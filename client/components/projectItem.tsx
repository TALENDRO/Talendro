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
import { ProjectComplete } from "./transactions/ProjectComplete";
import { arbitration } from "./transactions/arbitration";
import Image from "next/image";

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
        setMetadata({
          description: "Project description goes here",
          image: "/placeholder.svg?height=200&width=200",
        });
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
      // toast({ title: "Error", description: "Wallet not connected", variant: "destructive" })
      return;
    }
    if (!datum) {
      // toast({ title: "Error", description: "Project data not found", variant: "destructive" })
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
      // toast({ title: "Success", description: "Project accepted successfully" })
    } catch (error) {
      console.error(error);
      // toast({ title: "Error", description: "Failed to accept project", variant: "destructive" })
    }
    setSubmitting(false);
  }

  async function projectCompleteClick() {
    if (!lucid || !address || !datum) {
      // toast({ title: "Error", description: "Missing required data", variant: "destructive" })
      return;
    }
    setSubmitting(true);
    try {
      const calledByDev = from.includes("dev");
      await ProjectComplete(lucid, project, datum, calledByDev, address);
      // toast({ title: "Success", description: "Project completed successfully" })
    } catch (error) {
      console.error(error);
      // toast({ title: "Error", description: "Failed to complete project", variant: "destructive" })
    }
    setSubmitting(false);
  }

  async function cancelProjectClick() {
    if (!lucid || !address || !datum) {
      // toast({ title: "Error", description: "Missing required data", variant: "destructive" })
      return;
    }
    setSubmitting(true);
    try {
      const calledByDev = from.includes("dev");
      await CancelProject(lucid, project, datum, calledByDev, address);
      // toast({ title: "Success", description: "Project cancelled successfully" })
    } catch (error) {
      console.error(error);
      // toast({ title: "Error", description: "Failed to cancel project", variant: "destructive" })
    }
    setSubmitting(false);
  }

  async function handleArbitrationClick() {
    setSubmitting(true);
    try {
      const calledByDev = from.includes("dev");
      await arbitration(walletConnection, project, calledByDev);
      // toast({ title: "Success", description: "Arbitration requested successfully" })
    } catch (error) {
      console.error(error);
      // toast({ title: "Error", description: "Failed to request arbitration", variant: "destructive" })
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
            src={metadata.image || "/placeholder.svg"}
            alt={toText(datum.title)}
            width={200}
            height={200}
            className="rounded-md mx-auto"
          />
          <p className="text-sm text-muted-foreground">
            {metadata.description}
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

function CancelProject(
  lucid: LucidEvolution,
  project: UTxO,
  datum: ProjectDatum,
  calledByDev: boolean,
  address: string,
) {
  // Implement the cancel project logic here
  throw new Error("Function not implemented.");
}
