import { Constr, Data, WalletApi } from "@lucid-evolution/lucid";

export type Wallet = {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<WalletApi>;
  isEnabled(): Promise<boolean>;
};

//#region Alias
export const PaymentKeyHashSchema = Data.Bytes();
export const StakeKeyHashSchema = Data.Bytes();
export const AddressSchema = Data.Tuple([
  PaymentKeyHashSchema,
  StakeKeyHashSchema,
]);
//#endregion
// #region Datum
export const ConfigDatumSchema = Data.Object({
  identification_nft: Data.Bytes(), //PolicyId
  milestone_contract_policy: Data.Bytes(), //PolicyId,
  milestone_contract_address: Data.Bytes(),
  holding_contract: Data.Bytes(),
  projectinit_contract: Data.Bytes(),
  arbitrator_nft: Data.Bytes(), //PolicyId,
  arbitrator_contract: Data.Bytes(),
  talendrouser_nft: Data.Bytes(), //PolicyId,
  stake_vkh: Data.Bytes(),
  stake_amount: Data.Integer(),
});
export type ConfigDatum = Data.Static<typeof ConfigDatumSchema>;
export const ConfigDatum = ConfigDatumSchema as unknown as ConfigDatum;

export const MilestoneDatumSchema = Data.Object({
  name: Data.Bytes(),
  status: Data.Boolean(),
  pay: Data.Integer(),
});
export type MilestoneDatum = Data.Static<typeof MilestoneDatumSchema>;
export const MilestoneDatum = MilestoneDatumSchema as unknown as MilestoneDatum;

export const ProjectDatumSchema = Data.Object({
  title: Data.Bytes(),
  pay: Data.Nullable(Data.Integer()),
  developer: Data.Nullable(Data.Bytes()),
  client: Data.Bytes(),
  milestones: Data.Array(MilestoneDatumSchema),
  current_milestone: Data.Nullable(MilestoneDatumSchema),
  next_milestone: Data.Nullable(MilestoneDatumSchema),
});
export type ProjectDatum = Data.Static<typeof ProjectDatumSchema>;
export const ProjectDatum = ProjectDatumSchema as unknown as ProjectDatum;

export const ArbitratorDatumSchema = Data.Object({
  project_datum: ProjectDatumSchema,
  pow: Data.Bytes(),
});
export type ArbitratorDatum = Data.Static<typeof ArbitratorDatumSchema>;
export const ArbitratorDatum =
  ArbitratorDatumSchema as unknown as ArbitratorDatum;



export const StakeDatumSchema = Data.Object({
  staked_by: Data.Bytes(),
});
export type StakeDatum = Data.Static<typeof StakeDatumSchema>;
export const StakeDatum =
  StakeDatumSchema as unknown as StakeDatum;
//#endregion

//#region Redeemer


export type ProjectRedeemerAction = "Create" | "Complete" | "Cancel" | "Arbitrator";
export const ProjectRedeemerAction = {
  Create: {
    Title: "Create",
    Schema: Data.Literal("Create"),
    Constr: new Constr(0, []),
  },
  Complete: {
    Title: "Complete",
    Schema: Data.Literal("Complete"),
    Constr: new Constr(1, []),
  },
  Cancel: {
    Title: "Cancel",
    Schema: Data.Literal("Cancel"),
    Constr: new Constr(2, []),
  },
  Arbitrator: {
    Title: "Arbitrator",
    Schema: Data.Literal("Arbitrator"),
    Constr: new Constr(3, []),
  },
};
export const ProjectRedeemerSchema = Data.Enum([
  ProjectRedeemerAction.Create.Schema,
  ProjectRedeemerAction.Complete.Schema,
  ProjectRedeemerAction.Cancel.Schema,
  ProjectRedeemerAction.Arbitrator.Schema,
]);

export type ProjectRedeemer = Data.Static<typeof ProjectRedeemerSchema>;
export const ProjectRedeemer =
  ProjectRedeemerSchema as unknown as ProjectRedeemer;





export const ArbitratorRedeemerSchema = Data.Object({
  payto: Data.Integer(),
});
export type ArbitratorRedeemer = Data.Static<typeof ArbitratorRedeemerSchema>;
export const ArbitratorRedeemer =
  ArbitratorRedeemerSchema as unknown as ArbitratorRedeemer;


//#endregion
