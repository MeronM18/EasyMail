"use client";

import Image from "next/image";
import { intentMeta, type Intent } from "@/lib/intent";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  Reveal,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
  type Variants,
} from "@/components/marketing/motion";

// Row stagger starts a beat after the product window itself has settled in
// (Reveal's own "visual" transition already has a 0.15s delay + 0.85s
// duration), so the rows read as software populating, not one flat block.
const messageListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};
import { cn } from "@/lib/utils";

type PreviewIntent = Exclude<Intent, "cleanup_candidate">;

// Synthetic, demo-safe content only — never real product or customer data.
const previewMessages: Array<{
  sender: string;
  time: string;
  subject: string;
  snippet: string;
  intent: PreviewIntent;
  selected?: boolean;
  reason?: string;
}> = [
  {
    sender: "Priya Nair",
    time: "9:14 AM",
    subject: "Can you review the launch brief before Friday?",
    snippet:
      "I incorporated the latest feedback. Could you confirm the final positioning before Friday morning?",
    intent: "needs_reply",
    selected: true,
    reason: "A direct question and Friday deadline make a response likely.",
  },
  {
    sender: "Jordan Lee",
    time: "8:58 AM",
    subject: "Re: Tuesday planning session",
    snippet: "Does 2:30 work for you, or should I keep the original time?",
    intent: "needs_reply",
  },
  {
    sender: "Finance Operations",
    time: "8:47 AM",
    subject: "Receipt needed for August expense report",
    snippet: "Upload the missing receipt by 5 PM so this month’s report can close.",
    intent: "needs_action",
  },
  {
    sender: "University Registrar",
    time: "Yesterday",
    subject: "Fall schedule has been finalized",
    snippet: "Your confirmed course schedule and room assignments are now available.",
    intent: "matters",
  },
  {
    sender: "The Weekly Edit",
    time: "Yesterday",
    subject: "Five links worth saving this week",
    snippet: "A curated digest of product thinking, design systems, and team rituals.",
    intent: "can_ignore",
  },
];

const previewIntents: PreviewIntent[] = [
  "needs_reply",
  "needs_action",
  "matters",
  "can_ignore",
];

const categoryCounts: Record<PreviewIntent, number> = {
  needs_reply: 2,
  needs_action: 1,
  matters: 1,
  can_ignore: 1,
};

const categoryStyles: Record<Intent, { dot: string; badge: string }> = {
  needs_reply: {
    dot: "bg-primary",
    badge: "border-primary/20 bg-primary-subtle text-primary",
  },
  needs_action: {
    dot: "bg-warning",
    badge: "border-warning/20 bg-warning-bg text-warning-fg",
  },
  matters: { dot: "bg-text", badge: "border-border bg-surface text-text" },
  can_ignore: {
    dot: "bg-text-subtle",
    badge: "border-border bg-surface-muted text-text-muted",
  },
  cleanup_candidate: {
    dot: "bg-border-strong",
    badge: "border-border/70 bg-background text-text-subtle",
  },
};

function CategoryBadge({ intent }: { intent: Intent }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center rounded-[var(--radius-sm)] border px-2 py-1 text-[11px] font-medium leading-4",
        categoryStyles[intent].badge,
      )}
    >
      {intentMeta[intent].label}
    </span>
  );
}

function PreviewMessageRow({ message }: { message: (typeof previewMessages)[number] }) {
  const rowVariants = useSafeVariants(staggerItemVariants);
  return (
    <motion.li
      className={cn(
        "relative px-4 py-3.5 sm:px-6",
        message.selected && "bg-primary-subtle/40",
      )}
      variants={rowVariants}
    >
      {message.selected ? (
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
      ) : null}
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[13px] font-semibold leading-5 text-text">
              {message.sender}
            </p>
            {message.selected ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-primary">
                Selected
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-sm font-medium leading-5 text-text">
            {message.subject}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[12px] leading-5 text-text-muted">
            {message.snippet}
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <span className="font-mono text-[10px] text-text-subtle">{message.time}</span>
          <CategoryBadge intent={message.intent} />
        </div>
      </div>
      {message.reason ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-primary/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] leading-5 text-text-muted">
            <span className="font-medium text-text">Why this needs you:</span>{" "}
            {message.reason}
          </p>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.06em] text-text-subtle">
            AI classified
          </span>
        </div>
      ) : null}
    </motion.li>
  );
}

export function ProductPreview() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const messageList = useSafeVariants(messageListVariants);
  return (
    <section className="border-b border-border bg-[#F5F7F9]">
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-24 lg:px-8 lg:pt-32 lg:pb-32">
        <RevealGroup className="max-w-3xl">
          <motion.p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
            variants={eyebrow}
          >
            The recap
          </motion.p>
          <motion.h2
            className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-text"
            variants={headline}
          >
            One focused view of every inbox.
          </motion.h2>
          <motion.p
            className="mt-6 max-w-xl text-[17px] leading-7 text-text-muted"
            variants={body}
          >
            EasyMail analyzes your connected inboxes and surfaces a single focused recap —
            organized by what actually needs you, regardless of provider.
          </motion.p>
        </RevealGroup>

        <Reveal className="relative mt-12 lg:mt-16" kind="visual">
          <div className="marketing-float overflow-hidden rounded-[10px] border border-border-strong bg-surface shadow-[0_22px_55px_rgba(18,18,18,0.08)]">
            <div className="flex h-11 items-center justify-between border-b border-border bg-surface-muted/60 px-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#FF605C]" />
                  <span className="size-2.5 rounded-full bg-[#FFBD44]" />
                  <span className="size-2.5 rounded-full bg-[#00CA4E]" />
                </span>
                <span className="font-mono text-[10px] text-text-subtle">
                  EasyMail · Recap
                </span>
              </div>
              <span className="hidden items-center gap-2 text-[11px] text-text-muted sm:inline-flex">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={12}
                  src="/hero/gmail.svg"
                  width={16}
                />
                2 inboxes · Connected
              </span>
            </div>

            <div className="flex min-h-[56px] items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
              <div className="flex items-center gap-5">
                <span className="text-[15px] font-bold tracking-[-0.01em] text-text">
                  EasyMail
                </span>
                <nav
                  aria-label="Product preview"
                  className="hidden items-center gap-4 sm:flex"
                >
                  <span className="border-b-2 border-primary py-[18px] text-[12px] font-medium text-text">
                    Recap
                  </span>
                  <span className="py-[18px] text-[12px] text-text-subtle">Triage</span>
                </nav>
              </div>
              <span className="rounded-[var(--radius-sm)] border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-text-subtle">
                Read only
              </span>
            </div>

            <div className="grid md:grid-cols-[190px_minmax(0,1fr)]">
              <aside className="border-b border-border bg-surface-muted/30 px-4 py-5 md:border-r md:border-b-0 md:px-5 md:py-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-subtle">
                  Since last visit
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-4 md:grid-cols-1">
                  {previewIntents.map((intent) => (
                    <li
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2.5 py-2 text-[12px]",
                        intent === "needs_reply"
                          ? "bg-primary-subtle font-medium text-primary"
                          : "text-text-muted",
                      )}
                      key={intent}
                    >
                      <span className="inline-flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            categoryStyles[intent].dot,
                          )}
                        />
                        <span className="truncate">{intentMeta[intent].label}</span>
                      </span>
                      <span className="font-mono text-[10px] text-text-subtle">
                        {categoryCounts[intent]}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 hidden border-t border-border pt-4 md:block">
                  <div className="flex items-center gap-2">
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={14}
                      src="/hero/gmail.svg"
                      width={18}
                    />
                    <div>
                      <p className="text-[11px] font-medium text-text">Personal Gmail</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-text-subtle">
                        Synced now
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 hidden items-center gap-2 md:flex">
                  <Image
                    alt=""
                    aria-hidden="true"
                    height={16}
                    src="/hero/outlook.svg"
                    width={16}
                  />
                  <div>
                    <p className="text-[11px] font-medium text-text">Work Outlook</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-text-subtle">
                      Synced now
                    </p>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-6 sm:py-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-subtle">
                      Daily recap
                    </p>
                    <h3 className="mt-1 text-lg font-semibold leading-6 text-text">
                      Today&apos;s attention
                    </h3>
                    <p className="mt-1 text-[12px] leading-5 text-text-muted">
                      The messages most likely to need your attention, in one place.
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-primary/20 bg-primary-subtle px-2.5 py-1 font-mono text-[10px] font-medium text-primary">
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-primary"
                    />
                    5 items need you
                  </span>
                </div>

                <motion.ul className="divide-y divide-border" variants={messageList}>
                  {previewMessages.map((message) => (
                    <PreviewMessageRow key={message.subject} message={message} />
                  ))}
                </motion.ul>

                <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
                  <span className="font-mono text-[10px] text-text-subtle">
                    Gmail + Outlook · 48 messages classified
                  </span>
                  <span className="font-mono text-[10px] text-text-subtle">
                    Updated just now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
