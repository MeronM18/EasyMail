"use client";

import { ArrowUpRight, Inbox, SlidersHorizontal } from "lucide-react";
import { useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { IntentLabel } from "@/components/app/intent-label";
import { intents, intentMeta } from "@/lib/intent";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  Reveal,
  RevealGroup,
  useSafeVariants,
} from "@/components/marketing/motion";

const recapRows = [
  {
    sender: "Priya Nair",
    subject: "Can you review the launch brief before Friday?",
    account: "Personal · Gmail",
    time: "9:14 AM",
    intent: "needs_reply" as const,
  },
  {
    sender: "Finance Operations",
    subject: "Receipt needed for August expense report",
    account: "Work · Outlook",
    time: "8:47 AM",
    intent: "needs_action" as const,
  },
  {
    sender: "University Registrar",
    subject: "Fall schedule has been finalized",
    account: "School · Gmail",
    time: "Yesterday",
    intent: "matters" as const,
  },
];

function RecapCopy() {
  return (
    <div>
      <span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-border bg-background text-primary">
        <Inbox aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
      </span>
      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.08em] text-text-subtle">
        Recap first
      </p>
      <h3 className="mt-2 text-[28px] font-semibold leading-8 tracking-[-0.02em] text-text">
        One calm view before any inbox.
      </h3>
      <p className="mt-4 max-w-md text-[14px] leading-6 text-text-muted">
        Gmail and Outlook are available today. Both feed the same intent model without
        turning EasyMail into another email client.
      </p>
      <p className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-primary">
        Open the original message only when needed
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </p>
    </div>
  );
}

function TriageCopy() {
  return (
    <div>
      <span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-border bg-background text-primary">
        <SlidersHorizontal aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
      </span>
      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.08em] text-text-subtle">
        Intent over chronology
      </p>
      <h3 className="mt-2 text-[28px] font-semibold leading-8 tracking-[-0.02em] text-text">
        Triage by what the message asks of you.
      </h3>
      <p className="mt-4 max-w-md text-[14px] leading-6 text-text-muted">
        Five stable categories replace inbox archaeology. Correct a classification
        whenever your judgment differs, and your choice stays in control.
      </p>
    </div>
  );
}

function RecapVisual() {
  return (
    <div className="marketing-float overflow-hidden rounded-[10px] border border-border-strong bg-background shadow-[0_16px_40px_rgba(18,18,18,0.07)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-subtle">
            Since last visit
          </p>
          <p className="mt-1 text-[14px] font-semibold text-text">Needs you now</p>
        </div>
        <span className="rounded-[var(--radius-sm)] border border-primary/20 bg-primary-subtle px-2 py-1 font-mono text-[10px] text-primary">
          3 messages
        </span>
      </div>
      <ul className="divide-y divide-border bg-surface">
        {recapRows.map((row) => (
          <li
            className="grid gap-2 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
            key={row.subject}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-[12px] font-medium text-text">{row.sender}</p>
                <span className="font-mono text-[9px] text-text-subtle">{row.time}</span>
              </div>
              <p className="mt-1 truncate text-[13px] font-medium text-text">
                {row.subject}
              </p>
              <p className="mt-0.5 text-[11px] text-text-subtle">{row.account}</p>
            </div>
            <IntentLabel className="shrink-0" intent={row.intent} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TriageVisual() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-border-strong bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-subtle">
          Triage by intent
        </p>
      </div>
      <ul className="divide-y divide-border bg-surface">
        {intents.map((intent, index) => (
          <li
            className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5"
            key={intent}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-mono text-[10px] text-text-subtle">0{index + 1}</span>
              <span className="text-[13px] font-medium text-text">
                {intentMeta[intent].label}
              </span>
            </div>
            <IntentLabel intent={intent} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChromeFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mt-16 overflow-hidden rounded-[10px] border border-border-strong bg-surface shadow-[0_24px_60px_rgba(18,18,18,0.07)] lg:mt-20">
      <div className="flex h-11 items-center justify-between border-b border-border bg-[#F5F7F9] px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#FF605C]" />
            <span className="size-2.5 rounded-full bg-[#FFBD44]" />
            <span className="size-2.5 rounded-full bg-[#00CA4E]" />
          </span>
          <span className="font-mono text-[10px] text-text-subtle">
            EasyMail · Product tour
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-text-subtle">
          Gmail + Outlook
        </span>
      </div>
      <div className="flex items-center gap-6 border-b border-border px-5 sm:px-7">
        <span className="border-b-2 border-primary py-4 text-[12px] font-medium text-text">
          Recap
        </span>
        <span className="py-4 text-[12px] text-text-subtle">Triage</span>
        <span className="py-4 text-[12px] text-text-subtle">Corrections</span>
      </div>
      {children}
    </div>
  );
}

/**
 * Manual scroll-progress: 0 when the target's top reaches the viewport top,
 * 1 when its bottom reaches the viewport bottom — the same semantics as
 * Framer's `useScroll({offset: ["start start", "end end"]})`, computed by
 * hand because that built-in tracking was observed to freeze partway
 * through a tall target with a `position: sticky` child (confirmed via
 * direct inline-style inspection: the derived motion values stopped
 * updating well before the target's actual scroll range ended). A plain
 * passive scroll/resize listener setting a MotionValue directly avoids
 * React re-renders per frame and has none of that failure mode.
 */
function useManualScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);

  useEffect(() => {
    function update() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        progress.set(rect.top <= 0 ? 1 : 0);
        return;
      }
      const raw = -rect.top / total;
      progress.set(Math.min(1, Math.max(0, raw)));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, progress]);

  return progress;
}

/**
 * Desktop-only sticky product storytelling (Motion System C): the product
 * window stays visually anchored while scroll progress through this tall
 * wrapper crossfades/translates between the Recap and Triage states.
 * Progress is the only driver — no "hasAnimated" flag — so scrolling
 * backward reverses the progression exactly like scrolling forward
 * advances it. Hidden entirely under reduced motion or below `lg` via
 * `motion-reduce:hidden`/`lg:hidden` — StackedFeatureStory covers both.
 */
function StickyFeatureStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useManualScrollProgress(wrapperRef);

  // A wide crossfade left both blocks of text readable-but-competing at
  // once (muddy double exposure). Narrowing the blend window to a brief
  // stretch of scroll, paired with a real vertical displacement, reads as a
  // clean handoff instead — most of the scroll range shows one state
  // clearly, with only a quick blend at the middle.
  const recapOpacity = useTransform(scrollYProgress, [0.47, 0.53], [1, 0]);
  const recapY = useTransform(scrollYProgress, [0.47, 0.53], [0, -22]);
  const triageOpacity = useTransform(scrollYProgress, [0.47, 0.53], [0, 1]);
  const triageY = useTransform(scrollYProgress, [0.47, 0.53], [22, 0]);

  return (
    <div
      className="relative hidden lg:block lg:motion-reduce:hidden"
      ref={wrapperRef}
      style={{ height: "185vh" }}
    >
      <div className="sticky top-[14vh]">
        <ChromeFrame>
          <div className="grid gap-16 px-7 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="relative min-h-[230px]">
              <motion.div
                className="absolute inset-0"
                style={{ opacity: recapOpacity, y: recapY }}
              >
                <RecapCopy />
              </motion.div>
              <motion.div
                className="absolute inset-0"
                style={{ opacity: triageOpacity, y: triageY }}
              >
                <TriageCopy />
              </motion.div>
            </div>
            <div className="relative min-h-[360px]">
              <motion.div
                className="absolute inset-0"
                style={{ opacity: recapOpacity, y: recapY }}
              >
                <RecapVisual />
              </motion.div>
              <motion.div
                className="absolute inset-0"
                style={{ opacity: triageOpacity, y: triageY }}
              >
                <TriageVisual />
              </motion.div>
            </div>
          </div>
        </ChromeFrame>
      </div>
    </div>
  );
}

/**
 * Mobile/tablet AND reduced-motion fallback: the same two states in normal
 * document flow, each with a standard repeatable entrance reveal — no
 * sticky mechanics, no scroll-progress dependency, same storytelling order.
 */
function StackedFeatureStory() {
  return (
    <div className="block lg:hidden lg:motion-reduce:block">
      <ChromeFrame>
        <Reveal
          as="div"
          className="grid gap-10 px-5 py-10 sm:px-7 sm:py-12"
          kind="visual"
        >
          <RecapCopy />
          <div className="mt-2">
            <RecapVisual />
          </div>
        </Reveal>
        <Reveal
          as="div"
          className="grid gap-10 border-t border-border px-5 py-10 sm:px-7 sm:py-12"
          kind="visual"
        >
          <TriageCopy />
          <div className="mt-2">
            <TriageVisual />
          </div>
        </Reveal>
      </ChromeFrame>
    </div>
  );
}

export function FeatureShowcase() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  return (
    <section className="border-b border-border bg-surface" id="features">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <RevealGroup className="ml-auto max-w-3xl lg:text-right">
          <motion.p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
            variants={eyebrow}
          >
            Product
          </motion.p>
          <motion.h2
            className="mt-5 text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[1] tracking-[-0.03em] text-text"
            variants={headline}
          >
            Built around one question:
            <span className="block text-text-muted">what needs you?</span>
          </motion.h2>
          <motion.p
            className="mt-6 ml-auto max-w-xl text-[17px] leading-7 text-text-muted"
            variants={body}
          >
            EasyMail is not another place to manage email. It is the attention layer that
            tells you where to look next.
          </motion.p>
        </RevealGroup>

        <StickyFeatureStory />
        <StackedFeatureStory />
      </div>
    </section>
  );
}
