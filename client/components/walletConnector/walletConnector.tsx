"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Snippet } from "@nextui-org/snippet";
import { Wallet } from "@/types/cardano";
import { handleError } from "@/lib/utils";
import { useWallet } from "@/context/walletContext";
import { mkLucid, walletConnect } from "@/lib/lucid";
import { Button } from "../ui/button";
import { LoaderCircle, LogOut, WalletIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Switch } from "../ui/switch";
import { Label } from "@radix-ui/react-label";
import EmulatorConnector from "./emulator";
import { EmulatorAccount } from "@lucid-evolution/lucid";
import { Admin, UserA, UserB, UserC } from "@/config/emulator";

export default function WalletComponent() {
  const [walletConnection, setWalletConnection] = useWallet();
  const { lucid, wallet, address, balance } = walletConnection;
  const [wallets, setWallets] = useState<Wallet[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [emulator, setEmulator] = useState(false)
  const [emulatorWallets, setEmulatorWallets] = useState<Record<string, { account: EmulatorAccount, connected: boolean }>>({
    Admin: { account: Admin, connected: false },
    UserA: { account: UserA, connected: false },
    UserB: { account: UserB, connected: false },
    UserC: { account: UserC, connected: false },
  });

  useEffect(() => {
    const wallets: Wallet[] = [];
    const { cardano } = window;
    for (const c in cardano) {
      const wallet = cardano[c];
      if (!wallet.apiVersion) continue;
      wallets.push(wallet);
    }
    wallets.sort((l, r) => {
      return l.name.toUpperCase() < r.name.toUpperCase() ? -1 : 1;
    });
    setWallets(wallets);
    mkLucid(setWalletConnection, emulator);

  }, [emulator]);

  async function onConnectWallet(wallet: Wallet) {
    setIsOpen(false);
    setConnecting(true);
    try {
      if (!lucid) throw "Uninitialized Lucid!!!";
      await walletConnect(setWalletConnection, wallet, lucid);
      console.log("connected");
    } catch (error) {
      handleError(error);
    }
    setConnecting(false);
  }
  function disconnect() {
    setWalletConnection(prev => ({ ...prev, address: undefined, wallet: undefined, pkh: undefined, stakeAddress: undefined, skh: undefined, balance: undefined }))
    setIsOpen(false);
  }

  if (!wallets)
    return (
      <Snippet hideCopyButton hideSymbol variant="bordered">
        <Spinner label="Browsing Cardano Wallets" />
      </Snippet>
    );

  if (!wallets.length)
    return (
      <Snippet hideCopyButton hideSymbol variant="bordered">
        <p className="uppercase">No Cardano Wallet</p>
      </Snippet>
    );



  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={!wallet ? "default" : "outline"}
          size="default"
          disabled={connecting}
          className={"max-sm:p-2"}
        >
          {
            connecting ? (
              <>
                <LoaderCircle className="animate-spin" />
                Connecting
              </>
            ) : balance ? (
              <>
                <img className="w-4" src={wallet?.icon} alt="wallet icon" />
                <span className="max-sm:text-xs text-center tracking-wide">
                  ₳ {balance.toFixed(2)}
                </span>
              </>
            ) : (
              <>
                <WalletIcon size={30} />
                {emulator ?
                  <span>Emulator<span className="max-sm:hidden"> Mode</span></span> :
                  <span><span className="max-sm:hidden">Connect</span> Wallet</span>}
              </>
            )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-popover py-1 px-2 min-w-[300px] mx-2 bg-opacity-60 rounded-lg backdrop-blur-[6.8px] shadow-[3px_0px_51px_-35px_rgba(0,_0,_255,_0.6)] border ">
        {!wallet ? (
          <span>
            <h2 className="text-accent-foreground text-xl font-semibold text-center uppercase py-4">
              Select Wallet
            </h2>
            {/* Emulator Toggle  */}
            <div className="flex items-center justify-between rounded-lg border p-2 mx-2">
              <div className="space-y-0.5">
                <Label
                  className="text-base font-semibold"
                >
                  Emulator Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  This will use Emulator Accounts.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={emulator}
                onCheckedChange={setEmulator}
                aria-label="Toggle marketing emails"
              />
            </div>
            <div className="flex flex-wrap py-2 justify-center gap-2">

              {emulator ?
                <EmulatorConnector setWallets={setEmulatorWallets} wallets={emulatorWallets} />
                :
                // {/* regular Wallets */}

                wallets.map((w, i) => (
                  <Button
                    key={i}
                    variant={"ghost"}
                    className="group hover:bg-transparent h-24 p-0 w-16"
                    onClick={() => onConnectWallet(w)}
                  >
                    <span
                      className="flex flex-col items-center justify-center gap-1 bg-transparent shadow-none rounded-sm p-1 w-full hover:border hover:border-muted-foreground"
                    >
                      <span
                        className=
                        "flex h-14 w-14 items-center justify-center rounded-lg bg-accent bg-opacity-50 group-hover:bg-opacity-100"

                      >
                        <img src={w.icon} className="w-7" alt="wallet icon" />
                      </span>

                      <span
                        className="text-xs capitalize"
                      >
                        {w.name}
                      </span>
                    </span>
                  </Button>
                ))

              }
            </div>



          </span>
        ) : (
          <>
            <Button
              onClick={disconnect}
              variant={"ghost"}
              className="hover:bg-transparent w-full"
            >
              <LogOut />
              Disconnect
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}