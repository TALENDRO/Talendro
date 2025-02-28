import { PRIVATEKEY } from "@/config";
import {
  ConfigDatumHolderValidator,
  IdentificationNFT_MintValidator,
} from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import { getAddress, privateKeytoAddress } from "@/lib/utils";
import { ConfigDatum } from "@/types/cardano";
import {
  Constr,
  Data,
  fromText,
  MintingPolicy,
  mintingPolicyToId,
} from "@lucid-evolution/lucid";

export async function mint(WalletConnection: WalletConnection) {
  try {
    const { lucid, address } = WalletConnection;
    if (!lucid) throw new Error("Uninitalized Lucid");
    if (!address) throw new Error("Wallet not connected");
    const SYSTEMADDRESS = await privateKeytoAddress(PRIVATEKEY);

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
    console.log(policyID);
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
    console.log("policyId (param for rest of the scripts): ", policyID);
    console.log("txHash: ", txHash);
    return txHash;
  } catch (error: any) {
    throw error;
  }
}

export async function sendConfigDatum(
  WalletConnection: WalletConnection,
  CONFIGDATUM: ConfigDatum
) {
  try {
    const { lucid, address } = WalletConnection;
    const CONFIGADDR = getAddress(ConfigDatumHolderValidator);
    const IDENTIFICATIONPID = process.env
      .NEXT_PUBLIC_IDENTIFICATION_POLICY_ID as string;
    if (!lucid) throw new Error("Uninitalized Lucid");
    if (!address) throw new Error("Wallet not connected");
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
    return txHash;
  } catch (error: any) {
    throw error;
  }
}

export async function updateConfigDatum(
  WalletConnection: WalletConnection,
  CONFIGDATUM: ConfigDatum
) {
  try {
    const { lucid, address } = WalletConnection;
    const CONFIGADDR = getAddress(ConfigDatumHolderValidator);
    const IDENTIFICATIONPID = process.env
      .NEXT_PUBLIC_IDENTIFICATION_POLICY_ID as string;
    if (!lucid) throw new Error("Uninitalized Lucid");
    if (!address) throw new Error("Wallet not connected");

    const ref_configNFT = IDENTIFICATIONPID + fromText("ref_configNFT");
    const usr_configNFT = IDENTIFICATIONPID + fromText("usr_configNFT");
    const refTokenUTXO = await lucid.utxosAtWithUnit(CONFIGADDR, ref_configNFT);
    const usrTokenUTXO = await lucid.utxosAtWithUnit(address, usr_configNFT);
    const tx = await lucid
      .newTx()
      .collectFrom(refTokenUTXO, Data.void())
      .collectFrom(usrTokenUTXO)
      .pay.ToAddressWithData(
        CONFIGADDR,
        { kind: "inline", value: Data.to(CONFIGDATUM, ConfigDatum) },
        { lovelace: 5_000_000n, ref_configNFT: 1n }
      )
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
    return txHash;
  } catch (error: any) {
    throw error;
  }
}
