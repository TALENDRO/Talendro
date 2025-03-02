"use client";
import { useWallet } from "@/context/walletContext";
import {
  type Address,
  Data,
  paymentCredentialOf,
  type UTxO,
} from "@lucid-evolution/lucid";
import React, { useEffect, useState } from "react";
import ProjectItem from "@/components/projectCards/projectItem";
import { ProjectDatum } from "@/types/cardano";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getAddress } from "@/lib/utils";
import {
  HoldingContractValidator,
  MilestoneSpendValidator,
  ProjectInitiateValidator,
} from "@/config/scripts/scripts";
// import { useToast } from "@/components/ui/use-toast"

export default function MyProjectsPage() {
  const [walletContext] = useWallet();
  const { lucid, address } = walletContext;
  const [clientProjects, setClientProjects] = useState<Set<UTxO>>(new Set());
  const [devProjects, setDevProjects] = useState<Set<UTxO>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  // const { toast } = useToast()

  async function fetchProjects(contractAddress: Address) {
    if (!lucid || !address) return;
    try {
      const utxos = await lucid.utxosAt(contractAddress);
      const newClientProjects = new Set<UTxO>();
      const newDevProjects = new Set<UTxO>();

      for (const utxo of utxos) {
        const data = await lucid.datumOf(utxo);
        try {
          const datum = Data.castFrom(data as Data, ProjectDatum);
          const hash = paymentCredentialOf(address).hash;
          if (datum.developer?.[0] === hash) {
            newDevProjects.add(utxo);
          } else if (datum.client[0] === hash) {
            newClientProjects.add(utxo);
          }
        } catch (error) {
          console.error("Error processing UTxO datum:", error);
        }
      }

      setClientProjects((prev) => new Set([...prev, ...newClientProjects]));
      setDevProjects((prev) => new Set([...prev, ...newDevProjects]));
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    if (!lucid || !address) return;
    async function loadProjects() {
      const MILESTONEADDR = getAddress(MilestoneSpendValidator);
      const HOLDINGADDR = getAddress(HoldingContractValidator);
      const PROJECTINITADDR = getAddress(ProjectInitiateValidator);
      setIsLoading(true);
      await Promise.all([
        fetchProjects(PROJECTINITADDR),
        fetchProjects(HOLDINGADDR),
        fetchProjects(MILESTONEADDR),
      ]);
      setIsLoading(false);
    }

    loadProjects();
  }, [lucid, address]);

  useEffect(() => {
    setClientProjects(new Set());
    setDevProjects(new Set());
  }, [address]);

  return (
    <div className="container mx-auto">
      <Tabs defaultValue="client" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Created Projects</TabsTrigger>
          <TabsTrigger value="developer">Accepted Projects</TabsTrigger>
        </TabsList>
        {/* created Projects */}
        <TabsContent value="client">
          <Card>
            <CardHeader>
              <CardTitle>Your Client Projects</CardTitle>
              <CardDescription>
                Projects you&apos;ve created as a client
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  {!address ? (
                    <p className="text-muted-foreground">Connect Wallet</p>
                  ) : (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  )}
                </div>
              ) : clientProjects.size > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from(clientProjects).map((project, i) => (
                    <ProjectItem
                      project={project}
                      key={i}
                      from="myProjects_client"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center min-h-[30vh]">
                  <p className="text-muted-foreground ">
                    No client projects found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* accepted projects */}
        <TabsContent value="developer">
          <Card>
            <CardHeader>
              <CardTitle>Your Developer Projects</CardTitle>
              <CardDescription>
                Projects you&apos;ve accepted as a developer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  {!address ? (
                    <p className="text-muted-foreground">Connect Wallet</p>
                  ) : (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  )}
                </div>
              ) : devProjects.size > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from(devProjects).map((project, i) => (
                    <ProjectItem
                      project={project}
                      key={i}
                      from="myProjects_dev"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center min-h-[30vh]">
                  <p className="text-muted-foreground ">
                    No developer projects found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
