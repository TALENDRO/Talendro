use cardano/address.{from_verification_key}
use cardano/assets.{from_asset}
//from_lovelace
use cardano/transaction.{InlineDatum, OutputReference}
// use mocktail.{mint}
// use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{mock_policy_id}
// mock_key_hash
use tx_util/builder/txn.{
  add_asset_to_tx_output, add_mint, add_tx_input, add_tx_output,
  set_datum_of_tx_input, set_datum_of_tx_output,
}
use types.{ConfigDatum, Milestone, ProjectDatum}
use utils1

pub const campaign_nonce = OutputReference("CAMPAIGN_NONCE_TxHash", 0)

pub const prj = ProjectDatum

pub const policy_id = mock_policy_id(0)

test create_milestone_pass() {
  // let action = ProjectRedeemer{
  //     Create 
  //     Complete
  //     Cancel
  //     Arbitator
  // }
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

  //   let mock_tx =
  //     mocktail_tx()
  //       |> tx_in_inline_datum(True, config_datum)
  //       |> tx_in(
  //           True,
  //           mock_tx_hash(0),
  //           0,
  //           from_lovelace(0),
  //           mock_pub_key_address(1, None),
  //         )
  //   let mint1 = mint()
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

  //  |> add_asset_to_tx_output(from_lovelace(12))
  //   let tx_output_2 =
  //     txn.new_tx_output(address1)
  //       |> add_asset_to_tx_output(from_asset("pid1", "dev_", 1)) 
  //       //|> add_asset_to_tx_output(from_asset("pid1", "clt_", 1))
  //       |> set_datum_of_tx_output(InlineDatum(out_prj_datum))
  //   trace @"output": tx_output_2
  let tx =
    transaction.placeholder
      |> add_tx_input(tx_input)
      |> add_mint(value)
      |> add_mint(value1)
      |> add_tx_output(tx_output_1)

  //|> add_tx_output(tx_output_2)
  utils1.milestone_mint_create(tx, config_datum, policy_id)
}
//----------------------------------------------
//      let tx_input =
//     txn.new_tx_input(campaign_nonce, creator_address_from_tuple)
//       |> with_asset_of_tx_input(assets.from_lovelace(2_000_000))

//   let tx_output_1 =
//     txn.new_tx_output(campaign_address)
//       |> set_datum_of_tx_output(redeemer |> InlineDatum)
//       |> add_asset_to_tx_output(campaign_state_token)
//   let tx_output_2 =
//     txn.new_tx_output(creator_address_from_tuple)
//       |> add_asset_to_tx_output(assets.from_lovelace(2_000_000))

//   let tx =
//     transaction.placeholder
//       |> add_tx_input(tx_input)
//       |> add_mint(campaign_state_token)
//       |> add_tx_output(tx_output_1)
//       |> add_tx_output(tx_output_2)
//       |> set_validity_range(after_now)

//   crowdfunding.validate_mint_campaign(
//     platform_pkh,
//     creator_pkh,
//     campaign_nonce,
//     redeemer,
//     campaign_script,
//     tx,
//   )
