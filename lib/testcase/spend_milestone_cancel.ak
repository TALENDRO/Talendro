use cardano/address.{Address, Script, from_verification_key}
use cardano/assets.{from_asset}
use cardano/transaction.{InlineDatum}
use mocktail.{mock_utxo_ref}
use mocktail/virgin_key_hash.{mock_policy_id}
use tx_util/builder/txn.{
  add_asset_to_tx_output, add_mint, add_tx_input, add_tx_output,
  set_datum_of_tx_output, with_asset_of_tx_input,
}
// use mocktail/virgin_address.{mock_pub_key_address}
use types.{ConfigDatum, Milestone, ProjectDatum}
use utils1

pub const campaign_nonce = mock_utxo_ref(0, 0)

pub const prj = ProjectDatum

pub const policy_id = mock_policy_id(1)

pub const mil: Milestone = Milestone { name: "mile", status: True, pay: 12 }

pub const out_prj_datum =
  ProjectDatum {
    title: "dev",
    pay: Some(10),
    developer: None,
    //Some(from_verification_key("abc")),
    client: from_verification_key("abc"),
    milestones: [mil],
    current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
    next_milestone: Some(mil),
  }

test cancel_milestone_spend_Developer_NONE_pass() {
  let mil: Milestone = Milestone { name: "mile", status: True, pay: 12 }
  let prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: None,
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
  let value = from_asset(policy_id, "dev_dev_mile", -1)
  let value1 = from_asset(policy_id, "clt_dev_mile", -1)

  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> with_asset_of_tx_input(value)
      |> with_asset_of_tx_input(value1)

  let tx_output_1 =
    txn.new_tx_output(address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_cancel(tx, prj_datum, config_datum, policy_id)
}

test cancel_milestone_spend_Developer_NONE_only_CltToken() fail {
  let mil: Milestone = Milestone { name: "mile", status: True, pay: 12 }
  let prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: None,
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
  let value = from_asset(policy_id, "dev_dev_mile", 1)
  let tx_input = txn.new_tx_input(campaign_nonce, address1)

  let tx_output_1 =
    txn.new_tx_output(address1)
      |> add_asset_to_tx_output(value)

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_cancel(tx, prj_datum, config_datum, policy_id)
}

test cancel_milestone_spend_Developer_NONE_only_DevToken() fail {
  let mil: Milestone = Milestone { name: "mile", status: True, pay: 12 }
  let prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: None,
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
  let value1 = from_asset(policy_id, "clt_dev_mile", 1)

  let tx_input = txn.new_tx_input(campaign_nonce, address1)

  let tx_output_1 =
    txn.new_tx_output(address1)
      |> add_asset_to_tx_output(value1)

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_cancel(tx, prj_datum, config_datum, policy_id)
}

///---------------------------------Developer is Some---------
test cancel_milestone_spend_Developer_pass() {
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

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: None,
      //Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil),
    }

  let config_datum =
    ConfigDatum {
      identification_nft: mock_policy_id(0),
      milestone_contract_policy: mock_policy_id(0),
      milestone_contract_address: Address(Script("abc"), None),
      holding_contract: from_verification_key("abc"),
      projectinit_contract: from_verification_key("abc"),
      arbitrator_nft: mock_policy_id(0),
      arbitrator_contract: from_verification_key("abc"),
      talendrouser_nft: mock_policy_id(5),
    }

  let address1 = prj_datum.client
  let value = from_asset(policy_id, "dev_dev_mile", -1)

  let script_addr = config_datum.milestone_contract_address

  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> with_asset_of_tx_input(value)

  let tx_output_1 =
    txn.new_tx_output(script_addr)
      |> add_asset_to_tx_output(value)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_cancel(tx, prj_datum, config_datum, policy_id)
}

test cancel_milestone_spend_Developer_pasiing_diff_Output_addr() fail {
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
      milestone_contract_address: Address(Script("abc"), None),
      holding_contract: from_verification_key("abc"),
      projectinit_contract: from_verification_key("abc"),
      arbitrator_nft: mock_policy_id(0),
      arbitrator_contract: from_verification_key("abc"),
      talendrouser_nft: mock_policy_id(5),
    }

  let address1 = prj_datum.client
  let value = from_asset(policy_id, "dev_dev_mile", 1)

  // let script_addr = config_datum.milestone_contract_address
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> with_asset_of_tx_input(value)

  let tx_output_1 =
    txn.new_tx_output(address1) //passing differnet address (script_addr is needed to pass)
      |> add_asset_to_tx_output(value)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_cancel(tx, prj_datum, config_datum, policy_id)
}

test cancel_milestone_spend_Developer_passing_diff_OutputDatum() fail {
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
      milestone_contract_address: Address(Script("abc"), None),
      holding_contract: from_verification_key("abc"),
      projectinit_contract: from_verification_key("abc"),
      arbitrator_nft: mock_policy_id(0),
      arbitrator_contract: from_verification_key("abc"),
      talendrouser_nft: mock_policy_id(5),
    }

  let address1 = prj_datum.client
  let value = from_asset(policy_id, "dev_dev_mile", 1)

  let script_addr = config_datum.milestone_contract_address

  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> with_asset_of_tx_input(value)

  let tx_output_1 =
    txn.new_tx_output(script_addr)
      |> add_asset_to_tx_output(value)
      |> set_datum_of_tx_output(InlineDatum(config_datum))

  //pasing different datum
  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_cancel(tx, prj_datum, config_datum, policy_id)
}

test cancel_milestone_spend_Developer_passing_Diff_token() fail {
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
      milestone_contract_address: Address(Script("abc"), None),
      holding_contract: from_verification_key("abc"),
      projectinit_contract: from_verification_key("abc"),
      arbitrator_nft: mock_policy_id(0),
      arbitrator_contract: from_verification_key("abc"),
      talendrouser_nft: mock_policy_id(5),
    }

  let address1 = prj_datum.client
  let value = from_asset(policy_id, "abc_dev_mile", 1)

  //passing different token
  let script_addr = config_datum.milestone_contract_address

  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> with_asset_of_tx_input(value)

  let tx_output_1 =
    txn.new_tx_output(script_addr)
      |> add_asset_to_tx_output(value)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_cancel(tx, prj_datum, config_datum, policy_id)
}

test cancel_milestone_spend_Developer_passing_diff_PId() fail {
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
      milestone_contract_address: Address(Script("abc"), None),
      holding_contract: from_verification_key("abc"),
      projectinit_contract: from_verification_key("abc"),
      arbitrator_nft: mock_policy_id(0),
      arbitrator_contract: from_verification_key("abc"),
      talendrouser_nft: mock_policy_id(5),
    }

  let address1 = prj_datum.client
  //passing different policy_id
  let value = from_asset(mock_policy_id(2), "dev_dev_mile", 1)

  let script_addr = config_datum.milestone_contract_address

  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> with_asset_of_tx_input(value)

  let tx_output_1 =
    txn.new_tx_output(script_addr)
      |> add_asset_to_tx_output(value)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_tx_output(tx_output_1)

  utils1.milestone_spend_cancel(tx, prj_datum, config_datum, policy_id)
}
