'use client'
import React, { useEffect } from 'react'
import { useWallet } from '@/context/walletContext'
import EmulatorWallet from './tmp/emulatorClient'
import { mkLucid } from '@/lib/lucid'
import WalletComponent from './walletConnector-OLD'

export default function WalletConnectors() {
    const [walletConnection, setWalletConnection] = useWallet()
    const {isEmulator} = walletConnection
    useEffect(() => {
        mkLucid(setWalletConnection, isEmulator)
    }, [isEmulator])
  return (
isEmulator ? <EmulatorWallet/> : <WalletComponent/>
)
}
