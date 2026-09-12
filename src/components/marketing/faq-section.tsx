import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "Does EasyMail read or store my email?",
    answer:
      "EasyMail stores message metadata and a short-lived copy of the body — kept for up to 7 days — solely to classify messages and build your recap. Access to your mailbox is read-only.",
  },
  {
    question: "Can EasyMail send, delete, or archive anything for me?",
    answer:
      "No. Access is read-only. EasyMail can never send, archive, delete, or modify anything in your mailbox.",
  },
  {
    question: "What happens if it gets a classification wrong?",
    answer:
      "Move it to any of the five categories in one click. Your correction is permanent — EasyMail won't reclassify that message back on a later sync.",
  },
  {
    question: "How long is my data kept?",
    answer:
      "EasyMail is designed to retain message bodies for up to 7 days and message records for up to 14 days.",
  },
  {
    question: "Which inboxes does EasyMail support?",
    answer: "Gmail is supported today. Outlook support is planned.",
  },
];

export function FaqSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium leading-5 text-primary">FAQ</p>
          <h2 className="mt-4 text-[26px] font-semibold leading-8 tracking-[-0.01em] text-text sm:text-[30px] sm:leading-9">
            Questions people actually ask
          </h2>
        </div>

        <Accordion className="mt-12" type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-[15px] font-medium text-text hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[13px] leading-6 text-text-muted">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
