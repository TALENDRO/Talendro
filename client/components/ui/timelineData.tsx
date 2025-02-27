import {
  Shield,
  Users,
  Briefcase,
  FileCheck,
  Coins,
  Scale,
  Info,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagicCard } from "../magicui/magic-card";

export const DATA = {
  "step 1": {
    title: "Stake Reputation",
    card: [
      {
        cardTitle: "Freelancer Stake",
        cardIcon: Users,
        cardContent:
          "Freelancers must stake 2% of the project value as a commitment deposit to ensure quality delivery and accountability.",
      },
      {
        cardTitle: "Arbitrator Stake",
        cardIcon: Scale,
        cardContent:
          "Arbitrators are required to stake an amount equal to or greater than the project value to ensure fair dispute resolution.",
      },
    ],
  },
  "step 2": {
    title: "Post Job",
    card: [
      {
        cardTitle: "Job Details",
        cardIcon: Briefcase,
        cardContent:
          "Clients create detailed job listings including project description, required skills, budget range, and timeline expectations.",
      },
      {
        cardTitle: "Freelancer Access",
        cardIcon: Users,
        cardContent:
          "Qualified freelancers can browse listings and submit proposals based on their expertise and availability.",
      },
    ],
  },
  "step 3": {
    title: "Hire & Fund Smart Contract",
    card: [
      {
        cardTitle: "Smart Contract",
        cardIcon: Shield,
        cardContent:
          "Project payment is securely held in an escrow smart contract until successful completion or dispute resolution.",
      },
      {
        cardTitle: "Payment Security",
        cardIcon: Coins,
        cardContent:
          "Funds remain locked and protected until all project milestones are met and approved by both parties.",
      },
    ],
  },
  "step 4": {
    title: "Work Submission & Review",
    card: [
      {
        cardTitle: "Submission",
        cardIcon: FileCheck,
        cardContent:
          "Freelancers submit completed work through the platform with detailed documentation.",
      },
      {
        cardTitle: "Client Review",
        cardIcon: Users,
        cardContent:
          "Clients review submissions and can request revisions or approve the final work.",
      },
      {
        cardTitle: "Revision Process",
        cardIcon: Info,
        cardContent:
          "Clear revision guidelines ensure both parties understand the feedback and improvement process.",
      },
    ],
  },
  "step 5": {
    title: "Payment & Reputation Update",
    card: [
      {
        cardTitle: "Successful Completion",
        cardIcon: BadgeCheck,
        cardContent:
          "Upon approval, payment is automatically released to the freelancer and both parties gain reputation points.",
      },
      {
        cardTitle: "Failed Delivery",
        cardIcon: AlertCircle,
        cardContent:
          "If delivery fails, the freelancer's stake is slashed and the client receives a refund of the project payment.",
      },
      {
        cardTitle: "Reputation Impact",
        cardIcon: Users,
        cardContent:
          "Project outcomes directly affect platform reputation scores for future opportunities.",
      },
    ],
  },
  "step 6": {
    title: "Dispute Resolution",
    card: [
      {
        cardTitle: "Arbitration Process",
        cardIcon: Scale,
        cardContent:
          "Qualified arbitrators review dispute evidence and make binding decisions based on platform guidelines.",
      },
      {
        cardTitle: "Stake Protection",
        cardIcon: Shield,
        cardContent:
          "Arbitrator stakes ensure fair and unbiased dispute resolution with consequences for poor decisions.",
      },
      {
        cardTitle: "Appeals System",
        cardIcon: Users,
        cardContent:
          "Higher-level arbitrators can review contested decisions and penalize biased arbitration.",
      },
    ],
  },
};

export const timelineData = Object.entries(DATA).map(
  ([stepKey, stepValue], stepIndex) => ({
    title: "..." + (stepIndex + 1),
    content: (
      <div>
        <h4 className="text-xl sm:text-3xl md:text-4xl font-bold text-white pb-5 md:pb-10">
          <span className="relative inline-block group">
            {stepValue.title}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
          </span>
        </h4>
        <div className={`grid gap-4 grid-cols-4 items-center`}>
          {stepValue.card.map((card, cardIndex) => (
            <MagicCard
              key={cardIndex}
              className={`
                ${cardIndex === 2 ? "col-start-2 col-span-2" : "col-span-2"}
              `}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <card.cardIcon className="h-5 w-5" />
                  {card.cardTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {card.cardContent}
                </p>
              </CardContent>
            </MagicCard>
          ))}
        </div>
      </div>
    ),
  })
);
