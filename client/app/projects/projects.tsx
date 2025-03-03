"use client";
import { CreateProject } from "@/components/projectCards/createProjectModal";
import { useWallet } from "@/context/walletContext";
import type { UTxO } from "@lucid-evolution/lucid";
import type React from "react";
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProjectItem from "@/components/projectCards/projectItem";
import { Loader2, Search } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { getAddress, getPolicyId } from "@/lib/utils";
import { ProjectInitiateValidator } from "@/config/scripts/scripts";

const PROJECTS_PER_PAGE = 9;

export default function ProjectsPage() {
  const [walletContext] = useWallet();
  const { lucid } = walletContext;
  const [projects, setProjects] = useState<UTxO[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<UTxO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();
  const [isManualLoading, setIsManualLoading] = useState(false);

  // const fetchProjects = useCallback(async () => {
  //   if (!lucid) return;
  //   setIsLoading(true);
  //   try {
  //     const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
  //     const PROJECTINITADDR = getAddress(ProjectInitiateValidator);
  //     const utxos = await lucid.utxosAt(PROJECTINITADDR);
  //     const filteredUtxos = utxos.filter((utxo) => {
  //       return Object.keys(utxo.assets).some((key) =>
  //         key.includes(PROJECTINITPID)
  //       );
  //     });
  //     setProjects(filteredUtxos);
  //   } catch (error: any) {
  //     toast.error("ERROR", { description: error.message });
  //     console.error("Error fetching projects:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [lucid]);
  const fetchProjects = useCallback(
    async (isManual: boolean = false) => {
      if (!lucid) return;
      if (isManual) setIsManualLoading(true); // Only set loading state for manual refresh
      try {
        const PROJECTINITPID = getPolicyId(ProjectInitiateValidator);
        const PROJECTINITADDR = getAddress(ProjectInitiateValidator);
        const utxos = await lucid.utxosAt(PROJECTINITADDR);
        const filteredUtxos = utxos.filter((utxo) => {
          return Object.keys(utxo.assets).some((key) =>
            key.includes(PROJECTINITPID)
          );
        });
        setProjects(filteredUtxos);
      } catch (error: any) {
        toast.error("ERROR", { description: error.message });
        console.error("Error fetching projects:", error);
      } finally {
        if (isManual) setIsManualLoading(false); // Only reset manual loading state
      }
    },
    [lucid]
  );
  /////////////////////////
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProjects(); // Automatic refresh without loader
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  ////////////////////////////////////
  useEffect(() => {
    const filtered = projects.filter((project) =>
      Object.keys(project.assets).some((key) =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setDisplayedProjects(filtered.slice(0, page * PROJECTS_PER_PAGE));
  }, [projects, searchTerm, page]);

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchProjects(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>
            Manage your projects as a client or developer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProject />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Projects</CardTitle>
          <CardDescription>Browse and accept projects</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[50vh]">
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            <Button onClick={handleRefresh}>Refresh</Button>
          </div>

          {isManualLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : displayedProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayedProjects.map((project, i) => (
                <ProjectItem project={project} key={i} from="projects" />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[40vh]">
              <p className="text-muted-foreground ">No projects found.</p>
            </div>
          )}

          {!isLoading && displayedProjects.length < projects.length && (
            <div ref={ref} className="flex justify-center mt-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
