"use client";
import { useWallet } from "@/context/walletContext";
import ArbitratorTokenMinter from "@/components/transactions/arbitratorToken";
import ProjectInitiate from "@/components/transactions/projectInit";
import HoldingContractCancel from "@/components/transactions/holdingContract_cancel";

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

      <ArbitratorTokenMinter />
      <ProjectInitiate />
      <div className="flex gap-4 flex-wrap max-w-96">
        <HoldingContractCancel />
      </div>
    </section>
  );
}
