"use client";
import { Button } from "@/components/ui/button";
import {
  IDENTIFICATIONPID,
  MILESTONEPID,
  MILESTONEADDR,
  HOLDINGADDR,
  PROJECTINITADDR,
  ARBITRATORPID,
  ARBITRATIONADDR,
  TALENDROPID,
  STAKEADDRESS,
  CONFIGADDR,
  SYSTEMADDRESS,
} from "@/config";
import { IdentificationNFT_MintValidator } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import { handleError } from "@/lib/utils";
import { ConfigDatum } from "@/types/cardano";
import {
  Constr,
  Data,
  fromText,
  MintingPolicy,
  mintingPolicyToId,
  paymentCredentialOf,
} from "@lucid-evolution/lucid";
import React, { useState } from "react";

export default function Page() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;
  const [submitting, setSubmitting] = useState(false);

  const CONFIGDATUM: ConfigDatum = {
    identification_nft: IDENTIFICATIONPID,
    milestone_contract_policy: MILESTONEPID,
    milestone_contract_address: paymentCredentialOf(MILESTONEADDR).hash,
    holding_contract: paymentCredentialOf(HOLDINGADDR).hash,
    projectinit_contract: paymentCredentialOf(PROJECTINITADDR).hash,
    arbitrator_nft: ARBITRATORPID,
    arbitrator_contract: paymentCredentialOf(ARBITRATIONADDR).hash,
    talendrouser_nft: TALENDROPID,
    stake_vkh: paymentCredentialOf(STAKEADDRESS).hash,
    stake_amount: 100_000_000n,
  };

  async function mint() {
    if (!lucid) throw "Uninitialized Lucid!!!";
    if (!address) throw "Wallet not Connected!!!";
    setSubmitting(true);
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
    setSubmitting(false);
  }

  async function sendConfigDatum() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const ref_configNFT = {
      [IDENTIFICATIONPID + fromText("ref_configNFT")]: 1n,
    };

    const tx = await lucid
      .newTx()
      .pay.ToAddressWithData(
        CONFIGADDR,
        { kind: "inline", value: Data.to(CONFIGDATUM, ConfigDatum) },
        { lovelace: 5_000_000n, ...ref_configNFT }
      )
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  }

  return (
    <div>
      <p>
        CONFIGDATUM:
        {JSON.stringify(
          CONFIGDATUM,
          (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          4
        )}
      </p>

      <Button onClick={mint} disabled={submitting}>
        Mint Identification Token
      </Button>

      <Button onClick={sendConfigDatum} disabled={submitting}>
        Attach Config Datum
      </Button>
    </div>
  );
}
