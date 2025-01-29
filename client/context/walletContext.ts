import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  Address,
  LucidEvolution,
  PaymentKeyHash,
  RewardAddress,
  StakeKeyHash,
} from "@lucid-evolution/lucid";

import { Wallet } from "@/types/cardano";

export type WalletConnection = {
  lucid?: LucidEvolution;
  wallet?: Wallet;
  address?: Address;
  pkh?: PaymentKeyHash;
  stakeAddress?: RewardAddress;
  skh?: StakeKeyHash;
  balance?: number;
  isEmulator: boolean;
};

export const WalletContext = createContext<
  [WalletConnection, Dispatch<SetStateAction<WalletConnection>>]
>([{ isEmulator: true }, () => {}]);
export const useWallet = () => useContext(WalletContext);
