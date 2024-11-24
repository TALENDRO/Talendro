import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Constr, Data, fromText, MintingPolicy, mintingPolicyToId, TxSignBuilder, utxoToTransactionOutput, validatorToAddress } from "@lucid-evolution/lucid";
import { identification_nftValidator, spendingValidator } from "@/components/compiled/Validators";
import { callLucid, usingEmulator } from "@/config/lucid";
import { emulator } from "@/config/emulator";

export default function IdentificationNFT(props: {
  setActionResult: (result: string) => void;
  onError: (error: any) => void;
}) {
  const { setActionResult, onError } = props;
  async function submitTx(tx: TxSignBuilder) {
    const txSigned = await tx.sign.withWallet().complete();
    const txHash = await txSigned.submit();

    if (usingEmulator) {
      emulator.awaitTx(txHash)
      emulator.log()
    }

    return txHash;
  }

  type Action = () => Promise<void>;
  type ActionGroup = Record<string, Action>;




  const actions: Record<string, ActionGroup> = {
    identification_nft: {
      mint: async () => {
        const lucid = callLucid()

        try {
          if (!lucid) throw ("lucid not Initailized")
          const address = await lucid.wallet().address()
          const utxos = await lucid.utxosAt(address);
          const txHash = String(utxos[0].txHash);
          const txIndex = BigInt(utxos[0].outputIndex);
          const oref = new Constr(0, [txHash, txIndex]);
          const mintingValidator: MintingPolicy = identification_nftValidator([oref]);
          console.log(mintingValidator)
          const policyID = mintingPolicyToId(mintingValidator);
          const ref_assetName = "ref_configNFT";
          const usr_assetName = "usr_configNFT";

          const mintedAssets = { [`${policyID}${fromText(ref_assetName)}`]: 1n, [`${policyID}${fromText(usr_assetName)}`]: 1n };
          const redeemer = Data.void();

          const tx = await lucid
            .newTx()
            .mintAssets(mintedAssets, redeemer)
            .attach.MintingPolicy(mintingValidator)
            .complete();


          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },
      burn: async () => {
        const lucid = callLucid()

        try {
          if (!lucid) throw ("lucid not Initailized")
          const address = await lucid.wallet().address()
          const utxos = await lucid.utxosAt(address);
          const txHash = String(utxos[0].txHash);
          const txIndex = BigInt(utxos[0].outputIndex);
          const oref = new Constr(0, [txHash, txIndex]);
          const mintingValidator: MintingPolicy = identification_nftValidator([oref]);
          console.log(mintingValidator)
          const policyID = mintingPolicyToId(mintingValidator);
          const ref_assetName = "ref_configNFT";
          const usr_assetName = "usr_configNFT";

          const mintedAssets = { [`${policyID}${fromText(ref_assetName)}`]: -1n, [`${policyID}${fromText(usr_assetName)}`]: -1n };
          const redeemer = Data.void();

          const tx = await lucid
            .newTx()
            .mintAssets(mintedAssets, redeemer)
            .attach.MintingPolicy(mintingValidator)
            .complete();


          submitTx(tx).then(setActionResult).catch(onError);
        } catch (error) {
          onError(error);
        }
      },
    },
  };


  return (
    <div className="flex flex-col gap-2 py-2">
      <Accordion variant="splitted">
        {/* Always True */}
        <AccordionItem key="1" aria-label="Accordion 1" title="Identification NFT mint">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize" radius="full" onClick={actions.identification_nft.mint}>
              Mint
            </Button>
            <Button className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg capitalize" radius="full" onClick={actions.identification_nft.burn}>
              Burn
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}