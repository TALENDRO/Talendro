import { STAKEPRIVATEKEY } from "@/config";
import {
  HoldingContractValidator,
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import {
  getAddress,
  getPolicyId,
  keyHashtoAddress,
  privateKeytoAddress,
  refStakeUtxo,
  refUtxo,
} from "@/lib/utils";
import { ProjectDatum, ProjectRedeemer } from "@/types/cardano";
import {
  Data,
  fromText,
  LucidEvolution,
  paymentCredentialOf,
  UTxO,
} from "@lucid-evolution/lucid";

export async function CancelProject(
  lucid: LucidEvolution,
  utxo: UTxO,
  datum: ProjectDatum,
  calledByDev: boolean,
  address: string
) {
  try {
    const STAKEADDRESS = await privateKeytoAddress(STAKEPRIVATEKEY);
    const mintingValidator = ProjectInitiateValidator();
    const HOLDINGADDR = getAddress(HoldingContractValidator);
    const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
    const TALENDROPID = getPolicyId(TalendroTokenValidator);
    const qty = calledByDev ? 1n : -1n;

    const dev_assetname = fromText("dev_") + datum.title;
    const dev_token = { [PROJECTINITPID + dev_assetname]: qty };

    const clt_assetname = fromText("clt_") + datum.title;
    const clt_token = { [PROJECTINITPID + clt_assetname]: qty };

    const ref_utxo = await refUtxo(lucid);
    const ref_stake = await refStakeUtxo(lucid, address, STAKEADDRESS);
    //talendroPolicyID+assetName assetname is user address
    const toPay = datum.pay;
    datum.pay = null;
    datum.developer = null;

    const redeemer = Data.to("Cancel", ProjectRedeemer);

    let dev, clt, signed;
    const tx = lucid
      .newTx()
      .readFrom([...ref_utxo, ...ref_stake])
      .collectFrom([utxo], redeemer)
      .attach.SpendingValidator(HoldingContractValidator());

    if (calledByDev) {
      dev = await tx.pay
        .ToAddressWithData(
          HOLDINGADDR,
          { kind: "inline", value: Data.to(datum, ProjectDatum) },
          { lovelace: toPay as bigint, ...dev_token }
        )
        .complete();
      signed = await dev.sign.withWallet().complete();
    } else {
      clt = await tx.pay
        .ToAddress(address, {
          lovelace: toPay as bigint,
        })
        .mintAssets({ ...clt_token, ...dev_token }, Data.to(1n))
        .attach.MintingPolicy(mintingValidator)
        .complete();
      signed = await clt.sign.withWallet().complete();
    }
    const txHash = await signed.submit();
    return txHash;
  } catch (error) {
    throw error;
  }
}

export async function CancelNotAccepted(
  lucid: LucidEvolution,
  utxo: UTxO,
  datum: ProjectDatum
) {
  try {
    const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);

    const dev_assetname = fromText("dev_") + datum.title;
    const dev_token = { [PROJECTINITPID + dev_assetname]: -1n };

    const clt_assetname = fromText("clt_") + datum.title;
    const clt_token = { [PROJECTINITPID + clt_assetname]: -1n };

    const clientaddr = keyHashtoAddress(datum.client);
    const pay = datum.pay;

    const redeemer = Data.to(1n);
    const spend_redeemer = Data.to(2n);

    const tx = await lucid
      .newTx()
      .collectFrom([utxo], spend_redeemer)
      .pay.ToAddress(clientaddr, {
        lovelace: pay as bigint,
      })
      .mintAssets({ ...clt_token, ...dev_token }, redeemer)
      .attach.Script(ProjectInitiateValidator())
      .complete();

    const sign = await tx.sign.withWallet().complete();
    const submit = await sign.submit();
    return submit;
  } catch (error) {
    return error;
  }
}
