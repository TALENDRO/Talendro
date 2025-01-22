import { TxSignBuilder } from "@lucid-evolution/lucid";
import { PRIVATEKEY, STAKEPRIVATEKEY } from ".";
import { signWithPrivateKey } from "@/lib/utils";

export async function SystemWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithPrivateKey(tx, PRIVATEKEY);
  return txSystemSigned;
}

export async function StakeWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithPrivateKey(tx, STAKEPRIVATEKEY);
  return txSystemSigned;
}
