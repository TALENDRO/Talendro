"use client";
import {
  ArbitratorTokenValidator,
  identificationPolicyid,
} from "@/config/scripts/scripts";
import { useWallet } from "@/contexts/walletContext";
import {
  Constr,
  Data,
  fromText,
  mintingPolicyToId,
  Validator,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "../ui/button";
import { SYSTEMADDRESS } from "@/config";
import { SystemWallet } from "@/config/systemWallet";

export default function ArbitratorTokenMinter() {
  const [WalletConnection] = useWallet();

  const { lucid, address } = WalletConnection;
  async function mint() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    const usr_configNFT = {
      [identificationPolicyid + fromText("usr_configNFT")]: 1n,
    };
    const utxoWithIdentificationToken = await lucid.utxosAtWithUnit(
      SYSTEMADDRESS,
      identificationPolicyid + fromText("usr_configNFT"),
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

  return <Button onClick={mint}>Arbitrator mint</Button>;
}
