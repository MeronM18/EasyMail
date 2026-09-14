"use client";

import { ArrowUpDown, ArrowUpRight, Layers, UserCheck } from "lucide-react";
import Image from "next/image";
import { IntentLabel } from "@/components/app/intent-label";
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

/**
 * "Features Grid With Large Skeletons" section — a compact, skimmable
 * overview of the same three ideas FeatureShowcase and TrustSection cover
 * in depth further down the page. Deliberately additive, not a
 * replacement: this is the quick-glance summary; those remain the deep
 * dive. See landing-page design pass report for the overlap rationale.
 */

const recapRows: Array<{
  subject: string;
  intent: "needs_reply" | "needs_action" | "matters" | "can_ignore";
}> = [
  { subject: "Review launch brief", intent: "needs_reply" },
  { subject: "August expense receipt", intent: "needs_action" },
  { subject: "Fall schedule finalized", intent: "matters" },
  { subject: "Weekly product digest", intent: "can_ignore" },
];

function RecapSkeleton() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-6 py-6 sm:px-8">
      <div className="flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-muted">
          <Image alt="" aria-hidden="true" height={16} src="/hero/gmail.svg" width={20} />
          Gmail
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-muted">
          <Image
            alt=""
            aria-hidden="true"
            height={18}
            src="/hero/outlook.svg"
            width={18}
          />
          Outlook
        </span>
      </div>
      <ul className="overflow-hidden rounded-[10px] border border-border-strong bg-surface">
        {recapRows.map((row) => (
          <li
            className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
            key={row.subject}
          >
            <p className="truncate text-[13px] font-medium text-text">{row.subject}</p>
            <IntentLabel className="shrink-0" intent={row.intent} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TriageSkeleton() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6 py-7 sm:px-8">
      <div className="rounded-[10px] border border-primary/25 bg-primary-subtle px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-medium text-text">Can you review the brief?</p>
          <IntentLabel intent="needs_reply" />
        </div>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-primary">
          In focus
        </p>
      </div>
      <ul className="overflow-hidden rounded-[10px] border border-border bg-surface opacity-60">
        {[
          { subject: "Expense receipt", intent: "needs_action" as const },
          { subject: "Fall schedule", intent: "matters" as const },
        ].map((row) => (
          <li
            className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
            key={row.subject}
          >
            <p className="truncate text-[13px] text-text-muted">{row.subject}</p>
            <IntentLabel className="shrink-0" intent={row.intent} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function JudgmentSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-7 sm:px-8">
      <div className="w-full max-w-[260px] rounded-[10px] border border-border bg-surface px-4 py-3.5 opacity-60">
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-subtle">
          Model suggested
        </span>
        <div className="mt-2.5">
          <IntentLabel full intent="matters" />
        </div>
      </div>
      <ArrowUpDown aria-hidden="true" className="size-5 rotate-90 text-text-subtle" />
      <div className="w-full max-w-[260px] rounded-[10px] border border-primary/25 bg-primary-subtle px-4 py-3.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-primary">
          You corrected to
        </span>
        <div className="mt-2.5">
          <IntentLabel full intent="needs_action" />
        </div>
      </div>
    </div>
  );
}

type FeatureCardData = {
  title: string;
  icon: typeof Layers;
  Skeleton: () => React.JSX.Element;
};

const featureCards: FeatureCardData[] = [
  { title: "One recap. Every inbox.", icon: Layers, Skeleton: RecapSkeleton },
  { title: "Know what needs you.", icon: ArrowUpDown, Skeleton: TriageSkeleton },
  { title: "Your judgment wins.", icon: UserCheck, Skeleton: JudgmentSkeleton },
];

function FeatureCard({
  title,
  icon: Icon,
  Skeleton,
  variants,
}: FeatureCardData & { variants: Variants }) {
  return (
    <motion.div
      className="group flex flex-col overflow-hidden rounded-[10px] border border-border-strong bg-surface transition-colors hover:border-primary/40"
      variants={variants}
    >
      <div className="h-[340px] border-b border-border bg-surface-muted/60">
        <Skeleton />
      </div>
      <div className="flex items-center justify-between gap-4 px-6 py-5 sm:px-7">
        <span className="inline-flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.01em] text-text">
          <Icon
            aria-hidden="true"
            className="size-[18px] text-primary"
            strokeWidth={1.8}
          />
          {title}
        </span>
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-text-subtle transition-colors group-hover:border-primary/40 group-hover:text-primary"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </motion.div>
  );
}

export function FeatureGrid() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);

  return (
    <section className="border-b border-border bg-background" id="features">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-28">
        <RevealGroup className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-10">
          <div>
            <motion.p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
              variants={eyebrow}
            >
              Features
            </motion.p>
            <motion.h2
              className="mt-5 text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[1] tracking-[-0.03em] text-text"
              variants={headline}
            >
              Everything important.
              <span className="block text-text-muted">Nothing buried.</span>
            </motion.h2>
          </div>
          <motion.p
            className="max-w-lg text-[16px] leading-7 text-text-muted lg:text-right"
            variants={body}
          >
            EasyMail turns multiple inboxes into one clear view of what needs your
            attention, what can wait, and what to do next.
          </motion.p>
        </RevealGroup>

        <RevealGroup
          as="div"
          className="mt-14 grid gap-7 lg:mt-16 lg:grid-cols-3"
          staggerChildren={0.1}
        >
          {featureCards.map((card) => (
            <FeatureCard key={card.title} variants={staggerItem} {...card} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
