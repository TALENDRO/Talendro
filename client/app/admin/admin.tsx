"use client";

import { mint, sendConfigDatum } from "@/components/transactions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWallet } from "@/context/walletContext";
import { toast } from "sonner";

import { ConfigDatum } from "@/types/cardano";
import { paymentCredentialOf, stakeCredentialOf } from "@lucid-evolution/lucid";
import React, { useEffect, useState } from "react";
import {
  ArbitrationContractValidator,
  ArbitratorTokenValidator,
  ConfigDatumHolderValidator,
  HoldingContractValidator,
  MilestoneMINTValidator,
  MilestoneSpendValidator,
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import {
  getAddress,
  getPolicyId,
  privateKeytoAddress,
  seedtoAddress,
} from "@/lib/utils";
import { STAKEPRIVATEKEY } from "@/config";
import { withErrorHandling } from "@/components/errorHandling";
import { fail } from "assert";

export default function Page() {
  const [stakeAddress, setstakeAddress] = useState("");
  const [WalletConnection, setWalletConnection] = useWallet();
  const { isEmulator } = WalletConnection;
  const [submitting, setSubmitting] = useState(false);
  const [policyID, setPolicy] = useState("");
  const STAKESEED = process.env.NEXT_PUBLIC_STAKE_WALLET as string;
  const MILESTONEPID = getPolicyId(MilestoneMINTValidator);
  const IDENTIFICATIONPID = process.env
    .NEXT_PUBLIC_IDENTIFICATION_POLICY_ID as string;
  const ARBITRATORPID = getPolicyId(ArbitratorTokenValidator);
  const TALENDROPID = getPolicyId(TalendroTokenValidator);

  const CONFIGADDR = getAddress(ConfigDatumHolderValidator);
  const MILESTONEADDR = getAddress(MilestoneSpendValidator);
  const HOLDINGADDR = getAddress(HoldingContractValidator);
  const PROJECTINITADDR = getAddress(ProjectInitiateValidator);
  const ARBITRATIONADDR = getAddress(ArbitrationContractValidator);
  async function awaitStakAddr(STAKESEED: string) {
    const STAKEADDRESS = await privateKeytoAddress(STAKEPRIVATEKEY);
    setstakeAddress(STAKEADDRESS);
  }

  useEffect(() => {
    awaitStakAddr(STAKESEED);
  }, []);
  const CONFIGDATUM: ConfigDatum = {
    identification_nft: isEmulator ? policyID : IDENTIFICATIONPID,
    milestone_contract_policy: MILESTONEPID,
    milestone_contract_address: paymentCredentialOf(MILESTONEADDR).hash,
    holding_contract: paymentCredentialOf(HOLDINGADDR).hash,
    projectinit_contract: paymentCredentialOf(PROJECTINITADDR).hash,
    arbitrator_nft: ARBITRATORPID,
    arbitrator_contract: paymentCredentialOf(ARBITRATIONADDR).hash,
    talendrouser_nft: TALENDROPID,
    stake_address: stakeAddress
      ? [paymentCredentialOf(stakeAddress).hash, ""]
      : ["", ""],
    stake_amount: 100_000_000n,
  };

  async function handleMintClick() {
    setSubmitting(true);
    const saferMint = withErrorHandling(mint);
    const result = await saferMint(WalletConnection);

    console.log(result);

    setSubmitting(false);
  }

  async function sendConfigDatumClick() {
    setSubmitting(true);

    // if (isEmulator && !policyID) return;
    const safe_configDatum = withErrorHandling(sendConfigDatum);
    const result = await safe_configDatum(WalletConnection, CONFIGDATUM);
    console.log(result);
    setSubmitting(false);
  }

  if (!isEmulator) {
    return (
      <div className="w-full h-full flex items-center justify-center font-semibold text-2xl flex-col">
        YOU MUST BE IN EMULATOR MODE
        {/* Emulator Toggle  */}
        <div className="flex items-center justify-between rounded-lg border p-2 mx-2">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">Emulator Mode</Label>
            <p className="text-sm text-muted-foreground">
              This will use Emulator Accounts.
            </p>
          </div>
          <Switch
            id="marketing"
            checked={isEmulator}
            onCheckedChange={(checked) => {
              setTimeout(() => {
                setWalletConnection((prev) => ({
                  ...prev,
                  isEmulator: checked,
                }));
              }, 500);
            }}
            aria-label="Toggle marketing emails"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Configuration Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Config Datum</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-secondary/30 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(
                CONFIGDATUM,
                (key, value) =>
                  typeof value === "bigint" ? value.toString() : value,
                2
              )}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleMintClick}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Processing..." : "Mint Identification Token"}
            </Button>
            <Button
              onClick={sendConfigDatumClick}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Processing..." : "Attach Config Datum"}
            </Button>
            <div className="">
              <Label>Do you Have a Policy ID already?</Label>
              <Input
                type="text"
                value={policyID}
                onChange={(e) => setPolicy(e.target.value)}
                placeholder="Policy ID"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
