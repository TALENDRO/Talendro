import {
  HoldingContractValidator,
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import {
  getAddress,
  getPolicyId,
  keyHashtoAddress,
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

export async function ProjectComplete(
  lucid: LucidEvolution,
  utxo: UTxO,
  datum: ProjectDatum,
  calledByDev: boolean,
  address: string
) {
  try {
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
    const UTxO_Talendro = await lucid.utxoByUnit(
      TALENDROPID + paymentCredentialOf(address).hash.slice(-20)
    ); //talendroPolicyID+assetName assetname is user address

    const redeemer = Data.to("Complete", ProjectRedeemer);

    let dev, clt, signed;
    const tx = lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom([utxo], redeemer)
      .readFrom([UTxO_Talendro])
      .attach.SpendingValidator(HoldingContractValidator());

    if (calledByDev) {
      dev = await tx.pay
        .ToAddressWithData(
          HOLDINGADDR,
          { kind: "inline", value: Data.to(datum, ProjectDatum) },
          { lovelace: datum.pay as bigint, ...dev_token }
        )
        .complete();
      signed = await dev.sign.withWallet().complete();
    } else {
      clt = await tx.pay
        .ToAddress(keyHashtoAddress(datum.developer as string[]), {
          lovelace: datum.pay as bigint,
        })
        .mintAssets({ ...clt_token, ...dev_token }, Data.to(1n))
        .attach.MintingPolicy(mintingValidator)
        .complete();
      signed = await clt.sign.withWallet().complete();
    }

    // const finalTx = calledByDev ? dev : clt
    // const txSystemSigned = await SystemWallet(tx)
    const txHash = await signed.submit();
    return txHash;
  } catch (error) {
    throw error;
  }
}

// export async function AlreadyComplete(
//   lucid: LucidEvolution,
//   datum: ProjectDatum
// ) {
//   const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
//   const [walletConnection] = useWallet();
//   const { address } = walletConnection;

//   const mintingValidator = ProjectInitiateValidator();

//   const dev_assetname = fromText("dev_") + datum.title;
//   const dev_token = { [PROJECTINITPID + dev_assetname]: 1 };

//   const have_dev_token = await lucid.utxosAtWithUnit(
//     address as string,
//     dev_assetname
//   );
//   if (have_dev_token.length > 0) {
//     return true;
//   }
//   console.log(have_dev_token);
//   return false;
// }
