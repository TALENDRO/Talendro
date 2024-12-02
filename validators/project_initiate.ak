use aiken/collection/list
use aiken/primitive/bytearray
use cardano/assets.{PolicyId, lovelace_of}
use cardano/transaction.{InlineDatum, Output, Transaction, find_script_outputs}
use mint_utils
use types.{ProjectDatum}

validator project_initiate {
  spend(_datum, _redeemer, _oref, _tx) {
    todo
  }

  mint(_redeemer, policy_id: PolicyId, tx: Transaction) {
    let Transaction { outputs, mint, .. } = tx
    expect [script_output]: List<Output> =
      find_script_outputs(outputs, policy_id)
    expect InlineDatum(script_datum) = script_output.datum
    expect scriptdatum: ProjectDatum = script_datum

    expect [ref_token, usr_token] = mint_utils.tokens_minting(mint, policy_id)
    expect Pair(ref_token_name, 1) = ref_token
    expect #"7265665f" = ref_token_name |> bytearray.take(4)
    expect Pair(usr_token_name, 1) = usr_token
    expect #"7573725f" = usr_token_name |> bytearray.take(4)
    and {
      bytearray.drop(usr_token_name, 4) == bytearray.drop(ref_token_name, 4),
      scriptdatum.pay == lovelace_of(script_output.value),
      list.has(script_output.value |> assets.policies, policy_id),
    }
    // then mint 2 token 1. clt_projectName 2. dev_projectName
    // find output to spendHandler and check the datum format
  }

  else(_) {
    fail
  }
}
