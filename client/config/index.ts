import {
  getAddress,
  getPolicyId,
  privateKeytoAddress,
  seedtoAddress,
} from "@/lib/utils";
import {
  ArbitrationContractValidator,
  ArbitratorTokenValidator,
  ConfigDatumHolderValidator,
  HoldingContractValidator,
  MilestoneMINTValidator,
  MilestoneSpendValidator,
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "./scripts/scripts";

export const PRIVATEKEY = process.env.NEXT_PUBLIC_SYSTEM_WALLET as string;
export const SYSTEMADDRESS = await privateKeytoAddress(PRIVATEKEY);

export const STAKESEED = process.env.NEXT_PUBLIC_STAKE_WALLET as string;
export const STAKEADDRESS = await seedtoAddress(STAKESEED);

export const MILESTONEPID = getPolicyId(MilestoneMINTValidator);
export const IDENTIFICATIONPID = process.env
  .NEXT_PUBLIC_IDENTIFICATION_POLICY_ID as string;
export const ARBITRATORPID = getPolicyId(ArbitratorTokenValidator);
export const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
export const TALENDROPID = getPolicyId(TalendroTokenValidator);

export const CONFIGADDR = getAddress(ConfigDatumHolderValidator);
export const MILESTONEADDR = getAddress(MilestoneSpendValidator);
export const HOLDINGADDR = getAddress(HoldingContractValidator);
export const PROJECTINITADDR = getAddress(ProjectInitiateValidator);
export const ARBITRATIONADDR = getAddress(ArbitrationContractValidator);
