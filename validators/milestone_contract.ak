use cardano/address.{Script}
use cardano/assets.{PolicyId}
use cardano/transaction.{
  InlineDatum, Input, Output, OutputReference, Transaction, find_input,
}
use types.{
  Cancel, CancelX, Complete, ConfigDatum, Create, MilestoneRedeemer,
  ProjectDatum,
}
use utils

validator milestone_contract_spend(config_nft: PolicyId) {
  spend(
    _datum,
    redeemer: MilestoneRedeemer,
    oref: OutputReference,
    tx: Transaction,
  ) {
    let Transaction { inputs, reference_inputs, .. } = tx
    when redeemer is {
      Create -> {
        expect Some(script_utxo) = find_input(inputs, oref)

        let config_datum = {
          let ref_input =
            utils.find_ref_input_with_config_nft(reference_inputs, config_nft)
          expect InlineDatum(output_datum) = ref_input.output.datum
          expect configdatum: ConfigDatum = output_datum
          configdatum
        }
        expect Script(project_init_policyid) =
          config_datum.projectinit_contract.payment_credential
        expect _: Input =
          utils.find_ref_input_with_config_nft(inputs, project_init_policyid)
        True
      }
      Cancel -> True
      CancelX -> True
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
        expect _: Input =
          utils.must_have_x_token(inputs, config_datum.talendrouser_nft)
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
          utils.output_must_have_x_tokens(
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
          utils.must_burn_dev_clt_token(mint, policy_id, project_datum),
          utils.correct_milestone_updation(project_datum, output_project_datum),
          utils.correct_milestone_ada_to_script(
            holding_contract_output,
            output_project_datum.current_milestone,
          ),
        }
      }

      Cancel -> True
      CancelX -> True
    }
  }

  else(_) {
    fail
  }
}
// Create 
// Mint
// DONE: must have Talendro_Token 
// DONE: must have input from script address
// DONE: Project Datu, doesn't change except Milstone list, currentMilestone -> milstone_contract_spend (address configdatum) -> input.address == milestone_address ->  project datum 
// DONE: should mint 2 token for each milestone -> holding_contract_utxo (datum.milestone) ->milestone[] ...> tx.mint and confirm 2 token
// DONE: _dev token goes to projectDatum.developer
// DONE: projectDatum.currentMilestone.pay == ada to holding contract

// Spend
// client will mint milestone token -> should have _clt token == script _dev token   |||| scriptOutput -> dev_token | clt_
// output to the holding contract
// must mint some milestone token
