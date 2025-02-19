"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@heroui/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Code2,
  Gavel,
  Shield,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import Orb from "@/components/ui/orbprop";
import GlitchText from "@/components/ui/glitchText";

export default function Homepage() {
  const categories = [
    { name: "Smart Contract Development", count: 124, icon: Code2 },
    { name: "Blockchain Integration", count: 89, icon: TrendingUp },
    { name: "Web3 Frontend", count: 156, icon: Wallet },
  ];
  const { currentUser, userDatObj } = useAuth();
  const [data, setdata] = useState({});
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Project Manager",
      content:
        "Found an amazing blockchain developer within hours. The escrow system made the whole process secure.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Startup Founder",
      content:
        "The milestone-based payment system is revolutionary. It made our complex DeFi project manageable.",
      rating: 5,
    },
    {
      name: "Michael Roberts",
      role: "Lead Developer",
      content:
        "The arbitration system provides peace of mind. Highly recommend for Web3 projects.",
      rating: 4,
    },
  ];
  useEffect(() => {
    if (!currentUser || !userDatObj) {
      return;
    }
    setdata(userDatObj);
  }, [currentUser, userDatObj]);
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative from-primary/10 via-primary/5 to-background pt-10 pb-32">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Secure Blockchain Project Management
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Connect with top blockchain developers and manage projects with
                built-in escrow, milestone tracking, and decentralized
                arbitration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/projects">Find Projects</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/projects">Post a Project</Link>
                </Button>
              </div>
            </div>
            {/* <div className="flex-1">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Platform Preview"
                width={400}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div> */}
            {/* <div
              style={{ width: "100%", height: "800px", position: "relative" }}
            >
              <Orb
                hoverIntensity={0.5}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </div> */}

            {/* <GlitchText
              speed={1}
              enableShadows={true}
              enableOnHover={false}
              className="custom-class"
            >
              TALENDRO
            </GlitchText> */}
            <GlitchText
              speed={1.2}
              enableShadows={true}
              enableOnHover={false}
              className="custom-class border-4 border-white rounded-lg px-4 py-2"
            >
              TALENDRO
            </GlitchText>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Talendro
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure Escrow</CardTitle>
                <CardDescription>
                  Smart contract-based escrow system ensures secure payments and
                  project delivery.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Wallet className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Milestone Payments</CardTitle>
                <CardDescription>
                  Break down projects into milestones with automated payment
                  releases.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Gavel className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Fair Arbitration</CardTitle>
                <CardDescription>
                  Decentralized arbitration system ensures fair dispute
                  resolution.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Categories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="group hover:shadow-lg transition-shadow"
              >
                <Link href={`#`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <category.icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">
                        {category.count} Projects
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {testimonial.content}
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-primary">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary/80">
            Join the future of decentralized project management
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">
              Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
