"use client";
import { useWallet } from "@/context/walletContext";
import { Button } from "@/components/ui/button";
import { mint } from "@/components/transactions/identification_mint";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProject } from "@/components/createProjectModal";
import MyProjectsPage from "./myProjects";
import { useState } from "react";
import { withErrorHandling } from "@/components/errorHandling";

export default function TalendroTokenMinter() {
  const [WalletConnection] = useWallet();
  const [submitting, setSubmitting] = useState(false);

  const { lucid, address } = WalletConnection;
  async function mintClick() {
    setSubmitting(true);
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const talendroMint = withErrorHandling(mint);
    const result = await talendroMint(WalletConnection);
    console.log(result);
    setSubmitting(false);
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Manage and Create your projects on Talendro by Staking your
            reputation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={mintClick} disabled={submitting}>
            Talendro mint
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>
            Manage your projects as a client or developer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProject />
        </CardContent>
      </Card>

      <MyProjectsPage />
    </>
  );
}
