"use client";
import { CreateProject } from "@/components/createProjectModal";
import { HOLDINGADDR, MILESTONEADDR, PROJECTINITADDR } from "@/config";
import { useWallet } from "@/context/walletContext";
import {
  type Address,
  Data,
  paymentCredentialOf,
  type UTxO,
} from "@lucid-evolution/lucid";
import React, { useEffect, useState } from "react";
import ProjectItem from "@/components/projectItem";
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
    console.log("fecthing projects");
    try {
      const utxos = await lucid.utxosAt(contractAddress);
      const newClientProjects = new Set<UTxO>();
      const newDevProjects = new Set<UTxO>();

      for (const utxo of utxos) {
        const data = await lucid.datumOf(utxo);
        try {
          const datum = Data.castFrom(data as Data, ProjectDatum);
          const hash = paymentCredentialOf(address).hash;
          if (datum.developer === hash) {
            newDevProjects.add(utxo);
          } else if (datum.client === hash) {
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
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch projects. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  useEffect(() => {
    if (!lucid || !address) return;
    async function loadProjects() {
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
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>Manage your projects as a client or developer</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProject />
        </CardContent>
      </Card> */}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Created Projects</TabsTrigger>
            <TabsTrigger value="developer">Accepted Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <Card>
              <CardHeader>
                <CardTitle>Your Client Projects</CardTitle>
                <CardDescription>
                  Projects you&apos;ve created as a client
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientProjects.size > 0 ? (
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
                  <p className="text-center text-muted-foreground">
                    No client projects found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="developer">
            <Card>
              <CardHeader>
                <CardTitle>Your Developer Projects</CardTitle>
                <CardDescription>
                  Projects you&apos;ve accepted as a developer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {devProjects.size > 0 ? (
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
                  <p className="text-center text-muted-foreground">
                    No developer projects found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
