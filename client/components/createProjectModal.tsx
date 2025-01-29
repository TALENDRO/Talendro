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
  PROJECTINITADDR,
  PROJECTINITPID,
  STAKEADDRESS,
  TALENDROPID,
} from "@/config";
import { refStakeUtxo, refUtxo, toLovelace } from "@/lib/utils";
import { ProjectInitiateValidator } from "@/config/scripts/scripts";
import { toast } from "sonner";

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

    const result = await createProject(
      projectTitle,
      pay,
      projectType,
      projectDescription,
      projectImageUrl
    );
    if (!result.data) {
      toast.error("ERROR", {
        description: result.error,
      });
      setSubmitting(false);

      return;
    }
    toast.success("Tx Hash", {
      description: "Project Created Successfully",
    });
    // Reset the form
    setTxHash(result.data);
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
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    const mintingValidator: MintingPolicy = ProjectInitiateValidator();

    try {
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
        TALENDROPID + fromText(address.slice(-10))
      );
      const redeemer = Data.to(0n);
      const tx = await lucid
        .newTx()
        .readFrom([...ref_utxo, ...ref_stake])
        .collectFrom([UTxO_Talendro])
        .pay.ToAddressWithData(
          PROJECTINITADDR,
          { kind: "inline", value: Data.to(datum, ProjectDatum) },
          { lovelace: pay ? toLovelace(pay) : 3_000_000n, ...dev_token }
        )
        .mintAssets({ ...clt_token, ...dev_token }, redeemer)
        .attach.MintingPolicy(mintingValidator)
        .complete();

      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();
      return { data: txHash, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
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

          {txHash && (
            <p className="text-sm text-muted-foreground">
              Transaction Hash: {txHash}
            </p>
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
