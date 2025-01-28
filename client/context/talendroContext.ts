import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { IDENTIFICATIONPID } from "@/config";

export type TalendroHook = {
  policyId: String;
};

export const TalendroContext = createContext<
  [TalendroHook, Dispatch<SetStateAction<TalendroHook>>]
>([{ policyId: IDENTIFICATIONPID }, () => {}]);
export const useTalendro = () => useContext(TalendroContext);
