import {
  IDENTIFICATIONPID,
  STAKEADDRESS,
  SYSTEMADDRESS,
  TALENDROPID,
} from "@/config";
import { TalendroTokenValidator } from "@/config/scripts/scripts";
import { SystemWallet } from "@/config/systemWallet";
import { WalletConnection } from "@/context/walletContext";
import { refUtxo } from "@/lib/utils";
import { StakeDatum } from "@/types/cardano";
import {
  Data,
  fromText,
  paymentCredentialOf,
  Validator,
} from "@lucid-evolution/lucid";
import { error } from "console";
import { toast } from "sonner";

export async function mint(walletConnection: WalletConnection) {
  const { lucid, address } = walletConnection;
  try {
    if (!lucid) throw "Uninitialized Lucid!!!";
    if (!address) throw "Wallet not Connected!!!";
    const usr_configNFT = {
      [IDENTIFICATIONPID + fromText("usr_configNFT")]: 1n,
    };
    const utxoWithIdentificationToken = await lucid.utxosAtWithUnit(
      SYSTEMADDRESS,
      IDENTIFICATIONPID + fromText("usr_configNFT"),
    );

    const mintingValidator: Validator = TalendroTokenValidator();
    const policyID = TALENDROPID;
    const TalendroUserName = address.slice(-10);
    const mintedAssets = { [policyID + fromText(TalendroUserName)]: 1n };
    const redeemer = Data.to(fromText("redeemer"));
    const ref_utxo = await refUtxo(lucid);
    const tx = await lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom(utxoWithIdentificationToken)
      .pay.ToAddress(SYSTEMADDRESS, { ...usr_configNFT, lovelace: 2_000_000n })
      .pay.ToAddressWithData(
        STAKEADDRESS,
        {
          kind: "inline",
          value: Data.to(
            { staked_by: paymentCredentialOf(address).hash },
            StakeDatum,
          ),
        },
        { lovelace: 100_000_000n },
      )
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .addSigner(SYSTEMADDRESS)
      .complete();

    const systemSigned = await SystemWallet(tx);
    const signed = await systemSigned.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("TalendroToken PiD", policyID);
    console.log("txHash: ", txHash);
    return { data: txHash, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
