'use client'
import { ArbitratorTokenValidator, identificationPolicyid, TalendroTokenValidator } from '@/config/scripts/scripts';
import { useWallet } from '@/contexts/walletContext';
import { Constr, Data, fromText, mintingPolicyToId, Validator } from '@lucid-evolution/lucid';
import React from 'react'
import { Button } from '../ui/button';
import { getPolicyId, privateKeytoAddress } from '@/libs/utils';
import { SystemWallet } from '@/config/systemWallet';
import { PRIVATEKEY, SYSTEMADDRESS } from '@/config';

export default function TalendroTokenMinter() {
    const [WalletConnection] = useWallet()

    const { lucid, address } = WalletConnection
    async function mint() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";
        const usr_configNFT = { [identificationPolicyid + fromText('usr_configNFT')]: 1n };
        // const utxos = await lucid.utxosAt(address);
        const utxoWithIdentificationToken = await lucid.utxosAtWithUnit(SYSTEMADDRESS, identificationPolicyid + fromText('usr_configNFT'));
        //     utxos.filter((utxo) => {
        //     const assets = utxo.assets;

        //     return Object.keys(ref_configNFT).some((key) =>
        //         assets[key] === ref_configNFT[key]
        //     );
        // });

        const mintingValidator: Validator = TalendroTokenValidator();
        const policyID = getPolicyId(TalendroTokenValidator)
        const TalendroUserName = address.slice(-10);
        const mintedAssets = { [policyID + fromText(TalendroUserName)]: 1n };
        const redeemer = Data.to(fromText("redeemer"));
        const tx = await lucid
            .newTx()
            .collectFrom(utxoWithIdentificationToken)
            .pay.ToAddress(SYSTEMADDRESS, { ...usr_configNFT, lovelace: 2_000_000n })
            .mintAssets(mintedAssets, redeemer)
            .attach.MintingPolicy(mintingValidator)
            .addSigner(SYSTEMADDRESS)
            .complete();

        const systemSigned = await SystemWallet(tx)
        const signed = await systemSigned.sign.withWallet().complete();
        const txHash = await signed.submit();
        console.log("TalendroToken PiD", policyID);
        console.log("txHash: ", txHash);
    }


    return (
        <Button onClick={mint}>
            Talendro mint
        </Button>
    )
}
