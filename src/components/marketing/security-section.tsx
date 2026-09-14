"use client";

import { Clock, Eye, Lock, RotateCcw, ShieldCheck, type LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/marketing/animated-number";
import {
  bodyVariants,
  EASE,
  eyebrowVariants,
  headlineVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

// Every number here is a real, checkable product fact — not a usage or
// traction metric. Never add fabricated counts to this list.
const stats: Array<{ value: number; label: string }> = [
  { value: 2, label: "Inboxes supported today" },
  { value: 5, label: "Clear attention intents" },
  { value: 7, label: "Day message-body retention" },
  { value: 14, label: "Day message-record retention" },
];

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

const trustPoints: Array<{
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}> = [
  {
    icon: Eye,
    number: "01",
    title: "Read-only access",
    description:
      "EasyMail can read connected messages, but it cannot send, archive, delete, or modify them.",
  },
  {
    icon: Lock,
    number: "02",
    title: "Encrypted connection",
    description:
      "Mailbox credentials are encrypted with AES-256-GCM before they are stored.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "User-owned data",
    description:
      "Database-enforced row-level security keeps every account isolated from every other user.",
  },
  {
    icon: Clock,
    number: "04",
    title: "Short retention",
    description:
      "Message bodies are retained for up to 7 days and message records for up to 14 days.",
  },
  {
    icon: RotateCcw,
    number: "05",
    title: "Your judgment wins",
    description:
      "Classification is a starting point, not a verdict. Correct any message and EasyMail keeps your decision on every future sync.",
  },
];

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 } },
};

export function SecuritySection() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const badge = useSafeVariants(badgeVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);
  const statCard = useSafeVariants(statCardVariants);
  return (
    <section className="border-b border-border bg-surface" id="security">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-28">
        <div>
          <RevealGroup className="mx-auto max-w-3xl text-center">
            <motion.p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
              variants={eyebrow}
            >
              Security
            </motion.p>
            <motion.h2
              className="mx-auto mt-5 max-w-3xl text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[1] tracking-[-0.03em] text-text"
              variants={headline}
            >
              Trust should be visible in the architecture.
            </motion.h2>
            <motion.p
              className="mx-auto mt-6 max-w-xl text-[16px] leading-7 text-text-muted"
              variants={body}
            >
              Every claim here maps to an implemented boundary—not a vague promise on a
              compliance page.
            </motion.p>

            <motion.div
              className="mt-10 inline-flex items-center gap-3 border-y border-border py-4"
              variants={badge}
            >
              <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
              <div>
                <p className="text-[13px] font-semibold text-text">No mailbox actions</p>
                <p className="mt-0.5 text-[11px] text-text-subtle">
                  Classify and surface only
                </p>
              </div>
            </motion.div>
          </RevealGroup>

          <RevealGroup
            as="ol"
            className="mt-14 grid border-t border-border md:grid-cols-2"
            staggerChildren={0.08}
          >
            {trustPoints.map((point) => (
              <motion.li
                className="grid grid-cols-[32px_36px_minmax(0,1fr)] gap-3 border-b border-border py-7 md:px-7 md:odd:border-r sm:grid-cols-[36px_44px_minmax(0,1fr)] sm:gap-5"
                key={point.title}
                variants={staggerItem}
              >
                <span className="pt-1 font-mono text-[10px] text-text-subtle">
                  {point.number}
                </span>
                <span className="flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-border bg-background text-primary">
                  <point.icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold leading-6 text-text">
                    {point.title}
                  </h3>
                  <p className="mt-1 max-w-lg text-[13px] leading-6 text-text-muted">
                    {point.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </RevealGroup>

          <RevealGroup
            as="div"
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-12 lg:grid-cols-4 lg:gap-x-8"
            staggerChildren={0.1}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={statCard}>
                <AnimatedNumber
                  className="block text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-[-0.02em] text-text"
                  value={stat.value}
                />
                <p className="mt-2 max-w-[160px] text-[13px] leading-5 text-text-muted">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
