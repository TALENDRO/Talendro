"use client";
import Identification from "@/components/transactions/identification";
import { useWallet } from "@/context/walletContext";
import ConfigDatumHolder from "@/components/transactions/configDatumHolder";
import ArbitratorTokenMinter from "@/components/transactions/arbitratorToken";
import ProjectInitiate from "@/components/transactions/projectInit";
import TalendroTokenMinter from "@/components/transactions/TalendroToken";
import HoldingContract from "@/components/transactions/holdingContract_complete";
import HoldingContractCancel from "@/components/transactions/holdingContract_cancel";
import HoldingContractArbitration from "@/components/transactions/holdingContract_arbitration";

export default function Home() {
  const [walletConnection] = useWallet();
  const { address } = walletConnection;

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {address ? (
        <span>{`${address.slice(0, 30)}...${address.slice(-5)}`}</span>
      ) : (
        "not connected"
      )}
      {/* <Identification /> */}

      {/* <ConfigDatumHolder /> */}

      <ArbitratorTokenMinter />

      <TalendroTokenMinter />       {/*//page routing */}

      <ProjectInitiate />
      <div className="flex gap-4 flex-wrap max-w-96">
        <HoldingContract />
        <HoldingContractCancel />
        <HoldingContractArbitration />
      </div>
    </section>
  );
}
