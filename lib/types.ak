use aiken/cbor.{serialise}
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
  milestone_contract_address: VerificationKeyHash,
  holding_contract: VerificationKeyHash,
  projectinit_contract: VerificationKeyHash,
  arbitrator_nft: PolicyId,
  arbitrator_contract: VerificationKeyHash,
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
// test projectdatum_offchain() {
//   let mil1: Milestone =
//     Milestone { name: "milestone1", status: False, pay: 5_000_000 }
//   let prj_datum =
//     ProjectDatum {
//       title: "firstProject",
//       pay: Some(5_000_000),
//       developer: None,
//       client: #"817176370a2149c13b98122edb0208c7fdc4926e664f3bb623b6fa28",
//       milestones: [mil1],
//       current_milestone: None,
//       next_milestone: None,
//     }
//   let lucid = #"d8799f4c666972737450726f6a656374d8799f1a004c4b40ffd87a80581c817176370a2149c13b98122edb0208c7fdc4926e664f3bb623b6fa289fd8799f4a6d696c6573746f6e6531d879801a004c4b40ffffd87a80d87a80ff"
//   let delucid = cbor.deserialise(lucid)
//   let ser = cbor.serialise(prj_datum)

//   expect Some(lucid_data) = delucid
//   trace @"lucid Data": lucid_data
//   trace @"projectDatum": prj_datum
//   lucid == ser
// }
