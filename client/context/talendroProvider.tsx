"use client";

import { useState } from "react";

import { TalendroHook, TalendroContext } from "./talendroContext";
import { IDENTIFICATIONPID } from "@/config";

export default function TalendroProvider(props: { children: React.ReactNode }) {
  return (
    <TalendroContext.Provider
      value={useState<TalendroHook>({ policyId: IDENTIFICATIONPID })}
    >
      {props.children}
    </TalendroContext.Provider>
  );
}
