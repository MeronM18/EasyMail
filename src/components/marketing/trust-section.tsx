"use client";

import { ArrowRight, MousePointerClick, RotateCcw } from "lucide-react";
import { IntentLabel } from "@/components/app/intent-label";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  Reveal,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

const noteVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 } },
};

// Starts a beat after the card itself settles in, so the correction states
// read as a sequence rather than appearing with the card all at once.
const correctionRowVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.35 } },
};

export function TrustSection() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const note = useSafeVariants(noteVariants);
  const correctionRow = useSafeVariants(correctionRowVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);
  return (
    <section className="border-b border-border bg-[#F2F7FC]">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <RevealGroup className="mx-auto max-w-3xl text-center">
          <motion.p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
            variants={eyebrow}
          >
            Your judgment wins
          </motion.p>
          <motion.h2
            className="mx-auto mt-5 max-w-3xl text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[1] tracking-[-0.03em] text-text"
            variants={headline}
          >
            The model suggests.
            <span className="block text-text-muted">You decide.</span>
          </motion.h2>
          <motion.p
            className="mx-auto mt-6 max-w-xl text-[16px] leading-7 text-text-muted"
            variants={body}
          >
            Classification is a starting point, not a verdict. Correct any message and
            EasyMail keeps your decision in control on every future sync.
          </motion.p>

          <motion.div
            className="mx-auto mt-10 flex max-w-xl items-start gap-3 border-t text-left border-border pt-5"
            variants={note}
          >
            <RotateCcw
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
            <p className="text-[12px] leading-5 text-text-muted">
              Reclassification can update the model suggestion. It cannot overwrite your
              explicit correction.
            </p>
          </motion.div>
        </RevealGroup>

        <Reveal
          className="marketing-float mx-auto mt-14 max-w-5xl overflow-hidden rounded-[10px] border border-border-strong bg-surface shadow-[0_18px_48px_rgba(18,18,18,0.08)]"
          kind="visual"
        >
          <div className="flex items-center justify-between border-b border-border bg-surface-muted/60 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#FF605C]" />
                <span className="size-2.5 rounded-full bg-[#FFBD44]" />
                <span className="size-2.5 rounded-full bg-[#00CA4E]" />
              </span>
              <span className="font-mono text-[10px] text-text-subtle">
                EasyMail · Message
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-text-subtle">
              Correction history on
            </span>
          </div>

          <div className="p-5 sm:p-7">
            <div className="border-b border-border pb-5">
              <p className="text-[12px] font-medium text-text">Promo Deals</p>
              <h3 className="mt-1 text-[17px] font-semibold leading-6 text-text">
                Still interested? Everything&apos;s 40% off
              </h3>
              <p className="mt-1 text-[11px] text-text-subtle">
                Personal · Gmail · Today, 8:04 AM
              </p>
            </div>

            <motion.div
              className="grid gap-5 py-6 sm:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] sm:items-center"
              variants={correctionRow}
            >
              <motion.div variants={staggerItem}>
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-subtle">
                  Model suggested
                </span>
                <div className="mt-2.5">
                  <IntentLabel className="opacity-60" full intent="cleanup_candidate" />
                </div>
              </motion.div>
              <motion.div variants={staggerItem}>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 rotate-90 text-text-subtle sm:rotate-0"
                />
              </motion.div>
              <motion.div
                className="rounded-[var(--radius-md)] border border-primary/25 bg-primary-subtle px-3.5 py-3"
                variants={staggerItem}
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-primary">
                  <MousePointerClick aria-hidden="true" className="size-3" />
                  You corrected to
                </span>
                <div className="mt-2">
                  <IntentLabel full intent="needs_action" />
                </div>
              </motion.div>
            </motion.div>

            <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
              <p className="text-[12px] leading-5 text-text-muted">
                Your correction is permanent.
              </p>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.06em] text-primary">
                Override protected
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
