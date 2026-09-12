import { ArrowLeft, ExternalLink, Mail, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CorrectionForm } from "@/components/app/correction-form";
import { IntentLabel } from "@/components/app/intent-label";
import { getMessageDetail } from "@/lib/data/recap";
import { intentMeta } from "@/lib/intent";

export const metadata: Metadata = { title: "Message detail" };

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ messageId: string }>;
}) {
  const { messageId } = await params;
  const message = await getMessageDetail(messageId);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-9 lg:px-8 lg:py-12">
      <Link
        className="inline-flex items-center gap-2 text-[12px] font-medium text-text-muted hover:text-text"
        href="/app"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to recap
      </Link>

      <article className="mt-5">
        <header className="border-b border-border pb-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <IntentLabel full intent={message.intent} />
            {message.isUserOverride ? (
              <span className="text-[11px] font-medium text-text-subtle">
                Corrected by you
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-3xl text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
            {message.subject || "No subject"}
          </h1>
          <div className="mt-5 grid max-w-3xl gap-3 text-[12px] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <p className="font-semibold text-text">
                {message.fromName || message.fromAddress}
              </p>
              {message.fromName ? (
                <p className="mt-0.5 text-text-subtle">{message.fromAddress}</p>
              ) : null}
            </div>
            <div className="sm:text-right">
              <p className="font-medium text-text-muted">{message.accountLabel}</p>
              <time
                className="mt-0.5 block text-text-subtle"
                dateTime={message.receivedAt}
              >
                {dateFormatter.format(new Date(message.receivedAt))}
              </time>
            </div>
          </div>
        </header>

        <div className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <section aria-labelledby="message-heading">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-subtle">
              <Mail aria-hidden="true" className="size-3.5" />
              <h2 id="message-heading">Message preview</h2>
            </div>
            <div className="mt-5 max-w-3xl whitespace-pre-wrap text-[14px] leading-7 text-text-muted">
              {message.bodyText || message.snippet || "No preview is available."}
            </div>
            {message.webLink ? (
              <a
                className="mt-8 inline-flex items-center gap-2 text-[12px] font-medium text-primary hover:text-primary-hover"
                href={message.webLink}
                rel="noreferrer"
                target="_blank"
              >
                Open in {message.provider === "google" ? "Gmail" : "Outlook"}
                <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
            ) : (
              <p className="mt-8 text-[11px] text-text-subtle">
                Demo messages do not link to an external mailbox.
              </p>
            )}
          </section>

          <aside className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <section aria-labelledby="why-heading">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-subtle">
                EasyMail read
              </p>
              <h2 className="mt-2 text-sm font-semibold text-text" id="why-heading">
                Why EasyMail placed it here
              </h2>
              <p className="mt-2 text-[12px] leading-5 text-text-muted">
                {message.reason || intentMeta[message.intent].description}
              </p>
              {message.actionSignal ? (
                <div className="mt-4 border-l-2 border-primary bg-surface py-3 pl-3 pr-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-subtle">
                    Attention signal
                  </p>
                  <p className="mt-1 text-[12px] font-medium leading-5 text-text">
                    {message.actionSignal}
                  </p>
                </div>
              ) : null}
            </section>

            <section
              className="mt-6 border-t border-border pt-5"
              aria-labelledby="correction-heading"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-text" id="correction-heading">
                  Your judgment wins
                </h2>
              </div>
              <p className="mt-2 text-[12px] leading-5 text-text-muted">
                If EasyMail read this incorrectly, move it. The message stays unchanged in
                your mailbox.
              </p>
              <CorrectionForm
                currentIntent={message.intent}
                key={message.intent}
                messageId={message.id}
              />
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
