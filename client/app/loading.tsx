"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { HashLoader } from "react-spinners";

export default function Loading() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null; // Hide the loader after 5 seconds

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      {/* <Loader2 className="h-12 w-12 animate-spin text-primary" /> */}
      <HashLoader size={140} color="#ffffff" />
      <h2 className="mt-4 text-xl font-semibold">Loading...</h2>
      <p className="text-sm text-muted-foreground">
        Please wait while we set things up
      </p>
    </div>
  );
}
