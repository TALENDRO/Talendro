// this validator mints an NFT for arbitrator identification and only person who can mint is someone holding identification_NFT
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}
use mint_utils
use types.{ConfigDatum}
use utils

validator talendro_nft(identification_nft: PolicyId) {
  mint(redeemer: ByteArray, policy_id: PolicyId, tx: Transaction) {
    let Transaction { mint, inputs, reference_inputs, outputs, .. } = tx
    expect [Pair(_, token_qty)] = mint_utils.tokens_details(mint, policy_id)
    expect _: ByteArray = redeemer
    when token_qty is {
      1 -> {
        let config_datum: ConfigDatum =
          utils.get_config_datum(reference_inputs, identification_nft)

        and {
          utils.must_send_stake_ada(
            outputs,
            config_datum.stake_vkh,
            config_datum.stake_amount,
          ),
          mint_utils.must_have_identification_nft(inputs, identification_nft),
        }
      }
      -1 -> mint_utils.must_have_identification_nft(inputs, identification_nft)
      _ -> fail
    }
  }

  else(_) {
    fail
  }
}
