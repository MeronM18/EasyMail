"use client";

import { Briefcase, GraduationCap, RefreshCw, type LucideIcon } from "lucide-react";
import Image from "next/image";
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
 * Bento-style illustration of the three problems (structural reference:
 * Aceternity's "Multi Illustration Bento" — asymmetric tall-left/
 * stacked-right grid, card composition, subtle borders). Content is
 * EasyMail-specific throughout: no fake testimonial, login form, world
 * map, or keyboard illustration, since those don't represent this
 * product and a testimonial would violate the project's no-fake-social-
 * proof rule. `marketing-dark-stage` (on the parent section) remaps the
 * design tokens for this scope, so the standard bg-surface/text-text/etc.
 * classes below already render in the correct dark palette.
 */

const scatteredInboxes: Array<{
  label: string;
  source: string;
  count: number;
  rotate: string;
  icon: string | LucideIcon;
}> = [
  {
    label: "Personal",
    source: "Gmail",
    count: 12,
    rotate: "-rotate-3",
    icon: "/hero/gmail.svg",
  },
  {
    label: "Work",
    source: "Outlook",
    count: 8,
    rotate: "rotate-2",
    icon: "/hero/outlook.svg",
  },
  { label: "School", source: "Mail", count: 5, rotate: "-rotate-2", icon: GraduationCap },
  {
    label: "Side project",
    source: "Mail",
    count: 3,
    rotate: "rotate-3",
    icon: Briefcase,
  },
];

function MultipleInboxesPanel() {
  return (
    <div className="relative flex h-full min-h-[260px] items-center justify-center overflow-hidden px-6 py-8 lg:min-h-full">
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:22px_22px] opacity-40"
      />
      <div className="relative grid grid-cols-2 gap-4 sm:gap-5">
        {scatteredInboxes.map((inbox) => (
          <div
            className={`flex w-[156px] items-center gap-2.5 rounded-[10px] border border-border-strong bg-surface px-3.5 py-3 shadow-[0_10px_28px_rgba(0,0,0,0.28)] ${inbox.rotate}`}
            key={inbox.label}
          >
            {typeof inbox.icon === "string" ? (
              <Image alt="" aria-hidden="true" height={20} src={inbox.icon} width={20} />
            ) : (
              <inbox.icon
                aria-hidden="true"
                className="size-5 text-primary"
                strokeWidth={1.8}
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-text">
                {inbox.label}
              </p>
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.06em] text-text-subtle">
                {inbox.source} · {inbox.count} new
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const streamRows = [
  "Re: Tuesday planning session",
  "Your receipt from last week",
  "Fall schedule has been finalized",
  "5 links worth saving this week",
  "Can you review this before Friday?",
];

function UndifferentiatedStreamPanel() {
  return (
    <div className="flex h-full flex-col justify-center px-6 py-6">
      <ul className="overflow-hidden rounded-[10px] border border-border-strong bg-surface">
        {streamRows.map((row) => (
          <li
            className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5 last:border-b-0"
            key={row}
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-text-subtle"
            />
            <p className="truncate text-[12px] text-text-muted">{row}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.06em] text-text-subtle">
        Every message, same visual weight
      </p>
    </div>
  );
}

function AttentionLostPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-7 text-center">
      <span className="flex size-11 items-center justify-center rounded-full border border-border-strong bg-surface text-primary">
        <RefreshCw aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </span>
      <p className="text-[22px] font-semibold leading-none text-text">12×</p>
      <p className="max-w-[220px] text-[12px] leading-5 text-text-subtle">
        Checked today, still not sure what actually needed you.
      </p>
    </div>
  );
}

type PanelData = {
  number: string;
  title: string;
  description: string;
  Panel: () => React.JSX.Element;
};

const panels: PanelData[] = [
  {
    number: "01",
    title: "Multiple inboxes",
    description:
      "Work, personal, school, and side projects each live in their own tab and demand their own check.",
    Panel: MultipleInboxesPanel,
  },
  {
    number: "02",
    title: "One undifferentiated stream",
    description:
      "Replies, deadlines, receipts, and newsletters all arrive with the same visual weight: newest first.",
    Panel: UndifferentiatedStreamPanel,
  },
  {
    number: "03",
    title: "Attention lost to checking",
    description:
      "You open every inbox just to learn whether anything today actually needs your judgment.",
    Panel: AttentionLostPanel,
  },
];

function ProblemCard({
  number,
  title,
  description,
  Panel,
  variants,
  className,
}: PanelData & { variants: Variants; className?: string }) {
  return (
    <motion.div
      className={`flex flex-col overflow-hidden rounded-[14px] border border-border-strong bg-background ${className ?? ""}`}
      variants={variants}
    >
      <div className="flex-1 border-b border-border">
        <Panel />
      </div>
      <div className="px-6 py-5">
        <span className="font-mono text-[10px] text-text-subtle">{number}</span>
        <h3 className="mt-1 text-[15px] font-semibold leading-6 text-text">{title}</h3>
        <p className="mt-1.5 max-w-sm text-[13px] leading-6 text-text-muted">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function ProblemSection() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);
  return (
    <section className="marketing-dark-stage border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-28">
        <RevealGroup className="mx-auto max-w-4xl text-center">
          <div>
            <motion.p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
              variants={eyebrow}
            >
              The problem
            </motion.p>
            <motion.h2
              className="mx-auto mt-5 max-w-3xl text-[clamp(2.5rem,4.5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
              variants={headline}
            >
              <span className="block text-text">Your inboxes work fine.</span>
              <span className="block text-text-muted">
                Knowing what needs you doesn&apos;t.
              </span>
            </motion.h2>
          </div>
          <motion.p
            className="mx-auto mt-8 max-w-2xl text-[17px] leading-7 text-text-muted"
            variants={body}
          >
            Email is organized by account and arrival time. Your day is organized by
            consequences, commitments, and people waiting on you.
          </motion.p>
        </RevealGroup>

        <RevealGroup
          as="div"
          className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-2 lg:grid-rows-2"
          staggerChildren={0.1}
        >
          <ProblemCard {...panels[0]} className="lg:row-span-2" variants={staggerItem} />
          <ProblemCard {...panels[1]} variants={staggerItem} />
          <ProblemCard {...panels[2]} variants={staggerItem} />
        </RevealGroup>
      </div>
    </section>
  );
}
