"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { TalendroLogo } from "@/components/icons";
import MouseFollower from "@/components/home/MouseFollower";
import Link from "next/link";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";

export default function Homepage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hideHero, setHideHero] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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
  const steps = [
    {
      title: "Stake Reputation",
      description:
        "Freelancers must stake 2% of the project value as a commitment deposit. Arbitrators must stake an amount equal to or greater than the project value.",
    },
    {
      title: "Post Job",
      description:
        "Clients post job listings with a detailed description, budget, and deadline. Freelancers can browse and apply based on their expertise.",
    },
    {
      title: "Hire & Fund Smart Contract",
      description:
        "Clients select a freelancer and deposit the agreed payment into a smart contract. Funds remain locked until the job is completed or disputed.",
    },
    {
      title: "Work Submission & Review",
      description:
        "Freelancer submits work within the deadline. The client reviews and either accepts or requests revisions.",
    },
    {
      title: "Payment & Reputation Update",
      description:
        "If the client accepts: The smart contract releases payment to the freelancer. Reputation increases for both parties. If the freelancer fails to deliver: Their stake is slashed, and the client is refunded. This affects the freelancer’s reputation.",
    },
    {
      title: "Dispute Resolution (If Needed)",
      description:
        "If there's a dispute, an arbitrator steps in. If the arbitrator rules against the freelancer, their stake is partially slashed. If an arbitrator is biased, a higher-level arbitrator reviews and penalizes them if necessary.",
    },
  ];

  return (
    <main>
      <MouseFollower />
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

        {/* Selected Works Section */}
        <section
          className="relative min-h-[80vh]  bg-secondary/50 flex items-center justify-center explore-project rounded-md"
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

        <section className="relative min-h-[80vh] flex items-center justify-center bg-background">
          <div className="container mx-auto px-4 py-24 text-center space-y-3 sm:space-y-6">
            <Link
              href="/projects"
              className="relative text-3xl md:text-5xl font-light group"
            >
              Let&apos;s Create
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full">
                {" "}
              </span>
            </Link>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind? Let&apos;s create something amazing
              together.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {steps.map((step, index) => (
              <MagicCard
                key={index}
                className="cursor-pointer flex flex-col items-center justify-center text-center p-6 rounded-lg shadow-lg h-full"
                gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
              >
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {step.description}
                </p>
              </MagicCard>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
