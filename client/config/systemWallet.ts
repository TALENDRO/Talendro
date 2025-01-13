import { TxSignBuilder } from "@lucid-evolution/lucid";
import { PRIVATEKEY } from ".";
import { signWithPrivateKey } from "@/lib/utils";

export async function SystemWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithPrivateKey(tx, PRIVATEKEY);
  return txSystemSigned;
}
