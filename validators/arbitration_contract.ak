use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}
use types.{ArbitrationDatum, ArbitrationRedeemer}
use utils

validator arbitration(config_nft: PolicyId) {
  spend(
    datum: Option<ArbitrationDatum>,
    redeemer: ArbitrationRedeemer,
    _oref,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    let Transaction { inputs, reference_inputs, outputs, .. } = tx

    let config_datum = utils.get_config_datum(reference_inputs, config_nft)
    let arb_policy_id = config_datum.arbitrator_nft
    let stake_vkh = config_datum.stake_vkh
    expect _ = utils.find_input_with_address(inputs, stake_vkh)

    and {
      utils.must_have_x_token(inputs, arb_policy_id),
      when redeemer.payto is {
        0 -> utils.must_pay_to_client(outputs, datum.project_datum)
        1 -> utils.must_pay_to_developer(outputs, datum.project_datum)
        _ -> False
      },
    }
  }

  else(_) {
    fail
  }
}
