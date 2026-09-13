"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    question: "Does EasyMail read or store my email?",
    answer:
      "EasyMail stores message metadata and a short-lived copy of the body—kept for up to 7 days—solely to classify messages and build your recap. Access to your mailbox is read-only.",
  },
  {
    question: "Can EasyMail send, delete, or archive anything for me?",
    answer:
      "No. Access is read-only. EasyMail cannot send, archive, delete, or modify anything in your mailbox.",
  },
  {
    question: "What happens if it gets a classification wrong?",
    answer:
      "Move the message to any of the five categories. Your correction is permanent, so a later sync cannot silently reclassify it back.",
  },
  {
    question: "How long is my data kept?",
    answer:
      "EasyMail is designed to retain message bodies for up to 7 days and message records for up to 14 days.",
  },
  {
    question: "Which inboxes does EasyMail support?",
    answer: "Gmail and Outlook are supported today.",
  },
];

export function FaqSection() {
  const eyebrow = useSafeVariants(eyebrowVariants);
  const headline = useSafeVariants(headlineVariants);
  const body = useSafeVariants(bodyVariants);
  const staggerItem = useSafeVariants(staggerItemVariants);
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
          <Accordion className="border-t border-border" collapsible type="single">
            {faqs.map((faq, index) => (
              <motion.div key={faq.question} variants={staggerItem}>
                <AccordionItem
                  className="px-3 transition-colors hover:bg-white/60 sm:px-4"
                  value={faq.question}
                >
                  <AccordionTrigger className="gap-5 py-6 text-left transition-colors hover:text-primary text-[15px] font-medium leading-6 text-text hover:no-underline">
                    <span className="flex min-w-0 items-start gap-4">
                      <span className="mt-0.5 shrink-0 font-mono text-[10px] text-text-subtle">
                        0{index + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-8 text-[13px] leading-6 text-text-muted sm:pl-10">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </RevealGroup>
      </div>
    </section>
  );
}
