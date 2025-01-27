"use client";

import dynamic from "next/dynamic";
import TalendroTokenMinter from "./profile";
const Page = dynamic(() => import("./profile"), { ssr: false });

export default function Client() {
  return <TalendroTokenMinter />;
}
