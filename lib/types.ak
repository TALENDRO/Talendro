use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}
use cardano/assets.{Lovelace, PolicyId}

pub type ProjectDatum {
  title: ByteArray,
  pay: Option<Lovelace>,
  developer: Option<VerificationKeyHash>,
  client: VerificationKeyHash,
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
  identification_nft: PolicyId,
  milestone_contract_policy: PolicyId,
  milestone_contract_address: Address,
  holding_contract: Address,
  projectinit_contract: Address,
  arbitrator_nft: PolicyId,
  arbitrator_contract: Address,
  talendrouser_nft: PolicyId,
}

// the contract that holds the assets
pub type ArbitrationDatum {
  project_datum: ProjectDatum,
  pow: ByteArray,
}

// pub type MilestoneRedeemer {
//   Create
//   Complete
//   Cancel
// }

pub type ProjectRedeemer {
  Create
  Complete
  Cancel
  Arbitrator
}
