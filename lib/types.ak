use cardano/address.{Address}
use cardano/assets.{Lovelace}

pub type ProjectDatum {
  project_title: ByteArray,
  client: Address,
  developer: Address,
  pay: Lovelace,
}

// pay: Lovelace //could be 0 too

pub type ConfigDatum {
  holding_contract: Address,
}
// the contract that holds the assets
