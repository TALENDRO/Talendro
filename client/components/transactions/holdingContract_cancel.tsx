import { NETWORK } from "@/config/lucid";
import {
  HoldingContractValidator,
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import { ProjectDatum, ProjectRedeemer } from "@/types/cardano";
import { Data, fromText, paymentCredentialOf } from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "../ui/button";
import { getAddress, getPolicyId, handleError, refUtxo } from "@/lib/utils";
import { Admin } from "@/config/emulator";

export default function HoldingContractCancel() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;

  async function devCancel() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const holdingContractAddress = getAddress(HoldingContractValidator);
    const policyID = getPolicyId(ProjectInitiateValidator);
    const talendroPid = getPolicyId(TalendroTokenValidator);

    try {
      const datum: ProjectDatum = {
        title: fromText("firstProject"),
        pay: null,
        developer: null,
        client: paymentCredentialOf(Admin.address).hash,
        milestones: [],
        current_milestone: null,
        next_milestone: null,
      };

      const dev_assetname = fromText("dev_") + datum.title;
      const dev_token = { [policyID + dev_assetname]: 1n };

      const ref_utxo = await refUtxo(lucid);
      const UTxO_Talendro = await lucid.utxoByUnit(
        talendroPid + fromText(address.slice(-10))
      ); 
      const script_UTxO = (await lucid.utxosAt(holdingContractAddress))[0]; 
      const redeemer = Data.to("Cancel", ProjectRedeemer);
      console.log("before tx");
      const tx = await lucid
        .newTx()
        .readFrom(ref_utxo)
        .collectFrom([UTxO_Talendro, script_UTxO], redeemer)
        .pay.ToAddressWithData(
          holdingContractAddress,
          { kind: "inline", value: Data.to(datum, ProjectDatum) },
          { lovelace: 5_000_000n as bigint, ...dev_token }
        )
        .attach.SpendingValidator(HoldingContractValidator())
        .complete();

      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();
      console.log("txHash: ", txHash);
    } catch (error) {
      console.log(error);
    }
  }

  async function cltCancel() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const holdingContractAddress = getAddress(HoldingContractValidator);
    const policyID = getPolicyId(ProjectInitiateValidator);
    const talendroPid = getPolicyId(TalendroTokenValidator);
    const mintingValidator = ProjectInitiateValidator();



    try {
      const datum: ProjectDatum = {
        title: fromText("firstProject"),
        pay: 5_000_000n,
        developer: paymentCredentialOf(address).hash,
        client: paymentCredentialOf(Admin.address).hash,
        milestones: [],
        current_milestone: null,
        next_milestone: null,
      };

      const dev_assetname = fromText("dev_") + datum.title;
      const clt_assetname = fromText("clt_") + datum.title;
      const dev_token = { [policyID + dev_assetname]: -1n };
      const clt_token = { [policyID + clt_assetname]: -1n };

      const ref_utxo = await refUtxo(lucid);

      const UTxO_Talendro = await lucid.utxosAt(address);
      const script_UTxO = await lucid.utxosAt(holdingContractAddress); 
      console.log(script_UTxO);
      const redeemer = Data.to("Cancel", ProjectRedeemer);
      const minterRedeemer = Data.to(1n);
      const tx = await lucid
        .newTx()
        .readFrom(ref_utxo)
        .collectFrom(script_UTxO, redeemer)
        .collectFrom(UTxO_Talendro)
        .pay.ToAddress(
          Admin.address, 
          { lovelace: datum.pay as bigint }
        )
        .mintAssets({ ...clt_token, ...dev_token }, minterRedeemer)
        .attach.MintingPolicy(mintingValidator)
        .attach.SpendingValidator(HoldingContractValidator())
        .complete();

      // const txSystemSigned = await SystemWallet(tx)
      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();
      console.log("txHash: ", txHash);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex gap-4">
      <Button onClick={devCancel}>Dev Cancel</Button>
      <Button onClick={cltCancel}>client Cancel</Button>
    </div>
  );
}
