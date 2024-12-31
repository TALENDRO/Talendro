use aiken/primitive/bytearray
use cardano/address.{Script, VerificationKey}
use cardano/assets.{PolicyId}
use cardano/transaction.{
  Output, OutputReference, Transaction, find_input, find_script_outputs,
}
use datum_file as d
use mint_utils
use types.{ConfigDatum, ProjectDatum}
use utils

// redeemer
// 0 -> developer calls
// 1 -> admin calls

validator project_initiate(config_nft: PolicyId) {
  spend(
    datum: Option<ProjectDatum>,
    _redeemer: Int,
    oref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    let Transaction { inputs, reference_inputs, outputs, extra_signatories, .. } =
      tx

    // find ref_input and Datum type
    let config_datum = utils.get_config_datum(reference_inputs, config_nft)
    // -----
    expect Some(input_utxo) = find_input(inputs, oref)
    expect Script(policy_id) = input_utxo.output.address.payment_credential
    let dev_output = utils.find_output_with_policy(outputs, policy_id)
    expect VerificationKey(vk_hash) = dev_output.address.payment_credential

    // must have talendro token
    // same datum expect projectDatum.developer
    let contract_output = utils.find_output_with_datum(outputs, datum)
    let output_datum: ProjectDatum = d.output_to_project_datum(contract_output)
    // (output_datum.developer == nft )
    and {
      utils.must_have_x_token(inputs, config_datum.talendrouser_nft),
      output_datum.developer == Some(vk_hash),
      utils.must_send_to_correct_script(
        contract_output,
        datum.pay,
        config_datum,
      ),
      utils.must_be_signed_by(extra_signatories, vk_hash),
    }
  }

  mint(_redeemer, policy_id: PolicyId, tx: Transaction) {
    let Transaction { inputs, outputs, reference_inputs, mint, .. } = tx
    // find ref_input and Datum type
    let ref_input =
      utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
    // expect InlineDatum(output_datum) = ref_input.output.datum
    trace @"ref_Input": ref_input
    let config_datum: ConfigDatum = d.input_to_config_datum(ref_input)
    trace @"config Datum": config_datum
    // -----
    // finding script output and Inlinedatum
    expect [script_output]: List<Output> =
      find_script_outputs(outputs, policy_id)
    let script_datum: ProjectDatum = d.output_to_project_datum(script_output)
    trace @"scriptDatum": script_datum
    // -----
    // finding clt_ dev_ tokens 
    expect [Pair(clt_token_name, 1),
      Pair(dev_token_name, 1)] = mint_utils.tokens_details(mint, policy_id)
    expect #"636c745f" = clt_token_name |> bytearray.take(4)
    expect #"6465765f" = dev_token_name |> bytearray.take(4)

    // #"636c745f" == clt_  && #"6465765f == dev_
    // -----
    // ------------------------- //
    // must have talendro token -> ref input -> ConfigDatum Match .talendro
    // must send correct datum to script
    and {
      utils.must_have_x_token(inputs, config_datum.talendrouser_nft),
      // token name must be same
      bytearray.drop(dev_token_name, 4) == bytearray.drop(clt_token_name, 4),
      // dev_ must go to script
      utils.must_have_token_in_output(script_output, dev_token_name, policy_id),
      // projectDatum.pay == ada to script output if None then True
      utils.must_send_to_correct_script(
        script_output,
        script_datum.pay,
        config_datum,
      ),
    }
  }

  else(_) {
    fail
  }
}
