use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}
use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum,
  Input, Output, OutputReference, find_input}
use types.{ProjectDatum}

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
    project_datum.project_title == input_datum.project_title,
    project_datum.client == input_datum.client,
    project_datum.pay == input_datum.pay,
    project_datum.developer == address,
  }
}

pub fn must_be_signed_by(
  signatories: List<VerificationKeyHash>,
  signer: VerificationKeyHash,
) -> Bool {
  list.has(signatories, signer)
}
