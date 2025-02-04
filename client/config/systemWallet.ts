import { TxSignBuilder } from "@lucid-evolution/lucid";
import { PRIVATEKEY, STAKESEED } from ".";
import { signWithPrivateKey, signWithSeed } from "@/lib/utils";

export async function SystemWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithPrivateKey(tx, PRIVATEKEY);
  return txSystemSigned;
}

export async function StakeWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithSeed(tx, STAKESEED);
  return txSystemSigned;
}
