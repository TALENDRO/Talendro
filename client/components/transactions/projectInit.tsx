import { NETWORK } from '@/config/lucid';
import { ArbitratorTokenValidator, ConfigDatumHolderValidator, HoldingContractValidator, identificationPolicyid, MilestoneMINTValidator, MilestoneSpendValidator, ProjectInitiateValidator } from '@/config/scripts/scripts';
import { useWallet } from '@/contexts/walletContext'
import { ConfigDatum, ConfigDatumSchema } from '@/types/cardano';
import { Data, fromText, mintingPolicyToId, paymentCredentialOf, Script, SpendingValidator, Validator, validatorToAddress, validatorToScriptHash } from '@lucid-evolution/lucid';
import React from 'react'
import { Button } from '../ui/button';

export default function configDatumHolder() {
    const [WalletConnection] = useWallet()
    const { lucid, address } = WalletConnection

    function getAddress(validatorFunction: { (): Validator; (): Script; }) {
        const validator: Validator = validatorFunction();
        const address = validatorToAddress(NETWORK, validator);
        return address
    }
    function getPolicyId(validatorFunction: { (): Validator; (): Script; }) {
        const validator: Validator = validatorFunction();
        const policyID = mintingPolicyToId(validator);
        return policyID
    }

    async function createProject() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";

        // const tx = await lucid
        //     .newTx()
        //     .pay.ToAddressWithData(
        //         contractAddress,
        //         { kind: "inline", value: Data.to(datum, ConfigDatum) },
        //         { lovelace: 5_000_000n, ...ref_configNFT }
        //     )
        //     .complete({ localUPLCEval: false });


        // const signed = await tx.sign.withWallet().complete();
        // const txHash = await signed.submit();
        // console.log("txHash: ", txHash);
    }

    return (
        <>
            <Button onClick={createProject}>
                create Project
            </Button>
            <Button onClick={createProject}>
                Accept Project
            </Button>
        </>
    )
}
