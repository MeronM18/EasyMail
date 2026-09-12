import { IntentLabel } from "@/components/app/intent-label";
import type { Intent } from "@/lib/intent";

// Synthetic, demo-safe content only — never real product data or invented
// customer names in a marketing surface (DESIGN_SYSTEM.md / brief rule).
const previewMessages: Array<{
  sender: string;
  subject: string;
  snippet: string;
  account: string;
  intent: Intent;
}> = [
  {
    sender: "Priya Nair",
    subject: "Re: contract redline — can you take a look today?",
    snippet: "One clause needs your sign-off before I send it back...",
    account: "Work · Outlook",
    intent: "needs_reply",
  },
  {
    sender: "Landlord — Unit 4B",
    subject: "Lease renewal due Friday",
    snippet: "Please confirm by end of week or the unit goes back on the market.",
    account: "Personal · Gmail",
    intent: "needs_action",
  },
  {
    sender: "University Registrar",
    subject: "Fall schedule finalized",
    snippet: "Your registration is confirmed. No action needed, for your records.",
    account: "School · Gmail",
    intent: "matters",
  },
  {
    sender: "Weekly Newsletter",
    subject: "5 productivity tips you already know",
    snippet: "This week: inbox zero, again.",
    account: "Personal · Gmail",
    intent: "can_ignore",
  },
  {
    sender: "Promo Deals",
    subject: "Still interested? Everything's 40% off",
    snippet: "Sent every Tuesday for the last six weeks.",
    account: "Personal · Gmail",
    intent: "cleanup_candidate",
  },
];

export function ProductPreview() {
  return (
    <section className="mx-auto -mt-10 max-w-4xl px-6 pb-20 lg:px-8 lg:pb-28">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-lg)]">
        <div className="flex items-center gap-1.5 border-b border-border bg-surface-muted px-4 py-3">
          <span aria-hidden="true" className="size-2 rounded-full bg-[#ff5f57]" />
          <span aria-hidden="true" className="size-2 rounded-full bg-[#febc2e]" />
          <span aria-hidden="true" className="size-2 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[12px] text-text-subtle">EasyMail — Recap</span>
        </div>
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold leading-6 text-text">Your recap</h2>
            <span className="text-[12px] text-text-subtle">3 need you · 1 matters</span>
          </div>
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {previewMessages.map((message) => (
              <li
                className="flex items-center justify-between gap-4 py-3"
                key={message.subject}
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold leading-5 text-text">
                    {message.sender}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium leading-5 text-text">
                    {message.subject}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] leading-5 text-text-muted">
                    {message.snippet}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <IntentLabel intent={message.intent} />
                  <span className="text-[11px] text-text-subtle">{message.account}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
