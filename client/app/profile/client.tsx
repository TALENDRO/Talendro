"use client";

import dynamic from "next/dynamic";
const TalendroTokenMinter = dynamic(() => import("./profile"), { ssr: false });

export default function Client() {
  return <TalendroTokenMinter />;
}
