"use client";
import React from "react";

import { TalendroLogo } from "./icons";
import { Marquee } from "./magicui/marquee";
export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">
              <TalendroLogo />
            </h3>
            <p className="text-sm text-muted-foreground">
              Building the future of web applications. Join us on our journey to
              create amazing experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/documentation"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
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
                <TalendroLogo size={40} />
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </footer>
  );
}
