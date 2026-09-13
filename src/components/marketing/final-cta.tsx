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

export function FinalCta() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const cta = useSafeVariants(ctaVariants);
  return (
    <section className="bg-primary">
      <RevealGroup
        as="div"
        className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.55fr)] lg:items-end lg:gap-20 lg:px-8 lg:py-24"
      >
        <div>
          <motion.p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary-foreground/65"
            variants={eyebrow}
          >
            Connect your inbox
          </motion.p>
          <motion.h2
            className="mt-5 max-w-3xl text-[clamp(2.5rem,4.5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-primary-foreground"
            variants={headline}
          >
            Stop guessing what needs you.
          </motion.h2>
        </div>

        <div>
          <motion.p
            className="max-w-md text-[16px] leading-7 text-primary-foreground/78"
            variants={body}
          >
            Connect Gmail or Outlook, get one focused recap, and keep your judgment as the
            final word on every message.
          </motion.p>
          <motion.div className="mt-7 flex flex-col gap-3 xl:flex-row" variants={cta}>
            <Button
              asChild
              className="h-[50px] min-w-[200px] rounded-[8px] bg-background px-5 text-text shadow-none hover:bg-surface-hover"
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
              className="h-[50px] min-w-[200px] rounded-[8px] border border-white/35 bg-transparent px-5 text-white shadow-none hover:bg-white/10"
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
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.06em] text-primary-foreground/55"
            variants={cta}
          >
            Read-only access · No sending · No mailbox modification
          </motion.p>
        </div>
      </RevealGroup>
    </section>
  );
}
