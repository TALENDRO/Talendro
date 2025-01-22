"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/context/walletContext"
import { toAda } from "@/lib/utils"
import { ArbitratorDatum } from "@/types/cardano"
import { Data, toText, type UTxO } from "@lucid-evolution/lucid"
import { ArbitratorAction } from "./transactions/arbitration"

interface Props {
    project: UTxO
}

export default function ArbitratorProjectItem({ project }: Props) {
    const [walletConnection] = useWallet()
    const { lucid } = walletConnection
    const [atFault, setAtFault] = useState<string>("")
    const [submitting, setSubmitting] = useState(false)
    const [datum, setDatum] = useState<ArbitratorDatum | null>(null)

    useEffect(() => {
        async function fetchDatum() {
            if (!lucid) return
            const data = await lucid.datumOf(project)
            const datum = Data.castFrom(data as Data, ArbitratorDatum)
            setDatum(datum)
        }
        fetchDatum()
    }, [lucid, project])

    async function handleArbAction() {
        if (!datum) return
        setSubmitting(true)
        try {
            await ArbitratorAction(walletConnection, project, atFault.includes("dev"))
        } catch (error) {
            console.error("Error in arbitration action:", error)
        } finally {
            setSubmitting(false)
        }
    }

    if (!datum) {
        return <div>Loading...</div>
    }

    return (
        <div className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{toText(datum.project_datum.title)}</h3>
            <p className="mb-2">Payment: {toAda(datum.project_datum.pay as bigint)} ADA</p>
            <p className="mb-2">POW: {toText(datum.pow)}</p>
            <p className="mb-4">Project Type: {datum.project_datum.pay ? "Regular" : "Milestone"}</p>
            <Select onValueChange={setAtFault}>
                <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Select at fault" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="dev">Developer</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button onClick={handleArbAction} disabled={submitting || !atFault} className="w-full">
                {submitting ? "Processing..." : "Submit Arbitration Action"}
            </Button>
        </div>
    )
}

