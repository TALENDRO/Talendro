import { privateKeytoAddress } from "@/lib/utils";

export const PRIVATEKEY = process.env.NEXT_PUBLIC_SYSTEM_WALLET as string;
export const SYSTEMADDRESS = await privateKeytoAddress(PRIVATEKEY);

export const STAKEPRIVATEKEY = process.env.NEXT_PUBLIC_STAKE_WALLET as string;
export const STAKEADDRESS = await privateKeytoAddress(STAKEPRIVATEKEY);


