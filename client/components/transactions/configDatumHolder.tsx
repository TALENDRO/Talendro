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

    async function deposit() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";
        const ref_configNFT = { [identificationPolicyid + fromText('ref_configNFT')]: 1n };
        const validator: SpendingValidator = ConfigDatumHolderValidator();
        const contractAddress = validatorToAddress(NETWORK, validator);



        const milestioneMint = getPolicyId(MilestoneMINTValidator)
        const milestoneSpend = getAddress(MilestoneSpendValidator)
        const holdingContract = getAddress(HoldingContractValidator)
        const projectinitContract = getAddress(ProjectInitiateValidator)
        const arbitratorMint = getPolicyId(ArbitratorTokenValidator)
        // const arbitratorContract = getAddress()
        // const talendroMint = getPolicyId()

        const datum: ConfigDatum = {
            identification_nft: identificationPolicyid as string,
            milestone_contract_policy: milestioneMint,
            milestone_contract_address: paymentCredentialOf(milestoneSpend).hash,
            holding_contract: paymentCredentialOf(holdingContract).hash,
            projectinit_contract: paymentCredentialOf(projectinitContract).hash,
            arbitrator_nft: arbitratorMint,
            arbitrator_contract: paymentCredentialOf('addr_test1qzqhza3hpgs5nsfmnqfzakczprrlm3yjdeny7wakywm052q3qskkkydwrt982spj6gq46yheeg4aszdqncv4cg92lzfqffnpd5').hash,
            talendrouser_nft: "41af3501c07b580374baaf26dd08bc862554869e0d4d9cfff7d04219",
        };

        const tx = await lucid
            .newTx()
            .pay.ToAddressWithData(
                contractAddress,
                { kind: "inline", value: Data.to(datum, ConfigDatum) },
                { lovelace: 5_000_000n, ...ref_configNFT }
            )
            .complete({ localUPLCEval: false });


        const signed = await tx.sign.withWallet().complete();
        const txHash = await signed.submit();
        console.log("txHash: ", txHash);
    }

    return (
        <Button onClick={deposit}>
            configDatumHolder
        </Button>
    )
}
