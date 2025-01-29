"use client";
import { CreateProject } from "@/components/createProjectModal";
import { PROJECTINITADDR, PROJECTINITPID } from "@/config";
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
import ProjectItem from "@/components/projectItem";
import { Loader2, Search } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

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

  const fetchProjects = useCallback(async () => {
    if (!lucid) return;
    setIsLoading(true);
    try {
      const utxos = await lucid.utxosAt(PROJECTINITADDR);
      const filteredUtxos = utxos.filter((utxo) => {
        return Object.keys(utxo.assets).some((key) =>
          key.includes(PROJECTINITPID),
        );
      });
      setProjects(filteredUtxos);
    } catch (error: any) {
      toast.error("ERROR", { description: error.message });
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lucid]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      Object.keys(project.assets).some((key) =>
        key.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
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
    fetchProjects();
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
        <CardContent>
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

          {isLoading ? (
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
            <p className="text-center text-muted-foreground">
              No projects found.
            </p>
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
