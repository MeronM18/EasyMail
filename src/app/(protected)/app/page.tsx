import { ArrowRight, CircleAlert, CircleCheck, Inbox } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { IntentLabel } from "@/components/app/intent-label";
import { MessageRow } from "@/components/app/message-row";
import { getRecapData } from "@/lib/data/recap";
import { parseRecapWindow, type RecapMessage } from "@/lib/recap";

export const metadata: Metadata = { title: "Recap" };

type PageProps = {
  searchParams: Promise<{ window?: string }>;
};

const windowLabels = {
  since_last_visit: "Since last visit",
  today: "Today",
  "24h": "Last 24 hours",
} as const;

function MessageSection({
  id,
  title,
  description,
  messages,
  emptyMessage,
  href,
}: {
  id: string;
  title: string;
  description: string;
  messages: RecapMessage[];
  emptyMessage: string;
  href: string;
}) {
  return (
    <section className="border-t border-border pt-6" aria-labelledby={id}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-base font-semibold leading-6 text-text" id={id}>
            {title}
            <span className="ml-2 font-normal text-text-subtle">{messages.length}</span>
          </h2>
          <p className="mt-0.5 text-[12px] leading-5 text-text-muted">{description}</p>
        </div>
        <Link
          className="shrink-0 pt-0.5 text-[12px] font-medium text-primary hover:text-primary-hover"
          href={href}
        >
          View triage
        </Link>
      </div>
      <div className="mt-3">
        {messages.length > 0 ? (
          messages.map((message) => <MessageRow key={message.id} message={message} />)
        ) : (
          <div className="flex items-center gap-2 py-5 text-[13px] text-text-muted">
            <CircleCheck aria-hidden="true" className="size-4 text-brand-accent" />
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

export default async function AppPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const window = parseRecapWindow(query.window);
  const state = await getRecapData(window);
  const greeting = state.displayName
    ? `Welcome back, ${state.displayName}`
    : "Your recap";
  const lowerAttentionCount = state.groups.canIgnore.length + state.groups.cleanup.length;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-9 lg:px-8 lg:py-12">
      <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-12">
        <div className="min-w-0">
          <div className="max-w-2xl">
            <p className="text-[12px] font-medium leading-5 text-primary">
              EasyMail recap
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
              {greeting}
            </h1>
            <p className="mt-1.5 text-[13px] leading-[21px] text-text-muted">
              What needs your attention across your connected inboxes, organized from
              stored classifications.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <nav aria-label="Recap window" className="flex flex-wrap gap-x-5 gap-y-2">
              {Object.entries(windowLabels).map(([value, label]) => (
                <Link
                  aria-current={window === value ? "page" : undefined}
                  className={`border-b-2 pb-1 text-[12px] font-medium ${
                    window === value
                      ? "border-primary text-text"
                      : "border-transparent text-text-muted hover:text-text"
                  }`}
                  href={value === "since_last_visit" ? "/app" : `/app?window=${value}`}
                  key={value}
                >
                  {label}
                </Link>
              ))}
            </nav>
            {state.accounts.length > 0 ? (
              <p className="text-[11px] text-text-subtle">
                {state.groups.needsNow.length} need you · {state.groups.matters.length}
                {" matter · "}
                {lowerAttentionCount} lower attention
              </p>
            ) : null}
          </div>

          {state.accounts.length === 0 ? (
            <section className="border-b border-border py-10 text-center">
              <Inbox aria-hidden="true" className="mx-auto size-6 text-text-subtle" />
              <h2 className="mt-4 text-base font-semibold text-text">
                Nothing to recap yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-[22px] text-text-muted">
                Your account is ready. Inbox connection arrives in the integration phase;
                Phase 10 demo data can be loaded locally for product review.
              </p>
            </section>
          ) : (
            <div className="space-y-7 pt-6">
              <MessageSection
                description="Replies, tasks, deadlines, and decisions waiting on you."
                emptyMessage="Nothing needs you right now."
                href="/app/triage"
                id="needs-now-heading"
                messages={state.groups.needsNow}
                title="Needs you now"
              />
              <MessageSection
                description="Important context worth seeing without demanding a response."
                emptyMessage="No important updates in this window."
                href="/app/triage?intent=matters"
                id="matters-heading"
                messages={state.groups.matters}
                title="Matters"
              />
              <section
                className="border-t border-border pt-6"
                aria-labelledby="lower-attention-heading"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      className="text-base font-semibold leading-6 text-text"
                      id="lower-attention-heading"
                    >
                      Lower attention
                      <span className="ml-2 font-normal text-text-subtle">
                        {lowerAttentionCount}
                      </span>
                    </h2>
                    <p className="mt-0.5 text-[12px] leading-5 text-text-muted">
                      Safe to defer now, available when you want to review.
                    </p>
                  </div>
                  <Link
                    className="inline-flex shrink-0 items-center gap-1 pt-0.5 text-[12px] font-medium text-primary hover:text-primary-hover"
                    href="/app/triage?intent=can_ignore"
                  >
                    Review
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </div>
                <div className="mt-4 grid border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-border">
                  <Link
                    className="flex items-center justify-between gap-4 py-3 pr-4 hover:bg-surface sm:pl-3"
                    href="/app/triage?intent=can_ignore"
                  >
                    <IntentLabel full intent="can_ignore" />
                    <span className="text-[12px] text-text-subtle">
                      {state.groups.canIgnore.length}
                    </span>
                  </Link>
                  <Link
                    className="flex items-center justify-between gap-4 border-t border-border py-3 hover:bg-surface sm:border-t-0 sm:px-3"
                    href="/app/triage?intent=cleanup_candidate"
                  >
                    <IntentLabel full intent="cleanup_candidate" />
                    <span className="text-[12px] text-text-subtle">
                      {state.groups.cleanup.length}
                    </span>
                  </Link>
                </div>
              </section>
            </div>
          )}
        </div>

        <aside className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-text-subtle">
            Inbox setup
          </h2>
          <p className="mt-1.5 text-[12px] leading-5 text-text-muted">
            {state.setup.completed} of {state.setup.total} target inboxes represented
          </p>
          <div className="mt-4 space-y-3.5">
            {state.accounts.map((account) => (
              <div key={account.id}>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${
                      account.status === "active" ? "bg-success" : "bg-warning"
                    }`}
                  />
                  <p className="min-w-0 truncate text-[13px] font-medium text-text">
                    {account.label}
                  </p>
                </div>
                <p className="ml-3.5 truncate text-[11px] capitalize text-text-subtle">
                  {account.provider}
                  {account.isDemo ? " · Demo data" : ""}
                </p>
              </div>
            ))}
          </div>
          {!state.setup.isComplete && state.accounts.length > 0 ? (
            <div className="mt-5 flex gap-2 border-t border-border pt-4">
              <CircleAlert
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-warning"
              />
              <p className="text-[11px] leading-[18px] text-text-muted">
                Partial setup is supported. Provider connection controls arrive in the
                integration phase.
              </p>
            </div>
          ) : null}
          {state.pendingCount > 0 ? (
            <p className="mt-4 border-t border-border pt-4 text-[11px] leading-[18px] text-text-muted">
              {state.pendingCount} message{state.pendingCount === 1 ? " is" : "s are"}
              waiting for classification and excluded from this recap.
            </p>
          ) : null}
          {state.accounts.length > 0 ? (
            <p className="mt-5 text-[11px] text-text-subtle">
              {state.classifiedCount} classified in this window
            </p>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
