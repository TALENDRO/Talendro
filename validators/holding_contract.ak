use aiken/collection/dict
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

validator project_complete(config_nft: PolicyId) {
  spend(
    datum: Option<ProjectDatum>,
    _redeemer,
    oref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    let Transaction { inputs, reference_inputs, outputs, mint, .. } = tx

    // DONE = should send dev_token
    // DONE = datum must not change
    // DONE = output should have ada == projectdatum.pay
    // input have dev_ -> than if YES run client part, if NOT than run developer
    // DEVELOEPR =  datum == find_script_output.datum
    //               output should have dev_ token and assets.value(input.valiue)==assets.value(input.output.valiue) 
    // CLIENT =  should burn dev_ & clt_
    //    ada goes to datum.developer
    expect Some(script_input) = find_input(inputs, oref)
    let config_datum = {
      let ref_input =
        utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
      expect InlineDatum(output_datum) = ref_input.output.datum
      expect configdatum: ConfigDatum = output_datum
      configdatum
    }
    //Dict<AssetName, Int>
    expect Script(project_init_policyid) =
      config_datum.projectinit_contract.payment_credential
    expect Script(script_hash) = script_input.output.address.payment_credential

    expect [script_output] = find_script_outputs(outputs, script_hash)

    let dev_token =
      assets.tokens(script_input.output.value, project_init_policyid)
    when dict.is_empty(dev_token) is {
      True -> and {
          utils.output_same_datum_dev_token(
            script_output,
            project_init_policyid,
            datum,
          ),
          assets.lovelace_of(script_input.output.value) <= assets.lovelace_of(
            script_output.value,
          ),
        }
      False -> and {
          // DONE = should burn dev_ & clt_
          utils.must_burn_dev_clt_token(mint, project_init_policyid),
          // DONE = projectdatum.pay == ada and must send to projectdatum.developer
          utils.datum_pay_to_developer(outputs, datum),
        }
    }
    //   and {
    //     utils.output_with_datum_address(
    //       outputs,
    //       config_nft,
    //       datum,
    //     ),
    //     // DONE = should burn dev_ & clt_
    //     utils.must_burn_dev_clt_token(mint, config_nft),
    //     // DONE = projectdatum.pay == ada and must send to projectdatum.developer
    //     utils.datum_pay_to_developer(outputs, datum, config_nft),
    //   }
  }

  else(_) {
    fail
  }
}
// validator cancel_project(config_nft: PolicyId){
//   spend(datum: Option<ConfigDatum>,_r,_oref,tx: Transaction){
//     expect Some(datum) = datum
//     let Transaction {inputs , mint, .. } =  tx  
//     let config_datum = {
//       let ref_input =
//         utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
//       expect InlineDatum(output_datum) = ref_input.output.datum
//       expect configdatum: ProjectDatum = output_datum
//       configdatum
//     }
//     //expect Script(project_init_policyid) =
//       //config_datum.projectinit_contract.payment_credential
//     expect mile_pid = datum.milestone_contract_policy
//     and{
// // projectdatum.developer & currentmilestone == None
//       utils.datum_for_cancel(config_datum),
//       utils.must_burn_dev_clt_token(mint, config_nft),
//       utils.must_burn_dev_clt_milestone_token(mint,mile_pid,datum ),
//       True
//     }
//   }
// }

//milestone based
// must send all milestone & project token
// locked ada goes to client

//regular based
// must send the dev_ toekn
// projectdatum.developer == None & pay == 0
// locked ada goes to client
