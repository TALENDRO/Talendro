"use client";

import { useEffect, useState } from "react";
import { TalendroLogo } from "@/components/icons";
import { ArrowDown, Send } from "lucide-react";
import MouseFollower from "@/components/home/MouseFollower";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <main>
      {/* Fixed Hero Section */}
      <MouseFollower />
      <div
        className="fixed inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          opacity: 1 - scrollProgress * 0.5,
        }}
      >
        <div className="text-center sm:space-y-4">
          <h1 className="text-4xl md:text-6xl font-light">
            <TalendroLogo size={140} />
          </h1>
          <p className="text-muted-foreground max-sm:text-sm font-comfortaa">
            a connection that sparks growth
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
              <p className="text-muted-foreground">INDIA</p>
            </div>
          </div>
        </section>

        <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-background">
          <div className="container mx-auto px-4 py-24 text-center space-y-3 sm:space-y-6">
            <a
              href="mailto:hello@example.com"
              className="relative text-3xl md:text-5xl font-light group inline-block"
            >
              Let’s Connect and Create Something Amazing"
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full" />
            </a>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We’re excited to bring your ideas to life. Whether you have a
              project in mind or just want to say hello, drop us a message!
            </p>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full mx-auto space-y-8"
          >
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-muted-foreground/30 py-2 px-1 focus:outline-none focus:border-foreground transition-colors peer placeholder:text-transparent"
                  placeholder="Name"
                />
                <label className="absolute left-1 -top-6 text-sm text-muted-foreground peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all peer-focus:-top-6 peer-focus:text-sm">
                  Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-muted-foreground/30 py-2 px-1 focus:outline-none focus:border-foreground transition-colors peer placeholder:text-transparent"
                  placeholder="Email"
                />
                <label className="absolute left-1 -top-6 text-sm text-muted-foreground peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all peer-focus:-top-6 peer-focus:text-sm">
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full bg-transparent border-b border-muted-foreground/30 py-2 px-1 focus:outline-none focus:border-foreground transition-colors peer placeholder:text-transparent"
                  placeholder="Subject"
                />
                <label className="absolute left-1 -top-6 text-sm text-muted-foreground peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all peer-focus:-top-6 peer-focus:text-sm">
                  Subject
                </label>
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-muted-foreground/30 py-2 px-1 focus:outline-none focus:border-foreground transition-colors peer placeholder:text-transparent resize-none"
                  placeholder="Message"
                />
                <label className="absolute left-1 -top-6 text-sm text-muted-foreground peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all peer-focus:-top-6 peer-focus:text-sm">
                  Message
                </label>
              </div>
            </div>
            <div className="p-2">
              <button
                type="submit"
                className="group flex items-center justify-center space-x-2 w-full border border-muted-foreground/30 py-2 hover:border-foreground transition-colors "
              >
                <span>Send Message</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
