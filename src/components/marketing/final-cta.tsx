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
 * Decorative dashed frame lines (structural reference: "CTA With Dashed
 * Grid Lines" — repeating-gradient dashes, masked to fade toward the
 * middle of each edge, extending past the container via a negative
 * offset). Purely atmospheric — aria-hidden, no content.
 */
function GridLineHorizontal({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 h-px w-[calc(100%+80px)] -translate-x-1/2 ${
        position === "top" ? "top-0" : "bottom-0"
      }`}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--border-strong) 50%, transparent 50%)",
        backgroundSize: "10px 1px",
        maskImage:
          "linear-gradient(to right, black, transparent 42%, transparent 58%, black)",
        WebkitMaskImage:
          "linear-gradient(to right, black, transparent 42%, transparent 58%, black)",
      }}
    />
  );
}

function GridLineVertical({ position }: { position: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 h-[calc(100%+56px)] w-px -translate-y-1/2 ${
        position === "left" ? "left-0" : "right-0"
      }`}
      style={{
        backgroundImage:
          "linear-gradient(to bottom, var(--border-strong) 50%, transparent 50%)",
        backgroundSize: "1px 10px",
        maskImage:
          "linear-gradient(to bottom, black, transparent 42%, transparent 58%, black)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black, transparent 42%, transparent 58%, black)",
      }}
    />
  );
}

export function FinalCta() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const cta = useSafeVariants(ctaVariants);
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <RevealGroup
          as="div"
          className="relative grid gap-12 overflow-hidden rounded-[16px] border border-border bg-surface/60 px-8 py-14 lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:px-14 lg:py-16"
        >
          <GridLineHorizontal position="top" />
          <GridLineHorizontal position="bottom" />
          <GridLineVertical position="left" />
          <GridLineVertical position="right" />

          <div>
            <motion.p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
              variants={eyebrow}
            >
              Connect your inbox
            </motion.p>
            <motion.h2
              className="mt-5 max-w-lg text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text"
              variants={headline}
            >
              Stop guessing <span className="text-primary">what needs you</span>.
            </motion.h2>
            <motion.p
              className="mt-5 max-w-md text-[16px] leading-7 text-text-muted"
              variants={body}
            >
              Connect Gmail or Outlook, get one focused recap, and keep your judgment as
              the final word on every message.
            </motion.p>
            <motion.div className="mt-8 flex flex-wrap items-center gap-3" variants={cta}>
              <Button
                asChild
                className="h-[48px] rounded-[8px] bg-[linear-gradient(to_bottom,var(--primary),color-mix(in_oklab,var(--primary)_85%,black))] px-5 text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_24px_rgba(31,95,169,0.28)] hover:brightness-110"
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
              <Button asChild className="h-[48px] rounded-[8px] px-5" variant="outline">
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
              className="mt-5 font-mono text-[10px] uppercase tracking-[0.06em] text-text-subtle"
              variants={cta}
            >
              Read-only access · No sending · No mailbox modification
            </motion.p>
          </div>

          <div className="border-t border-dashed border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <p className="text-[19px] leading-8 font-medium text-text">
              Read-only, always. EasyMail never sends, deletes, or archives anything on
              your behalf.
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-text-subtle">
              How EasyMail works
            </p>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
