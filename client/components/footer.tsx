"use client";
import React from "react";

import { TalendroLogo } from "./icons";
import { Marquee } from "./magicui/marquee";
export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          {/* Company Info */}
          <div className="">
            <span className="max-sm:hidden -ml-1">
              <TalendroLogo size={48} />
            </span>
            <span className="sm:hidden -ml-1">
              <TalendroLogo size={38} />
            </span>
            <p className="text-sm text-muted-foreground">
              Building the future of web applications. Join us on our journey to
              create amazing experiences.
            </p>
          </div>

          <div className="flex max-sm:flex-row gap-8 justify-start sm:justify-evenly">
            <LinkSection title="Quick Links" links={QUICK_LINKS} />

            <LinkSection title="Resources" links={RESOURCES} />
          </div>

          {/* Newsletter */}
          <div className="space-y-2 sm:space-y-4">
            <h3 className="text-lg font-bold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-background"
              />
              <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
      </div>
      <div className="mt-8 pt-8 border-t border-border px-0 space-x-4">
        <Marquee className="[--duration:50s]">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <span className="max-sm:hidden">
                <TalendroLogo size={100} />
              </span>
              <span className="sm:hidden">
                <TalendroLogo size={70} />
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </footer>
  );
}

const QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/contactUs", label: "Contact" },
];

const RESOURCES = [
  { href: "/documentation", label: "Documentation" },
  { href: "/pricing", label: "Pricing" },
  { href: "/support", label: "Support" },
  { href: "/terms", label: "Terms of Service" },
];

const LinkSection: React.FC<{ title: string; links: any[] }> = ({
  title,
  links,
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold">{title}</h3>
    <ul className="space-y-2">
      {links.map(({ href, label }) => (
        <li key={href}>
          <a
            href={href}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
