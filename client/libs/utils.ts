// import { toast } from "react-toastify";

import { NETWORK } from "@/config/lucid";
import { ConfigDatumHolderValidator, identificationPolicyid } from "@/config/scripts/scripts";
import { fromText, LucidEvolution, mintingPolicyToId, Script, Validator, validatorToAddress, Constr, MintingPolicy } from "@lucid-evolution/lucid";

export async function req(path: string, req?: RequestInit) {
    const rsp = await fetch(path, { ...req, cache: "no-cache" });

    if (!rsp.ok) {
        throw {
            code: rsp.status,
            info: rsp.statusText,
        };
    }

    return rsp.json();
}

export function handleSuccess(success: any) {
    // toast(`${success}`, { type: "success" });
    console.log(success);
}

export function handleError(error: any) {
    const { info, message } = error;

    function toJSON(error: any) {
        try {
            const errorString = JSON.stringify(error);
            const errorJSON = JSON.parse(errorString);

            return errorJSON;
        } catch {
            return {};
        }
    }

    const { cause } = toJSON(error);
    const { failure } = cause ?? {};

    const failureCause = failure?.cause;
    const failureInfo = failureCause?.info;
    const failureMessage = failureCause?.message;

    // toast(`${failureInfo ?? failureMessage ?? info ?? message ?? error}`, {
    // type: "error",
    // });
    console.error(failureCause ?? { error });
}

export function adaToLovelace(float: string) {
    const [ada, lovelace] = float.split(".");

    return BigInt(ada) * 1_000000n + BigInt(lovelace || 0);
}




export function getAddress(validatorFunction: { (): Validator; (): Script; }) {
    const validator: Validator = validatorFunction();
    const address = validatorToAddress(NETWORK, validator);
    return address
}
export function getPolicyId(validatorFunction: { (): Validator; (): Script; }) {
    const validator: MintingPolicy = validatorFunction();
    const policyID = mintingPolicyToId(validator);
    return policyID
}


export async function refUtxo(lucid: LucidEvolution) {
    // const address = getAddress(ConfigDatumHolderValidator)
    const v = ConfigDatumHolderValidator()
    const address = validatorToAddress(NETWORK, v)
    const utxos = await lucid.utxosAt(address);

    const ref_configNFT = { [identificationPolicyid + fromText('ref_configNFT')]: 1n };
    const utxoWithIdentificationToken = utxos.filter((utxo) => {
        const assets = utxo.assets;

        return Object.keys(ref_configNFT).some((key) =>
            assets[key] === ref_configNFT[key]
        );
    });

    return utxoWithIdentificationToken;
}