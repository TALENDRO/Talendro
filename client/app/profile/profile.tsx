"use client";
import { useWallet } from "@/context/walletContext";
import { Button } from "@/components/ui/button";
import { mint } from "@/components/transactions/identification_mint";

export default function TalendroTokenMinter() {
  const [WalletConnection] = useWallet();

  const { lucid, address } = WalletConnection;
async function mintClick() {
  if (!lucid || !address) throw "Uninitialized Lucid!!!";
  await  mint(WalletConnection);
}

  return <Button onClick={mintClick}>Talendro mint</Button>;
}
