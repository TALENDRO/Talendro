import { NETWORK } from "@/config/lucid";
import {
  ArbitratorTokenValidator,
  ConfigDatumHolderValidator,
  HoldingContractValidator,
  identificationPolicyid,
  MilestoneMINTValidator,
  MilestoneSpendValidator,
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import { ConfigDatum } from "@/types/cardano";
import {
  Data,
  fromText,
  mintingPolicyToId,
  paymentCredentialOf,
  Script,
  SpendingValidator,
  Validator,
  validatorToAddress,
  validatorToScriptHash,
} from "@lucid-evolution/lucid";
import React from "react";
import { Button } from "../ui/button";
import { accountD } from "@/config/emulator";
import { STAKEADDRESS } from "@/config";

export default function ConfigDatumHolder() {
  const [WalletConnection] = useWallet();
  const { lucid, address } = WalletConnection;

  function getAddress(validatorFunction: { (): Validator; (): Script }) {
    const validator: Validator = validatorFunction();
    const address = validatorToAddress(NETWORK, validator);
    return address;
  }
  function getPolicyId(validatorFunction: { (): Validator; (): Script }) {
    const validator: Validator = validatorFunction();
    const policyID = mintingPolicyToId(validator);
    return policyID;
  }

  async function deposit() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const ref_configNFT = {
      [identificationPolicyid + fromText("ref_configNFT")]: 1n,
    };
    const validator: SpendingValidator = ConfigDatumHolderValidator();
    const contractAddress = validatorToAddress(NETWORK, validator);

    const milestioneMint = getPolicyId(MilestoneMINTValidator);
    const milestoneSpend = getAddress(MilestoneSpendValidator);
    const holdingContract = getAddress(HoldingContractValidator);
    const projectinitContract = getAddress(ProjectInitiateValidator);
    const arbitratorMint = getPolicyId(ArbitratorTokenValidator);
    // const arbitratorContract = getAddress()
    const talendroMint = getPolicyId(TalendroTokenValidator);

    const datum: ConfigDatum = {
      identification_nft: process.env
        .NEXT_PUBLIC_IDENTIFICATION_POLICY_ID as string,
      milestone_contract_policy: milestioneMint,
      milestone_contract_address: paymentCredentialOf(milestoneSpend).hash,
      holding_contract: paymentCredentialOf(holdingContract).hash,
      projectinit_contract: paymentCredentialOf(projectinitContract).hash,
      arbitrator_nft: arbitratorMint,
      arbitrator_contract: paymentCredentialOf(
        accountD.address,
      ).hash,
      talendrouser_nft: talendroMint,
      stake_vkh: paymentCredentialOf(STAKEADDRESS).hash,
      stake_amount: 100_000_000n,
    };

    const tx = await lucid
      .newTx()
      .pay.ToAddressWithData(
        contractAddress,
        { kind: "inline", value: Data.to(datum, ConfigDatum) },
        { lovelace: 5_000_000n, ...ref_configNFT },
      )
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  }

  return <Button onClick={deposit}>configDatumHolder</Button>;
}
