import { NETWORK } from "@/config/lucid";
import {
  ArbitratorTokenValidator,
  ConfigDatumHolderValidator,
  HoldingContractValidator,
  identificationPolicyid,
  MilestoneMINTValidator,
  MilestoneSpendValidator,
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import { useWallet } from "@/contexts/walletContext";
import { ConfigDatum, ConfigDatumSchema, ProjectDatum, ProjectRedeemer } from "@/types/cardano";
import {
  Data,
  fromText,
  MintingPolicy,
  mintingPolicyToId,
  paymentCredentialOf,
  Script,
  SpendingValidator,
  Validator,
  validatorToAddress,
  validatorToScriptHash,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "../ui/button";
import { getAddress, getPolicyId, handleError, refUtxo } from "@/libs/utils";
import { SystemWallet } from "@/config/systemWallet";
import { accountA, accountB, accountD } from "@/config/emulator";
import { before } from "node:test";

export default function HoldingContractCancel() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;

  async function devCancel() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const holdingContractAddress = getAddress(HoldingContractValidator);
    const policyID = getPolicyId(ProjectInitiateValidator);
    const talendroPid = getPolicyId(TalendroTokenValidator);


    // should send dev_token to holding contract
    // 

    try {
      const datum: ProjectDatum = {
        title: fromText("firstProject"),
        pay: null,
        developer: null,
        client: paymentCredentialOf(accountA.address).hash,
        milestones: [],
        current_milestone: null,
        next_milestone: null,
      };

      const dev_assetname = fromText("dev_") + datum.title;
      const dev_token = { [policyID + dev_assetname]: 1n };

      const ref_utxo = await refUtxo(lucid);
      const UTxO_Talendro = await lucid.utxoByUnit(
        talendroPid + fromText(address.slice(-10)),
      ); //talendroPolicyID+assetName assetname is user address
      const script_UTxO = (await lucid.utxosAt(holdingContractAddress))[0]; // accept utxo as parameter
      const redeemer = Data.to("Cancel", ProjectRedeemer);
      console.log("before tx",)
      const tx = await lucid
        .newTx()
        .readFrom(ref_utxo)
        .collectFrom([UTxO_Talendro, script_UTxO], redeemer)
        .pay.ToAddressWithData(
          holdingContractAddress,
          { kind: "inline", value: Data.to(datum, ProjectDatum) },
          { lovelace: 5_000_000n as bigint, ...dev_token },
        )
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


  async function cltCancel() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const holdingContractAddress = getAddress(HoldingContractValidator);
    const policyID = getPolicyId(ProjectInitiateValidator);
    const talendroPid = getPolicyId(TalendroTokenValidator);
    const mintingValidator = ProjectInitiateValidator()

    // must burn dev & clt
    // must pay to dev

    try {
      const datum: ProjectDatum = {
        title: fromText("firstProject"),
        pay: 5_000_000n,
        developer: paymentCredentialOf(address).hash,
        client: paymentCredentialOf(accountA.address).hash,
        milestones: [],
        current_milestone: null,
        next_milestone: null,
      };

      const dev_assetname = fromText("dev_") + datum.title;
      const clt_assetname = fromText("clt_") + datum.title;
      const dev_token = { [policyID + dev_assetname]: -1n };
      const clt_token = { [policyID + clt_assetname]: -1n };

      const ref_utxo = await refUtxo(lucid);
      // const UTxO_Talendro = await lucid.utxoByUnit(
      //   talendroPid + fromText(address.slice(-10)),
      // ); //talendroPolicyID+assetName assetname is user address
      const UTxO_Talendro = await lucid.utxosAt(address)
      const script_UTxO = (await lucid.utxosAt(holdingContractAddress)); // accept utxo as parameter
      console.log(script_UTxO)
      const redeemer = Data.to("Cancel", ProjectRedeemer);
      const minterRedeemer = Data.to(1n);
      const tx = await lucid
        .newTx()
        .readFrom(ref_utxo)
        .collectFrom(script_UTxO, redeemer)
        .collectFrom(UTxO_Talendro)
        .pay.ToAddress(
          accountA.address, //pay back to client
          { lovelace: datum.pay as bigint },)
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
