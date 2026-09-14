"use client";

import { AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";
import {
  bodyVariants,
  eyebrowVariants,
  headlineVariants,
  motion,
  RevealGroup,
  staggerItemVariants,
  useSafeVariants,
} from "@/components/marketing/motion";

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "Is EasyMail read-only?",
    answer:
      "Yes. Access to your mailbox is read-only — EasyMail cannot send, archive, delete, or modify anything in it.",
  },
  {
    question: "Does EasyMail replace my inbox?",
    answer:
      "No. EasyMail is a recap layer on top of Gmail and Outlook, not a new inbox to check. Open the original message in your existing mail app to reply.",
  },
  {
    question: "Which email providers are supported?",
    answer: "Gmail and Outlook are supported today.",
  },
  {
    question: "Can I correct EasyMail's classifications?",
    answer:
      "Yes. Move any message to a different category and your correction is permanent, so a later sync cannot silently reclassify it back.",
  },
  {
    question: "How does EasyMail use my email data?",
    answer:
      "Message metadata and a short-lived copy of the body — kept for up to 7 days, message records for up to 14 — are used solely to classify messages and build your recap.",
  },
  {
    question: "Is EasyMail available yet?",
    answer:
      "EasyMail is currently in early access. Join the waitlist to get access as it opens up.",
  },
];

function FaqRow({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentId = useId();
  return (
    <div className="border-b border-border">
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-5 py-6 text-left transition-colors hover:text-primary"
        onClick={onToggle}
        type="button"
      >
        <span className="flex min-w-0 items-start gap-4">
          <span className="mt-0.5 shrink-0 font-mono text-[10px] text-text-subtle">
            0{index + 1}
          </span>
          <span className="text-[15px] font-medium leading-6 text-text">{question}</span>
        </span>
        <span aria-hidden="true" className="relative mt-0.5 size-4 shrink-0 text-primary">
          <Plus
            className={`absolute inset-0 transition-all duration-200 ${
              isOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"
            }`}
          />
          <Minus
            className={`absolute inset-0 transition-all duration-200 ${
              isOpen ? "rotate-0 scale-100" : "-rotate-90 scale-0"
            }`}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="pb-6 pl-8 text-[13px] leading-6 text-text-muted sm:pl-10">
              {answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-b border-border bg-[#F5F7F9]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20 lg:px-8 lg:py-32">
        <RevealGroup>
          <motion.p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-primary"
            variants={eyebrow}
          >
            FAQ
          </motion.p>
          <motion.h2
            className="mt-5 max-w-md text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[1] tracking-[-0.03em] text-text"
            variants={headline}
          >
            Clear answers before you connect.
          </motion.h2>
          <motion.p
            className="mt-6 max-w-sm text-[14px] leading-6 text-text-muted"
            variants={body}
          >
            The short version: EasyMail reads only what it needs, keeps it briefly, and
            never acts inside your inbox.
          </motion.p>
        </RevealGroup>

        <RevealGroup as="div" margin="-10% 0px -5% 0px" staggerChildren={0.07}>
          <div className="border-t border-border">
            {faqs.map((faq, index) => (
              <motion.div key={faq.question} variants={staggerItem}>
                <FaqRow
                  answer={faq.answer}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() =>
                    setOpenIndex((current) => (current === index ? null : index))
                  }
                  question={faq.question}
                />
              </motion.div>
            ))}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
