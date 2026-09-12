import { Inbox, SlidersHorizontal } from "lucide-react";
import { IntentLabel } from "@/components/app/intent-label";
import { intents } from "@/lib/intent";

const recapRows = [
  { sender: "Priya Nair", account: "Work · Outlook", intent: "needs_reply" as const },
  {
    sender: "Landlord — Unit 4B",
    account: "Personal · Gmail",
    intent: "needs_action" as const,
  },
  {
    sender: "University Registrar",
    account: "School · Gmail",
    intent: "matters" as const,
  },
  {
    sender: "Weekly Newsletter",
    account: "Personal · Gmail",
    intent: "can_ignore" as const,
  },
];

export function FeatureShowcase() {
  return (
    <section className="border-b border-border" id="features">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium leading-5 text-primary">Product</p>
          <h2 className="mt-4 text-[26px] font-semibold leading-8 tracking-[-0.01em] text-text sm:text-[30px] sm:leading-9">
            Built around one question: what needs you?
          </h2>
          <p className="mt-5 text-base leading-7 text-text-muted">
            Every account, in one place, sorted by what actually deserves your attention.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8 lg:col-span-3">
            <Inbox aria-hidden="true" className="size-5 text-primary" strokeWidth={1.8} />
            <h3 className="mt-4 text-lg font-semibold leading-7 text-text">
              One recap across every inbox
            </h3>
            <p className="mt-2 max-w-md text-[13px] leading-6 text-text-muted">
              Gmail and Outlook accounts feed the same prioritized list — no switching
              tabs to check what came in where.
            </p>
            <div className="mt-6 overflow-hidden rounded-[var(--radius-md)] border border-border shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-1.5 border-b border-border bg-surface-muted px-3.5 py-2.5">
                <span aria-hidden="true" className="size-2 rounded-full bg-[#ff5f57]" />
                <span aria-hidden="true" className="size-2 rounded-full bg-[#febc2e]" />
                <span aria-hidden="true" className="size-2 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[11px] text-text-subtle">
                  EasyMail — Recap
                </span>
              </div>
              <ul className="divide-y divide-border bg-surface">
                {recapRows.map((row) => (
                  <li
                    className="flex items-center justify-between gap-3 px-4 py-3.5"
                    key={row.sender}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium leading-5 text-text">
                        {row.sender}
                      </p>
                      <p className="truncate text-[11px] leading-4 text-text-subtle">
                        {row.account}
                      </p>
                    </div>
                    <IntentLabel className="shrink-0" intent={row.intent} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8 lg:col-span-2">
            <SlidersHorizontal
              aria-hidden="true"
              className="size-5 text-primary"
              strokeWidth={1.8}
            />
            <h3 className="mt-4 text-base font-semibold leading-6 text-text">
              Five-intent triage
            </h3>
            <p className="mt-2 text-[13px] leading-6 text-text-muted">
              Every message lands in one of five categories — filtering means &quot;what
              needs a reply&quot;, not scrolling an inbox.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 rounded-[var(--radius-md)] border border-border bg-surface-muted p-4">
              {intents.map((intent) => (
                <IntentLabel full intent={intent} key={intent} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
