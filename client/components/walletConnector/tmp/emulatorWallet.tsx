"use client";

import { useEffect, useState } from "react";
import { WalletIcon } from "lucide-react";
import type { EmulatorAccount } from "@lucid-evolution/lucid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/walletContext";
import { handleError } from "@/lib/utils";
import { Admin, UserA, UserB, UserC, emulator } from "@/config/emulator";
import { mkLucid } from "@/lib/lucid";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function WalletConnector() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { lucid, isEmulator } = walletConnection;
  const [wallets, setWallets] = useState<
    Record<string, { account: EmulatorAccount; connected: boolean }>
  >({
    UserA: { account: Admin, connected: false },
    UserB: { account: UserA, connected: false },
    UserC: { account: UserB, connected: false },
    UserD: { account: UserC, connected: false },
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    mkLucid(setWalletConnection, true);
  }, []);

  async function onConnectWallet(account: EmulatorAccount) {
    setIsOpen(false);
    try {
      if (!lucid) throw "Uninitialized Lucid!!!";
      lucid.selectWallet.fromSeed(account.seedPhrase);
      const address = await lucid.wallet().address();
      const updatedWallets = Object.keys(wallets).reduce(
        (acc, key) => {
          acc[key] = {
            ...wallets[key],
            connected: wallets[key].account.seedPhrase === account.seedPhrase,
          };
          return acc;
        },
        {} as Record<string, { account: EmulatorAccount; connected: boolean }>,
      );
      setWallets(updatedWallets);
      setWalletConnection((walletConnection) => {
        return { ...walletConnection, address };
      });
      console.log("connected emulator wallet\n", address);
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
    <div className="flex gap-2 items-center">
      <Button onClick={emulatorlog} className="w-fit max-sm:hidden">
        Log
      </Button>
      <Button onClick={awaitlog} className="w-fit max-sm:hidden">
        Await Block
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="icon">
            <WalletIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-popover p-4 w-[400px] mx-2 bg-opacity-60 rounded-lg backdrop-blur-[6.8px] shadow-[3px_0px_51px_-35px_rgba(0,_0,_255,_0.6)] border">
           <h2 className="text-accent-foreground text-xl font-semibold text-center uppercase py-4">
              Select Wallet
            </h2>
          <div className="flex flex-col gap-4 justify-center items-center">
             {/* Emulator Toggle  */}
             <div className="flex items-center justify-between rounded-lg border p-2 mx-2 w-full">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Emulator Mode</Label>
                <p className="text-sm text-muted-foreground">
                  This will use Emulator Accounts.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={isEmulator}
                onCheckedChange={(checked) =>{
                  setIsOpen(false)
                  setTimeout(() => {
                    setWalletConnection((prev) => ({
                      ...prev,
                      isEmulator: checked,
                    }))
                  }, 500)
                }}
                aria-label="Toggle marketing emails"
              />
            </div>
            <div className="flex flex-wrap gap-4 w-full items-center justify-center">
              {Object.keys(wallets).map((key) => {
                const wallet = wallets[key];
                return (
                  <Button
                    key={key}
                    className="capitalize w-full flex justify-start"
                    variant={wallet.connected ? "default" : "outline"}
                    onClick={() => onConnectWallet(wallet.account)}
                  >
                    <span>{key}: </span>
<span>

                    {wallet.account.address.slice(0, 10) +
                      "..." +
                      wallet.account.address.slice(-24)}
                      </span>
                  </Button>
                );
              })}
            </div>
            <div className="flex gap-4">
            <Button onClick={emulatorlog} className="w-fit sm:hidden">
        Log
      </Button>
      <Button onClick={awaitlog} className="w-fit sm:hidden">
        Await Block
      </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
