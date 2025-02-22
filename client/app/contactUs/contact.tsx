"use client";

import { useEffect, useState } from "react";
import { TalendroLogo } from "@/components/icons";
import { ArrowDown } from "lucide-react";

export default function ContactPage() {
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
          <h1 className="text-4xl md:text-6xl font-light">TALENDRO</h1>
          <p className="text-muted-foreground max-sm:text-sm font-comfortaa">
            let&apos;s connect
          </p>
        </div>
        <div className="absolute bottom-8">
          <ArrowDown className="w-6 h-6" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative">
        {/* Spacer to push content below fold */}
        <div className="h-screen" />

        {/* Contact Content */}
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
                GET IN TOUCH
              </h2>
              <div className="space-y-4">
                <a
                  href="mailto:hello@example.com"
                  className="block text-xl md:text-2xl text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@example.com
                </a>
                <p className="text-muted-foreground">
                  Available for new projects and collaborations
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-light tracking-widest">
                LOCATION
              </h2>
              <p className="text-muted-foreground">
                Based in Your City, Country
              </p>
            </div>
          </div>
        </section>

        <section className="relative min-h-[80vh] flex items-center justify-center bg-background">
          <div className="container mx-auto px-4 py-24 text-center space-y-3 sm:space-y-6">
            <a
              href="mailto:hello@example.com"
              className="relative text-3xl md:text-5xl font-light group inline-block"
            >
              Start a Project
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full" />
            </a>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have an idea? Let&apos;s bring it to life together.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
