import { applyDoubleCborEncoding, Validator } from "@lucid-evolution/lucid";
import {
  arbitrator_nft_arbitrator_nft_mint,
  holding_contract_project_complete_spend,
  identification_nft_identification_nft_mint,
  milestone_contract_milestone_contract_mint_mint,
  milestone_contract_milestone_contract_spend_spend,
  project_initiate_project_initiate_spend,
  project_initiate_project_initiate_mint,
} from "./plutus";

///-------------------------------------------------------------
const arbitratorTokenMint = applyDoubleCborEncoding(
  arbitrator_nft_arbitrator_nft_mint
);
export const arbitratorTokenMintValidator: Validator = {
  type: "PlutusV3",
  script: arbitratorTokenMint,
};

//----------------------------------------------------------------
const holding_contract_pr_complt_spend = applyDoubleCborEncoding(
  holding_contract_project_complete_spend
);

export const holding_contract_pr_complt_SpendValidator: Validator = {
  type: "PlutusV3",
  script: holding_contract_pr_complt_spend,
};

//------------------------------------------------------------------
const identificationNFT_Mint = applyDoubleCborEncoding(
  identification_nft_identification_nft_mint
);

export const identificationNFT_MintValidator: Validator = {
  type: "PlutusV3",
  script: identificationNFT_Mint,
};
//-----------------------------------------------------------
const MilestonecontractMINT = applyDoubleCborEncoding(
  milestone_contract_milestone_contract_mint_mint
);

export const MilestonecontractMINT_Validator: Validator = {
  type: "PlutusV3",
  script: MilestonecontractMINT,
};

//------------------------------------------------------

const MilestonecontractSpend = applyDoubleCborEncoding(
  milestone_contract_milestone_contract_spend_spend
);

export const MilestonecontractSpned_Validator: Validator = {
  type: "PlutusV3",
  script: MilestonecontractSpend,
};

//----------------------------------------------------------

const ProjectInitiateSpend = applyDoubleCborEncoding(
  project_initiate_project_initiate_spend
);

export const ProjectInitiateSpendValidator: Validator = {
  type: "PlutusV3",
  script: ProjectInitiateSpend,
};

//---------------------------------------------------------

const ProjectInitiateMINT = applyDoubleCborEncoding(
  project_initiate_project_initiate_mint
);

export const ProjectInitiateMINT_Validator: Validator = {
  type: "PlutusV3",
  script: ProjectInitiateMINT,
};
