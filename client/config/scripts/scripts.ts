import { applyDoubleCborEncoding, applyParamsToScript, Data, Validator } from "@lucid-evolution/lucid";
import {
    identification_nft_identification_nft_mint,
    config_datum_holder_config_datum_holder_spend,
    arbitrator_nft_arbitrator_nft_mint,
    project_initiate_project_initiate_spend,
    holding_contract_project_complete_spend,
    milestone_contract_milestone_contract_mint_mint,
    milestone_contract_milestone_contract_spend_spend,
} from "./plutus";

export const identificationPolicyid: Data = "81af3501c07b580374baaf26dd08bc862554869e0d4d9cfff7d04219"
//------------------------------------------------------------------
const identificationNFT_Mint = applyDoubleCborEncoding(
    identification_nft_identification_nft_mint
);

export function identificationNFT_MintValidator(params: any[]): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(identificationNFT_Mint, params),
    }
};

// --------------------------------------------------------------
const configDatumHolderScript = applyDoubleCborEncoding(
    config_datum_holder_config_datum_holder_spend
);
export function configDatumHolderValidator(): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(configDatumHolderScript, [identificationPolicyid]),
    }
};


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

const ProjectInitiateValidatorScript = applyDoubleCborEncoding(
    project_initiate_project_initiate_spend
);

export const ProjectInitiateValidator: Validator = {
    type: "PlutusV3",
    script: ProjectInitiateValidatorScript,
};

//---------------------------------------------------------
