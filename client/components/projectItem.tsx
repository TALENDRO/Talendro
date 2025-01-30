"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/components/ui/use-toast"
import {
  HOLDINGADDR,
  MILESTONEADDR,
  PROJECTINITPID,
  TALENDROPID,
} from "@/config";
import { ProjectInitiateValidator } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import { refUtxo, toAda } from "@/lib/utils";
import { ProjectDatum } from "@/types/cardano";
import {
  Data,
  fromText,
  type LucidEvolution,
  paymentCredentialOf,
  toText,
  type UTxO,
} from "@lucid-evolution/lucid";
import React, { useEffect, useState } from "react";
import { CancelProject, ProjectComplete } from "./transactions/ProjectComplete";
import { arbitration } from "./transactions/arbitration";
import Image from "next/image";
import { toast } from "sonner";
import { blockfrost } from "@/lib/blockfrost";

interface Props {
  project: UTxO;
  from: string;
}

export default function ProjectItem({ project, from }: Props) {
  const [walletConnection] = useWallet();
  const { lucid, address } = walletConnection;
  // const { toast } = useToast()

  const [submitting, setSubmitting] = useState(false);
  const [datum, setDatum] = useState<ProjectDatum>();
  const [isCompleteByDev, setIsCompleteByDev] = useState(false);
  const [isCancelByDev, setIsCancelByDev] = useState(false);
  const [metadata, setMetadata] = useState({ description: "", image: "" });

  useEffect(() => {
    if (!lucid) return;

    async function fetchDatum() {
      try {
        const data = await lucid?.datumOf(project);
        const datum = Data.castFrom(data as Data, ProjectDatum);
        setDatum(datum);
        setIsCompleteByDev(
          project.assets.hasOwnProperty(
            PROJECTINITPID + fromText("dev_") + datum?.title,
          ),
        );
        setIsCancelByDev(
          project.assets.hasOwnProperty(
            PROJECTINITPID + fromText("dev_") + datum?.title,
          ) && datum.pay === null,
        );
        // Assuming metadata is stored in the datum or fetched separately
        const metadata = await blockfrost.getMetadata(PROJECTINITPID + fromText("dev_") + datum?.title)
        setMetadata(metadata);
      } catch (error) {
        console.error("Error fetching datum:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch project data",
        //   variant: "destructive",
        // })
      }
    }
    fetchDatum();
  }, [lucid, project]);

  async function acceptProject() {
    if (!lucid || !address) {
      toast.error("Error", { description: "Wallet not connected" });
      return;
    }
    if (!datum) {
      toast.error("Error", { description: "Project data not found" });
      return;
    }

    setSubmitting(true);
    try {
      const updatedDatum: ProjectDatum = {
        ...datum,
        developer: paymentCredentialOf(address).hash,
      };

      const dev_assetname = fromText("dev_") + datum.title;
      const dev_token = { [PROJECTINITPID + dev_assetname]: 1n };

      const ref_utxo = await refUtxo(lucid);
      const UTxO_Talendro = await lucid.utxoByUnit(
        TALENDROPID + fromText(address.slice(-10)),
      );
      const redeemer = Data.to(1n);

      const contractAddress = datum.pay ? HOLDINGADDR : MILESTONEADDR;
      const tx = await lucid
        .newTx()
        .readFrom(ref_utxo)
        .collectFrom([UTxO_Talendro, project], redeemer)
        .pay.ToAddress(address, dev_token)
        .pay.ToAddressWithData(
          contractAddress,
          { kind: "inline", value: Data.to(updatedDatum, ProjectDatum) },
          { lovelace: datum.pay ? BigInt(datum.pay) : 3_000_000n },
        )
        .attach.SpendingValidator(ProjectInitiateValidator())
        .addSigner(address)
        .complete();

      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();
      console.log("txHash: ", txHash);
      toast.success("Success", {
        description: "Project accepted successfully",
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Error", { description: "Failed to accept project" });
    }
    setSubmitting(false);
  }

  async function projectCompleteClick() {
    if (!lucid || !address || !datum) {
      toast.error("Error", { description: "Missing required data" });

      return;
    }
    setSubmitting(true);
    try {
      const calledByDev = from.includes("dev");
      await ProjectComplete(lucid, project, datum, calledByDev, address);
      toast.success("Success", {
        description: "Project completed successfully",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "Failed to complete project" });
    }
    setSubmitting(false);
  }

  async function cancelProjectClick() {
    if (!lucid || !address || !datum) {
      toast.error("Error", { description: "Missing required data" });

      return;
    }
    setSubmitting(true);
    try {
      const calledByDev = from.includes("dev");
      await CancelProject(lucid, project, datum, calledByDev, address);
      toast.success("Success", {
        description: "Project cancelled successfully",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "Failed to cancel project" });
    }
    setSubmitting(false);
  }

  async function handleArbitrationClick() {
    setSubmitting(true);
    try {
      const calledByDev = from.includes("dev");
      await arbitration(walletConnection, project, calledByDev);
      toast.success("Success", {
        description: "Arbitration requested successfully",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "Failed to request arbitration" });
    }
    setSubmitting(false);
  }

  if (!datum) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{toText(datum.title)}</CardTitle>
        <Badge variant={datum.pay ? "default" : "secondary"}>
          {datum.pay ? "Regular" : "Milestone Based"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Image
            src={metadata?.image || "/placeholder.svg"}
            alt={toText(datum.title)}
            width={200}
            height={200}
            className="rounded-md mx-auto"
          />
          <p className="text-sm text-muted-foreground">
            {metadata?.description || "No description provided"}
          </p>
          <p className="font-semibold">
            Budget: {toAda(datum.pay as bigint)} ADA
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-center">
        {from === "projects" && (
          <Button onClick={acceptProject} disabled={submitting}>
            {submitting ? "Accepting..." : "Accept Project"}
          </Button>
        )}
        {(from === "myProjects_dev" || from === "myProjects_client") && (
          <>
            <Button
              onClick={projectCompleteClick}
              disabled={
                submitting ||
                (isCompleteByDev && from.includes("dev")) ||
                (!isCompleteByDev && from.includes("client"))
              }
            >
              {submitting
                ? "Processing..."
                : isCompleteByDev && from.includes("dev")
                  ? "Completed"
                  : !isCompleteByDev && from.includes("client")
                    ? "Awaiting Completion"
                    : "Complete Project"}
            </Button>
            <Button
              onClick={cancelProjectClick}
              disabled={
                submitting ||
                (isCancelByDev && from.includes("dev")) ||
                (!isCancelByDev && from.includes("client"))
              }
            >
              {submitting
                ? "Processing..."
                : isCancelByDev && from.includes("dev")
                  ? "Cancelled"
                  : !isCancelByDev && from.includes("client")
                    ? "Awaiting Cancellation"
                    : "Cancel Project"}
            </Button>
            <Button onClick={handleArbitrationClick} disabled={submitting}>
              {submitting ? "Requesting..." : "Request Arbitration"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
