"use client";

import {
  ArbitratorTokenValidator,
  identificationPolicyid,
} from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import {
  Data,
  fromText,
  mintingPolicyToId,
  type Validator,
} from "@lucid-evolution/lucid";
import { PRIVATEKEY } from "@/config";
import { SystemWallet } from "@/config/systemWallet";
import { privateKeytoAddress } from "@/lib/utils";

export async function ArbitratorMint(walletConnection: WalletConnection) {
  const { lucid, address } = walletConnection;

  try {
    if (!lucid || !address) throw new Error("Wallet not Connected");
    const SYSTEMADDRESS = await privateKeytoAddress(PRIVATEKEY);
    const usr_configNFT = {
      [identificationPolicyid + fromText("usr_configNFT")]: 1n,
    };
    const utxoWithIdentificationToken = await lucid.utxosAtWithUnit(
      SYSTEMADDRESS,
      identificationPolicyid + fromText("usr_configNFT")
    );

    const mintingValidator: Validator = ArbitratorTokenValidator();
    const policyID = mintingPolicyToId(mintingValidator);
    const ArbitratorID = address.slice(-10);
    const mintedAssets = { [policyID + fromText(ArbitratorID)]: 1n };
    const redeemer = Data.void();
    const tx = await lucid
      .newTx()
      .collectFrom(utxoWithIdentificationToken)
      .pay.ToAddress(SYSTEMADDRESS, {
        ...usr_configNFT,
        lovelace: 2_000_000n,
      })
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .addSigner(SYSTEMADDRESS)
      .complete();

    const systemSigned = await SystemWallet(tx);
    const signed = await systemSigned.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("Arbitrator PiD", policyID);
    console.log("txHash: ", txHash);

    return { data: txHash, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
