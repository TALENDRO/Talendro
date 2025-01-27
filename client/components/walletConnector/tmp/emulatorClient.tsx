"use client";

import dynamic from "next/dynamic";
const WalletConnector = dynamic(() => import("./emulatorWallet"), {
  ssr: false,
});

export default function EmulatorWallet() {
  return <WalletConnector />;
}
