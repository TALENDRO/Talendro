use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}
use cardano/assets.{AssetName, Lovelace, PolicyId}
use cardano/transaction.{InlineDatum,
  Input, Output, OutputReference, find_input}
use types.{ConfigDatum, ProjectDatum}

pub fn must_consume_oref(inputs: List<Input>, oref: OutputReference) -> Bool {
  expect Some(_) = find_input(inputs, oref)
  True
}

pub fn find_output_with_nft(outputs: List<Output>, nft: PolicyId) -> Output {
  expect Some(output_utxo) =
    list.find(
      outputs,
      fn(output) -> Bool { list.has(output.value |> assets.policies, nft) },
    )
  output_utxo
}

pub fn find_ref_input_with_config_nft(
  inputs: List<Input>,
  nft: PolicyId,
) -> Input {
  expect Some(ref_input) =
    list.find(
      inputs,
      fn(input) { list.has(input.output.value |> assets.policies, nft) },
    )
  ref_input
}

pub fn find_output_with_address(
  outputs: List<Output>,
  address: Address,
) -> Output {
  expect Some(some_utxo) =
    list.find(outputs, fn(output) { output.address == address })
  some_utxo
}

pub fn datum_address_update(
  holding_output: Output,
  input_datum: ProjectDatum,
  address: Address,
) -> Bool {
  expect InlineDatum(projectdatum) = holding_output.datum
  expect project_datum: ProjectDatum = projectdatum

  and {
    project_datum.title == input_datum.title,
    project_datum.client == input_datum.client,
    project_datum.pay == input_datum.pay,
    project_datum.developer == Some(address),
  }
}

pub fn must_be_signed_by(
  signatories: List<VerificationKeyHash>,
  signer: VerificationKeyHash,
) -> Bool {
  list.has(signatories, signer)
}

pub fn must_have_x_token(inputs: List<Input>, policy_id: PolicyId) -> Input {
  expect Some(input_with_x_token) =
    list.find(
      inputs,
      fn(input) { list.has(input.output.value |> assets.policies, policy_id) },
    )
  input_with_x_token
}

pub fn dev_token_to_script(
  output: Output,
  token: AssetName,
  policy_id: PolicyId,
) -> Bool {
  assets.quantity_of(output.value, policy_id, token) == 1
}

pub fn ada_to_script_address(output: Output, pay: Option<Lovelace>) -> Bool {
  when pay is {
    Some(ada) -> ada <= assets.lovelace_of(output.value)
    None -> True
  }
}

pub fn find_output_with_datum(
  outputs: List<Output>,
  datum: ProjectDatum,
) -> Output {
  expect Some(output) =
    list.find(
      outputs,
      fn(output) {
        when output.datum is {
          InlineDatum(datum_data) -> {
            expect output_datum: ProjectDatum = datum_data
            and {
              output_datum.title == datum.title,
              output_datum.pay == datum.pay,
              output_datum.client == datum.client,
              output_datum.milestones == datum.milestones,
              output_datum.current_milestoneidentifier == datum.current_milestoneidentifier,
              output_datum.next_milestone == datum.next_milestone,
            }
          }

          _ -> True
        }
      },
    )
  output
}

pub fn must_send_to_correct_script(
  output: Output,
  pay: Option<Int>,
  config_datum: ConfigDatum,
) -> Bool {
  when pay is {
    Some(ada) -> and {
        ada <= assets.lovelace_of(output.value),
        output.address == config_datum.holding_contract,
      }
    None -> output.address == config_datum.milestone_contract
  }
}
