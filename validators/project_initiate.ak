use aiken/primitive/bytearray
use cardano/address.{Script, VerificationKey}
use cardano/assets.{PolicyId}
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
          when datum.pay is {
            Some(pay) -> pay <= assets.lovelace_of(holding_script_output.value)
            None -> False
          },
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
    //TODO: 
    //TODO: 
    //TODO:_
    //TODO: 
    //TODO: projectDatum.pay == ada to script output if None then skip
    let Transaction { inputs, outputs, reference_inputs, mint, .. } = tx
    // find ref_input and Datum type
    let ref_input =
      utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
    expect InlineDatum(output_datum) = ref_input.output.datum
    expect config_datum: ConfigDatum = output_datum
    // -----
    // finding script output and Inlinedatum
    expect [script_output]: List<Output> =
      find_script_outputs(outputs, policy_id)
    expect InlineDatum(script_datum_data) = script_output.datum
    // -----
    // finding clt_ dev_ tokens 
    expect [clt_token, dev_token] = mint_utils.tokens_details(mint, policy_id)
    expect Pair(clt_token_name, 1) = clt_token
    expect Pair(dev_token_name, 1) = dev_token
    expect #"636c745f" = clt_token_name |> bytearray.take(4)
    expect #"6465765f" = dev_token_name |> bytearray.take(4)

    // #"636c745f" == clt_  && #"6465765f == dev_
    // -----
    // ------------------------- //
    // must have talendro token -> ref input -> ConfigDatum Match .talendro
    expect _ = utils.must_have_x_token(inputs, config_datum.talendrouser_nft)
    // must send correct datum to script
    expect script_datum: ProjectDatum = script_datum_data
    and {
      // token name must be same
      bytearray.drop(dev_token_name, 4) == bytearray.drop(clt_token_name, 4),
      // dev_ must go to script
      utils.dev_token_to_script(script_output, dev_token_name, policy_id),
      // projectDatum.pay == ada to script output if None then True
      utils.ada_to_script_address(script_output, script_datum.pay),
    }
  }

  else(_) {
    fail
  }
}
