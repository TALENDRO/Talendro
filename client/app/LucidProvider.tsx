'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { Blockfrost, Lucid, LucidEvolution, Network } from "@lucid-evolution/lucid";

interface LucidContextType {
  lucid: LucidEvolution | undefined;
}

const LucidContext = createContext<LucidContextType | undefined>(undefined);

const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORK = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export interface ProvidersProps {
  children: React.ReactNode;
}
export default function LucidProvider({ children }: ProvidersProps) {
  const [lucid, setLucid] = useState<LucidEvolution>();

  // useEffect(() => {
  //   const blockfrost = new Blockfrost(BF_URL, BF_PID);
  //   // Lucid(blockfrost, NETWORK).then(setLucid).catch((error) => console.log(error));

  //   Lucid(blockfrost, NETWORK)
  //     .then((lucidInstance) => {
  //       if (lucidInstance) {
  //         setLucid(lucidInstance);
  //       } else { console.error("Lucid returned undefined."); }
  //     }).catch((error) => console.error("Error initializing Lucid:", error));
  // }, []);


  // useEffect(() => {
  //   const initializeLucid = async () => {
  //     try {
  //       const blockfrost = new Blockfrost(BF_URL, BF_PID);
  //       console.log(blockfrost)
  //       const lucidInstance = await Lucid(blockfrost, NETWORK);
  //       if (lucidInstance) {
  //         setLucid(lucidInstance);
  //       } else {
  //         console.error("Lucid returned undefined.");
  //       }
  //     } catch (error) {
  //       console.error("Error initializing Lucid:", error);
  //     }
  //   };
  
  //   initializeLucid();
  // }, []);
  

  return (
    <LucidContext.Provider value={{ lucid, }}>
      {children}
    </LucidContext.Provider>
  );
};

export const useLucid = () => {
  const context = useContext(LucidContext);
  if (!context) throw new Error("useLucid must be used within a LucidProvider");
  return context;
};
