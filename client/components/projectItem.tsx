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
import { ProjectDatum } from "@/types/cardano";
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
    from: string;
}

export default function ProjectItem({ project, from }: Props) {
    const [walletConnection] = useWallet();
    const { lucid, address } = walletConnection;

    const [submitting, setSubmitting] = useState(false);
    const [datum, setDatum] = useState<ProjectDatum>();
    useEffect(() => {
        if (!lucid) return;
        async function fetchDatum() {
            const data = await lucid?.datumOf(project);
            const datum = Data.castFrom(data as Data, ProjectDatum);
            setDatum(datum);
        }
        fetchDatum();
    }, [lucid]);

    async function acceptProject() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";
        if (!datum) throw "Datum not found!!!";
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
                TALENDROPID + fromText(address.slice(-10))
            ); //talendroPolicyID+assetName assetname is user address
            const redeemer = Data.to(1n);

            const contractAddress = datum.pay ? HOLDINGADDR : MILESTONEADDR;
            const tx = await lucid
                .newTx()
                .readFrom(ref_utxo)
                .collectFrom([UTxO_Talendro, project], redeemer)
                // .collectFrom([script_UTxO], redeemer)
                .pay.ToAddress(address, dev_token)
                .pay.ToAddressWithData(
                    contractAddress,
                    { kind: "inline", value: Data.to(updatedDatum, ProjectDatum) },
                    { lovelace: datum.pay ? BigInt(datum.pay) : 3_000_000n }
                )
                .attach.SpendingValidator(ProjectInitiateValidator())
                .addSigner(address)
                .complete();

            const signed = await tx.sign.withWallet().complete();
            const txHash = await signed.submit();
            console.log("txHash: ", txHash);
        } catch (error) {
            console.log(error);
        }
        setSubmitting(false);
    }

    async function projectCompleteClick() {
        console.log("ssss");
        if (!lucid || !address || !datum) throw "Uninitialized Lucid!!!";
        // console.log("ssss2", lucid, address, datum)
        const calledByDev = from.includes("dev");
        await ProjectComplete(lucid, project, datum, calledByDev, address);
    }

    async function Alreadycmplt() {
        if (!lucid || !address || !datum) throw "Uninitialized Lucid!!!";
        await AlreadyComplete(lucid, datum);
    }

    async function handleArbitrationClick() {
        const calledByDev = from.includes("dev");
        arbitration(walletConnection, project, calledByDev);
    }
    return (
        datum && (
            <div className="border p-2">
                <p>{toText(datum.title)}</p>
                <p>{toAda(datum.pay as BigInt)}</p>
                <p> projectType: {datum.pay ? "Regular" : "Milestone"}</p>
                {from == "projects" && (
                    <Button onClick={acceptProject} disabled={submitting}>
                        Accept
                    </Button>
                )}
                {(from == "myProjects_dev" || from == "myProjects_client") && (
                    <>
                        {(true) ? (
                            <Button disabled>Complete</Button>
                        ) : (
                            <Button onClick={projectCompleteClick}>Complete</Button>
                        )}
                        {/* TODO: if project(utxo in props) have dev token in asset then don't show complete button */}
                        {/* TDOD: show complete button only if project client have completed  */}
                        {(true) ? (
                            <Button disabled>Cancel</Button>
                        ) : (
                            <Button>Cancel</Button>
                        )}
                        <Button onClick={handleArbitrationClick}>Arbitration</Button>
                    </>
                )}
            </div>
        )
    );
}

// {isComplete ? (
//     <button disabled>Complete</button> // If true
//   ) : (
//     <button onClick={() => console.log("Clicked!")}>Complete</button> // If false
//   )}
