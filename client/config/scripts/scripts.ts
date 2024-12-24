import { applyDoubleCborEncoding, Validator } from '@lucid-evolution/lucid';
import {
    arbitrator_nft_arbitrator_nft_mint,
    holding_contract_project_complete_spend,
    identification_nft_identification_nft_mint,
    milestone_contract_milestone_contract_mint_mint,
    milestone_contract_milestone_contract_spend_spend,
    project_initiate_project_initiate_spend,
} from './plutus';


const arbitratorTokenMint = applyDoubleCborEncoding(arbitrator_nft_arbitrator_nft_mint)
export const arbitratorTokenMintValidator: Validator = {
    type: "PlutusV3",
    script: arbitratorTokenMint,
}