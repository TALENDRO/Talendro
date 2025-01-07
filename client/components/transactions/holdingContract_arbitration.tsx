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
import { ArbitratorDatum, ConfigDatum, ConfigDatumSchema, ProjectDatum, ProjectRedeemer } from "@/types/cardano";
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

export default function HoldingContractArbitration() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;


  async function arbitration() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const holdingContractAddress = getAddress(HoldingContractValidator);
    const arbitrationAddress = accountD.address;
    const policyID = getPolicyId(ProjectInitiateValidator);
    const talendroPid = getPolicyId(TalendroTokenValidator);





    try {
      const datum: ProjectDatum = {
        title: fromText("firstProject"),
        pay: 5_000_000n,
        developer: paymentCredentialOf(accountB.address).hash,
        client: paymentCredentialOf(accountA.address).hash,
        milestones: [],
        current_milestone: null,
        next_milestone: null,
      };

      const arbDatum: ArbitratorDatum = {
        project_datum: datum,
        pow: fromText("proof of work")
      }
      const project_assetname = fromText("clt_") + datum.title;
      const projecttoken = { [policyID + project_assetname]: 1n };

      const ref_utxo = await refUtxo(lucid);
      const UTxO_Talendro = await lucid.utxoByUnit(
        talendroPid + fromText(address.slice(-10)),
      ); //talendroPolicyID+assetName assetname is user address
      const script_UTxO = (await lucid.utxosAt(holdingContractAddress))[0]; // accept utxo as parameter
      const redeemer = Data.to("Arbitrator", ProjectRedeemer);
      const tx = await lucid
        .newTx()
        .readFrom(ref_utxo)
        .collectFrom([UTxO_Talendro, script_UTxO], redeemer)
        .pay.ToAddressWithData(
          arbitrationAddress,
          { kind: "inline", value: Data.to(arbDatum, ArbitratorDatum) },
          { lovelace: datum.pay as bigint, ...projecttoken },
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



  return (
    <div className="flex gap-4">
      <Button onClick={arbitration}>Arbitration</Button>
    </div>
  );
}
