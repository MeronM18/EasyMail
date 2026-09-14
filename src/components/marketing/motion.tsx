"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type UseInViewOptions,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Pre-created at module scope on purpose — calling `motion(tag)` inside a
// component body would produce a new component type every render, which
// React would then remount (destroying animation/children state) instead of
// updating in place.
const motionTags = {
  div: motion.div,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  ul: motion.ul,
  li: motion.li,
  ol: motion.ol,
} as const;

type MotionTag = keyof typeof motionTags;

/**
 * Shared motion language for the landing page (Linear-precision / Attio-pacing):
 * one easing curve, one set of entrance presets, and one shared
 * viewport-intersection hook used everywhere instead of one-off
 * IntersectionObservers. Every standard section reveal fires once on first
 * entry and then stays visible — it never resets or replays on scroll-away
 * / scroll-back. This is separate from the scroll-linked mechanics
 * (FeatureShowcase's sticky Recap/Triage crossfade, HowItWorks' connector),
 * which track continuous scroll position directly and are unaffected by
 * this hook.
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealInViewOptions = {
  amount?: UseInViewOptions["amount"];
  margin?: UseInViewOptions["margin"];
};

/** One-shot viewport intersection — reveals once, then stays visible. */
export function useRevealInView(options?: RevealInViewOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: options?.amount ?? 0.3,
    // Shrinks the effective viewport on both edges so entry requires a
    // meaningful crossing rather than toggling right at the pixel edge.
    margin: options?.margin ?? "-10% 0px -12% 0px",
  });
  return { ref, inView };
}

/** Reduced-motion users get the finished state immediately — no transform, no delay. */
const instantVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

export function useSafeVariants(variants: Variants): Variants {
  const reduced = useReducedMotion();
  return reduced ? instantVariants : variants;
}

export const eyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const headlineVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

export const bodyVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.1 } },
};

export const visualVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: EASE, delay: 0.15 },
  },
};

/** Parent container for a staggered list of same-shape children. */
export const staggerListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

type RevealKind = "eyebrow" | "headline" | "body" | "visual";

const kindVariants: Record<RevealKind, Variants> = {
  eyebrow: eyebrowVariants,
  headline: headlineVariants,
  body: bodyVariants,
  visual: visualVariants,
};

/**
 * Generic one-shot entrance reveal for a single element. For sections that
 * need eyebrow -> headline -> body -> visual hierarchy, wrap them in a
 * `RevealGroup` and give each a `kind` so they all react to one shared
 * viewport state instead of independent observers (this is what prevents
 * inconsistent per-element reveal timing near the viewport boundary).
 */
export function Reveal({
  children,
  className,
  kind = "body",
  as = "div",
  amount,
  margin,
}: {
  children: ReactNode;
  className?: string;
  kind?: RevealKind;
  as?: MotionTag;
} & RevealInViewOptions) {
  const { ref, inView } = useRevealInView({ amount, margin });
  const variants = useSafeVariants(kindVariants[kind]);
  // All motionTags entries accept the same core motion props (variants,
  // initial, animate, className, children, ref-to-HTMLElement) — this cast
  // only resolves TypeScript's inability to narrow a union of Framer
  // component types from a runtime-only `as` value; it changes no runtime
  // behavior.
  const Component = motionTags[as] as unknown as typeof motion.div;

  return (
    <Component
      animate={inView ? "visible" : "hidden"}
      className={className}
      initial="hidden"
      ref={ref}
      variants={variants}
    >
      {children}
    </Component>
  );
}

/**
 * Orchestrates a group of `Reveal`-shaped children off ONE shared viewport
 * state (one observer, not one per child) so eyebrow/headline/body/visual
 * always reveal together, in order, the first time the section enters view —
 * then stay visible for the rest of the page session.
 * Children should be `motion.*` elements using `variants={kindVariants[...]}`
 * — Framer propagates this container's animate state to them automatically.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
  amount,
  margin,
  staggerChildren = 0.09,
  delayChildren = 0.03,
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  staggerChildren?: number;
  delayChildren?: number;
} & RevealInViewOptions) {
  const { ref, inView } = useRevealInView({ amount, margin });
  const groupVariants = useSafeVariants({
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  });
  const Component = motionTags[as] as unknown as typeof motion.div;

  return (
    <Component
      animate={inView ? "visible" : "hidden"}
      className={className}
      initial="hidden"
      ref={ref}
      variants={groupVariants}
    >
      {children}
    </Component>
  );
}

export { motion, cn };
export type { Variants };
