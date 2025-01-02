'use client'
import WalletConnector from "@/components/walletConnector/client";
import EmulatorConnector from "@/components/walletConnector/emulatorClient";
import Identification from "@/components/transactions/identification";
import { useWallet } from "@/contexts/walletContext";
import ConfigDatumHolder from "@/components/transactions/configDatumHolder";
import ArbitratorTokenMinter from "@/components/transactions/arbitratorToken";
import ProjectInitiate from "@/components/transactions/projectInit";
import TalendroTokenMinter from "@/components/transactions/TalendroToken";

export default function Home() {
  const [walletConnection] = useWallet();
  const { address, lucid } = walletConnection;


  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {address ? <span>{`${address.slice(0, 30)}...${address.slice(-5)}`}</span> : "not connected"}
      {/* <WalletConnector /> */}
      <EmulatorConnector />

      <Identification />

      <ConfigDatumHolder />

      <ArbitratorTokenMinter />

      <TalendroTokenMinter />

      <ProjectInitiate />
    </section>
  );
}
