import { getAddress, getPolicyId, privateKeytoAddress } from "@/lib/utils";
import { ArbitrationContractValidator, ArbitratorTokenValidator, ConfigDatumHolderValidator, HoldingContractValidator, MilestoneMINTValidator, MilestoneSpendValidator, ProjectInitiateValidator, TalendroTokenValidator } from "./scripts/scripts";

export const PRIVATEKEY = process.env.NEXT_PUBLIC_SYSTEM_WALLET as string;
export const SYSTEMADDRESS = await privateKeytoAddress(PRIVATEKEY);

export const STAKEPRIVATEKEY = process.env.NEXT_PUBLIC_STAKE_WALLET as string;
export const STAKEADDRESS = await privateKeytoAddress(STAKEPRIVATEKEY);

export const IDENTIFICATIONPID = process.env.NEXT_PUBLIC_IDENTIFICATION_POLICY_ID as string;
export const CONFIGADDR = getAddress(ConfigDatumHolderValidator);
export const MILESTONEADDR = getAddress(MilestoneSpendValidator);
export const MILESTONEPID = getPolicyId(MilestoneMINTValidator);
export const HOLDINGADDR = getAddress(HoldingContractValidator);
export const PROJECTINITADDR = getAddress(ProjectInitiateValidator);
export const ARBITRATORPID = getPolicyId(ArbitratorTokenValidator);
export const TALENDROPID = getPolicyId(TalendroTokenValidator);
export const ARBITRATIONADDR = getAddress(ArbitrationContractValidator)
