"use client";
import ClientHome from "./client";

import { ConfigDatum } from "@/types/cardano";
import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";

export default function Home() {
  return <ClientHome />;
}
