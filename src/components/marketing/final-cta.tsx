"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  RevealGroup,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.2 } },
};

/**
 * Side "context" panels — original abstract line-art (an envelope motif,
 * a focus-ring motif), not screenshots or stock imagery. Deliberately
 * muted and hidden below `lg` so they read as atmosphere around the
 * bright center card rather than competing with it.
 */

function EnvelopeTile() {
  return (
    <div className="relative hidden h-full min-h-[360px] items-center justify-center overflow-hidden rounded-[20px] border border-border bg-surface lg:flex">
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:26px_26px] opacity-50"
      />
      <svg
        aria-hidden="true"
        className="relative size-28 text-primary/70"
        fill="none"
        viewBox="0 0 96 96"
      >
        <rect
          height="56"
          rx="10"
          stroke="currentColor"
          strokeWidth="3"
          width="80"
          x="8"
          y="20"
        />
        <path d="M12 24 48 54 84 24" stroke="currentColor" strokeWidth="3" />
      </svg>
    </div>
  );
}

function FocusTile() {
  return (
    <div className="relative hidden h-full min-h-[360px] items-center justify-center overflow-hidden rounded-[20px] border border-border bg-surface lg:flex">
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:26px_26px] opacity-50"
      />
      <svg
        aria-hidden="true"
        className="relative size-28 text-primary/70"
        fill="none"
        viewBox="0 0 96 96"
      >
        <circle
          cx="48"
          cy="48"
          opacity="0.35"
          r="40"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle
          cx="48"
          cy="48"
          opacity="0.65"
          r="26"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="48" cy="48" fill="currentColor" r="7" />
      </svg>
    </div>
  );
}

export function FinalCta() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const cta = useSafeVariants(ctaVariants);
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-6xl items-stretch gap-6 px-6 py-20 lg:grid-cols-[1fr_minmax(0,620px)_1fr] lg:px-8 lg:py-24">
        <EnvelopeTile />

        <RevealGroup
          as="div"
          className="rounded-[20px] bg-primary px-8 py-14 text-center shadow-[0_24px_60px_rgba(31,95,169,0.28)] sm:px-14 sm:py-16"
        >
          <motion.p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary-foreground/65"
            variants={eyebrow}
          >
            Connect your inbox
          </motion.p>
          <motion.h2
            className="mx-auto mt-5 max-w-md text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-primary-foreground"
            variants={headline}
          >
            Stop guessing what needs you.
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 max-w-sm text-[15px] leading-7 text-primary-foreground/78"
            variants={body}
          >
            Connect Gmail or Outlook, get one focused recap, and keep your judgment as the
            final word on every message.
          </motion.p>
          <motion.div
            className="mx-auto mt-7 flex max-w-sm flex-col gap-3"
            variants={cta}
          >
            <Button
              asChild
              className="h-[50px] rounded-[8px] bg-background px-5 text-text shadow-none hover:bg-surface-hover"
            >
              <Link href="/sign-up">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={15}
                  src="/hero/gmail.svg"
                  width={20}
                />
                Continue with Gmail
              </Link>
            </Button>
            <Button
              asChild
              className="h-[50px] rounded-[8px] border border-white/35 bg-transparent px-5 text-white shadow-none hover:bg-white/10"
            >
              <Link href="/sign-up">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={20}
                  src="/hero/outlook.svg"
                  width={20}
                />
                Continue with Outlook
              </Link>
            </Button>
          </motion.div>
          <motion.p
            className="mt-5 font-mono text-[10px] uppercase tracking-[0.06em] text-primary-foreground/55"
            variants={cta}
          >
            Read-only access · No sending · No mailbox modification
          </motion.p>
        </RevealGroup>

        <FocusTile />
      </div>
    </section>
  );
}
