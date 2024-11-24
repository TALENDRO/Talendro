import { Address, applyDoubleCborEncoding, applyParamsToScript, MintingPolicy, paymentCredentialOf, SpendingValidator } from "@lucid-evolution/lucid"
import alwaysTrueSpend from "./spend.json" with {type: "json"}
import identification_nft from "./identification_nft.json" with {type: "json"}
import arbitrator_nft from "./arbitrator_nft.json" with {type: "json"}






const spendingScript = applyDoubleCborEncoding(alwaysTrueSpend.cborHex)
export const spendingValidator: SpendingValidator = {
    script: spendingScript,
    type: "PlutusV3"
}

// =====================for scripts with params=========================
// export function nameofValidatorWithParams(params: string[]): SpendingValidator {
//     const spendingScriptWithParams = applyParamsToScript(
//         spendingScript,
//         params
//     );

//     return {
//         type: "PlutusV3",
//         script: spendingScriptWithParams,
//     };
// }

// // example usage
// // const pkh = paymentCredentialOf("addr_test1...").hash; // PKH
// // const deadline = "17204775965"; // Example deadline
// // const validatorWithParams = nameofValidatorWithParams([pkh, deadline]);


const identification_nftScript = applyDoubleCborEncoding(identification_nft.cborHex)
export function identification_nftValidator(params: any[]): MintingPolicy {
    const mintingScriptWithParams = applyParamsToScript(
        identification_nftScript,
        params
    );

    return {
        type: "PlutusV3",
        script: mintingScriptWithParams,
    };
}


// policyid of Identification_NFT as a param
const arbitrator_nftScript = applyDoubleCborEncoding(arbitrator_nft.cborHex)
export function arbitrator_nftValidator(params: any[]): MintingPolicy {
    const mintingScriptWithParams = applyParamsToScript(
        arbitrator_nftScript,
        params
    );

    return {
        type: "PlutusV3",
        script: mintingScriptWithParams,
    };
}




