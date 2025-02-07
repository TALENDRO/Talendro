import {
  ARBITRATIONADDR,
  ARBITRATORPID,
  PROJECTINITPID,
  STAKEADDRESS,
  TALENDROPID,
} from "@/config";
import {
  ArbitrationContractValidator,
  HoldingContractValidator,
} from "@/config/scripts/scripts";
import { StakeWallet } from "@/config/systemWallet";
import { WalletConnection } from "@/context/walletContext";
import { keyHashtoAddress, refStakeUtxo, refUtxo } from "@/lib/utils";
import {
  ArbitratorDatum,
  ArbitratorRedeemer,
  ProjectDatum,
  ProjectRedeemer,
} from "@/types/cardano";
import { Data, fromText, TxHash, UTxO } from "@lucid-evolution/lucid";
import { error } from "console";

export async function arbitration(
  walletConnection: WalletConnection,
  utxo: UTxO,
  isDev: boolean,
  arbitrationLink: string
) {
  const { lucid, address } = walletConnection;
  if (!lucid || !address) throw "Uninitialized Lucid!!!";

  try {
    const data = await lucid.datumOf(utxo);
    const datum = Data.castFrom(data, ProjectDatum);
    const arbDatum: ArbitratorDatum = {
      project_datum: datum,
      pow: fromText(arbitrationLink),
    };
    console.log(arbDatum, arbitrationLink);
    const tokenName = isDev ? "dev_" : "clt_";
    const project_assetname = fromText(tokenName) + datum.title;
    const projecttoken = { [PROJECTINITPID + project_assetname]: 1n };

    const ref_utxo = await refUtxo(lucid);
    const UTxO_Talendro = await lucid.utxoByUnit(
      TALENDROPID + fromText(address.slice(-10))
    ); //talendroPolicyID+assetName assetname is user address
    const redeemer = Data.to("Arbitrator", ProjectRedeemer);
    const tx = await lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom([UTxO_Talendro, utxo], redeemer)
      .pay.ToAddressWithData(
        ARBITRATIONADDR,
        { kind: "inline", value: Data.to(arbDatum, ArbitratorDatum) },
        { lovelace: datum.pay as bigint, ...projecttoken }
      )
      .attach.SpendingValidator(HoldingContractValidator())
      .complete();

    // const txSystemSigned = await SystemWallet(tx)
    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
    return { data: txHash, error: null };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message };
  }
}

export async function ArbitratorAction(
  walletConnection: WalletConnection,
  utxo: UTxO,
  devAtFault: boolean
) {
  const { lucid, address } = walletConnection;
  if (!lucid || !address) throw new Error("Uninitialized Lucid!!!");

  try {
    const data = await lucid.datumOf(utxo);
    const currentDatum = Data.castFrom(data, ArbitratorDatum);
    const cltAddress = keyHashtoAddress(currentDatum.project_datum.client);
    const devAddress = keyHashtoAddress(
      currentDatum.project_datum.developer as string
    );
    let PaytoAddress = devAtFault ? cltAddress : devAddress;
    let AtFaultAddress = devAtFault ? devAddress : cltAddress;
    let stakedUtxo = (
      await refStakeUtxo(lucid, AtFaultAddress, STAKEADDRESS)
    )[0];

    const ref_utxo = await refUtxo(lucid);
    const UTxO_Arbitrator = await lucid.utxosAtWithUnit(
      address,
      ARBITRATORPID + fromText(address.slice(-10))
    );
    const redeemer: ArbitratorRedeemer = { payto: devAtFault ? 0n : 1n };
    console.log(ARBITRATORPID);
    const tx = await lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom(
        [...UTxO_Arbitrator, utxo, stakedUtxo],
        Data.to(redeemer, ArbitratorRedeemer)
      )
      .pay.ToAddress(PaytoAddress, {
        lovelace: currentDatum.project_datum.pay as bigint,
      })
      .pay.ToAddress(address, {
        lovelace: stakedUtxo.assets["lovelace"] as bigint,
      })
      .attach.SpendingValidator(ArbitrationContractValidator())
      .addSigner(STAKEADDRESS)
      .complete();

    const userSigned = await tx.sign.withWallet();
    const stakeSigned = await (
      await StakeWallet(walletConnection, userSigned)
    ).complete();
    const txHash = await stakeSigned.submit();
    console.log("txHash: ", txHash);

    return { data: txHash, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
