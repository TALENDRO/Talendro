// this validator mints an NFT for arbitrator identification and only person who can mint is someone holding identification_NFT
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}
use mint_utils
use types.{ConfigDatum}
use utils

validator talendro_nft(identification_nft: PolicyId) {
  mint(_redeemer, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, inputs, reference_inputs, outputs, .. } = tx
    expect [Pair(_, token_qty)] = mint_utils.tokens_details(mint, policy_id)
    let ConfigDatum { arbitrator_nft, .. } =
      utils.get_config_datum(reference_inputs, identification_nft)
    when token_qty is {
      1 -> {
        let config_datum: ConfigDatum =
          utils.get_config_datum(reference_inputs, identification_nft)

        and {
          utils.must_send_stake_ada_and_talendro_nft(
            outputs,
            config_datum.stake_vkh,
            config_datum.stake_amount,
            policy_id,
          ),
          mint_utils.must_have_identification_nft(inputs, identification_nft),
        }
      }
      -1 -> utils.must_have_x_token(inputs, arbitrator_nft)
      _ -> fail
    }
  }

  else(_) {
    fail
  }
}
