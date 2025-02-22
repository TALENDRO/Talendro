"use client";

import { useEffect, useState } from "react";
import { TalendroLogo } from "@/components/icons";

export default function AboutPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
      {/* Fixed Hero Section */}
      <div
        className="fixed inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          opacity: 1 - scrollProgress * 0.5,
        }}
      >
        <div className="text-center sm:space-y-4">
          <h1 className="text-4xl md:text-6xl font-light">Talendro</h1>
          <p className="text-muted-foreground max-sm:text-sm font-comfortaa">
            our story
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative">
        {/* Spacer to push content below fold */}
        <div className="h-screen" />

        {/* About Content */}
        <section
          className="relative min-h-[80vh] bg-secondary/50 flex items-center justify-center"
          style={{
            transform: `translateY(${(1 - scrollProgress) * 50}%)`,
            opacity: scrollProgress,
          }}
        >
          <div className="container mx-auto px-4 py-24 text-center space-y-16">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-light tracking-widest">
                WHO WE ARE
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A creative studio dedicated to crafting meaningful digital
                experiences through minimalist design and thoughtful
                development.
              </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-light tracking-widest">
                WHAT WE DO
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We transform ideas into elegant solutions, focusing on
                simplicity and purpose in every project we undertake.
              </p>
            </div>
          </div>
        </section>

        <section className="relative min-h-[80vh] flex items-center justify-center bg-background">
          <div className="container mx-auto px-4 py-24 text-center">
            <h2 className="text-3xl md:text-5xl font-light">
              Let&apos;s create something meaningful
            </h2>
          </div>
        </section>
      </div>
    </main>
  );
}
