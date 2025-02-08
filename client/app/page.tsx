"use client";
import ClientHome from "./client";
import {
  IDENTIFICATIONPID,
  MILESTONEPID,
  MILESTONEADDR,
  HOLDINGADDR,
  PROJECTINITADDR,
  ARBITRATORPID,
  ARBITRATIONADDR,
  TALENDROPID,
  STAKEADDRESS,
} from "@/config";
import { ConfigDatum } from "@/types/cardano";
import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";

export default function Home() {
  const CONFIGDATUM: ConfigDatum = {
    identification_nft: IDENTIFICATIONPID,
    milestone_contract_policy: MILESTONEPID,
    milestone_contract_address: paymentCredentialOf(MILESTONEADDR).hash,
    holding_contract: paymentCredentialOf(HOLDINGADDR).hash,
    projectinit_contract: paymentCredentialOf(PROJECTINITADDR).hash,
    arbitrator_nft: ARBITRATORPID,
    arbitrator_contract: paymentCredentialOf(ARBITRATIONADDR).hash,
    talendrouser_nft: TALENDROPID,
    stake_address: [
      paymentCredentialOf(STAKEADDRESS).hash,
      stakeCredentialOf(STAKEADDRESS).hash,
    ],
    stake_amount: 100_000_000n,
  };
  return <ClientHome />;
}
