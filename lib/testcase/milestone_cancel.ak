use cardano/address.{from_verification_key}
use cardano/assets.{from_asset}
use cardano/transaction.{InlineDatum}
use mocktail.{mock_utxo_ref}
use mocktail/virgin_key_hash.{mock_policy_id}
use tx_util/builder/txn.{
  add_asset_to_tx_output, add_mint, add_tx_input, add_tx_output,
  set_datum_of_tx_input, set_datum_of_tx_output,
}
use types.{ConfigDatum, Milestone, ProjectDatum}
use utils1

pub const campaign_nonce = mock_utxo_ref(0, 0)

pub const prj = ProjectDatum

pub const policy_id = mock_policy_id(0)
pub const mil: Milestone = Milestone { name: "mile", status: False, pay: 0 }
test cancel_milestone_pass() {
  let prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: None,
      client: from_verification_key("abc"),
      milestones: [mil],
      current_milestone: None,
      next_milestone: None,
    }

  let config_datum =
    ConfigDatum {
      identification_nft: mock_policy_id(0),
      milestone_contract_policy: mock_policy_id(0),
      milestone_contract_address: from_verification_key("abc"),
      holding_contract: from_verification_key("abc"),
      projectinit_contract: from_verification_key("abc"),
      arbitrator_nft: mock_policy_id(0),
      arbitrator_contract: from_verification_key("abc"),
      talendrouser_nft: mock_policy_id(3),
    }

  let input_project_datum = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_title_mile", -1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", -1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_cancel(tx, config_datum, policy_id)
}
