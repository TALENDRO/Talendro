use aiken/collection/list
use aiken/primitive/bytearray
use cardano/address.{Script, VerificationKey}
use cardano/assets.{PolicyId, lovelace_of}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
  find_script_outputs,
}
use mint_utils
use types.{ConfigDatum, ProjectDatum}
use utils

// redeemer
// 0 -> developer calls
// 1 -> admin calls

validator project_initiate(config_nft: PolicyId) {
  spend(
    datum: Option<ProjectDatum>,
    redeemer: Int,
    oref: OutputReference,
    tx: Transaction,
  ) {
    when redeemer is {
      0 -> {
        let Transaction { outputs, reference_inputs, extra_signatories, .. } =
          tx
        expect Some(datum) = datum
        let ref_input =
          utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
        expect InlineDatum(output_datum) = ref_input.output.datum
        expect config_datum: ConfigDatum = output_datum

        let holding_script_output =
          utils.find_output_with_address(outputs, config_datum.holding_contract)
        expect Some(input_utxo) = find_input(tx.inputs, oref)
        // find script utxo
        expect Script(policy_id) = input_utxo.output.address.payment_credential
        // find script hash/policyID
        let nft_output_utxo = utils.find_output_with_nft(outputs, policy_id)
        expect VerificationKey(vk_hash) =
          nft_output_utxo.address.payment_credential
        and {
          datum.pay <= assets.lovelace_of(holding_script_output.value),
          utils.datum_address_update(
            holding_script_output,
            datum,
            nft_output_utxo.address,
          ),
          utils.must_be_signed_by(extra_signatories, vk_hash),
        }
      }

      1 -> True
      _ -> fail
    }
  }

  mint(_redeemer, policy_id: PolicyId, tx: Transaction) {
    let Transaction { outputs, mint, .. } = tx
    expect [script_output]: List<Output> =
      find_script_outputs(outputs, policy_id)
    expect InlineDatum(script_datum) = script_output.datum
    expect scriptdatum: ProjectDatum = script_datum
    // 👆confirm datum type
    expect [clt_token, dev_token] = mint_utils.tokens_details(mint, policy_id)
    // 👆find minting token with policy id
    expect Pair(clt_token_name, 1) = clt_token
    expect #"636c745f" = clt_token_name |> bytearray.take(4)
    expect Pair(dev_token_name, 1) = dev_token
    expect #"6465765f" = dev_token_name |> bytearray.take(4)
    // 👆 #"636c745f" == clt_  && #"6465765f == dev_
    and {
      bytearray.drop(dev_token_name, 4) == bytearray.drop(clt_token_name, 4),
      // 👆token name match
      scriptdatum.pay <= lovelace_of(script_output.value),
      // 👆project payment is present in output (ada mentioned in datum)
      list.has(script_output.value |> assets.policies, policy_id),
    }
    // 👆script output has NFT
  }

  else(_) {
    fail
  }
}
