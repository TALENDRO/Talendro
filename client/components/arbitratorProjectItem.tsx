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
import { toAda } from "@/lib/utils";
import { ArbitratorDatum } from "@/types/cardano";
import { Data, toText, type UTxO } from "@lucid-evolution/lucid";
import { ArbitratorAction } from "./transactions/arbitration";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
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
  // const { toast } = useToast()

  useEffect(() => {
    async function fetchDatum() {
      if (!lucid) return;
      try {
        const data = await lucid.datumOf(project);
        const datum = Data.castFrom(data as Data, ArbitratorDatum);
        setDatum(datum);
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

  async function handleArbAction() {
    if (!datum) return;
    setSubmitting(true);
    try {
      await ArbitratorAction(
        walletConnection,
        project,
        atFault.includes("dev"),
      );
      // toast({
      //   title: "Success",
      //   description: "Arbitration action submitted successfully",
      // })
    } catch (error) {
      console.error("Error in arbitration action:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to submit arbitration action",
      //   variant: "destructive",
      // })
    } finally {
      setSubmitting(false);
    }
  }

  if (!datum) {
    return <div className="text-center p-4">Loading...</div>;
  }

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
          <Image
            src={"/placeholder.svg"}
            alt={toText(datum.project_datum.title)}
            width={200}
            height={200}
            className="rounded-md mx-auto"
          />
          <p className="text-sm text-muted-foreground">
            {"toText(datum.project_datum.description)"}
          </p>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Budget:</span>
            <span>{toAda(datum.project_datum.pay as bigint)} ADA</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">POW:</span>
            <span>{toText(datum.pow)}</span>
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
