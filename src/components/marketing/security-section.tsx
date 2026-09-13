"use client";

import { Clock, Eye, Lock, ShieldCheck, type LucideIcon } from "lucide-react";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

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
        </div>
      </div>
    </section>
  );
}
