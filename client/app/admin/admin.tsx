"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/toast"
import {
  IDENTIFICATIONPID,
  MILESTONEPID,
  MILESTONEADDR,
  HOLDINGADDR,
  PROJECTINITADDR,
  ARBITRATORPID,
  ARBITRATIONADDR,
  TALENDROPID,
  STAKEADDRESS,
  CONFIGADDR,
  SYSTEMADDRESS,
} from "@/config"
import { IdentificationNFT_MintValidator } from "@/config/scripts/scripts"
import { useWallet } from "@/context/walletContext"
import { handleError } from "@/lib/utils"
import { ConfigDatum } from "@/types/cardano"
import {
  Constr,
  Data,
  fromText,
  type MintingPolicy,
  mintingPolicyToId,
  paymentCredentialOf,
} from "@lucid-evolution/lucid"
import React, { useState } from "react"

export default function Page() {
  const [WalletConnection] = useWallet()
  const { lucid, address } = WalletConnection
  const [submitting, setSubmitting] = useState(false)
  // const { toast } = useToast()

  const CONFIGDATUM: ConfigDatum = {
    identification_nft: IDENTIFICATIONPID,
    milestone_contract_policy: MILESTONEPID,
    milestone_contract_address: paymentCredentialOf(MILESTONEADDR).hash,
    holding_contract: paymentCredentialOf(HOLDINGADDR).hash,
    projectinit_contract: paymentCredentialOf(PROJECTINITADDR).hash,
    arbitrator_nft: ARBITRATORPID,
    arbitrator_contract: paymentCredentialOf(ARBITRATIONADDR).hash,
    talendrouser_nft: TALENDROPID,
    stake_vkh: paymentCredentialOf(STAKEADDRESS).hash,
    stake_amount: 100_000_000n,
  }

  async function mint() {
    if (!lucid) {
      // toast({ title: "Error", description: "Uninitialized Lucid!!!", variant: "destructive" })
      return
    }
    if (!address) {
      // toast({ title: "Error", description: "Wallet not Connected!!!", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      const utxos = await lucid.utxosAt(address)

      const orefHash = String(utxos[0].txHash)
      const orefIndex = BigInt(utxos[0].outputIndex)
      const oref = new Constr(0, [orefHash, orefIndex])

      const mintingValidator: MintingPolicy = IdentificationNFT_MintValidator([oref])
      const policyID = mintingPolicyToId(mintingValidator)
      const ref_configNFT = { [policyID + fromText("ref_configNFT")]: 1n }
      const usr_configNFT = { [policyID + fromText("usr_configNFT")]: 1n }
      const mintedAssets = { ...ref_configNFT, ...usr_configNFT }

      const redeemer = Data.void()

      const tx = await lucid
        .newTx()
        .collectFrom([utxos[0]])
        .pay.ToAddress(SYSTEMADDRESS, {
          ...usr_configNFT,
          lovelace: 2_000_000n,
        })
        .mintAssets(mintedAssets, redeemer)
        .attach.MintingPolicy(mintingValidator)
        .complete()
      const signed = await tx.sign.withWallet().complete()
      const txHash = await signed.submit()
      console.log("policyId(param for rest of the scripts): ", policyID)
      console.log("txHash: ", txHash)
      // toast({ title: "Success", description: "Identification Token minted successfully!" })
    } catch (error) {
      handleError(error)
      // toast({ title: "Error", description: "Failed to mint Identification Token", variant: "destructive" })
    }
    setSubmitting(false)
  }

  async function sendConfigDatum() {
    if (!lucid || !address) {
      // toast({ title: "Error", description: "Uninitialized Lucid!!!", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      const ref_configNFT = {
        [IDENTIFICATIONPID + fromText("ref_configNFT")]: 1n,
      }

      const tx = await lucid
        .newTx()
        .pay.ToAddressWithData(
          CONFIGADDR,
          { kind: "inline", value: Data.to(CONFIGDATUM, ConfigDatum) },
          { lovelace: 5_000_000n, ...ref_configNFT },
        )
        .complete()

      const signed = await tx.sign.withWallet().complete()
      const txHash = await signed.submit()
      console.log("txHash: ", txHash)
      // toast({ title: "Success", description: "Config Datum attached successfully!" })
    } catch (error) {
      handleError(error)
      // toast({ title: "Error", description: "Failed to attach Config Datum", variant: "destructive" })
    }
    setSubmitting(false)
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
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(CONFIGDATUM, (key, value) => (typeof value === "bigint" ? value.toString() : value), 2)}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={mint} disabled={submitting} className="w-full">
              {submitting ? "Processing..." : "Mint Identification Token"}
            </Button>
            <Button onClick={sendConfigDatum} disabled={submitting} className="w-full">
              {submitting ? "Processing..." : "Attach Config Datum"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

