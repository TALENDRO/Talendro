"use client";
import { CreateProject } from "@/components/createProjectModal";
import { HOLDINGADDR, MILESTONEADDR, PROJECTINITADDR } from "@/config";
import { useWallet } from "@/context/walletContext";
import {
  Address,
  Data,
  paymentCredentialOf,
  UTxO,
} from "@lucid-evolution/lucid";
import React, { useEffect, useState } from "react";
import ProjectItem from "../../components/projectItem";
import { ProjectDatum } from "@/types/cardano";

export default function Page() {
  const [walletContext, setWalletContext] = useWallet();
  const { lucid, address } = walletContext;
  const [client, setClient] = useState<Set<UTxO>>(new Set());
  const [dev, setDev] = useState<Set<UTxO>>(new Set());

  async function returnFilteredUtxos(contractAddress: Address) {
    if (!lucid || !address) return;

    const utxos = await lucid.utxosAt(contractAddress);
    const newClient = new Set<UTxO>();
    const newDev = new Set<UTxO>();
    for (const utxo of utxos) {
      const data = await lucid.datumOf(utxo);
      try {
        const datum = Data.castFrom(data as Data, ProjectDatum);
        const hash = paymentCredentialOf(address).hash;
        if (datum.developer === hash) {
          newDev.add(utxo);
        } else if (datum.client === hash) {
          newClient.add(utxo);
        }
      } catch (error) {
        console.error("Error processing UTxO datum:", error);
      }
    }
    setClient((prev) => new Set([...prev, ...newClient]));
    setDev((prev) => new Set([...prev, ...newDev]));
  }

  useEffect(() => {
    returnFilteredUtxos(PROJECTINITADDR);
    returnFilteredUtxos(HOLDINGADDR);
    returnFilteredUtxos(MILESTONEADDR);
  }, [lucid, address]);

  useEffect(() => {
    setClient(new Set());
    setDev(new Set());
  }, [address]);
  return (
    <div>
      <CreateProject />
      CLIENT PROJECTS
      {Array.from(client).map((project, i) => (
        <ProjectItem project={project} key={i} from="myProjects_client" />
      ))}
      DEV PROJECTS i.e. accepted projects
      {Array.from(dev).map((project, i) => (
        <ProjectItem project={project} key={i} from="myProjects_dev" />
      ))}
    </div>
  );
}
