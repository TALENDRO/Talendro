"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "@/context/walletContext";
import { getPolicyId, toAda } from "@/lib/utils";
import { ArbitratorDatum } from "@/types/cardano";
import { Data, fromText, toText, type UTxO } from "@lucid-evolution/lucid";
import { ArbitratorAction } from "../transactions/arbitration";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import { blockfrost } from "@/lib/blockfrost";
import Link from "next/link";
import { ExternalLink, ImageIcon } from "lucide-react";
import { ProjectInitiateValidator } from "@/config/scripts/scripts";
import { withErrorHandling } from "../errorHandling";
import clsx from "clsx";
// import { useToast } from "@/components/ui/use-toast"

interface Props {
  project: UTxO;
}

export default function ArbitratorProjectItem({ project }: Props) {
  const [walletConnection] = useWallet();
  const { lucid } = walletConnection;
  const [atFault, setAtFault] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [datum, setDatum] = useState<ArbitratorDatum | null>(null);
  const [metadata, setMetadata] = useState({ description: "", image: "" });
  // const { toast } = useToast()

  useEffect(() => {
    async function fetchDatum() {
      if (!lucid) return;
      try {
        const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);

        const data = await lucid.datumOf(project);
        const datum = Data.castFrom(data as Data, ArbitratorDatum);
        setDatum(datum);
        const metadata = await blockfrost.getMetadata(
          PROJECTINITPID + fromText("dev_") + datum.project_datum.title
        );
        setMetadata(metadata);
      } catch (error) {
        toast.error("Error", {
          description: "Failed to fetch project data",
        });
      }
    }
    fetchDatum();
  }, [lucid, project]);

  async function handleArbAction() {
    if (!datum) return;
    setSubmitting(true);
    const safeArbiAction = withErrorHandling(ArbitratorAction);
    const result = await safeArbiAction(
      walletConnection,
      project,
      atFault.includes("dev")
    );
    console.log(result);

    setSubmitting(false);
  }

  if (!datum) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // const imageUrl = metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/");
  const imageUrl = metadata?.image
    ? metadata.image.startsWith("ipfs://")
      ? metadata.image.replace(
          "ipfs://",
          "https://beige-electoral-meadowlark-467.mypinata.cloud/ipfs/"
        )
      : metadata.image.startsWith("http")
        ? metadata.image
        : `https://beige-electoral-meadowlark-467.mypinata.cloud/ipfs/${metadata.image}`
    : null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{toText(datum.project_datum.title)}</CardTitle>
        <Badge variant={datum.project_datum.pay ? "default" : "secondary"}>
          {datum.project_datum.pay ? "Regular" : "Milestone Based"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={clsx(
              "w-full aspect-square rounded-md overflow-hidden flex items-center justify-center bg-background transition-all duration-200",
              !imageUrl && "border-2 border-dashed border-muted-foreground/20"
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={toText(datum.project_datum.title)}
                width={500}
                height={500}
                className="rounded-md mx-auto w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  loading Image
                </p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {metadata?.description || "No description provided"}
          </p>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Budget:</span>
            <span>{toAda(datum.project_datum.pay as bigint)} ADA</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">POW:</span>
            <Link
              href={toText(datum.pow)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-wrap text-sm gap-0.5"
            >
              {toText(datum.pow)} <ExternalLink size={14} color="#00ff00" />
            </Link>
          </div>
        </div>
        <Select onValueChange={setAtFault}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select at fault party" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="dev">Developer</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleArbAction}
          disabled={submitting || !atFault}
          className="w-full"
        >
          {submitting ? "Processing..." : "Submit Arbitration Action"}
        </Button>
      </CardFooter>
    </Card>
  );
}
