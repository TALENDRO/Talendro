'use client'
import WalletConnector from "@/components/walletConnector/client";
import Identification from "@/components/transactions/identification";
import { useWallet } from "@/contexts/walletContext";
import { useEffect } from "react";
import { Lucid } from "@lucid-evolution/lucid";
import { network, provider } from "@/config/lucid";
import ConfigDatumHolder from "@/components/transactions/configDatumHolder";

export default function Home() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { address, lucid } = walletConnection;
  let isInit = false;

  // useEffect(() => {
  //   if (isInit) return;
  //   else isInit = true;

  //   Lucid(provider, network)
  //     .then((lucid) =>
  //       setWalletConnection((walletConnection) => {
  //         return { ...walletConnection, lucid };
  //       }),
  //     )
  //     .catch((error) => console.log(`${error}`));
  // }, []);
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {lucid ? "lucid initalized" : "lucid not initialized"}
      {address ? <span>{address}</span> : "not connected"}
      <WalletConnector />

      <h1>Identification</h1>
      <Identification />

      <h1>configDatumHolder</h1>
      <ConfigDatumHolder />
    </section>
  );
}
