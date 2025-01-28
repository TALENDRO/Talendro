"use client"

import { useEffect, useState } from "react"
import { ArbitratorTokenValidator, identificationPolicyid } from "@/config/scripts/scripts"
import { useWallet } from "@/context/walletContext"
import { Data, fromText, mintingPolicyToId, type UTxO, type Validator } from "@lucid-evolution/lucid"
import { ARBITRATIONADDR, PROJECTINITPID, SYSTEMADDRESS } from "@/config"
import { SystemWallet } from "@/config/systemWallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw } from "lucide-react"
import ArbitratorProjectItem from "@/components/arbitratorProjectItem"

export default function ArbitratorTokenMinter() {
  const [WalletConnection] = useWallet()
  const { lucid, address } = WalletConnection
  const [projects, setProjects] = useState<UTxO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  // const { toast } = useToast()

  const fetchProjects = async () => {
    setIsLoading(true)
    if (!lucid || !address) {
      // toast({
      //   title: "Error",
      //   description: "Wallet not connected. Please connect your wallet and try again.",
      //   variant: "destructive",
      // })
      return
    }
    try {
      const utxos = await lucid.utxosAt(ARBITRATIONADDR)
      const filteredUtxos = utxos.filter((utxo) => Object.keys(utxo.assets).some((key) => key.includes(PROJECTINITPID)))
      setProjects(filteredUtxos)
    } catch (error) {
      console.error("Error fetching projects:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch projects. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 200);
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [lucid]) // Added fetchProjects to dependencies

  async function mint() {
    if (!lucid || !address) {
      // toast({
      //   title: "Error",
      //   description: "Wallet not connected. Please connect your wallet and try again.",
      //   variant: "destructive",
      // })
      return
    }

    setIsMinting(true)
    try {
      const usr_configNFT = {
        [identificationPolicyid + fromText("usr_configNFT")]: 1n,
      }
      const utxoWithIdentificationToken = await lucid.utxosAtWithUnit(
        SYSTEMADDRESS,
        identificationPolicyid + fromText("usr_configNFT"),
      )

      const mintingValidator: Validator = ArbitratorTokenValidator()
      const policyID = mintingPolicyToId(mintingValidator)
      const ArbitratorID = address.slice(-10)
      const mintedAssets = { [policyID + fromText(ArbitratorID)]: 1n }
      const redeemer = Data.void()
      const tx = await lucid
        .newTx()
        .collectFrom(utxoWithIdentificationToken)
        .pay.ToAddress(SYSTEMADDRESS, { ...usr_configNFT, lovelace: 2_000_000n })
        .mintAssets(mintedAssets, redeemer)
        .attach.MintingPolicy(mintingValidator)
        .addSigner(SYSTEMADDRESS)
        .complete()

      const systemSigned = await SystemWallet(tx)
      const signed = await systemSigned.sign.withWallet().complete()
      const txHash = await signed.submit()
      console.log("Arbitrator PiD", policyID)
      console.log("txHash: ", txHash)
      // toast({
      //   title: "Success",
      //   description: "Arbitrator token minted successfully!",
      // })
    } catch (error) {
      console.error("Minting error:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to mint Arbitrator token. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arbitrator Token Minter</CardTitle>
          <CardDescription>Mint your Arbitrator token and manage projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={mint} disabled={isMinting}>
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : (
              "Mint Arbitrator Token"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Arbitration Projects</CardTitle>
            <Button variant="outline" size="icon" onClick={fetchProjects} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ArbitratorProjectItem project={project} key={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No projects found for arbitration.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

