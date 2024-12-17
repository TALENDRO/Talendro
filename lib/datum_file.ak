use cardano/transaction.{InlineDatum, Input, Output}
use types.{ConfigDatum, ProjectDatum}

pub fn output_datum_to_project_datum(output: Output) -> ProjectDatum {
  expect InlineDatum(data) = output.datum
  expect datum: ProjectDatum = data
  datum
}

pub fn input_datum_to_project_datum(input: Input) -> ProjectDatum {
  expect InlineDatum(data) = input.output.datum
  expect datum: ProjectDatum = data
  datum
}

pub fn output_datum_to_config_datum(output: Output) -> ConfigDatum {
  expect InlineDatum(data) = output.datum
  expect datum: ConfigDatum = data
  datum
}

pub fn input_datum_to_config_datum(input: Input) -> ConfigDatum {
  expect InlineDatum(data) = input.output.datum
  expect datum: ConfigDatum = data
  datum
}
