import {
  HoldingContractValidator,
  MilestoneSpendValidator,
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import { getAddress, getPolicyId, refUtxo } from "@/lib/utils";
import { ProjectDatum } from "@/types/cardano";
import {
  paymentCredentialOf,
  fromText,
  Data,
  UTxO,
} from "@lucid-evolution/lucid";

export async function acceptProject(
  walletConnection: WalletConnection,
  projectUtxo: UTxO,
  datum: ProjectDatum
) {
  const { lucid, address } = walletConnection;

  try {
    if (!lucid || !address) throw new Error("Wallet not connected");

    const MILESTONEADDR = getAddress(MilestoneSpendValidator);
    const HOLDINGADDR = getAddress(HoldingContractValidator);
    const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
    const TALENDROPID = getPolicyId(TalendroTokenValidator);
    const updatedDatum: ProjectDatum = {
      ...datum,
      developer: paymentCredentialOf(address).hash,
    };

    const dev_assetname = fromText("dev_") + datum.title;
    const dev_token = { [PROJECTINITPID + dev_assetname]: 1n };

    const ref_utxo = await refUtxo(lucid);
    const UTxO_Talendro = await lucid.utxoByUnit(
      TALENDROPID + paymentCredentialOf(address).hash.slice(-20)
    );
    const redeemer = Data.to(1n);

    const contractAddress = datum.pay ? HOLDINGADDR : MILESTONEADDR;
    const tx = await lucid
      .newTx()
      .readFrom(ref_utxo)
      .readFrom([UTxO_Talendro])
      .collectFrom([projectUtxo], redeemer)
      .pay.ToAddress(address, dev_token)
      .pay.ToAddressWithData(
        contractAddress,
        { kind: "inline", value: Data.to(updatedDatum, ProjectDatum) },
        { lovelace: datum.pay ? BigInt(datum.pay) : 3_000_000n }
      )
      .attach.SpendingValidator(ProjectInitiateValidator())
      .addSigner(address)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  } catch (error: any) {
    console.error(error);
  }
  // finally {
  // setSubmitting(false);
  // }
}
