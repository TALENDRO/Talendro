"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { TalendroLogo } from "@/components/icons";

export default function Homepage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

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

  const blurAmount = Math.min(scrollProgress * 10, 5); // Max blur of 5px
  const opacity = Math.min(scrollProgress * 2, 1); // Fade in effect

  return (
    <main>
      {/* Fixed Hero Section */}
      <div
        ref={heroRef}
        className="fixed inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          filter: `blur(${blurAmount}px)`,
          opacity: 1 - scrollProgress * 0.5, // Fade out slightly as we scroll
        }}
      >
        <div className="text-center sm:space-y-4">
          <h1 className="text-4xl md:text-6xl font-light">
            <span className="max-sm:hidden">
              <TalendroLogo size={140} />
            </span>
            <span className="sm:hidden">
              <TalendroLogo size={60} />
            </span>
          </h1>

          <p className="text-muted-foreground max-sm:text-sm">
            A connection that Sparks growth
          </p>
        </div>
        <div className="absolute bottom-8 scroll-indicator">
          <ArrowDown className="w-6 h-6" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative">
        {/* Spacer to push content below fold */}
        <div className="h-screen" />

        {/* Selected Works Section */}
        <section
          className="relative min-h-screen bg-secondary/50 flex items-center justify-center"
          style={{
            transform: `translateY(${(1 - scrollProgress) * 50}%)`,
            opacity: opacity,
          }}
        >
          <div className="container mx-auto px-4 py-24 text-center">
            <h2 className="text-3xl md:text-5xl font-light mb-8">
              Selected Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A collection of projects that showcase my passion for design and
              development. Each piece represents a unique challenge and creative
              solution.
            </p>
          </div>
        </section>

        {/* Connect Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-background">
          <div className="container mx-auto px-4 py-24 text-center">
            <h2 className="text-3xl md:text-5xl font-light mb-8">
              Let's Connect
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear about it. Let's create
              something amazing together.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
