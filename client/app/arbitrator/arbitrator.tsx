"use client";
import {
  ArbitratorTokenValidator,
  identificationPolicyid,
} from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  UTxO,
  Validator,
} from "@lucid-evolution/lucid";
import React, { useEffect, useState } from "react";
import { ARBITRATIONADDR, PROJECTINITPID, SYSTEMADDRESS } from "@/config";
import { SystemWallet } from "@/config/systemWallet";
import { Button } from "@/components/ui/button";
import ArbitratorProjectItem from "@/components/arbitratorProjectItem";

export default function ArbitratorTokenMinter() {
  const [WalletConnection] = useWallet();

  const { lucid, address } = WalletConnection;
  const [projects, setProjects] = useState<UTxO[]>([]);
  async function mint() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    const usr_configNFT = {
      [identificationPolicyid + fromText("usr_configNFT")]: 1n,
    };
    const utxoWithIdentificationToken = await lucid.utxosAtWithUnit(
      SYSTEMADDRESS,
      identificationPolicyid + fromText("usr_configNFT")
    );

    const mintingValidator: Validator = ArbitratorTokenValidator();
    const policyID = mintingPolicyToId(mintingValidator);
    const usr_assetName = "arbitratorA";
    const mintedAssets = { [policyID + fromText(usr_assetName)]: 1n };
    const redeemer = Data.void();
    const tx = await lucid
      .newTx()
      .collectFrom(utxoWithIdentificationToken)
      .pay.ToAddress(SYSTEMADDRESS, { ...usr_configNFT, lovelace: 2_000_000n })
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .addSigner(SYSTEMADDRESS)
      .complete();

    const systemSigned = await SystemWallet(tx);
    const signed = await systemSigned.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("Arbitrator PiD", policyID);
    console.log("txHash: ", txHash);
  }

  useEffect(() => {
    async function fetchutxos() {
      if (!lucid) return;
      const utxos = await lucid.utxosAt(ARBITRATIONADDR)
      console.log(utxos)
      const filteredUtxos = utxos.filter((utxo) => {
        return Object.keys(utxo.assets).some((key) => key.includes(PROJECTINITPID));
      });
      setProjects(filteredUtxos)
    }
    fetchutxos()

  }, [lucid])

  return (
    <>
      <Button onClick={mint}>Arbitrator mint</Button>

      {projects.map((project, i) => (
        <ArbitratorProjectItem project={project} key={i} />
      ))}
    </>
  )
}
