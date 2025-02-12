import { STAKEPRIVATEKEY } from "@/config";
import { TalendroTokenValidator } from "@/config/scripts/scripts";
import { SystemWallet } from "@/config/systemWallet";
import { WalletConnection } from "@/context/walletContext";
import {
  getPolicyId,
  privateKeytoAddress,
  refUtxo,
  seedtoAddress,
} from "@/lib/utils";
import { StakeDatum } from "@/types/cardano";
import {
  Data,
  fromText,
  paymentCredentialOf,
  Validator,
} from "@lucid-evolution/lucid";

export async function mint(walletConnection: WalletConnection) {
  const { lucid, address } = walletConnection;
  try {
    if (!lucid) throw "Uninitialized Lucid!!!";
    if (!address) throw "Wallet not Connected!!!";
    // const STAKESEED = process.env.NEXT_PUBLIC_STAKE_WALLET as string;
    const PRIVATEKEY = process.env.NEXT_PUBLIC_SYSTEM_WALLET as string;
    const IDENTIFICATIONPID = process.env
      .NEXT_PUBLIC_IDENTIFICATION_POLICY_ID as string;
    const TALENDROPID = getPolicyId(TalendroTokenValidator);
    const SYSTEMADDRESS = await privateKeytoAddress(PRIVATEKEY);
    const STAKEADDRESS = await privateKeytoAddress(STAKEPRIVATEKEY);

    const usr_configNFT = {
      [IDENTIFICATIONPID + fromText("usr_configNFT")]: 1n,
    };
    const utxoWithIdentificationToken = await lucid.utxosAtWithUnit(
      SYSTEMADDRESS,
      IDENTIFICATIONPID + fromText("usr_configNFT")
    );
    const datum: StakeDatum = {
      staked_by: paymentCredentialOf(address).hash,
      staked_amount: 100_000_000n,
    };
    const mintingValidator: Validator = TalendroTokenValidator();
    const policyID = TALENDROPID;
    const TalendroUserName = paymentCredentialOf(address).hash.slice(-20);
    const mintedAssets = { [policyID + TalendroUserName]: 1n };
    const redeemer = Data.to(datum, StakeDatum);
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
          value: Data.to(datum, StakeDatum),
        },
        { lovelace: datum.staked_amount, ...mintedAssets }
      )
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .attachMetadata(721, {
        [TALENDROPID]: {
          [TalendroUserName]: {
            name: TalendroUserName,
            image: "ipfs://QmRGtfuQmHJEv7zatycKXx6WwKWXKyEdMk7N4iuRyVgkEN",
          },
        },
      })
      .addSigner(SYSTEMADDRESS)
      .addSigner(address)
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
