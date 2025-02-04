import {
  makeWalletFromSeed,
  TxSignBuilder,
  Wallet,
  WalletApi,
} from "@lucid-evolution/lucid";
import { PRIVATEKEY, STAKESEED } from ".";
import { signWithPrivateKey, signWithSeed } from "@/lib/utils";
import { WalletConnection } from "@/context/walletContext";
import { NETWORK, PROVIDER } from "./lucid";

export async function SystemWallet(tx: TxSignBuilder) {
  const txSystemSigned = await signWithPrivateKey(tx, PRIVATEKEY);
  return txSystemSigned;
}

export async function StakeWallet(
  walletConnection: WalletConnection,
  tx: TxSignBuilder
) {
  const { lucid, wallet } = walletConnection;
  await lucid?.selectWallet.fromSeed(STAKESEED, {
    addressType: "Base",
  });
  const txSystemSigned = await signWithSeed(tx, STAKESEED);
  await lucid?.selectWallet.fromAPI((await wallet?.enable()) as WalletApi);
  return txSystemSigned;
}
