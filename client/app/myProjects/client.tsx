"use client";

import dynamic from "next/dynamic";
const Page = dynamic(() => import("./myProjects"), { ssr: false });

export default function Client() {
  return <Page />;
}
