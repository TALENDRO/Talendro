"use client";
import { IdentificationNFT_MintValidator } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  Constr,
  Data,
  fromText,
  MintingPolicy,
  mintingPolicyToId,
  Validator,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "../ui/button";
import { handleError } from "@/lib/utils";
import { SYSTEMADDRESS } from "@/config";

export default function Identification() {
  const [WalletConnection] = useWallet();

  const { lucid, address } = WalletConnection;
  async function mint() {
    if (!lucid) throw "Uninitialized Lucid!!!";
    if (!address) throw "Wallet not Connected!!!";

    try {
      const utxos = await lucid.utxosAt(address);

      const orefHash = String(utxos[0].txHash);
      const orefIndex = BigInt(utxos[0].outputIndex);
      const oref = new Constr(0, [orefHash, orefIndex]);

      const mintingValidator: MintingPolicy = IdentificationNFT_MintValidator([
        oref,
      ]);
      const policyID = mintingPolicyToId(mintingValidator);
      const ref_configNFT = { [policyID + fromText("ref_configNFT")]: 1n };
      const usr_configNFT = { [policyID + fromText("usr_configNFT")]: 1n };
      const mintedAssets = { ...ref_configNFT, ...usr_configNFT };

      const redeemer = Data.void();

      const tx = await lucid
        .newTx()
        .collectFrom([utxos[0]])
        .pay.ToAddress(SYSTEMADDRESS, {
          ...usr_configNFT,
          lovelace: 2_000_000n,
        })
        .mintAssets(mintedAssets, redeemer)
        .attach.MintingPolicy(mintingValidator)
        .complete();
      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();
      console.log("policyId(param for rest of the scripts): ", policyID);
      console.log("txHash: ", txHash);
    } catch (error) {
      handleError(error);
    }
  }

  return <Button onClick={mint}>mint</Button>;
}
