import { privateKeytoAddress } from "@/libs/utils";

export const PRIVATEKEY = process.env.NEXT_PUBLIC_SYSTEM_WALLET as string;
export const SYSTEMADDRESS = await privateKeytoAddress(PRIVATEKEY);
