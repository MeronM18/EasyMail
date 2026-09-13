"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  EASE,
  motion,
  useRevealInView,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

/**
 * Hero has its own entrance system (Motion System A) — separate from the
 * repeatable viewport reveals used everywhere else, but built on the same
 * `useRevealInView` primitive so it replays if the Hero meaningfully leaves
 * and re-enters the viewport, exactly like every other section.
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

const heroBadgesVariants: Variants = {
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
  // should stay "entered" through ordinary top-of-page scroll wobble, and
  // only reset once it has genuinely left the viewport (not on tiny nudges).
  const { ref, inView } = useRevealInView({ amount: 0.35, margin: "-5% 0px -20% 0px" });
  const animate = inView ? "visible" : "hidden";

  const eyebrowVariants = useSafeVariants(heroEyebrowVariants);
  const wordContainerVariants = useSafeVariants(heroWordContainerVariants);
  const bodyVariants = useSafeVariants(heroBodyVariants);
  const ctaVariants = useSafeVariants(heroCtaVariants);
  const badgesVariants = useSafeVariants(heroBadgesVariants);

  return (
    <section className="relative overflow-hidden bg-[#FAFAFA]" ref={ref}>
      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-6 py-20 lg:min-h-[85vh] lg:px-8 lg:py-0 xl:w-[calc(100%-64px)] xl:max-w-[1280px] xl:px-10">
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
            className="mt-6 text-[clamp(2.75rem,6vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em] text-text"
            initial="hidden"
            variants={wordContainerVariants}
          >
            <HeroHeadlineLine text="Know what needs you." />
            <HeroHeadlineLine className="text-text-muted" text="Across every inbox." />
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
            className="mt-9"
            initial="hidden"
            variants={ctaVariants}
          >
            <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text-subtle">
              Connect your inbox
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="h-[50px] min-w-[200px] rounded-[8px] px-5">
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
                className="h-[50px] min-w-[210px] rounded-[8px] border-border bg-surface px-5 text-text shadow-none hover:bg-surface-hover"
                variant="outline"
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
            </div>
          </motion.div>

          <motion.div
            animate={animate}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-text-subtle"
            initial="hidden"
            variants={badgesVariants}
          >
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true">•</span>
              Read-only access
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true">•</span>
              Gmail supported
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true">•</span>
              Outlook supported
            </span>
          </motion.div>
        </div>
        <HeroArtwork animate={animate} />
      </div>
    </section>
  );
}
