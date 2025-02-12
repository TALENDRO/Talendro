import {
  makeWalletFromSeed,
  TxSignBuilder,
  Wallet,
  WalletApi,
} from "@lucid-evolution/lucid";
import { PRIVATEKEY, STAKEPRIVATEKEY } from ".";
import { signWithPrivateKey, signWithSeed } from "@/lib/utils";
import { WalletConnection } from "@/context/walletContext";
import { NETWORK, PROVIDER } from "./lucid";

export async function SystemWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithPrivateKey(tx, PRIVATEKEY);
  return txSystemSigned;
}

export async function StakeWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithPrivateKey(tx, STAKEPRIVATEKEY);
  return txSystemSigned;
}
