"use client";

import {
  CheckCircle2,
  Link2,
  ListChecks,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
} from "@/components/marketing/motion";

const steps: Array<{
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}> = [
  {
    icon: Link2,
    number: "01",
    title: "Connect",
    description: "Connect Gmail or Outlook with read-only access.",
  },
  {
    icon: RefreshCw,
    number: "02",
    title: "Sync",
    description: "Recent messages arrive quietly without changing the source inbox.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Classify",
    description: "Each message is assigned one of five clear attention intents.",
  },
  {
    icon: ListChecks,
    number: "04",
    title: "Recap",
    description: "What needs a reply or action rises above everything that can wait.",
  },
  {
    icon: CheckCircle2,
    number: "05",
    title: "Act",
    description: "Open the original email to respond. EasyMail never acts for you.",
  },
];

export function HowItWorks() {
  // Progress is measured across the whole connector+steps block (real
  // height), not the 1px connector line itself, so the fill/dot travel
  // gradually as the section scrolls rather than snapping instantly.
  const progressRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: progressRef,
    offset: ["start 0.75", "end 0.6"],
  });
  const fillScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotLeft = useTransform(scrollYProgress, [0, 1], ["0%", "calc(100% - 8px)"]);
  const dotOpacity = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);

  return (
    <section className="border-b border-border bg-[#F2F7FC]" id="how-it-works">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <RevealGroup className="mx-auto max-w-3xl text-center">
          <div>
            <motion.p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
              variants={eyebrow}
            >
              How it works
            </motion.p>
            <motion.h2
              className="mx-auto mt-5 max-w-2xl text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[1] tracking-[-0.03em] text-text"
              variants={headline}
            >
              From inbox noise to one useful recap.
            </motion.h2>
          </div>
          <motion.p
            className="mx-auto mt-6 max-w-xl text-[16px] leading-7 text-text-muted"
            variants={body}
          >
            Five quiet steps preserve your existing email workflow while removing the
            repeated work of checking what matters.
          </motion.p>
        </RevealGroup>

        <div ref={progressRef}>
          {/*
            Connector fill + traveling dot are driven directly by scroll
            progress through this block (Motion System C) — no state, no
            "hasAnimated" flag. Scrolling up naturally reverses
            scrollYProgress, which reverses these transforms automatically.
            Disabled under reduced motion (fill renders complete, dot hidden).
          */}
          <div
            aria-hidden="true"
            className="relative mt-16 hidden h-px bg-primary/20 lg:block"
          >
            <motion.span
              className="absolute inset-y-0 left-0 origin-left bg-primary"
              style={{ scaleX: reducedMotion ? 1 : fillScaleX }}
            />
            {reducedMotion ? null : (
              <motion.span
                className="absolute -top-[3px] size-2 rounded-full bg-primary"
                style={{ left: dotLeft, opacity: dotOpacity }}
              />
            )}
          </div>

          <RevealGroup
            as="ol"
            className="mt-14 border-y border-border lg:mt-8 lg:grid lg:grid-cols-5"
            staggerChildren={0.09}
          >
            {steps.map((step) => (
              <motion.li
                className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 border-b border-border py-6 last:border-b-0 lg:block lg:min-h-[250px] lg:border-r lg:border-b-0 lg:px-5 lg:py-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                key={step.title}
                variants={staggerItem}
              >
                <div className="flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface text-primary">
                  <step.icon
                    aria-hidden="true"
                    className="size-[17px]"
                    strokeWidth={1.8}
                  />
                </div>
                <div className="lg:mt-12">
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-subtle">
                    Step {step.number}
                  </span>
                  <h3 className="mt-1.5 text-[15px] font-semibold leading-6 text-text">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-text-muted">
                    {step.description}
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
