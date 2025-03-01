"use client";

import type React from "react";
import axios from "axios";
import { useState, useRef } from "react";
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
import { ImageIcon, Plus } from "lucide-react";
import { useWallet } from "@/context/walletContext";
import { withErrorHandling } from "../errorHandling";
import { createProject } from "../transactions/createProject";
import Image from "next/image";
import clsx from "clsx";

type ProjectType = "Milestone" | "Regular";

export function CreateProject() {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pay, setPay] = useState<number | null>(0);
  const [projectType, setProjectType] = useState<ProjectType>("Regular");
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [walletConnection] = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProjectTypeChange = (checked: boolean) => {
    setProjectType(checked ? "Milestone" : "Regular");
    if (checked) {
      setPay(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProjectImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadImageToIPFS = async () => {
    if (!projectImage) return "ipfs://default-placeholder-cid";

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(projectImage.type)) {
      throw new Error("Invalid file type. Accepted: JPEG, PNG, GIF");
    }

    const formData = new FormData();
    formData.append("file", projectImage);
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: projectImage.name,
        keyvalues: {
          type: "projectImage",
        },
      })
    );
    formData.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: 1,
        wrapWithDirectory: false,
      })
    );

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT || ""}`,
          },
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Image upload failed. Please try again.");
    }
  };
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const projectImageUrl = await uploadImageToIPFS();
      const saferCreateProject = withErrorHandling(createProject);

      const result = await saferCreateProject(
        walletConnection,
        projectTitle,
        pay,
        projectType,
        projectDescription,
        projectImageUrl
      );

      console.log("Transaction result:", result);

      setTxHash(result?.txHash || "");
      setProjectTitle("");
      setProjectDescription("");
      setProjectImage(null);
      setImagePreview(null);
      setPay(0);
      setProjectType("Regular");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Enter project details to create a new project.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 py-2">
          <div className="flex-1 grid gap-3">
            <Label htmlFor="projectTitle">Title</Label>
            <Input
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter project title"
            />

            <Label htmlFor="projectTypeSwitch">Type</Label>
            <Switch
              id="projectTypeSwitch"
              checked={projectType === "Milestone"}
              onCheckedChange={handleProjectTypeChange}
            />
            <Label>{projectType}</Label>

            <Label htmlFor="pay">Pay</Label>
            <Input
              id="pay"
              type="number"
              disabled={projectType !== "Regular"}
              value={pay ?? ""}
              onChange={(e) => setPay(Number(e.target.value))}
              placeholder="Enter amount"
            />

            <Label htmlFor="projectDescription">Description</Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project"
            />
          </div>

          <div className="w-[180px] flex flex-col gap-2">
            <p>Image Preview</p>
            <div
              className={clsx(
                "w-full aspect-square rounded-md overflow-hidden",
                !imagePreview && "border-2 border-dashed"
              )}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                />
              ) : (
                <ImageIcon className="h-8 w-8" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button onClick={triggerFileInput}>
              {projectImage ? "Change" : "Upload Image"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
