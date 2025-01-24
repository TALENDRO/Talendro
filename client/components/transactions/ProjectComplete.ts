import { HOLDINGADDR, PROJECTINITPID, TALENDROPID } from "@/config";
import {
  HoldingContractValidator,
  ProjectInitiateValidator,
} from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import { getAddress, keyHashtoAddress, refUtxo } from "@/lib/utils";
import { ProjectDatum, ProjectRedeemer } from "@/types/cardano";
import { Data, fromText, LucidEvolution, UTxO } from "@lucid-evolution/lucid";

export async function ProjectComplete(
  lucid: LucidEvolution,
  utxo: UTxO,
  datum: ProjectDatum,
  calledByDev: boolean,
  address: string
) {
  const mintingValidator = ProjectInitiateValidator();

  try {
    const qty = calledByDev ? 1n : -1n;

    const dev_assetname = fromText("dev_") + datum.title;
    const dev_token = { [PROJECTINITPID + dev_assetname]: qty };

    const clt_assetname = fromText("clt_") + datum.title;
    const clt_token = { [PROJECTINITPID + clt_assetname]: qty };

    const ref_utxo = await refUtxo(lucid);
    const UTxO_Talendro = await lucid.utxoByUnit(
      TALENDROPID + fromText(address.slice(-10))
    ); //talendroPolicyID+assetName assetname is user address

    const redeemer = Data.to("Complete", ProjectRedeemer);
    console.log(calledByDev, utxo, HOLDINGADDR);

    let dev, clt, signed;
    const tx = lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom([UTxO_Talendro, utxo], redeemer)
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
        .ToAddress(keyHashtoAddress(datum.developer as string), {
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
    console.log("txHash: ", txHash);
    console.log(lucid.utxosAtWithUnit(address, dev_assetname));
  } catch (error) {
    console.log(error);
  }
}

export async function AlreadyComplete(
  lucid: LucidEvolution,
  datum: ProjectDatum
) {
  const [walletConnection] = useWallet();
  const { address } = walletConnection;

  const mintingValidator = ProjectInitiateValidator();

  const dev_assetname = fromText("dev_") + datum.title;
  const dev_token = { [PROJECTINITPID + dev_assetname]: 1 };

  const have_dev_token = await lucid.utxosAtWithUnit(
    address as string,
    dev_assetname
  );
  if (have_dev_token.length > 0) {
    return true;
  }
  console.log(have_dev_token);
  return false;
}

// async function cltComplete() {
//   if (!lucid || !address) throw "Uninitialized Lucid!!!";
//   const holdingContractAddress = getAddress(HoldingContractValidator);
//   const policyID = getPolicyId(ProjectInitiateValidator);
//   const talendroPid = getPolicyId(TalendroTokenValidator);
//   const mintingValidator = ProjectInitiateValidator()

//   // must burn dev & clt
//   // must pay to dev

//   try {
//     const datum: ProjectDatum = {
//       title: fromText("firstProject"),
//       pay: 5_000_000n,
//       developer: paymentCredentialOf(address).hash,
//       client: paymentCredentialOf(accountA.address).hash,
//       milestones: [],
//       current_milestone: null,
//       next_milestone: null,
//     };

//     const dev_assetname = fromText("dev_") + datum.title;
//     const clt_assetname = fromText("clt_") + datum.title;
//     const dev_token = { [policyID + dev_assetname]: -1n };
//     const clt_token = { [policyID + clt_assetname]: -1n };

//     const ref_utxo = await refUtxo(lucid);
//     // const UTxO_Talendro = await lucid.utxoByUnit(
//     //   talendroPid + fromText(address.slice(-10)),
//     // ); //talendroPolicyID+assetName assetname is user address
//     const UTxO_Talendro = await lucid.utxosAt(address)
//     const script_UTxO = (await lucid.utxosAt(holdingContractAddress))[0]; // accept utxo as parameter
//     const redeemer = Data.to("Complete", ProjectRedeemer);
//     const minterRedeemer = Data.to(1n);
//     const tx = await lucid
//       .newTx()
//       .readFrom(ref_utxo)
//       .collectFrom([script_UTxO], redeemer)
//       .collectFrom(UTxO_Talendro)
//       .pay.ToAddress(
//         accountB.address,
//         { lovelace: datum.pay as bigint },
//       ).mintAssets({ ...clt_token, ...dev_token }, minterRedeemer)
//       .attach.MintingPolicy(mintingValidator)
//       .attach.SpendingValidator(HoldingContractValidator())
//       .complete();

//     // const txSystemSigned = await SystemWallet(tx)
//     const signed = await tx.sign.withWallet().complete();
//     const txHash = await signed.submit();
//     console.log("txHash: ", txHash);
//   } catch (error) {
//     console.log(error);
//   }
// }
//   return (
//     <div className="flex gap-4">
//       {/* <Button onClick={devComplete}>Dev Complete</Button> */}
//       {/* <Button onClick={cltComplete} >client Complete accept</Button> */}
//     </div>
//   );
// }
