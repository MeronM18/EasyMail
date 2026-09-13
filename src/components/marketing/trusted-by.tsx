"use client";

import {
  eyebrowVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

// Visual/reference trust strip only — these names are not customers,
// partners, or integrations. Wording stays exactly "Trusted by people who
// live in their inbox" per product-owner instruction; never "used by" or
// "trusted by companies".
const trustedNames = ["Google", "Microsoft", "OpenAI", "Notion", "Stripe", "and more"];

const nameRowVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export function TrustedBy() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const nameRow = useSafeVariants(nameRowVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-14">
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
            className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
            variants={nameRow}
          >
            {trustedNames.map((name) => (
              <motion.span
                className="text-[15px] font-semibold tracking-[-0.01em] text-text-subtle"
                key={name}
                variants={staggerItem}
              >
                {name}
              </motion.span>
            ))}
          </motion.div>
        </RevealGroup>
      </div>
    </section>
  );
}
