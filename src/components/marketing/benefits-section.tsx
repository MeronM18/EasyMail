"use client";

import { Clock, Layers, MailCheck, Target, type LucideIcon } from "lucide-react";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
} from "@/components/marketing/motion";

/**
 * Outcome-oriented companion to ProblemSection: where that section names
 * the problem, this names what changes for the reader. Deliberately light
 * (no illustration, no cards) — a short strip, not a competing section.
 */

const benefits: Array<{ icon: LucideIcon; text: string }> = [
  { icon: MailCheck, text: "Stop checking five inboxes just to find nothing urgent." },
  { icon: Target, text: "Get to the messages that actually need you, first." },
  { icon: Clock, text: "Spend minutes on email, not the whole morning." },
  { icon: Layers, text: "Keep work, school, and personal inboxes under one calm view." },
];

export function BenefitsSection() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <RevealGroup className="mx-auto max-w-2xl text-center">
          <motion.p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
            variants={eyebrow}
          >
            Why it helps
          </motion.p>
          <motion.h2
            className="mx-auto mt-5 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-text"
            variants={headline}
          >
            What changes once EasyMail is running.
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 text-[15px] leading-6 text-text-muted"
            variants={body}
          >
            Less time spent checking. More certainty about what actually needs you.
          </motion.p>
        </RevealGroup>

        <RevealGroup
          as="div"
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6"
          staggerChildren={0.08}
        >
          {benefits.map((benefit) => (
            <motion.div
              className="flex flex-col items-center gap-3 text-center"
              key={benefit.text}
              variants={staggerItem}
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-primary">
                <benefit.icon
                  aria-hidden="true"
                  className="size-[18px]"
                  strokeWidth={1.8}
                />
              </span>
              <p className="max-w-[220px] text-[14px] leading-6 text-text-muted">
                {benefit.text}
              </p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
