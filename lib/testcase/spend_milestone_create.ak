use cardano/address.{from_verification_key}
use cardano/assets.{from_asset}
use cardano/transaction
use mocktail.{mock_utxo_ref}
use mocktail/virgin_key_hash.{mock_policy_id}
use tx_util/builder/txn.{add_tx_input, add_tx_output, with_asset_of_tx_input}
use types.{ConfigDatum, Milestone, ProjectDatum}
use utils1

pub const campaign_nonce = mock_utxo_ref(0, 0)

pub const prj = ProjectDatum

pub const policy_id = mock_policy_id(1)

test create_milestone_spend_pass() {
  let mil: Milestone = Milestone { name: "mile", status: True, pay: 12 }
  let prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil),
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
      talendrouser_nft: mock_policy_id(5),
    }

  let address1 = prj_datum.client
  expect Some(dev_address1) = prj_datum.developer

  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> with_asset_of_tx_input(from_asset(mock_policy_id(1), "dev_dev_mile", 1))
      |> with_asset_of_tx_input(
          from_asset(config_datum.talendrouser_nft, "dev", 1),
        )

  let tx_output_1 = txn.new_tx_output(dev_address1)

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_create(tx, policy_id, config_datum)
}

test create_milestone_spend_diff_PID() fail {
  let mil: Milestone = Milestone { name: "mile", status: True, pay: 12 }
  let policy_id1 = mock_policy_id(9)
  let prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil),
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
      talendrouser_nft: mock_policy_id(5),
    }

  let address1 = prj_datum.client
  //   let value = from_asset(policy_id, "dev_dev_mile", 1)
  expect Some(dev_address1) = prj_datum.developer

  let tx_input =
    txn.new_tx_input(campaign_nonce, address1) //-------------------------passing diff PID (it should be (9) to pass)
      
    |> with_asset_of_tx_input(from_asset(mock_policy_id(1), "dev_dev_mile", 1))
      |> with_asset_of_tx_input(
          from_asset(config_datum.talendrouser_nft, "dev", 1),
        )

  let tx_output_1 = txn.new_tx_output(dev_address1)

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_create(tx, policy_id1, config_datum)
}

test create_milestone_spend_diff_token_PID() fail {
  let mil: Milestone = Milestone { name: "mile", status: True, pay: 12 }
  let prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil),
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
      talendrouser_nft: mock_policy_id(6),
    }

  let address1 = prj_datum.client
  expect Some(dev_address1) = prj_datum.developer

  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> with_asset_of_tx_input(from_asset(mock_policy_id(1), "dev_dev_mile", 1))
      |> with_asset_of_tx_input(from_asset(mock_policy_id(2), "dev", 1))

  //passing a differnt PID(it be (6) to pass)
  let tx_output_1 = txn.new_tx_output(dev_address1)

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_create(tx, policy_id, config_datum)
}
