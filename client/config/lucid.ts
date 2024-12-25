import { Blockfrost, Koios, Network, Provider } from "@lucid-evolution/lucid";
const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORK = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export const network: Network = NETWORK;
export const provider: Provider = new Blockfrost(BF_URL, BF_PID);
// export const provider: Provider = new Koios("/koios");


