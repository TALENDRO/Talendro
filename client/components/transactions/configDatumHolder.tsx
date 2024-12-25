import { network } from '@/config/lucid';
import { configDatumHolderValidator, identificationPolicyid } from '@/config/scripts/scripts';
import { useWallet } from '@/contexts/walletContext'
import { ConfigDatum, ConfigDatumSchema } from '@/types/cardano';
import { Data, fromText, Network, paymentCredentialOf, SpendingValidator, Validator, validatorToAddress } from '@lucid-evolution/lucid';
import React from 'react'
import { Button } from '../ui/button';

export default function configDatumHolder() {
    const [WalletConnection] = useWallet()
    const { lucid, address } = WalletConnection

    async function deposit() {
        if (!lucid || !address) throw "Uninitialized Lucid!!!";
        if (!lucid.config().network) throw "Network undefined"
        console.log(lucid.config().network, "network")
        const ref_configNFT = { [identificationPolicyid + fromText('ref_configNFT')]: 1n };
        const validator: SpendingValidator = configDatumHolderValidator();
        const contractAddress = validatorToAddress(lucid.config().network, validator);

        const datum: ConfigDatum = {
            identification_nft: "81af3501c07b580374baaf26dd08bc862554869e0d4d9cfff7d04219", //PolicyId
            milestone_contract_policy: "21af3501c07b580374baaf26dd08bc862554869e0d4d9cfff7d04219", //PolicyId,
            milestone_contract_address: paymentCredentialOf('addr_test1qzqhza3hpgs5nsfmnqfzakczprrlm3yjdeny7wakywm052q3qskkkydwrt982spj6gq46yheeg4aszdqncv4cg92lzfqffnpd5').hash,
            holding_contract: paymentCredentialOf('addr_test1qzqhza3hpgs5nsfmnqfzakczprrlm3yjdeny7wakywm052q3qskkkydwrt982spj6gq46yheeg4aszdqncv4cg92lzfqffnpd5').hash,
            projectinit_contract: paymentCredentialOf('addr_test1qzqhza3hpgs5nsfmnqfzakczprrlm3yjdeny7wakywm052q3qskkkydwrt982spj6gq46yheeg4aszdqncv4cg92lzfqffnpd5').hash,
            arbitrator_nft: "31af3501c07b580374baaf26dd08bc862554869e0d4d9cfff7d04219", //PolicyId,
            arbitrator_contract: paymentCredentialOf('addr_test1qzqhza3hpgs5nsfmnqfzakczprrlm3yjdeny7wakywm052q3qskkkydwrt982spj6gq46yheeg4aszdqncv4cg92lzfqffnpd5').hash,
            talendrouser_nft: "41af3501c07b580374baaf26dd08bc862554869e0d4d9cfff7d04219", //PolicyId,
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
