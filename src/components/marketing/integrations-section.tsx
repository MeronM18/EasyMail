"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

const providers = [
  {
    name: "Gmail",
    detail: "Personal, school, and Google Workspace inboxes",
    icon: "/hero/gmail.svg",
    iconWidth: 28,
    iconHeight: 21,
    status: "Available now",
    active: true,
  },
  {
    name: "Outlook",
    detail: "Personal Outlook and Microsoft 365 inboxes",
    icon: "/hero/outlook.svg",
    iconWidth: 28,
    iconHeight: 28,
    status: "Available now",
    active: true,
  },
];

const noteVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.15 } },
};

export function IntegrationsSection() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const note = useSafeVariants(noteVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);
  return (
    <section className="border-b border-border bg-[#F5F7F9]">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-20">
          <RevealGroup>
            <motion.p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
              variants={eyebrow}
            >
              Integrations
            </motion.p>
            <motion.h2
              className="mt-5 max-w-xl text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[1] tracking-[-0.03em] text-text"
              variants={headline}
            >
              Your inbox stays where it is.
            </motion.h2>
            <motion.p
              className="mt-6 max-w-md text-[16px] leading-7 text-text-muted"
              variants={body}
            >
              EasyMail adds a focused attention layer without replacing the tools you
              already use or asking permission to act on your behalf.
            </motion.p>

            <motion.div className="mt-10 border-t border-border pt-5" variants={note}>
              <p className="inline-flex items-center gap-2 text-[13px] font-medium text-text">
                <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
                Read-only by default
              </p>
              <p className="mt-2 max-w-sm text-[12px] leading-5 text-text-subtle">
                No sending, deleting, archiving, or mailbox modification.
              </p>
            </motion.div>
          </RevealGroup>

          <RevealGroup as="div" className="border-y border-border" staggerChildren={0.1}>
            {providers.map((provider) => (
              <motion.div
                className="grid gap-5 border-b border-border px-0 py-7 last:border-b-0 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-center sm:px-6 lg:py-8"
                key={provider.name}
                variants={staggerItem}
              >
                <span className="flex size-12 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface">
                  <Image
                    alt=""
                    aria-hidden="true"
                    height={provider.iconHeight}
                    src={provider.icon}
                    width={provider.iconWidth}
                  />
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-text">{provider.name}</h3>
                  <p className="mt-1 text-[13px] leading-5 text-text-muted">
                    {provider.detail}
                  </p>
                </div>
                <span
                  className={
                    provider.active
                      ? "inline-flex w-fit items-center gap-2 rounded-[var(--radius-sm)] border border-success/20 bg-success-subtle px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-success"
                      : "inline-flex w-fit items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-text-subtle"
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      provider.active
                        ? "marketing-status-pulse size-1.5 rounded-full bg-success"
                        : "size-1.5 rounded-full bg-border-strong"
                    }
                  />
                  {provider.status}
                </span>
              </motion.div>
            ))}

            <motion.div
              className="flex flex-col gap-4 border-t border-border bg-surface-muted/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              variants={staggerItem}
            >
              <p className="text-[12px] leading-5 text-text-muted">
                Every supported account feeds the same deterministic recap.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-text-subtle">
                One attention model
                <ArrowRight aria-hidden="true" className="size-3" />
              </span>
            </motion.div>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
