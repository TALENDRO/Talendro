use cardano/address.{Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, Input, Output, Transaction}
use datum_file
use types.{
  Cancel, Complete, ConfigDatum, Create, MilestoneRedeemer, ProjectDatum,
}
use utils

validator milestone_contract_spend(config_nft: PolicyId) {
  spend(
    datum: Option<ProjectDatum>,
    redeemer: MilestoneRedeemer,
    _oref,
    tx: Transaction,
  ) {
    let Transaction { inputs, reference_inputs, outputs, mint, .. } = tx
    expect Some(datum) = datum
    let config_datum = {
      let ref_input =
        utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
      expect InlineDatum(output_datum) = ref_input.output.datum
      expect configdatum: ConfigDatum = output_datum
      configdatum
    }
    expect Script(project_init_policyid) =
      config_datum.projectinit_contract.payment_credential

    when redeemer is {
      Create -> {
        expect _: Input =
          utils.find_ref_input_with_config_nft(inputs, project_init_policyid)
        expect _: Input =
          utils.must_have_x_token(inputs, config_datum.talendrouser_nft)
        True
      }
      Cancel ->
        when datum.developer is {
          Some(_) -> {
            expect Script(script_hash) =
              config_datum.milestone_contract_address.payment_credential
            expect [script_utxo] =
              transaction.find_script_outputs(outputs, script_hash)
            let script_datum =
              datum_file.output_datum_to_project_datum(script_utxo)
            and {
              script_datum.developer == None,
              utils.output_must_have_dev_token(
                script_utxo,
                project_init_policyid,
                script_datum,
              ),
            }
          }
          None -> utils.must_burn_dev_clt_token(mint, project_init_policyid)
        }
      _ -> fail
    }
  }

  else(_) {
    fail
  }
}

validator milestone_contract_mint(config_nft: PolicyId) {
  mint(redeemer: MilestoneRedeemer, policy_id: PolicyId, tx: Transaction) {
    let Transaction { inputs, reference_inputs, outputs, mint, .. } = tx
    // find ref_input and Datum type
    let ref_input =
      utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
    expect InlineDatum(output_datum) = ref_input.output.datum
    expect config_datum: ConfigDatum = output_datum

    when redeemer is {
      Create -> {
        let milestone_input: Input =
          utils.find_input_with_address(
            inputs,
            config_datum.milestone_contract_address,
          )
        expect InlineDatum(milestone_data) = milestone_input.output.datum
        expect milestone_datum: ProjectDatum = milestone_data

        let holding_contract_utxo: Output =
          utils.find_output_with_datum(outputs, milestone_datum)
        expect InlineDatum(holding_contract_data) = holding_contract_utxo.datum
        expect holding_contract_datum: ProjectDatum = holding_contract_data
        expect Some(dev_address) = milestone_datum.developer
        let dev_output: Output =
          utils.find_output_with_address(outputs, dev_address)
        and {
          utils.output_must_have_dev_tokens(
            dev_output,
            policy_id,
            holding_contract_datum,
          ),
          //  below function also check for qty == 1
          utils.confirm_minting_token_with_milestones(
            mint,
            holding_contract_datum,
            policy_id,
          ),
          utils.correct_milestone_ada_to_script(
            holding_contract_utxo,
            holding_contract_datum.current_milestone,
          ),
          holding_contract_utxo.address == config_datum.holding_contract,
        }
      }
      Complete -> {
        let project_datum = {
          let holding_contract_input =
            utils.find_input_with_address(inputs, config_datum.holding_contract)
          expect InlineDatum(project_datum_data) =
            holding_contract_input.output.datum
          expect project_datum: ProjectDatum = project_datum_data
          project_datum
        }

        let holding_contract_output =
          utils.find_output_with_address(outputs, config_datum.holding_contract)

        expect InlineDatum(project_datum_data) = holding_contract_output.datum
        expect output_project_datum: ProjectDatum = project_datum_data
        and {
          utils.must_burn_dev_clt_milestone_token(
            mint,
            policy_id,
            project_datum,
          ),
          utils.correct_milestone_updation(project_datum, output_project_datum),
          utils.correct_milestone_ada_to_script(
            holding_contract_output,
            output_project_datum.current_milestone,
          ),
        }
      }

      Cancel -> {
        let holding_contract_input: Input =
          utils.find_input_with_address(inputs, config_datum.holding_contract)
        expect InlineDatum(holding_contract_data) =
          holding_contract_input.output.datum
        expect holding_contract_datum: ProjectDatum = holding_contract_data
        and {
          utils.datum_for_cancel(holding_contract_datum),
          utils.milestone_tokens_burn_cancel(
            mint,
            policy_id,
            holding_contract_datum,
          ),
        }
      }
    }
  }

  else(_) {
    fail
  }
}
