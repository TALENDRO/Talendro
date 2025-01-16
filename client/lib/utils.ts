import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toAda(value: BigInt) {
  return (Number(value) / 1_000_000);
}
export function toLovelace(value: number) {
  return BigInt(value * 1_000_000);
}

// import { toast } from "react-toastify";

import {
  ConfigDatumHolderValidator,
  identificationPolicyid,
} from "@/config/scripts/scripts";
import { StakeDatum } from "@/types/cardano";
import {
  fromText,
  LucidEvolution,
  mintingPolicyToId,
  Script,
  Validator,
  validatorToAddress,
  Constr,
  MintingPolicy,
  TxSignBuilder,
  makeWalletFromPrivateKey,
  paymentCredentialOf,
  Data,
  keyHashToCredential,
  credentialToAddress,
} from "@lucid-evolution/lucid";
import { NETWORK, PROVIDER } from "@/config/lucid";

export async function req(path: string, req?: RequestInit) {
  const rsp = await fetch(path, { ...req, cache: "no-cache" });

  if (!rsp.ok) {
    throw {
      code: rsp.status,
      info: rsp.statusText,
    };
  }

  return rsp.json();
}

export function handleSuccess(success: any) {
  // toast(`${success}`, { type: "success" });
  console.log(success);
}

export function handleError(error: any) {
  const { info, message } = error;

  function toJSON(error: any) {
    try {
      const errorString = JSON.stringify(error);
      const errorJSON = JSON.parse(errorString);

      return errorJSON;
    } catch {
      return {};
    }
  }

  const { cause } = toJSON(error);
  const { failure } = cause ?? {};

  const failureCause = failure?.cause;
  const failureInfo = failureCause?.info;
  const failureMessage = failureCause?.message;

  // toast(`${failureInfo ?? failureMessage ?? info ?? message ?? error}`, {
  // type: "error",
  // });
  console.error(failureCause ?? { error });
}

export function adaToLovelace(float: string) {
  const [ada, lovelace] = float.split(".");

  return BigInt(ada) * 1_000000n + BigInt(lovelace || 0);
}

export function getAddress(validatorFunction: { (): Validator; (): Script }) {
  const validator: Validator = validatorFunction();
  const address = validatorToAddress(NETWORK, validator);
  return address;
}
export function getPolicyId(validatorFunction: { (): Validator; (): Script }) {
  const validator: MintingPolicy = validatorFunction();
  const policyID = mintingPolicyToId(validator);
  return policyID;
}

export async function refUtxo(lucid: LucidEvolution) {
  // const address = getAddress(ConfigDatumHolderValidator)
  const v = ConfigDatumHolderValidator();
  const address = validatorToAddress(NETWORK, v);
  // const utxos = await lucid.utxosAt(address);
  const utxos = await lucid.utxosAtWithUnit(
    address,
    identificationPolicyid + fromText("ref_configNFT"),
  );

  // const ref_configNFT = { [identificationPolicyid + fromText('ref_configNFT')]: 1n };
  // const utxoWithIdentificationToken = utxos.filter((utxo) => {
  //     const assets = utxo.assets;

  //     return Object.keys(ref_configNFT).some((key) =>
  //         assets[key] === ref_configNFT[key]
  //     );
  // });
  return utxos;
}


export async function refStakeUtxo(lucid: LucidEvolution, address: string, STAKEADDRESS: string) {
  const utxos = await lucid.utxosAt(STAKEADDRESS);
  const datum = { staked_by: paymentCredentialOf(address).hash }
  const stake_utxo = utxos.filter((utxo) => {
    if (!utxo.datum) return false; // Skip UTxOs without a datum
    const isEqual = utxo.datum === Data.to(datum, StakeDatum); // Compare using references
    return isEqual; // Ensure this result is returned
  })
  return stake_utxo;
}
export async function signWithPrivateKey(
  tx: TxSignBuilder,
  privateKey: string,
) {
  const signed = await tx.sign.withPrivateKey(privateKey);
  return signed;
}

export async function privateKeytoAddress(privateKey: string) {
  const privatekeyAddress = await makeWalletFromPrivateKey(
    PROVIDER,
    NETWORK,
    privateKey,
  ).address();
  return privatekeyAddress;
}

export function keyHashtoAddress(keyHash: string) {
  const credentials = keyHashToCredential(keyHash);
  const address = credentialToAddress(NETWORK, credentials);
  return address;
}