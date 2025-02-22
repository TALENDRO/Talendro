"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { TalendroLogo } from "@/components/icons";
import MouseFollower from "@/components/home/MouseFollower";
import Link from "next/link";

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
      <MouseFollower />
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

          <p className="text-muted-foreground max-sm:text-sm font-comfortaa">
            a connection that sparks growth
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
          className="relative min-h-screen bg-secondary/50 flex items-center justify-center explore-project rounded-md"
          style={{
            transform: `translateY(${(1 - scrollProgress) * 50}%)`,
            opacity: opacity,
          }}
        >
          <Link
            href={"/projects"}
            className="container mx-auto px-4 py-24 text-center cursor-none"
          >
            <h2 className="text-3xl md:text-5xl font-light mb-8 tracking-widest">
              EXPLORE PROJECTS
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore collection of projects and find that aligns with your
              passion of design and development.
            </p>
          </Link>
        </section>

        {/* Connect Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-background">
          <div className="container mx-auto px-4 py-24 text-center">
            <h2 className="text-3xl md:text-5xl font-light mb-8">
              Let&apos;s Connect
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind? I&apos;d love to hear about it. Let&apos;s
              create something amazing together.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
