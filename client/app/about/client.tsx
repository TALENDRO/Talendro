"use client";

import dynamic from "next/dynamic";
const Page = dynamic(() => import("./about"), { ssr: false });

export default function Client() {
  return <Page />;
}
