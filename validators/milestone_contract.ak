use cardano/assets.{PolicyId}
use types.{Cancel, CancelX, Complete, Create, MilestoneRedeemer}

validator milestone_contract(_config_nft: PolicyId) {
  spend(_datum, redeemer: MilestoneRedeemer, _oref, _tx) {
    when redeemer is {
      Create -> True
      Complete -> True
      Cancel -> True
      CancelX -> True
    }
  }

  mint(redeemer: MilestoneRedeemer, _policy_id, _tx) {
    when redeemer is {
      Create -> True
      Complete -> True
      Cancel -> True
      CancelX -> True
    }
  }

  else(_) {
    fail
  }
}
