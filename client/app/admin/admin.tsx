"use client";

import {
  mint,
  sendConfigDatum,
  updateConfigDatum,
} from "@/components/transactions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWallet } from "@/context/walletContext";

import { ConfigDatum } from "@/types/cardano";
import { paymentCredentialOf } from "@lucid-evolution/lucid";
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
import { getAddress, getPolicyId, privateKeytoAddress } from "@/lib/utils";
import { STAKEPRIVATEKEY } from "@/config";
import { withErrorHandling } from "@/components/errorHandling";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function Page() {
  const [stakeAddress, setstakeAddress] = useState("");
  const [WalletConnection, setWalletConnection] = useWallet();
  const { isEmulator, address } = WalletConnection;
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

  async function uppdateConfigDatumClick() {
    setSubmitting(true);

    // if (isEmulator && !policyID) return;
    const safe_configDatum = withErrorHandling(updateConfigDatum);
    const result = await safe_configDatum(WalletConnection, CONFIGDATUM);
    console.log(result);
    setSubmitting(false);
  }

  // lace #account 1
  if (
    isEmulator &&
    address !==
      "addr_test1qrlq53qjd2yxx4lqj29526fn2uyl9fe7julp4shkgqm3m4dpvpz9h24n9ttq5f4d2xunltqy3yfphmr29uw4kwxt0h9qadh7tj"
  ) {
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
      <h1 className="text-3xl font-bold mb-6 text-center">
        Configuration Management
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <ShineBorder
          className="relative w-full rounded-lg p-[2px]"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <Card className="bg-background rounded-lg p-4">
            <CardHeader>
              <CardTitle className="text-center">Config Datum</CardTitle>
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
        </ShineBorder> */}
        <ShineBorder
          className="relative w-full rounded-lg p-[2px]"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <Card className="bg-background rounded-lg p-4">
            <CardHeader>
              <CardTitle className="text-center">Config Datum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/30 p-4 rounded-md overflow-auto max-h-96">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(
                    CONFIGDATUM,
                    (key, value) =>
                      typeof value === "bigint" ? value.toString() : value,
                    2
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </ShineBorder>

        {/* <Card>
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
        </Card> */}
        <ShineBorder
          className="relative w-full rounded-lg p-[2px]"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Actions</CardTitle>
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
              <Button
                onClick={uppdateConfigDatumClick}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Processing..." : "Update Config Datum"}
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
        </ShineBorder>
      </div>
    </div>
  );
}
