use cardano/address.{Address}
use cardano/assets.{Lovelace, PolicyId}

pub type ProjectDatum {
  title: ByteArray,
  pay: Option<Lovelace>,
  developer: Option<Address>,
  client: Address,
  milestones: List<Milestone>,
  current_milestone: Option<Milestone>,
  next_milestone: Option<Milestone>,
}

pub type Milestone {
  name: ByteArray,
  status: Bool,
  pay: Lovelace,
}

pub type ConfigDatum {
  identificatoin_nft: PolicyId,
  milestone_contract_policy: PolicyId,
  milestone_contract_address: Address,
  holding_contract: Address,
  projectinit_contract: Address,
  arbitrator_nft: PolicyId,
  talendrouser_nft: PolicyId,
}

// the contract that holds the assets
pub type ArbitrationDatum {
  project_datum: ProjectDatum,
  pow: ByteArray,
}

pub type MilestoneRedeemer {
  Create
  Complete
  Cancel
  CancelX
}
