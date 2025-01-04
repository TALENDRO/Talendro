import { TxSignBuilder } from "@lucid-evolution/lucid";
import { PRIVATEKEY } from ".";
import { signWithPrivateKey } from "@/libs/utils";

export async function SystemWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithPrivateKey(tx, PRIVATEKEY);
  return txSystemSigned;
}
