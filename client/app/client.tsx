"use client";

import dynamic from "next/dynamic";
const Homepage = dynamic(() => import("./Home"), { ssr: false });

export default function ClientHome() {
  return <Homepage />;
}
