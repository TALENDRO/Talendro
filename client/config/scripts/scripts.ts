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

export function IdentificationNFT_MintValidator(params: any[]): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(identificationNFT_Mint, params),
    }
};

// --------------------------------------------------------------
const configDatumHolderScript = applyDoubleCborEncoding(
    config_datum_holder_config_datum_holder_spend
);
export function ConfigDatumHolderValidator(): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(configDatumHolderScript, [identificationPolicyid]),
    }
};


///-------------------------------------------------------------
const arbitratorTokenMint = applyDoubleCborEncoding(
    arbitrator_nft_arbitrator_nft_mint
);
export function ArbitratorTokenValidator(): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(arbitratorTokenMint, [identificationPolicyid]),
    }
};

//----------------------------------------------------------------
const ProjectInitiateValidatorScript = applyDoubleCborEncoding(
    project_initiate_project_initiate_spend
);

export function ProjectInitiateValidator(): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(ProjectInitiateValidatorScript, [identificationPolicyid]),
    }
};


//-----------------------------------------------------------
const MilestonecontractMINT = applyDoubleCborEncoding(
    milestone_contract_milestone_contract_mint_mint
);

export function MilestoneMINTValidator(): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(MilestonecontractMINT, [identificationPolicyid]),
    }
};

//------------------------------------------------------

const MilestonecontractSpend = applyDoubleCborEncoding(
    milestone_contract_milestone_contract_spend_spend
);

export function MilestoneSpendValidator(): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(MilestonecontractSpend, [identificationPolicyid]),
    }
};


//---------------------------------------------------------

const holding_contract_pr_complt_spend = applyDoubleCborEncoding(
    holding_contract_project_complete_spend
);

export function HoldingContractValidator(): Validator {
    return {
        type: "PlutusV3",
        script: applyParamsToScript(holding_contract_pr_complt_spend, [identificationPolicyid]),
    }
}
