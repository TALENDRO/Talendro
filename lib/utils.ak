use cardano/transaction.{Input, OutputReference, find_input}

pub fn must_consume_oref(inputs: List<Input>, oref: OutputReference) -> Bool {
  expect Some(_) = find_input(inputs, oref)
  True
}
