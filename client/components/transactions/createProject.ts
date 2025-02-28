import { STAKEPRIVATEKEY } from "@/config";
import { ProjectInitiateValidator } from "@/config/scripts/scripts";
import { WalletConnection } from "@/context/walletContext";
import {
  getPolicyId,
  getAddress,
  privateKeytoAddress,
  toLovelace,
  refUtxo,
  refStakeUtxo,
} from "@/lib/utils";
import { ProjectDatum } from "@/types/cardano";
import {
  MintingPolicy,
  fromText,
  paymentCredentialOf,
  Data,
  stakeCredentialOf,
} from "@lucid-evolution/lucid";
type ProjectType = "Milestone" | "Regular";

export async function createProject(
  walletConnection: WalletConnection,
  title: string,
  pay: number | null,
  type: ProjectType,
  description: string,
  imageUrl: string
) {
  const { lucid, address } = walletConnection;
  try {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const mintingValidator: MintingPolicy = ProjectInitiateValidator();
    const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
    const PROJECTINITADDR = getAddress(ProjectInitiateValidator);
    // const STAKESEED = process.env.NEXT_PUBLIC_STAKE_WALLET as string;
    // const STAKEADDRESS = await seedtoAddress(STAKESEED);
    const STAKEADDRESS = await privateKeytoAddress(STAKEPRIVATEKEY);

    const datum: ProjectDatum = {
      title: fromText(title),
      pay: pay ? toLovelace(pay) : null,
      developer: null,
      client: [
        paymentCredentialOf(address).hash,
        stakeCredentialOf(address).hash,
      ],
      milestones: [],
      current_milestone: null,
      next_milestone: null,
      // description: fromText(description),
      // imageUrl: fromText(imageUrl),
    };

    const clt_assetname = fromText("clt_") + datum.title;
    const dev_assetname = fromText("dev_") + datum.title;
    const clt_token = { [PROJECTINITPID + clt_assetname]: 1n };
    const dev_token = { [PROJECTINITPID + dev_assetname]: 1n };
    const ref_utxo = await refUtxo(lucid);
    const ref_stake = await refStakeUtxo(lucid, address, STAKEADDRESS);

    const redeemer = Data.to(0n);
    const tx = await lucid
      .newTx()
      .readFrom([...ref_utxo, ...ref_stake])
      // .readFrom([UTxO_Talendro])
      .pay.ToAddressWithData(
        PROJECTINITADDR,
        { kind: "inline", value: Data.to(datum, ProjectDatum) },
        { lovelace: pay ? toLovelace(pay) : 3_000_000n, ...dev_token }
      )
      .mintAssets({ ...clt_token, ...dev_token }, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .attachMetadata(721, {
        [PROJECTINITPID]: {
          ["dev_" + title]: {
            name: "dev_" + title,
            image: imageUrl,
            description: description,
          },
          ["clt_" + title]: {
            name: "clt_" + title,
            image: imageUrl,
            description: description,
          },
        },
      })
      .complete();
    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();

    return txHash;
  } catch (error: any) {
    throw error;
  }
}
