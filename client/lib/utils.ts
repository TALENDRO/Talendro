import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toAda(value: BigInt) {
  return Number(value) / 1_000_000;
}
export function toLovelace(value: number) {
  return BigInt(value * 1_000_000);
}

import {
  ConfigDatumHolderValidator,
  identificationPolicyid,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import { StakeDatum } from "@/types/cardano";
import {
  fromText,
  LucidEvolution,
  mintingPolicyToId,
  Script,
  Validator,
  validatorToAddress,
  MintingPolicy,
  TxSignBuilder,
  makeWalletFromPrivateKey,
  paymentCredentialOf,
  Data,
  keyHashToCredential,
  credentialToAddress,
  makeWalletFromSeed,
  getAddressDetails,
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

  return failureCause ?? { error };
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
  const v = ConfigDatumHolderValidator();
  const address = validatorToAddress(NETWORK, v);
  const utxos = await lucid.utxosAtWithUnit(
    address,
    identificationPolicyid + fromText("ref_configNFT")
  );

  return utxos;
}

export async function refStakeUtxo(
  lucid: LucidEvolution,
  address: string,
  STAKEADDRESS: string
) {
  const TALENDROPID = getPolicyId(TalendroTokenValidator);
  const utxos = await lucid.utxosAtWithUnit(
    STAKEADDRESS,
    TALENDROPID + paymentCredentialOf(address).hash.slice(-20)
  );
  if (!utxos.length) throw new Error("Stake not found, Please Stake 100 ADA");
  return utxos;
}
export function signWithPrivateKey(tx: TxSignBuilder, privateKey: string) {
  const signed = tx.sign.withPrivateKey(privateKey);
  return signed;
}

export function signWithSeed(tx: TxSignBuilder, seed: string) {
  const signed = tx.sign.withWallet();
  return signed;
}

export async function privateKeytoAddress(privateKey: string) {
  const privatekeyAddress = await makeWalletFromPrivateKey(
    PROVIDER,
    NETWORK,
    privateKey
  ).address();
  return privatekeyAddress;
}
export async function seedtoAddress(seed: string) {
  const privatekeyAddress = await makeWalletFromSeed(PROVIDER, NETWORK, seed, {
    addressType: "Base",
  }).address();
  return privatekeyAddress;
}

export function keyHashtoAddress(keyHash: string[]) {
  const payment = keyHashToCredential(keyHash[0]);
  const stake = keyHashToCredential(keyHash[1]);
  const address = credentialToAddress(NETWORK, payment, stake);
  return address;
}
