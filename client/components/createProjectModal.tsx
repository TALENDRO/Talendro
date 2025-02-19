"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import {
  Data,
  fromText,
  type MintingPolicy,
  paymentCredentialOf,
} from "@lucid-evolution/lucid";
import { useWallet } from "@/context/walletContext";
import { ProjectDatum } from "@/types/cardano";

import {
  getAddress,
  getPolicyId,
  privateKeytoAddress,
  refStakeUtxo,
  refUtxo,
  seedtoAddress,
  toLovelace,
} from "@/lib/utils";
import {
  ProjectInitiateValidator,
  TalendroTokenValidator,
} from "@/config/scripts/scripts";
import { toast } from "sonner";
import { STAKEPRIVATEKEY } from "@/config";
import { withErrorHandling } from "./errorHandling";

type ProjectType = "Milestone" | "Regular";

export function CreateProject() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectImageUrl, setProjectImageUrl] = useState("");
  const [pay, setPay] = useState<number | null>(0);
  const [projectType, setProjectType] = useState<ProjectType>("Regular");
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [walletConnection] = useWallet();
  const { lucid, address } = walletConnection;
  // const { toast } = useToast();

  const handleProjectTypeChange = (checked: boolean) => {
    setProjectType(checked ? "Milestone" : "Regular");
    if (checked) {
      setPay(null);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Console log the new fields
    console.log("Project Description:", projectDescription);
    console.log("Project Image URL:", projectImageUrl);
    const saferCreateProject = withErrorHandling(createProject);
    const result = await saferCreateProject(
      projectTitle,
      pay,
      projectType,
      projectDescription,
      projectImageUrl
    );
    console.log(result);

    // Reset the form
    setTxHash("");
    setProjectTitle("");
    setProjectDescription("");
    setProjectImageUrl("");
    setPay(0);
    setProjectType("Regular");
    setSubmitting(false);
  };

  async function createProject(
    title: string,
    pay: number | null,
    type: ProjectType,
    description: string,
    imageUrl: string
  ) {
    try {
      if (!lucid || !address) throw "Uninitialized Lucid!!!";
      const mintingValidator: MintingPolicy = ProjectInitiateValidator();
      const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
      const PROJECTINITADDR = getAddress(ProjectInitiateValidator);
      // const STAKESEED = process.env.NEXT_PUBLIC_STAKE_WALLET as string;
      // const STAKEADDRESS = await seedtoAddress(STAKESEED);
      const STAKEADDRESS = await privateKeytoAddress(STAKEPRIVATEKEY);

      const TALENDROPID = getPolicyId(TalendroTokenValidator);

      const datum: ProjectDatum = {
        title: fromText(title),
        pay: pay ? toLovelace(pay) : null,
        developer: null,
        client: paymentCredentialOf(address).hash,
        milestones: [],
        current_milestone: null,
        next_milestone: null,
        // description: fromText(description),
        // imageUrl: fromText(imageUrl),
      };

      const clt_assetname = fromText("clt_") + datum.title;
      const dev_assetname = fromText("dev_") + datum.title;
      const clt_token = { [PROJECTINITPID + clt_assetname]: 1n };
      const dev_token = { [PROJECTINITPID + dev_assetname]: 1n };
      const ref_utxo = await refUtxo(lucid);
      const ref_stake = await refStakeUtxo(lucid, address, STAKEADDRESS);
      const UTxO_Talendro = await lucid.utxoByUnit(
        TALENDROPID + paymentCredentialOf(address).hash.slice(-20)
      );
      const redeemer = Data.to(0n);
      const tx = await lucid
        .newTx()
        .readFrom([...ref_utxo, ...ref_stake])
        .readFrom([UTxO_Talendro])
        .pay.ToAddressWithData(
          PROJECTINITADDR,
          { kind: "inline", value: Data.to(datum, ProjectDatum) },
          { lovelace: pay ? toLovelace(pay) : 3_000_000n, ...dev_token }
        )
        .mintAssets({ ...clt_token, ...dev_token }, redeemer)
        .attach.MintingPolicy(mintingValidator)
        .attachMetadata(721, {
          [PROJECTINITPID]: {
            ["dev_" + title]: {
              name: "dev_" + title,
              image: imageUrl,
              description: description,
            },
            ["clt_" + title]: {
              name: "clt_" + title,
              image: imageUrl,
              description: description,
            },
          },
        })
        .complete();
      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();

      return txHash;
    } catch (error: any) {
      throw error;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Enter Project Details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectTitle" className="text-right">
              Title
            </Label>
            <Input
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectImageUrl" className="text-right">
              Image URL
            </Label>
            <Input
              id="projectImageUrl"
              value={projectImageUrl}
              onChange={(e) => setProjectImageUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectTypeSwitch" className="text-right">
              Type
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="projectTypeSwitch"
                checked={projectType === "Milestone"}
                onCheckedChange={handleProjectTypeChange}
              />
              <Label htmlFor="projectTypeSwitch">
                {projectType === "Milestone" ? "Milestone" : "Regular"}
              </Label>
            </div>
          </div>

          {projectType === "Regular" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pay" className="text-right">
                Pay
              </Label>
              <Input
                id="pay"
                type="number"
                value={pay !== null ? pay : ""}
                onChange={(e) => setPay(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
