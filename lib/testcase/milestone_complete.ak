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

pub const policy_id = mock_policy_id(0)

pub const mil2: Milestone = Milestone { name: "mile", status: True, pay: 12 }

test complete_milestone_pass() {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_diff_input_addr() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
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
  //----------------------different address
  let input_project_datum = from_verification_key("abcd")

  //   let address1 = config_datum.holding_contract
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let output_holding_contract = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(output_holding_contract)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_diff_output_addr() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: None,
    }

  let config_datum =
    ConfigDatum {
      identification_nft: mock_policy_id(0),
      milestone_contract_policy: mock_policy_id(0),
      milestone_contract_address: from_verification_key("abc"),
      holding_contract: from_verification_key("abcd"),
      //output with diff addres
      projectinit_contract: from_verification_key("abc"),
      arbitrator_nft: mock_policy_id(0),
      arbitrator_contract: from_verification_key("abc"),
      talendrouser_nft: mock_policy_id(3),
    }

  let input_project_datum = from_verification_key("abc")
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_diff_output_datum() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }

  //   let new_milestone =
  //     ProjectDatum {
  //       title: "title",
  //       pay: Some(10),
  //       developer: Some(from_verification_key("abc")),
  //       client: from_verification_key("abc"),
  //       milestones: [mil2],
  //       current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
  //       next_milestone: None,
  //     }
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(config_datum)) //different outptu datum.. it should be new_milestone
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_not_passsing_milestone_name() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "", status: True, pay: 12 }),
      //not passing milestone name
      next_milestone: Some(mil2),
    }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_burn_only_dev() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  //   let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value) //   |> add_mint(value1) //not burning clt_ token
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_burn_only_clt() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
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
  //   let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input) //   |> add_mint(value) //not burning dev_ token
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_new_miletsone_name_not_found() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  //---------hvaing diff milestone name
  let mil3 = Milestone { name: "mile3", status: True, pay: 12 }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil3],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_new_miletsone_status_false() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  let mil3 = Milestone { name: "mile", status: False, pay: 12 }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil3],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

/// new milseont status is False i.e oldmilestone.currentMiletsone.status == newmiletone.miletsone.status
test complete_milestone_newMilestone_currMil_notEqual_oldMil_nextMile() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  //name are diff---------------------(new_datum.current_milestone == old_datum.next_milestone)?,
  let mil3 = Milestone { name: "mile1", status: True, pay: 12 }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil3],
      current_milestone: Some(mil3),
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_newMilestone_nextMile_is_notNone() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  let mil3 = Milestone { name: "mile", status: True, pay: 12 }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil3],
      current_milestone: Some(mil3),
      next_milestone: Some(mil2),
    }

  //this is not NONE
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(21))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}

test complete_milestone_output_ADA_less() fail {
  let old_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
      next_milestone: Some(mil2),
    }
  let new_milestone =
    ProjectDatum {
      title: "title",
      pay: Some(10),
      developer: Some(from_verification_key("abc")),
      client: from_verification_key("abc"),
      milestones: [mil2],
      current_milestone: Some(Milestone { name: "mile", status: True, pay: 12 }),
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
  let value = from_asset(mock_policy_id(0), "dev_title_mile", 1)
  let value1 = from_asset(mock_policy_id(0), "clt_title_mile", 1)
  let holding_contract_output = config_datum.holding_contract
  let tx_input =
    txn.new_tx_input(campaign_nonce, input_project_datum)
      |> set_datum_of_tx_input(InlineDatum(old_milestone))

  let tx_output_1 =
    txn.new_tx_output(holding_contract_output)
      |> set_datum_of_tx_output(InlineDatum(new_milestone))
      |> add_asset_to_tx_output(assets.from_lovelace(1))

  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  utils1.milestone_mint_compelete(tx, config_datum, policy_id)
}
