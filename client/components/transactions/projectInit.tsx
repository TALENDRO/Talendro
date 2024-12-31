import { NETWORK } from '@/config/lucid';
import { ArbitratorTokenValidator, ConfigDatumHolderValidator, HoldingContractValidator, identificationPolicyid, MilestoneMINTValidator, MilestoneSpendValidator, ProjectInitiateValidator } from '@/config/scripts/scripts';
import { useWallet } from '@/contexts/walletContext'
import { ConfigDatum, ConfigDatumSchema, ProjectDatum } from '@/types/cardano';
import { Data, fromText, MintingPolicy, mintingPolicyToId, paymentCredentialOf, Script, SpendingValidator, Validator, validatorToAddress, validatorToScriptHash } from '@lucid-evolution/lucid';
import React from 'react'
import { Button } from '../ui/button';
import { getAddress, getPolicyId, handleError, refUtxo } from '@/libs/utils';

export default function ProjectInitiate() {
    const [WalletConnection] = useWallet()
    const { lucid, address } = WalletConnection



    async function createProject() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";
        const contractAddress = getAddress(ProjectInitiateValidator)
        const mintingValidator: MintingPolicy = ProjectInitiateValidator();
        const policyID = getPolicyId(ProjectInitiateValidator);

        try {
            const datum: ProjectDatum = {
                title: fromText("firstProject"),
                pay: 5_000_000n,
                developer: null,
                client: paymentCredentialOf(address).hash,
                milestones: [],
                current_milestone: null,
                next_milestone: null,
            }

            const clt_assetname = fromText("clt_") + datum.title
            const dev_assetname = fromText("dev_") + datum.title
            const clt_token = { [policyID + clt_assetname]: 1n }
            const dev_token = { [policyID + dev_assetname]: 1n }

            const ref_utxo = await refUtxo(lucid)


            const tx = await lucid
                .newTx()
                .readFrom(ref_utxo)
                .pay.ToContract(
                    contractAddress,
                    { kind: "inline", value: Data.to(datum, ProjectDatum) },
                    { lovelace: 5_000_000n, ...dev_token }
                )
                .mintAssets({ ...clt_token, ...dev_token }, Data.void())
                .attach.MintingPolicy(mintingValidator)
                .complete();

            console.log(tx, "complete")
            const signed = await tx.sign.withWallet().complete();
            const txHash = await signed.submit();
            console.log("txHash: ", txHash);
        } catch (error) {
            handleError(error);
        }

    }

    return (
        <div className='flex gap-4'>
            <Button onClick={createProject}>
                create Project
            </Button>
            <Button onClick={createProject}>
                Accept Project
            </Button>
        </div>
    )
}
