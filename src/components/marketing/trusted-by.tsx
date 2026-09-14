"use client";

import {
  eyebrowVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

/**
 * Visual/reference trust strip only — these names are not customers,
 * partners, or integrations. Wording stays exactly "Trusted by people who
 * live in their inbox" per product-owner instruction; never "used by" or
 * "trusted by companies". Marks below are simple, monochrome, original
 * silhouettes (not reproductions of each company's trademarked artwork),
 * kept deliberately subdued and low-contrast.
 */

function GoogleMark() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8h4.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
    >
      <rect height="6.5" width="6.5" x="1" y="1" />
      <rect height="6.5" width="6.5" x="8.5" y="1" />
      <rect height="6.5" width="6.5" x="1" y="8.5" />
      <rect height="6.5" width="6.5" x="8.5" y="8.5" />
    </svg>
  );
}

function OpenAiMark() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M8 1.3 14 4.9v6.2L8 14.7 2 10.9V4.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="8" cy="8" r="2.1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function NotionMark() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <rect
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        width="13"
        x="1.5"
        y="1.5"
      />
      <path
        d="M5.2 4.6v6.8M5.2 4.6l5.6 6.8M10.8 4.6v6.8"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function StripeMark() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <rect
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
        width="13"
        x="1.5"
        y="1.5"
      />
      <path
        d="M10.5 6.1c0-.9-.9-1.4-2.3-1.4-1.5 0-2.5.6-2.5 1.7 0 2.4 5 1.2 5 4.1 0 1.2-1.2 1.9-2.7 1.9-1.4 0-2.5-.6-2.7-1.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

const trustedMarks: Array<{ name: string; Icon?: () => React.JSX.Element }> = [
  { name: "Google", Icon: GoogleMark },
  { name: "Microsoft", Icon: MicrosoftMark },
  { name: "OpenAI", Icon: OpenAiMark },
  { name: "Notion", Icon: NotionMark },
  { name: "Stripe", Icon: StripeMark },
  { name: "and more" },
];

const nameRowVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export function TrustedBy() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const nameRow = useSafeVariants(nameRowVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
        <RevealGroup
          className="flex flex-col items-center text-center"
          staggerChildren={0.08}
        >
          <motion.p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text-subtle"
            variants={eyebrow}
          >
            Trusted by people who live in their inbox
          </motion.p>
          <motion.div
            className="mt-7 flex flex-wrap items-center justify-center gap-x-11 gap-y-4"
            variants={nameRow}
          >
            {trustedMarks.map(({ name, Icon }) => (
              <motion.span
                className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-text-subtle"
                key={name}
                variants={staggerItem}
              >
                {Icon ? <Icon /> : null}
                {name}
              </motion.span>
            ))}
          </motion.div>
        </RevealGroup>
      </div>
    </section>
  );
}
