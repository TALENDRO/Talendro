

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

validator holding_contract(config_nft: PolicyId) {
  spend(datum: Option<ProjectDatum>, _redeemer, _oref, tx: Transaction) {
    expect Some(datum) = datum
    let Transaction { inputs, outputs, mint, .. } = tx

    // DONE = should send dev_token
    // DONE = datum must not change
    // DONE = output should have ada == projectdatum.pay
    and {
      utils.output_with_datum_address(
        outputs,
        datum.developer,
        config_nft,
        datum,
      ),
      // DONE = should burn dev_ & clt_
      utils.must_burn_dev_clt_token(mint, config_nft),
      // DONE = projectdatum.pay == ada and must send to projectdatum.developer
      utils.datum_pay_to_developer(outputs, datum, config_nft),
    }
  }

  else(_) {
    fail
  }
}
