"use client";

import { useEffect, useRef, useState } from "react";
import { TalendroLogo } from "@/components/icons";
import MouseFollower from "@/components/home/MouseFollower";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hideHero, setHideHero] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / windowHeight, 2);
      setHideHero(scrollPosition / windowHeight > 2);
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
        className={`fixed inset-0 flex items-center justify-center transition-all duration-300 ${hideHero && "hidden"}`}
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
              <h2 className="relative group inline-block text-3xl md:text-5xl font-light tracking-widest">
                WHO WE ARE
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
              </h2>

              <p className="text-muted-foreground max-w-2xl mx-auto">
                We are a team of passionate blockchain developers, and technical
                writers dedicated to building and educating within the Cardano
                ecosystem. With expertise in{" "}
                <b className="text-foreground">smart contract development</b>{" "}
                and decentralized technologies, we strive to push the boundaries
                of blockchain adoption and innovation.
              </p>
            </div>
          </div>
        </section>

        <section className="relative min-h-[80vh] bg-secondary/50 flex items-center justify-center mt-10">
          <div className="container mx-auto px-4 py-24 text-center space-y-16">
            <div className="space-y-8">
              <h2 className="relative group inline-block text-3xl md:text-5xl font-light tracking-widest">
                WHAT WE DO
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
              </h2>

              <p className="text-muted-foreground max-w-2xl mx-auto">
                We develop secure and efficient smart contracts using{" "}
                <b className="text-foreground">Aiken, Plutus, and Marlowe </b>,
                contribute to Cardano governance as a{" "}
                <b className="text-foreground">DRep</b>, and actively engage in
                technical writing to educate the community. We also conduct
                blockchain workshops, contribute to{" "}
                <b className="text-foreground">open-source </b> projects, and
                explore real-world applications of decentralized solutions.
              </p>
            </div>
          </div>
        </section>
        <section className="relative min-h-[80vh] flex items-center justify-center bg-background">
          <div className="container mx-auto px-4 py-24">
            <h2 className="text-3xl md:text-5xl font-light text-center mb-16">
              Let&apos;s create something meaningful
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Team Member Card 1 */}
              <div className="group relative bg-secondary/20 rounded-lg p-6 border-3 transition-all duration-300 hover:bg-secondary/30">
                <div className="aspect-square relative rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/naruto.jpg"
                    alt="FaizanShaikh"
                    width={400}
                    height={400}
                    priority
                    fetchPriority="high"
                    unoptimized
                    className="object-cover transition-transform duration-500 "
                  />
                </div>
                <h3 className="text-xl font-light mb-2 text-center">
                  Faizan Shaikh
                </h3>
                <p className="text-muted-foreground mb-4 text-center">
                  Developer
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link
                    href="https://github.com/Cryptonean"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="size-5" />
                    <span className="sr-only">Github</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/faizanshaikh-here/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="size-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link
                    href="mailto:faizanvit8@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="size-5" />
                    <span className="sr-only">Email</span>
                  </Link>
                </div>
              </div>

              {/* Team Member Card 2 */}
              <div className="group relative bg-secondary/20 border-3 rounded-lg p-6 transition-all duration-300 hover:bg-secondary/30">
                <div className="aspect-square relative rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/sasuke.jpg"
                    alt="RahatSayyed"
                    width={400}
                    height={400}
                    className="object-cover transition-transform duration-500 "
                    priority
                    fetchPriority="high"
                    unoptimized
                  />
                </div>
                <h3 className="text-xl font-light mb-2 text-center">
                  Rahat Sayyed
                </h3>
                <p className="text-muted-foreground mb-4 text-center">
                  Developer
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link
                    href="https://github.com/youreachedrahat"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="size-5" />
                    <span className="sr-only">Github</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/youreachedrahat/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="size-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link
                    href="mailto:rahxtsayyed@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="size-5" />
                    <span className="sr-only">Email</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
