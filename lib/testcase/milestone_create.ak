use cardano/address.{from_verification_key}
use cardano/assets.{from_asset}
//from_lovelace
use cardano/transaction.{InlineDatum}
use mocktail.{mock_utxo_ref}
// use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{mock_policy_id}
// mock_key_hash
use tx_util/builder/txn.{
  add_asset_to_tx_output, add_mint, add_tx_input, add_tx_output,
  set_datum_of_tx_input, set_datum_of_tx_output,
}
use types.{ConfigDatum, Milestone, ProjectDatum}
use utils1

pub const campaign_nonce = mock_utxo_ref(0, 0)

pub const prj = ProjectDatum

pub const policy_id = mock_policy_id(0)

test create_milestone_pass() {
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
  let mil2: Milestone = Milestone { name: "mile", status: True, pay: 13 }

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(mil2),
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 1)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_output_dont_have_any_token_fail()fail {
  let mil: Milestone = Milestone { name: "mile", status: True, pay: 12 }
  let prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil],
      current_milestone: Some(mil),
      next_milestone: Some(mil),
    }
  let mil2: Milestone = Milestone { name: "mile", status: True, pay: 13 }

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(mil2),
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 1)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      // |> add_asset_to_tx_output(value)
      // |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(13))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_diff_PID_fail()fail {
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
  let mil2: Milestone = Milestone { name: "mile", status: True, pay: 13 }

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(mil2),
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile",1)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)
  // ----------------------------passing a different PID
  let policy_id = mock_policy_id(1)
  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_token_qty_2_fail() fail {
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
  let mil2: Milestone = Milestone { name: "mile", status: True, pay: 13 }

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(mil2),
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  //-------------------------------------- qty is more than 1 
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 2)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 2)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_mint_1Mile_token_fail() fail{
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
  let mil2: Milestone = Milestone { name: "mile", status: True, pay: 13 }

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(mil2),
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 1)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      // |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_output_dont_have_dev_token()fail {
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
  let mil2: Milestone = Milestone { name: "mile", status: True, pay: 13 }

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(mil2),
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 1)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      // |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_Holding_diff_address() fail{
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
  let mil2: Milestone = Milestone { name: "mile", status: True, pay: 13 }

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(mil2),
      next_milestone: Some(mil),
    }

  let config_datum =
    ConfigDatum {
      identification_nft: mock_policy_id(0),
      milestone_contract_policy: mock_policy_id(0),
      milestone_contract_address: from_verification_key("abc"),
      holding_contract: from_verification_key("abcd"),// different address
      projectinit_contract: from_verification_key("abc"),
      arbitrator_nft: mock_policy_id(0),
      arbitrator_contract: from_verification_key("abc"),
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 1)
  // expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_output_less_ada()fail {
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
  let mil2: Milestone = Milestone { name: "mile", status: True, pay: 13 }

  let out_prj_datum =
    ProjectDatum {
      title: "dev",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(mil2),
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 1)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
      |> add_asset_to_tx_output(assets.from_lovelace(12)) //-- output ADA is less

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_output_No_datum()fail {
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 1)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      // NOT passing INLINE datum 
      // |> set_datum_of_tx_output(InlineDatum(out_prj_datum)) 
      |> add_asset_to_tx_output(assets.from_lovelace(13)) 

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}

test create_milestone_output_diff_datum()fail {
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
      talendrouser_nft: mock_policy_id(3),
    }

  let address1 = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_dev_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_dev_mile", 1)
  expect Some(dev_address1) = prj_datum.developer
  let tx_input =
    txn.new_tx_input(campaign_nonce, address1)
      |> set_datum_of_tx_input(InlineDatum(prj_datum))

  let tx_output_1 =
    txn.new_tx_output(dev_address1)
      |> add_asset_to_tx_output(value)
      |> add_asset_to_tx_output(value1)
      |> set_datum_of_tx_output(InlineDatum(prj_datum)) //passing different datum
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)


  utils1.milestone_mint_create(tx, config_datum, policy_id)
}