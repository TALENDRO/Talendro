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
  milestone_contract_address: AddressSchema,
  holding_contract: AddressSchema,
  projectinit_contract: AddressSchema,
  arbitrator_nft: Data.Bytes(), //PolicyId,
  arbitrator_contract: AddressSchema,
  talendrouser_nft: Data.Bytes(), //PolicyId,
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
  developer: Data.Nullable(AddressSchema),
  client: AddressSchema,
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
export const ArbitratorDatum = ArbitratorDatumSchema as unknown as ArbitratorDatum;
//#endregion




//#region Redeemer
export const ProjectRedeemer = {
  Create: Data.to(new Constr(0, [])),
  Complete: Data.to(new Constr(1, [])),
  Cancel: Data.to(new Constr(2, [])),
  Arbitrator: Data.to(new Constr(3, [])),
};
//#endregion
