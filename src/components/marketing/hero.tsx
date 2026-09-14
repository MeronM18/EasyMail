"use client";

import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EASE,
  motion,
  useRevealInView,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

/**
 * Hero has its own entrance system (Motion System A) — separate from the
 * standard viewport reveals used everywhere else, but built on the same
 * `useRevealInView` primitive, so it reveals once on first entry and then
 * stays visible, exactly like every other section.
 */

const heroEyebrowVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, delay: 0.05 } },
};

// Container for the headline's words — staggers its children (see
// HeroHeadlineLine below), not a translate/opacity target itself.
const heroWordContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.18 } },
};

const heroWordVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

const heroBodyVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: 0.42 } },
};

const heroCtaVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: 0.52 } },
};

const heroFormVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.62 } },
};

const heroArtworkVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.965 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASE, delay: 0.32 },
  },
};

// Masked word-by-word reveal — never a literal typewriter/character reveal.
// Each word is wrapped in its own overflow-hidden mask so only the word
// itself slides/blurs into place; natural line wrapping is untouched since
// each mask stays inline-block at the word's own intrinsic size.
function HeroHeadlineLine({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  const wordVariants = useSafeVariants(heroWordVariants);
  return (
    <span className={className ? `block ${className}` : "block"}>
      {words.map((word, index) => (
        <span className="inline-block overflow-hidden" key={`${word}-${index}`}>
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function HeroArtwork({ animate }: { animate: "visible" | "hidden" }) {
  const variants = useSafeVariants(heroArtworkVariants);
  return (
    <motion.div
      animate={animate}
      className="pointer-events-none mt-10 flex w-full items-center justify-center xl:absolute xl:inset-y-0 xl:left-1/2 xl:mt-0 xl:w-auto xl:translate-x-[clamp(1.5rem,calc(16.25vw-11.5rem),3.125rem)] xl:justify-start"
      initial="hidden"
      variants={variants}
    >
      <Image
        alt="Gmail, Outlook, Yahoo, and IMAP messages flowing into an EasyMail attention recap"
        className="h-auto w-full max-w-[680px] object-contain xl:w-[45.5vw] xl:max-w-[655px] xl:shrink-0"
        height={973}
        priority
        sizes="(min-width: 1440px) 655px, (min-width: 1280px) 45.5vw, (min-width: 640px) 680px, calc(100vw - 48px)"
        src="/hero/herorightimage-cropped.png"
        unoptimized
        width={1305}
      />
    </motion.div>
  );
}

export function Hero() {
  // A larger amount + shallower margin than the standard reveal: the Hero
  // is in view on first load almost by definition, so this just avoids the
  // one-shot entrance firing on a sub-pixel layout/hydration wobble.
  const { ref, inView } = useRevealInView({ amount: 0.35, margin: "-5% 0px -20% 0px" });
  const animate = inView ? "visible" : "hidden";

  const eyebrowVariants = useSafeVariants(heroEyebrowVariants);
  const wordContainerVariants = useSafeVariants(heroWordContainerVariants);
  const bodyVariants = useSafeVariants(heroBodyVariants);
  const ctaVariants = useSafeVariants(heroCtaVariants);
  const formVariants = useSafeVariants(heroFormVariants);

  return (
    <section
      className="relative flex flex-1 flex-col overflow-hidden bg-[#FAFAFA]"
      ref={ref}
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-20 lg:px-8 lg:py-0 xl:w-[calc(100%-64px)] xl:max-w-[1280px] xl:px-10">
        <div className="max-w-xl">
          <motion.span
            animate={animate}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-text-subtle"
            initial="hidden"
            variants={eyebrowVariants}
          >
            <span
              aria-hidden="true"
              className="animate-dot-fade-snap size-1.5 rounded-full bg-primary"
            />
            The attention layer for email
          </motion.span>

          <motion.h1
            animate={animate}
            className="mt-3 text-[clamp(2.5rem,5.25vw,5.25rem)] font-bold leading-[0.95] tracking-[-0.02em] text-text"
            initial="hidden"
            variants={wordContainerVariants}
          >
            <HeroHeadlineLine text="Know what needs you." />
            <HeroHeadlineLine className="text-primary" text="Across every inbox." />
          </motion.h1>

          <motion.p
            animate={animate}
            className="mt-6 max-w-xl text-[17px] leading-7 text-text-muted"
            initial="hidden"
            variants={bodyVariants}
          >
            EasyMail turns your inbox into one focused recap of what needs a reply, what
            needs action, what matters, and what can wait.
          </motion.p>

          <motion.div
            animate={animate}
            className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]"
            initial="hidden"
            variants={ctaVariants}
          >
            <span className="inline-flex items-center gap-2 font-medium text-text">
              <Image
                alt=""
                aria-hidden="true"
                height={16}
                src="/hero/gmail.svg"
                width={20}
              />
              Gmail
            </span>
            <span className="inline-flex items-center gap-2 font-medium text-text">
              <Image
                alt=""
                aria-hidden="true"
                height={20}
                src="/hero/outlook.svg"
                width={20}
              />
              Outlook
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-border" />
            <span className="text-text-subtle">Both available now.</span>
          </motion.div>

          <motion.form
            animate={animate}
            className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial="hidden"
            onSubmit={(event) => event.preventDefault()}
            variants={formVariants}
          >
            <div className="relative sm:w-[300px]">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-subtle"
              />
              <Input
                className="h-[50px] rounded-full pl-10 text-[14px]"
                name="email"
                placeholder="Enter your email to get early access"
                type="email"
              />
            </div>
            <Button
              className="h-[50px] shrink-0 rounded-full bg-text px-5 text-background hover:bg-text/90 active:bg-text/90"
              type="submit"
            >
              Get early access
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </motion.form>
        </div>
        <HeroArtwork animate={animate} />
      </div>
    </section>
  );
}
