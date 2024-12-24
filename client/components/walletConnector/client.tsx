"use client";

import dynamic from "next/dynamic";
const WalletConnectors = dynamic(() => import("./walletConnector"), { ssr: false });

export default function WalletConnector() {
    return <WalletConnectors />;
}
