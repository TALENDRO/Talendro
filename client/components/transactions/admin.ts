import { CONFIGADDR, IDENTIFICATIONPID, SYSTEMADDRESS } from "@/config";
import { IdentificationNFT_MintValidator } from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import { ConfigDatum } from "@/types/cardano";
import { Constr, Data, fromText, MintingPolicy, mintingPolicyToId } from "@lucid-evolution/lucid";

export async function mint(WalletConnection: WalletConnection) {
    const {lucid, address} = WalletConnection
    if (!lucid) throw new Error ("Uninitalized Lucid");
    if (!address)throw new Error ("Wallet not connected");
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
      return {data: {txHash, policyID}, error: null};
      // toast({ title: "Success", description: "Identification Token minted successfully!" })
    } catch (error) {
      return {data: null, error: error};
      // toast({ title: "Error", description: "Failed to mint Identification Token", variant: "destructive" })
    }
  }



export async function sendConfigDatum(WalletConnection: WalletConnection, CONFIGDATUM: ConfigDatum) {
    const {lucid, address} = WalletConnection
    try {
    if (!lucid) throw new Error ("Uninitalized Lucid");
    if (!address)throw new Error ("Wallet not connected");
      const ref_configNFT = {
        [IDENTIFICATIONPID + fromText("ref_configNFT")]: 1n,
      };

      const tx = await lucid
        .newTx()
        .pay.ToAddressWithData(
          CONFIGADDR,
          { kind: "inline", value: Data.to(CONFIGDATUM, ConfigDatum) },
          { lovelace: 5_000_000n, ...ref_configNFT },
        )
        .complete();

      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();
      console.log("txHash: ", txHash);
      return {data: txHash, error: null};
      // toast({ title: "Success", description: "Config Datum attached successfully!" })
    } catch (error) {
      return {data: null, error: error};
      // toast({ title: "Error", description: "Failed to attach Config Datum", variant: "destructive" })
    }
  }