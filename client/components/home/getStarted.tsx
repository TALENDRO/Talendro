import {
  ArrowRight,
  User,
  Wallet,
  Compass,
  PlusCircle,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GettingStarted() {
  const steps = [
    {
      title: "Connect wallet",
      description:
        "Connect your Cardano wallet and make sure it's on Preview Network. Get test ADA from the faucet.",
      icon: <Wallet className="h-6 w-6" />,
      link: "https://docs.cardano.org/cardano-testnets/tools/faucet",
      linkText: "Get test ADA",
      external: true,
    },
    {
      title: "Become a Member",
      description:
        "Mint Talendro Token to become a member. (100 ADA will be Staked)",
      icon: <Wallet className="h-6 w-6" />,
      link: "/profile",
      linkText: "Go to Profile",
    },
    {
      title: "Explore projects",
      description:
        "Browse through available projects that match your skills and interests.",
      icon: <Compass className="h-6 w-6" />,
      link: "/projects",
      linkText: "View projects",
    },
    {
      title: "Create projects",
      description:
        "Have an idea? Create your own project and find collaborators.",
      icon: <PlusCircle className="h-6 w-6" />,
    },
    {
      title: "Track your projects",
      description:
        "View your created and accepted projects in the Profile tab.",
      icon: <ClipboardList className="h-6 w-6" />,
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-0 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Getting Started with Talendro
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Follow these simple steps to begin your journey with Talendro
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 py-12">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border-2 border-primary/50 transition-colors duration-200 hover:bg-background/80"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/90 text-background ">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      Step {index + 1}: {step.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {step.description}
                  {step.link && (
                    <Link
                      href={step.link}
                      target={step.external ? "_blank" : "_self"}
                      rel={step.external ? "noopener noreferrer" : undefined}
                      className="ml-2 inline-flex items-center font-medium  hover:underline"
                    >
                      {step.linkText ? step.linkText : "View projects"}{" "}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
