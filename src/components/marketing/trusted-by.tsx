"use client";

import { AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  bodyVariants,
  EASE,
  headlineVariants,
  motion,
  RevealGroup,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

type Logo = {
  name: string;
  mark: ReactNode;
};

const subscribeNoop = () => () => {};

// True only after the client has hydrated. Unlike `useState` + a mount
// effect, this never calls a setter from inside an effect body (avoided
// react-hooks/set-state-in-effect) while still guaranteeing the server
// snapshot (false) and the client's first render agree.
function useHasMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function MarkFrame({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

const logoSets: Logo[][] = [
  [
    {
      name: "Google",
      mark: (
        <MarkFrame>
          <path
            d="M20.2 12.2c0-.65-.06-1.28-.17-1.88H12v3.56h4.59a3.92 3.92 0 0 1-1.7 2.57v2.31h2.75c1.61-1.49 2.56-3.68 2.56-6.56Z"
            fill="currentColor"
          />
          <path
            d="M12 20.5c2.3 0 4.23-.76 5.64-2.06l-2.75-2.31c-.76.51-1.74.81-2.89.81-2.22 0-4.1-1.5-4.77-3.52H4.39v2.39A8.52 8.52 0 0 0 12 20.5Z"
            fill="currentColor"
            opacity=".72"
          />
          <path
            d="M7.23 13.42A5.1 5.1 0 0 1 7 12c0-.49.08-.97.23-1.42V8.19H4.39A8.51 8.51 0 0 0 3.5 12c0 1.37.33 2.67.89 3.81l2.84-2.39Z"
            fill="currentColor"
            opacity=".5"
          />
          <path
            d="M12 7.06c1.25 0 2.37.43 3.25 1.27l2.45-2.45A8.2 8.2 0 0 0 12 3.5a8.52 8.52 0 0 0-7.61 4.69l2.84 2.39C7.9 8.56 9.78 7.06 12 7.06Z"
            fill="currentColor"
            opacity=".86"
          />
        </MarkFrame>
      ),
    },
    {
      name: "Microsoft",
      mark: (
        <MarkFrame>
          <path
            d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"
            fill="currentColor"
          />
        </MarkFrame>
      ),
    },
    {
      name: "OpenAI",
      mark: (
        <MarkFrame>
          <g fill="none" stroke="currentColor" strokeWidth="1.65">
            <path d="M12 3.25a4.12 4.12 0 0 1 4.02 3.18 4.12 4.12 0 0 1 1.99 7.02 4.12 4.12 0 0 1-6 4.67A4.12 4.12 0 0 1 5.98 15a4.12 4.12 0 0 1 0-7A4.12 4.12 0 0 1 12 3.25Z" />
            <path d="m8.3 8.15 3.7-2.1 3.7 2.1v4.2L12 14.5l-3.7-2.15Zm0 0 3.7 2.12 3.7-2.12M12 10.27v4.23" />
          </g>
        </MarkFrame>
      ),
    },
    {
      name: "Notion",
      mark: (
        <MarkFrame>
          <rect
            fill="none"
            height="18"
            rx="2.2"
            stroke="currentColor"
            strokeWidth="1.8"
            width="18"
            x="3"
            y="3"
          />
          <path
            d="M8 7.2v9.6M8 7.2l8 9.6M16 7.2v9.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </MarkFrame>
      ),
    },
  ],
  [
    {
      name: "Slack",
      mark: (
        <Image
          alt=""
          aria-hidden="true"
          className="size-5 shrink-0 grayscale"
          height={20}
          src="/hero/slack.svg"
          width={20}
        />
      ),
    },
    {
      name: "Stripe",
      mark: (
        <MarkFrame>
          <path
            d="M18.7 12.35c0-3.7-1.8-5.25-5.7-5.25-1.65 0-3.12.28-4.28.8v4.02c1.08-.5 2.45-.82 3.62-.82.96 0 1.31.25 1.31.67 0 .51-.62.71-1.72 1.1-1.82.64-3.15 1.58-3.15 3.69 0 2.53 1.95 3.94 5.17 3.94 1.72 0 3.35-.35 4.55-.94v-4.08c-1.23.64-2.57 1.02-3.75 1.02-.92 0-1.42-.23-1.42-.69 0-.49.57-.69 1.65-1.05 2.08-.7 3.72-1.55 3.72-3.41Z"
            fill="currentColor"
          />
        </MarkFrame>
      ),
    },
    {
      name: "GitHub",
      mark: (
        <MarkFrame>
          <path
            d="M12 2.7a9.5 9.5 0 0 0-3 18.52c.48.09.65-.21.65-.46v-1.85c-2.67.58-3.23-1.13-3.23-1.13-.44-1.11-1.07-1.4-1.07-1.4-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.47 2.25 1.05 2.8.8.09-.62.34-1.05.61-1.29-2.13-.24-4.37-1.06-4.37-4.73 0-1.05.37-1.9.99-2.57-.1-.24-.43-1.22.09-2.54 0 0 .8-.26 2.62.98A9.13 9.13 0 0 1 12 7.11a9 9 0 0 1 2.38.32c1.82-1.24 2.62-.98 2.62-.98.52 1.32.19 2.3.09 2.54.62.67.99 1.52.99 2.57 0 3.68-2.25 4.49-4.39 4.72.35.3.65.88.65 1.77v2.71c0 .25.18.55.66.46A9.5 9.5 0 0 0 12 2.7Z"
            fill="currentColor"
          />
        </MarkFrame>
      ),
    },
    {
      name: "Linear",
      mark: (
        <MarkFrame>
          <path
            d="M4.4 15.25A8.5 8.5 0 0 0 15.25 4.4L4.4 15.25Zm1.65 2.12A8.48 8.48 0 0 0 17.37 6.05L6.05 17.37Zm2.4 1.42A8.5 8.5 0 0 0 18.79 8.45L8.45 18.79ZM12 3.5a8.5 8.5 0 0 0-8.5 8.5c0 .45.04.89.1 1.32L13.32 3.6A8.8 8.8 0 0 0 12 3.5Z"
            fill="currentColor"
          />
        </MarkFrame>
      ),
    },
  ],
];

const logoSetVariants: Variants = {
  enter: { opacity: 0, y: 8, filter: "blur(6px)" },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    transition: { duration: 0.4, ease: EASE },
  },
};

function LogoSet({ logos }: { logos: Logo[] }) {
  return (
    <motion.ul
      animate="center"
      aria-label="Reference brands"
      className="absolute inset-0 grid grid-cols-2 content-center gap-x-8 gap-y-7 lg:grid-cols-4 lg:gap-x-12"
      exit="exit"
      initial="enter"
      variants={logoSetVariants}
    >
      {logos.map((logo) => (
        <li
          aria-label={logo.name}
          className="flex items-center justify-center gap-2.5 text-[16px] font-semibold tracking-[-0.02em] text-text-muted"
          key={logo.name}
          role="img"
        >
          {logo.mark}
          <span aria-hidden="true">{logo.name}</span>
        </li>
      ))}
    </motion.ul>
  );
}

export function TrustedBy() {
  const systemReducedMotion = useReducedMotion();
  // `useReducedMotion` reads the real matchMedia value synchronously on the
  // client's first render (not inside an effect), which would otherwise
  // make this branch disagree with the statically prerendered HTML for any
  // visitor who actually has reduced motion enabled. Gating on `hasMounted`
  // keeps the first client render identical to the server output — the
  // static/animated choice only takes effect after hydration commits, same
  // as the accepted pattern for other client-only media checks.
  const hasMounted = useHasMounted();
  const [activeSet, setActiveSet] = useState(0);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const showStatic = hasMounted && systemReducedMotion;

  useEffect(() => {
    if (systemReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveSet((current) => (current + 1) % logoSets.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [systemReducedMotion]);

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <RevealGroup className="mx-auto max-w-3xl text-center">
          <motion.h2
            className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-text"
            variants={headline}
          >
            Trusted by people who live in their inbox
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-[15px] leading-6 text-text-muted"
            variants={body}
          >
            Built for people managing work, school, and everything in between.
          </motion.p>
          <motion.div
            className="relative mt-10 h-[116px] w-full overflow-hidden lg:h-[64px]"
            variants={body}
          >
            {showStatic ? (
              <ul
                aria-label="Reference brands"
                className="absolute inset-0 grid grid-cols-2 content-center gap-x-8 gap-y-7 lg:grid-cols-4 lg:gap-x-12"
              >
                {logoSets[0].map((logo) => (
                  <li
                    aria-label={logo.name}
                    className="flex items-center justify-center gap-2.5 text-[16px] font-semibold tracking-[-0.02em] text-text-muted"
                    key={logo.name}
                    role="img"
                  >
                    {logo.mark}
                    <span aria-hidden="true">{logo.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <AnimatePresence initial={false} mode="wait">
                <LogoSet key={activeSet} logos={logoSets[activeSet]} />
              </AnimatePresence>
            )}
          </motion.div>
        </RevealGroup>
      </div>
    </section>
  );
}
