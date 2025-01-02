'use client'
import { ArbitratorTokenValidator, identificationPolicyid } from '@/config/scripts/scripts';
import { useWallet } from '@/contexts/walletContext';
import { Constr, Data, fromText, mintingPolicyToId, Validator } from '@lucid-evolution/lucid';
import React from 'react'
import { Button } from '../ui/button';

export default function ArbitratorTokenMinter() {
    const [WalletConnection] = useWallet()

    const { lucid, address } = WalletConnection
    async function mint() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";
        const ref_configNFT = { [identificationPolicyid + fromText('usr_configNFT')]: 1n };
        const utxos = await lucid.utxosAt(address);
        const utxoWithIdentificationToken = utxos.filter((utxo) => {
            const assets = utxo.assets;

            return Object.keys(ref_configNFT).some((key) =>
                assets[key] === ref_configNFT[key]
            );
        });

        const mintingValidator: Validator = ArbitratorTokenValidator();
        const policyID = mintingPolicyToId(mintingValidator);
        const usr_assetName = "arbitratorA";
        const mintedAssets = { [policyID + fromText(usr_assetName)]: 1n };
        const redeemer = Data.void();
        const tx = await lucid
            .newTx()
            .collectFrom(utxoWithIdentificationToken)
            .mintAssets(mintedAssets, redeemer)
            .attach.MintingPolicy(mintingValidator)
            .complete();

        const signed = await tx.sign.withWallet().complete();
        const txHash = await signed.submit();
        console.log("TalentToken PiD", policyID);
        console.log("txHash: ", txHash);
    }


    return (
        <Button onClick={mint}>
            Arbitrator mint
        </Button>
    )
}
