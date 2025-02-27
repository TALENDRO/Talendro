"use client";

import dynamic from "next/dynamic";
const ProfilePage = dynamic(() => import("./profile"), { ssr: false });

export default function Client() {
  return <ProfilePage />;
}
