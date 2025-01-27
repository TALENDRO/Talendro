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
import {
  ARBITRATIONADDR,
  ARBITRATORPID,
  CONFIGADDR,
  HOLDINGADDR,
  IDENTIFICATIONPID,
  MILESTONEADDR,
  MILESTONEPID,
  PROJECTINITADDR,
  STAKEADDRESS,
  TALENDROPID,
} from "@/config";

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

    const datum: ConfigDatum = {
      identification_nft: IDENTIFICATIONPID,
      milestone_contract_policy: MILESTONEPID,
      milestone_contract_address: paymentCredentialOf(MILESTONEADDR).hash,
      holding_contract: paymentCredentialOf(HOLDINGADDR).hash,
      projectinit_contract: paymentCredentialOf(PROJECTINITADDR).hash,
      arbitrator_nft: ARBITRATORPID,
      arbitrator_contract: paymentCredentialOf(ARBITRATIONADDR).hash,
      talendrouser_nft: TALENDROPID,
      stake_vkh: paymentCredentialOf(STAKEADDRESS).hash,
      stake_amount: 100_000_000n,
    };

    const tx = await lucid
      .newTx()
      .pay.ToAddressWithData(
        CONFIGADDR,
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
