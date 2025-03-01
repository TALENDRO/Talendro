// "use client";

// import type React from "react";
// import axios from "axios";

// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import { ImageIcon, Plus, Upload } from "lucide-react";
// import { useWallet } from "@/context/walletContext";
// import { withErrorHandling } from "../errorHandling";
// import { createProject } from "../transactions/createProject";
// import Image from "next/image";
// import clsx from "clsx";

// type ProjectType = "Milestone" | "Regular";

// export function CreateProject() {
//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectDescription, setProjectDescription] = useState("");
//   const [projectImage, setProjectImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [pay, setPay] = useState<number | null>(0);
//   const [projectType, setProjectType] = useState<ProjectType>("Regular");
//   const [submitting, setSubmitting] = useState(false);
//   const [txHash, setTxHash] = useState<string>();
//   const [walletConnection] = useWallet();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleProjectTypeChange = (checked: boolean) => {
//     setProjectType(checked ? "Milestone" : "Regular");
//     if (checked) {
//       setPay(null);
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setProjectImage(file);

//       // Create a preview URL for the image
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   // const handleSubmit = async () => {
//   //   setSubmitting(true);

//   //   // Here you would handle the image upload to a storage service
//   //   // and get back a URL to store in your project data
//   //   let projectImageUrl = "";
//   //   if (projectImage) {
//   //     // This is where you would upload the image and get a URL
//   //     // For now, we'll just use the file name as a placeholder

//   //     // temprorayly using this link
//   //     projectImageUrl = "https://avatars.githubusercontent.com/u/68136265";
//   //     // projectImageUrl = projectImage.name;
//   //   }

//   //   const saferCreateProject = withErrorHandling(createProject);
//   //   const result = await saferCreateProject(
//   //     walletConnection,
//   //     projectTitle,
//   //     pay,
//   //     projectType,
//   //     projectDescription,
//   //     projectImageUrl
//   //   );
//   //   console.log(result);

//   //   // Reset the form
//   //   setTxHash("");
//   //   setProjectTitle("");
//   //   setProjectDescription("");
//   //   setProjectImage(null);
//   //   setImagePreview(null);
//   //   setPay(0);
//   //   setProjectType("Regular");
//   //   setSubmitting(false);
//   // };
//   const handleSubmit = async () => {
//     setSubmitting(true);

//     let projectImageUrl = "";

//     if (projectImage) {
//       const formData = new FormData();
//       formData.append("file", projectImage);

//       const metadata = JSON.stringify({ name: "User Image" });
//       formData.append("pinataMetadata", metadata);

//       const options = JSON.stringify({ cidVersion: 1 });
//       formData.append("pinataOptions", options);

//       try {
//         const response = await axios.post(
//           "https://api.pinata.cloud/pinning/pinFileToIPFS",
//           formData,
//           {
//             headers: {
//               "Content-Type": `multipart/form-data`,
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, // Use JWT key here
//             },
//           }
//         );

//         projectImageUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`; // IPFS link
//       } catch (error) {
//         console.error("Image upload to Pinata failed:", error);
//         alert("Failed to upload image.");
//         setSubmitting(false);
//         return;
//       }
//     } else {
//       projectImageUrl = "https://avatars.githubusercontent.com/u/68136265"; // Default placeholder
//     }

//     const saferCreateProject = withErrorHandling(createProject);
//     const result = await saferCreateProject(
//       walletConnection,
//       projectTitle,
//       pay,
//       projectType,
//       projectDescription,
//       projectImageUrl // Now using IPFS URL
//     );

//     console.log(result);

//     // Reset the form
//     setTxHash("");
//     setProjectTitle("");
//     setProjectDescription("");
//     setProjectImage(null);
//     setImagePreview(null);
//     setPay(0);
//     setProjectType("Regular");
//     setSubmitting(false);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" /> Create Project
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[650px] overflow-hidden">
//         <DialogHeader className="pb-2">
//           <DialogTitle>New Project</DialogTitle>
//           <DialogDescription>
//             Enter project details to create a new project.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex gap-4 py-2">
//           {/* Form Section */}
//           <div className="flex-1 grid gap-3">
//             <div className="grid grid-cols-4 items-center gap-3">
//               <Label htmlFor="projectTitle" className="text-right text-sm">
//                 Title
//               </Label>
//               <Input
//                 id="projectTitle"
//                 value={projectTitle}
//                 onChange={(e) => setProjectTitle(e.target.value)}
//                 className="col-span-3 h-9"
//                 placeholder="Enter project title"
//               />
//             </div>

//             <div className="grid grid-cols-4 items-center gap-3">
//               <Label htmlFor="projectTypeSwitch" className="text-right text-sm">
//                 Type
//               </Label>
//               <div className="col-span-3 flex items-center space-x-2">
//                 <Switch
//                   id="projectTypeSwitch"
//                   checked={projectType === "Milestone"}
//                   onCheckedChange={handleProjectTypeChange}
//                 />
//                 <Label
//                   htmlFor="projectTypeSwitch"
//                   className="text-sm font-normal"
//                 >
//                   {projectType === "Milestone" ? "Milestone" : "Regular"}
//                 </Label>
//               </div>
//             </div>

//             <div className="grid grid-cols-4 items-center gap-3">
//               <Label htmlFor="pay" className="text-right text-sm">
//                 Pay
//               </Label>
//               <Input
//                 id="pay"
//                 type="number"
//                 disabled={projectType !== "Regular"}
//                 value={pay !== null ? pay : ""}
//                 onChange={(e) => setPay(Number(e.target.value))}
//                 className="col-span-3 h-9"
//                 placeholder={
//                   projectType === "Regular"
//                     ? "Enter amount"
//                     : "Milestone projects do not require payment"
//                 }
//               />
//             </div>

//             <div className="grid grid-cols-4 items-start gap-3">
//               <Label
//                 htmlFor="projectDescription"
//                 className="text-right text-sm pt-2"
//               >
//                 Description
//               </Label>
//               <Textarea
//                 id="projectDescription"
//                 value={projectDescription}
//                 onChange={(e) => setProjectDescription(e.target.value)}
//                 className="col-span-3 h-20 resize-none"
//                 placeholder="Describe your project"
//               />
//             </div>
//           </div>

//           {/* Image Preview Section */}
//           <div className="w-[180px] flex flex-col gap-2 border rounded-md p-3 bg-muted/30">
//             <p className="text-xs font-medium text-center text-muted-foreground">
//               Image Preview
//             </p>

//             <div
//               className={clsx(
//                 "w-full aspect-square rounded-md overflow-hidden flex items-center justify-center bg-background transition-all duration-200",
//                 !imagePreview &&
//                   "border-2 border-dashed border-muted-foreground/20"
//               )}
//             >
//               {imagePreview ? (
//                 <Image
//                   src={imagePreview || "/placeholder.svg"}
//                   alt="Project preview"
//                   width={200}
//                   height={200}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center p-2">
//                   <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
//                   <p className="text-xs text-muted-foreground mt-1 text-center">
//                     No image selected
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div>
//               <input
//                 type="file"
//                 id="projectImage"
//                 ref={fileInputRef}
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={triggerFileInput}
//                 className="w-full text-xs h-8"
//               >
//                 <Upload className="mr-1 h-3 w-3" />
//                 {projectImage ? "Change" : "Upload Image"}
//               </Button>
//               {projectImage && (
//                 <p className="text-xs text-muted-foreground mt-1 truncate text-center">
//                   {projectImage.name.length > 20
//                     ? `${projectImage.name.substring(0, 17)}...`
//                     : projectImage.name}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         <DialogFooter className="pt-2">
//           <Button type="submit" onClick={handleSubmit} disabled={submitting}>
//             {submitting ? "Submitting..." : "Create Project"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
