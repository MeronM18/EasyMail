"use client";

import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
} from "@/components/marketing/motion";

const problems: Array<{ number: string; title: string; description: string }> = [
  {
    number: "01",
    title: "Multiple inboxes",
    description:
      "Work, personal, school, and side projects each live in their own tab and demand their own check.",
  },
  {
    number: "02",
    title: "One undifferentiated stream",
    description:
      "Replies, deadlines, receipts, and newsletters all arrive with the same visual weight: newest first.",
  },
  {
    number: "03",
    title: "Attention lost to checking",
    description:
      "You open every inbox just to learn whether anything today actually needs your judgment.",
  },
];

export function ProblemSection() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);
  return (
    <section className="marketing-dark-stage border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-28">
        <RevealGroup className="mx-auto max-w-4xl text-center">
          <div>
            <motion.p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
              variants={eyebrow}
            >
              The problem
            </motion.p>
            <motion.h2
              className="mx-auto mt-5 max-w-3xl text-[clamp(2.5rem,4.5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
              variants={headline}
            >
              <span className="block text-text">Your inboxes work fine.</span>
              <span className="block text-text-muted">
                Knowing what needs you doesn&apos;t.
              </span>
            </motion.h2>
          </div>
          <motion.p
            className="mx-auto mt-8 max-w-2xl text-[17px] leading-7 text-text-muted"
            variants={body}
          >
            Email is organized by account and arrival time. Your day is organized by
            consequences, commitments, and people waiting on you.
          </motion.p>
        </RevealGroup>

        <RevealGroup
          as="ol"
          className="mt-14 border-y border-border lg:mt-16 lg:grid lg:grid-cols-3"
          staggerChildren={0.1}
        >
          {problems.map((problem) => (
            <motion.li
              className="grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-b border-border py-7 last:border-b-0 lg:block lg:border-r lg:border-b-0 lg:px-8 lg:py-9 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              key={problem.number}
              variants={staggerItem}
            >
              <span className="font-mono text-[11px] text-text-subtle">
                {problem.number}
              </span>
              <div className="lg:mt-8">
                <h3 className="text-[16px] font-semibold leading-6 text-text">
                  {problem.title}
                </h3>
                <p className="mt-2 max-w-sm text-[14px] leading-6 text-text-muted">
                  {problem.description}
                </p>
              </div>
            </motion.li>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
