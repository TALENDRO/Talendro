use aiken/primitive/bytearray
use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction}
use mint_utils
use utils.{must_consume_oref}

validator identification_nft(oref: OutputReference) {
  mint(_redeemer, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, inputs, .. } = tx

    expect [ref_token, usr_token] = mint_utils.tokens_details(mint, policy_id)
    expect Pair(ref_token_name, 1) = ref_token
    expect #"7265665f" = ref_token_name |> bytearray.take(4)
    expect Pair(usr_token_name, 1) = usr_token
    expect #"7573725f" = usr_token_name |> bytearray.take(4)
    // ref_ goes to config UTXO and usr_ goes to admin for Arbitator token minting control
    and {
      bytearray.drop(usr_token_name, 4) == bytearray.drop(ref_token_name, 4),
      must_consume_oref(inputs, oref),
    }
  }

  else(_) {
    fail
  }
}
