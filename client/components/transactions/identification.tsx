'use client'
import { IdentificationNFT_MintValidator } from '@/config/scripts/scripts';
import { useWallet } from '@/contexts/walletContext';
import { Constr, Data, fromText, mintingPolicyToId, Validator } from '@lucid-evolution/lucid';
import React from 'react'
import { Button } from '../ui/button';
import { handleError } from '@/libs/utils';

export default function Identification() {
    const [WalletConnection] = useWallet()

    const { lucid, address } = WalletConnection
    async function mint() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";

        try {


            const utxos = await lucid.utxosAt(address);

            const orefHash = String(utxos[0].txHash);
            const orefIndex = BigInt(utxos[0].outputIndex);
            const oref = new Constr(0, [orefHash, orefIndex]);


            const mintingValidator: Validator = IdentificationNFT_MintValidator([oref]);
            const policyID = mintingPolicyToId(mintingValidator);
            const ref_assetName = "ref_configNFT";
            const usr_assetName = "usr_configNFT";
            const mintedAssets = { [policyID + fromText(ref_assetName)]: 1n, [policyID + fromText(usr_assetName)]: 1n };
            const redeemer = Data.void();
            console.log("first")
            const tx = await lucid
                .newTx()
                .mintAssets(mintedAssets, redeemer)
                .attach.MintingPolicy(mintingValidator)
                .complete();
            console.log("txCompleted")
            const signed = await tx.sign.withWallet().complete();
            const txHash = await signed.submit();
            console.log("policyId(param for rest of the scripts): ", policyID);
            console.log("txHash: ", txHash);
        } catch (error) {
            handleError(error);
        }
    }


    return (
        <Button onClick={mint}>
            mint
        </Button>
    )
}
