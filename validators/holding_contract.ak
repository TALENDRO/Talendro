use aiken/collection/dict
use cardano/address.{Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{
  Output, OutputReference, Transaction, find_input, find_script_outputs,
}
use datum_file as d
use types.{
  ArbitrationDatum, Arbitrator, Cancel, Complete, ConfigDatum, ProjectDatum,
  ProjectRedeemer,
}
use utils

validator project_complete(config_nft: PolicyId) {
  spend(
    datum: Option<ProjectDatum>,
    redeemer: ProjectRedeemer,
    oref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    let Transaction { inputs, reference_inputs, outputs, mint, .. } = tx

    // input have dev_ -> than if YES run client part, if NOT than run developer
    expect Some(script_input) = find_input(inputs, oref)
    let config_datum = {
      let ref_input =
        utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
      d.input_to_config_datum(ref_input)
    }
    expect Script(project_init_policyid) =
      config_datum.projectinit_contract.payment_credential
    expect Script(script_hash) = script_input.output.address.payment_credential

    expect [script_output] = find_script_outputs(outputs, script_hash)
    // TODO = script_output is not found wehn redeemer is `arbitrator`, using soft pattern matching or move in complete/cancel
    let dev_token =
      assets.tokens(script_input.output.value, project_init_policyid)
    // dict<assetname, qty>
    when redeemer is {
      Complete ->
        when dict.is_empty(dev_token) is {
          True -> and {
              utils.output_must_have_dev_token(
                script_output,
                project_init_policyid,
                datum,
              ),
              script_input.output.datum == script_output.datum,
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

      // DEVELOEPR = must send dev_ -> holding_script
      // proectdatum.deveolper & pay ==NONE
      //output should have dev_ token and assets.value(input.valiue)==assets.value(input.output.valiue) 
      Cancel ->
        when dict.is_empty(dev_token) is {
          // Developer
          True -> {
            let project_script_datum = d.output_to_project_datum(script_output)
            and {
              utils.output_must_have_dev_token(
                script_output,
                project_init_policyid,
                datum,
              ),
              and {
                project_script_datum.developer == None,
                project_script_datum.pay == None,
              },
              assets.lovelace_of(script_input.output.value) <= assets.lovelace_of(
                script_output.value,
              ),
            }
          }
          // Client
          // CLIENT =  should burn dev_ & clt_
          //    ada goes to datum.client
          False -> and {
              utils.must_burn_dev_clt_token(mint, project_init_policyid),
              utils.datum_pay_to_client(outputs, datum),
            }
        }

      // DEVELOEPR
      //  DONE = must send dev_ -> aribration contract
      //  DONE = must send arbitration datum -> aribration contract
      //  DONE = aribration.projectdatum == script_input.projectdatum
      //  script_input ADA == aribration_output ADA
      // CLIENT
      // DONE = must send clt_ token ->  aribration
      // DONE = aribration.projectdatum == script_input.projectdatum
      // script_input ADA == aribration_output ADA
      Arbitrator -> {
        //let arbitrator_address = config_datum.arbitrator_contract
        let arbitrator_output: Output =
          utils.find_output_with_address(
            outputs,
            config_datum.arbitrator_contract,
          )
        expect Script(prj_policy_id) =
          config_datum.projectinit_contract.payment_credential
        let arbitration_datum = d.output_to_arbitration_datum(arbitrator_output)
        and {
          utils.output_must_have_prj_token(
            arbitrator_output,
            prj_policy_id,
            datum,
          ),
          arbitration_datum.project_datum == datum,
          assets.lovelace_of(arbitrator_output.value) >= assets.lovelace_of(
            script_input.output.value,
          ),
        }
      }
      _ -> False
    }
  }

  else(_) {
    fail
  }
}
