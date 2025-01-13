"use client";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Snippet } from "@nextui-org/snippet";
import { EmulatorAccount, Lucid } from "@lucid-evolution/lucid";
import { Skeleton } from "@nextui-org/skeleton";
import { handleError } from "@/lib/utils";
import { useWallet } from "@/context/walletContext";
import {
  UserA,
  UserB,
  UserC,
  Admin,
  emulator,
} from "@/config/emulator";
import { Button } from "../ui/button";

export default function EmulatorConnector() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { lucid } = walletConnection;

  const [wallets, setWallets] = useState<Record<string, { account: EmulatorAccount, connected: boolean }>>({});
  const isInitRef = useRef(false);

  useEffect(() => {
    if (isInitRef.current) return;
    isInitRef.current = true;
    Lucid(emulator, "Custom")
      .then((lucid) => {
        setWalletConnection((prev) => ({ ...prev, lucid }));
        setWallets({
          Admin: { account: Admin, connected: false },
          UserA: { account: UserA, connected: false },
          UserB: { account: UserB, connected: false },
          UserC: { account: UserC, connected: false },
        });
      })
      .catch((error) =>
        // toast error
        console.log(error),
      );
  }, []);

  async function onConnectWallet(account: EmulatorAccount) {
    try {
      if (!lucid) throw "Uninitialized Lucid!!!";
      lucid.selectWallet.fromSeed(account.seedPhrase);
      const address = await lucid.wallet().address();
      setWallets((prevWallets) => {
        return Object.fromEntries(
          Object.entries(prevWallets).map(([key, wallet]) => {
            return [
              key,
              {
                ...wallet,
                connected: wallet.account.seedPhrase === account.seedPhrase,
              },
            ];
          })
        );
      });
      setWalletConnection((walletConnection) => {
        return { ...walletConnection, address };
      });
      console.log("connected emulator wallet");
    } catch (error) {
      handleError(error);
    }
  }

  async function emulatorlog() {
    emulator.log();
  }
  async function awaitlog() {
    emulator.awaitBlock(1);
    console.log("block Height +1: ", emulator.blockHeight);
  }


  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div className="flex flex-wrap gap-4 w-56 items-center justify-center">
        {/* {wallets.map((wallet, w) => {
          return (
            <>
              <Skeleton
                key={`wallet.${w}`}
                className="rounded-full"
                isLoaded={!!lucid}
              >
                <Button
                  className="capitalize"
                  color="primary"
                  onClick={() => onConnectWallet(wallet[1])}
                >
                  {`${wallet[0]}`}
                </Button>
              </Skeleton>
            </>
          );
        })} */}
        {Object.keys(wallets).map((key, index) => {
          const wallet = wallets[key];
          return (
            <>
              <Skeleton
                key={`wallet.${index}`}
                className="rounded-full"
                isLoaded={!!lucid}
              >
                <Button
                  className="capitalize"
                  color="primary"
                  variant={wallet.connected ? "default" : "outline"}
                  onClick={() => onConnectWallet(wallet.account)}
                >
                  {key}
                </Button>
              </Skeleton>
            </>
          );
        })}
      </div>
      <div className="flex gap-4 ">
        <Button onClick={emulatorlog} className="w-fit">
          Log
        </Button>
        <Button onClick={awaitlog} className="w-fit">
          Await Block
        </Button>
      </div>
    </div>
  );
}
