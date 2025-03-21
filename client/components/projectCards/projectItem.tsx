"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectInitiateValidator } from "@/config/scripts/scripts";
import { useWallet } from "@/context/walletContext";
import { getAddress, getPolicyId, refUtxo, toAda } from "@/lib/utils";
import { ProjectDatum } from "@/types/cardano";
import { Data, fromText, toText, type UTxO } from "@lucid-evolution/lucid";
import { useEffect, useState } from "react";
import { arbitration } from "../transactions/arbitration";
import Image from "next/image";
import { toast } from "sonner";
import { blockfrost } from "@/lib/blockfrost";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { withErrorHandling } from "../errorHandling";
import { acceptProject } from "../transactions/acceptProject";
import {
  CancelNotAccepted,
  CancelProject,
} from "../transactions/cancelProject";
import { ProjectComplete } from "../transactions/ProjectComplete";
import clsx from "clsx";
import { ImageIcon } from "lucide-react";

interface Props {
  project: UTxO;
  from: string;
}

export default function ProjectItem({ project, from }: Props) {
  const [walletConnection] = useWallet();
  const { lucid, address } = walletConnection;
  const [submitting, setSubmitting] = useState(false);
  const [datum, setDatum] = useState<ProjectDatum>();
  const [isCompleteByDev, setIsCompleteByDev] = useState(false);
  const [isCancelByDev, setIsCancelByDev] = useState(false);
  const [metadata, setMetadata] = useState({ description: "", image: "" });
  const [isArbitrationDialogOpen, setIsArbitrationDialogOpen] = useState(false);
  const [POWLink, setPOWLink] = useState("");
  const [IsNewListed, setIsNewListed] = useState(false);

  useEffect(() => {
    if (!lucid) return;

    async function fetchDatum() {
      try {
        const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);

        const data = await lucid?.datumOf(project);
        const datum = Data.castFrom(data as Data, ProjectDatum);
        setDatum(datum);
        setIsCompleteByDev(
          project.assets.hasOwnProperty(
            PROJECTINITPID + fromText("dev_") + datum?.title
          )
        );
        setIsCancelByDev(
          project.assets.hasOwnProperty(
            PROJECTINITPID + fromText("dev_") + datum?.title
          ) && datum.pay === null
        );
        // Assuming metadata is stored in the datum or fetched separately
        const metadata = await blockfrost.getMetadata(
          PROJECTINITPID + fromText("dev_") + datum?.title
        );
        setMetadata(metadata);
      } catch (error) {
        console.error("Error fetching datum:", error);
      }
    }
    fetchDatum();
    newlisted();
  }, [lucid, project]);

  if (!datum) return null;

  function newlisted() {
    if (!lucid) return;
    if (project.address == getAddress(ProjectInitiateValidator)) {
      setIsNewListed(true);
    }
  }

  async function handleAcceptClick() {
    if (!datum) {
      toast.error("Error", { description: "Project data not found" });
      return;
    }
    setSubmitting(true);
    const saferMint = withErrorHandling(acceptProject);
    await saferMint(walletConnection, project, datum);
    setSubmitting(false);
  }

  async function cancelProjectClick() {
    if (!lucid || !address || !datum) {
      toast.error("Error", { description: "Missing required data" });

      return;
    }
    setSubmitting(true);
    try {
      const calledByDev = from.includes("dev");
      const safeCnlnotAccept = withErrorHandling(CancelNotAccepted);
      const safeCnlPrj = withErrorHandling(CancelProject);
      IsNewListed
        ? await safeCnlnotAccept(lucid, project, datum)
        : await safeCnlPrj(lucid, project, datum, calledByDev, address);
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  }

  async function projectCompleteClick() {
    if (!lucid || !address || !datum) {
      toast.error("Error", { description: "Missing required data" });

      return;
    }
    setSubmitting(true);
    try {
      const calledByDev = from.includes("dev");
      const safePrjComplete = withErrorHandling(ProjectComplete);
      await safePrjComplete(lucid, project, datum, calledByDev, address);
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  }

  async function handleArbitrationClick() {
    setIsArbitrationDialogOpen(true);
  }

  async function confirmArbitration() {
    try {
      setSubmitting(true);
      const calledByDev = from.includes("dev");
      const safeArbitration = withErrorHandling(arbitration);
      await safeArbitration(walletConnection, project, calledByDev, POWLink);
      setIsArbitrationDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
    setPOWLink("");
  }

  // const imageUrl = metadata?.image?.replace("ipfs://", "https://ipfs.io/ipfs/");
  const imageUrl = metadata?.image
    ? metadata.image.startsWith("ipfs://")
      ? metadata.image.replace(
          "ipfs://",
          "https://beige-electoral-meadowlark-467.mypinata.cloud/ipfs/"
        )
      : metadata.image.startsWith("http")
        ? metadata.image
        : `https://beige-electoral-meadowlark-467.mypinata.cloud/ipfs/${metadata.image}`
    : null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex !flex-row items-center justify-between">
        <CardTitle>{toText(datum.title)}</CardTitle>
        <Badge variant={"secondary"}>
          {!datum.milestones.length ? "Single Milestone" : "Multi Milestone"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={clsx(
              "w-full aspect-square rounded-md overflow-hidden flex items-center justify-center bg-background transition-all duration-200",
              !imageUrl && "border-2 border-dashed border-muted-foreground/20"
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={toText(datum.title)}
                width={500}
                height={500}
                className="rounded-md mx-auto w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  loading Image
                </p>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {metadata?.description || "No description provided"}
          </p>
          <p className="font-semibold">
            Budget: {toAda(datum.pay as bigint)} ADA
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-center">
        {from === "projects" && (
          <Button onClick={handleAcceptClick} disabled={submitting}>
            {submitting ? "Accepting..." : "Accept Project"}
          </Button>
        )}
        {(from === "myProjects_dev" || from === "myProjects_client") &&
          (!IsNewListed ? (
            <div className="flex gap-2 justify-center items-center flex-wrap">
              <Button
                onClick={projectCompleteClick}
                disabled={
                  submitting ||
                  (isCompleteByDev && from.includes("dev")) ||
                  (!isCompleteByDev && from.includes("client")) ||
                  (isCancelByDev && from.includes("client"))
                }
              >
                {submitting
                  ? "Processing..."
                  : isCompleteByDev && from.includes("dev")
                    ? "Marked Completed"
                    : !isCompleteByDev && from.includes("client")
                      ? "Awaiting Completion"
                      : "Complete Project"}
              </Button>
              <Button
                onClick={cancelProjectClick}
                disabled={
                  submitting ||
                  (isCancelByDev && from.includes("dev")) ||
                  (!isCancelByDev && from.includes("client"))
                }
                // style={{
                //   display:
                //     (isCancelByDev && from.includes("dev")) ||
                //     (!isCancelByDev && from.includes("client"))
                //       ? "none"
                //       : "block",
                // }}
              >
                {submitting
                  ? "Processing..."
                  : isCancelByDev && from.includes("dev")
                    ? "Cancelled"
                    : !isCancelByDev && from.includes("client")
                      ? "Awaiting Cancellation"
                      : "Cancel Project"}
              </Button>
              <Button onClick={handleArbitrationClick} disabled={submitting}>
                {submitting ? "Requesting..." : "Request Arbitration"}
              </Button>
            </div>
          ) : (
            <>
              Not Accept yet
              <br></br>
              <Button onClick={cancelProjectClick}>Cancel Project</Button>
            </>
          ))}
      </CardFooter>
      <Dialog
        open={isArbitrationDialogOpen}
        onOpenChange={setIsArbitrationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Arbitration</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter Proof of work or related document as link"
            value={POWLink}
            onChange={(e) => setPOWLink(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={() => setIsArbitrationDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmArbitration}
              disabled={!POWLink || submitting}
            >
              {submitting ? "Requesting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
