"use client";
import { Button } from "@/components/ui/button";
import {
    HOLDINGADDR,
    MILESTONEADDR,
    PROJECTINITADDR,
    PROJECTINITPID,
    TALENDROPID,
} from "@/config";
import { ProjectInitiateValidator } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import { refUtxo, toAda } from "@/lib/utils";
import { ArbitratorDatum } from "@/types/cardano";
import {
    Data,
    fromText,
    paymentCredentialOf,
    toText,
    UTxO,
} from "@lucid-evolution/lucid";
import React, { use, useEffect, useState } from "react";
import {
    AlreadyComplete,
    ProjectComplete,
} from "./transactions/ProjectComplete";
import { arbitration } from "./transactions/arbitration";

interface Props {
    project: UTxO;
}

export default function ArbitratorProjectItem({ project }: Props) {
    const [walletConnection] = useWallet();
    const { lucid, address } = walletConnection;

    const [submitting, setSubmitting] = useState(false);
    const [datum, setDatum] = useState<ArbitratorDatum>();
    useEffect(() => {
        if (!lucid) return;
        async function fetchDatum() {
            const data = await lucid?.datumOf(project);
            const datum = Data.castFrom(data as Data, ArbitratorDatum);
            setDatum(datum);
        }
        fetchDatum();
    }, [lucid]);


    return (
        datum && (
            <div className="border p-2">
                <p>{toText(datum.project_datum.title)}</p>
                <p>{toAda(datum.project_datum.pay as BigInt)}</p>
                <p>POW: {toText(datum.pow)}</p>
                <p> projectType: {datum.project_datum.pay ? "Regular" : "Milestone"}</p>
                <Button>Arb Action</Button>
            </div>
        )
    );
}

// {isComplete ? (
//     <button disabled>Complete</button> // If true
//   ) : (
//     <button onClick={() => console.log("Clicked!")}>Complete</button> // If false
//   )}
