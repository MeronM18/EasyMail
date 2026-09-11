import { Inbox } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MessageRow } from "@/components/app/message-row";
import { getTriageData } from "@/lib/data/recap";
import { intentMeta, isIntent, type Intent } from "@/lib/intent";

export const metadata: Metadata = { title: "Triage" };

type TriageIntent = Intent | "all_needs_me";
const filters: Array<{ value: TriageIntent; label: string }> = [
  { value: "all_needs_me", label: "Needs me" },
  { value: "needs_reply", label: "Needs reply" },
  { value: "needs_action", label: "Needs action" },
  { value: "matters", label: "Matters" },
  { value: "can_ignore", label: "Can ignore" },
  { value: "cleanup_candidate", label: "Cleanup" },
];

function parseIntent(value: unknown): TriageIntent {
  return value === "all_needs_me" || isIntent(value) ? value : "all_needs_me";
}

export default async function TriagePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; account?: string }>;
}) {
  const query = await searchParams;
  const intent = parseIntent(query.intent);
  const state = await getTriageData({ intent, accountId: query.account });
  const activeLabel = intent === "all_needs_me" ? "Needs me" : intentMeta[intent].label;

  function href(nextIntent: TriageIntent, accountId?: string) {
    const params = new URLSearchParams();
    if (nextIntent !== "all_needs_me") params.set("intent", nextIntent);
    if (accountId) params.set("account", accountId);
    const suffix = params.toString();
    return suffix ? `/app/triage?${suffix}` : "/app/triage";
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-9 lg:px-8 lg:py-12">
      <div className="max-w-2xl">
        <p className="text-[12px] font-medium text-primary">Attention view</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-text">
          Triage
        </h1>
        <p className="mt-1.5 text-[13px] leading-[21px] text-text-muted">
          Inspect stored classifications across inboxes. EasyMail does not change the
          underlying message.
        </p>
      </div>

      <section
        className="mt-7 border-y border-border py-4"
        aria-labelledby="intent-filter-heading"
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-subtle"
          id="intent-filter-heading"
        >
          Intent
        </p>
        <nav
          aria-label="Intent filters"
          className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2"
        >
          {filters.map((filter) => (
            <Link
              aria-current={intent === filter.value ? "page" : undefined}
              className={`border-b-2 pb-1 text-[12px] font-medium ${
                intent === filter.value
                  ? "border-primary text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
              href={href(filter.value, state.selectedAccount?.id)}
              key={filter.value}
            >
              {filter.label}
            </Link>
          ))}
        </nav>
      </section>

      {state.accounts.length > 1 ? (
        <section
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
          aria-labelledby="inbox-filter-heading"
        >
          <div className="flex shrink-0 items-center gap-2">
            <Inbox aria-hidden="true" className="size-3.5 text-text-subtle" />
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-subtle"
              id="inbox-filter-heading"
            >
              Inbox
            </p>
          </div>
          <nav
            aria-label="Inbox filters"
            className="flex flex-wrap gap-2 sm:border-l sm:border-border sm:pl-4"
          >
            <Link
              aria-current={!state.selectedAccount ? "page" : undefined}
              className={`rounded-[var(--radius-md)] border px-2.5 py-1 text-[11px] font-medium ${
                !state.selectedAccount
                  ? "border-border-strong bg-surface-muted text-text"
                  : "border-border bg-background text-text-muted hover:border-border-strong"
              }`}
              href={href(intent)}
            >
              All inboxes
            </Link>
            {state.accounts.map((account) => (
              <Link
                aria-current={
                  state.selectedAccount?.id === account.id ? "page" : undefined
                }
                className={`max-w-48 truncate rounded-[var(--radius-md)] border px-2.5 py-1 text-[11px] font-medium ${
                  state.selectedAccount?.id === account.id
                    ? "border-border-strong bg-surface-muted text-text"
                    : "border-border bg-background text-text-muted hover:border-border-strong"
                }`}
                href={href(intent, account.id)}
                key={account.id}
              >
                {account.label}
              </Link>
            ))}
          </nav>
        </section>
      ) : null}

      <section
        className="mt-7 border-t border-border pt-5"
        aria-labelledby="results-heading"
      >
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-text" id="results-heading">
              {activeLabel}
            </h2>
            <p className="mt-0.5 text-[12px] text-text-muted">
              {state.selectedAccount?.label ?? "Across all inboxes"}
            </p>
          </div>
          <p className="text-[11px] text-text-subtle">
            {state.messages.length} message{state.messages.length === 1 ? "" : "s"} · 14
            days
          </p>
        </div>
        <div className="mt-3">
          {state.messages.length > 0 ? (
            state.messages.map((message) => (
              <MessageRow key={message.id} message={message} />
            ))
          ) : (
            <p className="py-8 text-[13px] text-text-muted">
              No messages match this view in the last 14 days.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
