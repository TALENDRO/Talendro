import { ARBITRATIONADDR, HOLDINGADDR, PROJECTINITPID, TALENDROPID } from "@/config";
import { HoldingContractValidator } from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import { refUtxo } from "@/lib/utils";
import { ArbitratorDatum, ProjectDatum, ProjectRedeemer } from "@/types/cardano";
import { Data, fromText, UTxO } from "@lucid-evolution/lucid";


export async function arbitration(walletConnection: WalletConnection, utxo: UTxO, isDev: boolean) {
  const { lucid, address } = walletConnection;
  if (!lucid || !address) throw "Uninitialized Lucid!!!";

  try {
    const data = await lucid.datumOf(utxo)
    const datum = Data.castFrom(data, ProjectDatum);
    console.log(datum)
    const arbDatum: ArbitratorDatum = {
      project_datum: datum,
      pow: fromText("proof of work") //should be @PARAM
    }
    const tokenName = isDev ? "dev_" : "clt_";
    const project_assetname = fromText(tokenName) + datum.title;
    const projecttoken = { [PROJECTINITPID + project_assetname]: 1n };

    const ref_utxo = await refUtxo(lucid);
    const UTxO_Talendro = await lucid.utxoByUnit(
      TALENDROPID + fromText(address.slice(-10)),
    ); //talendroPolicyID+assetName assetname is user address
    const redeemer = Data.to("Arbitrator", ProjectRedeemer);
    console.log(TALENDROPID, PROJECTINITPID)
    const tx = await lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom([UTxO_Talendro, utxo], redeemer)
      .pay.ToAddressWithData(
        ARBITRATIONADDR,
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


export async function ArbitratorAction() {
  try {

    const tx = await lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom([UTxO_Talendro, utxo], redeemer)
      .pay.ToAddressWithData(
        ARBITRATIONADDR,
        { kind: "inline", value: Data.to(arbDatum, ArbitratorDatum) },
        { lovelace: datum.pay as bigint, ...projecttoken },
      )
      .attach.SpendingValidator(HoldingContractValidator())
      .complete();

  } catch (error) {
    console.log(error);
  }
}




