// export const timelineData = [
//   {
//     title: "Stake Reputation",
//     content: (
//       <>
//         <p>
//           - <strong>Freelancers</strong> must stake <strong>2%</strong> of the
//           project value as a <strong>commitment deposit</strong>.
//         </p>
//         <p>
//           - <strong>Arbitrators</strong> must stake an amount{" "}
//           <strong>equal to or greater than</strong> the project value.
//         </p>
//       </>
//     ),
//   },
//   {
//     title: "Post Job",
//     content: (
//       <>
//         <p>
//           - <strong>Clients</strong> post job listings with a{" "}
//           <strong>detailed description, budget, and deadline</strong>.
//         </p>
//         <p>
//           - <strong>Freelancers</strong> can <strong>browse</strong> and apply
//           based on their expertise.
//         </p>
//       </>
//     ),
//   },
//   {
//     title: "Hire & Fund Smart Contract",
//     content: (
//       <>
//         <p>
//           - <strong>Clients</strong> select a freelancer and deposit the{" "}
//           <strong>agreed payment into a smart contract</strong>.
//         </p>
//         <p>
//           - Funds remain <strong>locked</strong> until the job is completed or
//           disputed.
//         </p>
//       </>
//     ),
//   },
//   {
//     title: "Work Submission & Review",
//     content: (
//       <>
//         <p>
//           - <strong>Freelancer submits work</strong> within the deadline.
//         </p>
//         <p>
//           - The <strong>client reviews</strong> and either{" "}
//           <strong>accepts or requests revisions</strong>.
//         </p>
//       </>
//     ),
//   },
//   {
//     title: "Payment & Reputation Update",
//     content: (
//       <>
//         <p>
//           ✅ <strong>If the client accepts</strong>:
//         </p>
//         <ul>
//           <li>
//             The <strong>smart contract releases payment</strong> to the
//             freelancer.
//           </li>
//           <li>
//             <strong>Reputation increases</strong> for both parties.
//           </li>
//         </ul>
//         <p>
//           ❌ <strong>If the freelancer fails to deliver</strong>:
//         </p>
//         <ul>
//           <li>
//             Their <strong>stake is slashed</strong>, and the{" "}
//             <strong>client is refunded</strong>.
//           </li>
//           <li>
//             This affects the <strong>freelancer’s reputation</strong>.
//           </li>
//         </ul>
//       </>
//     ),
//   },
//   {
//     title: "Dispute Resolution (If Needed)",
//     content: (
//       <>
//         <p>
//           - If there's a dispute, an <strong>arbitrator steps in</strong>.
//         </p>
//         <p>
//           - If the arbitrator <strong>rules against the freelancer</strong>,
//           their stake is <strong>partially slashed</strong>.
//         </p>
//         <p>
//           - If an arbitrator is biased, a{" "}
//           <strong>higher-level arbitrator reviews</strong> and penalizes them if
//           necessary.
//         </p>
//       </>
//     ),
//   },
// ];
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagicCard } from "../magicui/magic-card";
import { useTheme } from "next-themes";

export const timelineData = [
  {
    title: "Stake Reputation",
    content: (
      <div className="grid gap-4 md:grid-cols-2">
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Freelancer Stake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Freelancers must stake 2% of the project value as a commitment
              deposit to ensure quality delivery and accountability.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Arbitrator Stake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Arbitrators are required to stake an amount equal to or greater
              than the project value to ensure fair dispute resolution.
            </p>
          </CardContent>
        </MagicCard>
      </div>
    ),
  },
  {
    title: "Post Job",
    content: (
      <div className="grid gap-4 md:grid-cols-2">
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clients create detailed job listings including project
              description, required skills, budget range, and timeline
              expectations.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Freelancer Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Qualified freelancers can browse listings and submit proposals
              based on their expertise and availability.
            </p>
          </CardContent>
        </MagicCard>
      </div>
    ),
  },
  {
    title: "Hire & Fund Smart Contract",
    content: (
      <div className="grid gap-4 md:grid-cols-2">
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Smart Contract
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Project payment is securely held in an escrow smart contract until
              successful completion or dispute resolution.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Payment Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Funds remain locked and protected until all project milestones are
              met and approved by both parties.
            </p>
          </CardContent>
        </MagicCard>
      </div>
    ),
  },
  {
    title: "Work Submission & Review",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Freelancers submit completed work through the platform with
              detailed documentation.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clients review submissions and can request revisions or approve
              the final work.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Revision Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clear revision guidelines ensure both parties understand the
              feedback and improvement process.
            </p>
          </CardContent>
        </MagicCard>
      </div>
    ),
  },
  {
    title: "Payment & Reputation Update",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />
              Successful Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upon approval, payment is automatically released to the freelancer
              and both parties gain reputation points.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Failed Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If delivery fails, the freelancer's stake is slashed and the
              client receives a refund of the project payment.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Reputation Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Project outcomes directly affect platform reputation scores for
              future opportunities.
            </p>
          </CardContent>
        </MagicCard>
      </div>
    ),
  },
  {
    title: "Dispute Resolution",
    content: (
      <div className="grid gap-4 md:grid-cols-3">
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Arbitration Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Qualified arbitrators review dispute evidence and make binding
              decisions based on platform guidelines.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Stake Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Arbitrator stakes ensure fair and unbiased dispute resolution with
              consequences for poor decisions.
            </p>
          </CardContent>
        </MagicCard>
        <MagicCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Appeals System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Higher-level arbitrators can review contested decisions and
              penalize biased arbitration.
            </p>
          </CardContent>
        </MagicCard>
      </div>
    ),
  },
];
