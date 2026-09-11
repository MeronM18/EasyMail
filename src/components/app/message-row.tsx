import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { IntentLabel } from "@/components/app/intent-label";
import type { RecapMessage } from "@/lib/recap";

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});
const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});

function formatReceivedAt(value: string) {
  const date = new Date(value);
  const now = new Date();
  return date.toDateString() === now.toDateString()
    ? timeFormatter.format(date)
    : dateFormatter.format(date);
}

export function MessageRow({ message }: { message: RecapMessage }) {
  return (
    <Link
      className="group -mx-3 grid gap-2 border-t border-border px-3 py-3.5 first:border-t-0 hover:bg-surface sm:grid-cols-[minmax(0,1fr)_142px_18px] sm:items-center sm:gap-5"
      href={`/app/messages/${message.id}`}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-baseline justify-between gap-3 sm:justify-start">
          <p className="truncate text-[13px] font-semibold leading-5 text-text">
            {message.fromName || message.fromAddress}
          </p>
          <time
            className="shrink-0 text-[11px] text-text-subtle sm:hidden"
            dateTime={message.receivedAt}
          >
            {formatReceivedAt(message.receivedAt)}
          </time>
        </div>
        <p className="mt-0.5 truncate text-sm font-medium leading-5 text-text">
          {message.subject || "No subject"}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[12px] leading-5 text-text-muted">
          {message.actionSignal || message.reason || message.snippet}
        </p>
      </div>
      <div className="flex min-w-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
        <IntentLabel intent={message.intent} />
        <span className="min-w-0 truncate text-[11px] text-text-subtle">
          {message.accountLabel}
        </span>
        <time
          className="hidden text-[11px] text-text-subtle sm:block"
          dateTime={message.receivedAt}
        >
          {formatReceivedAt(message.receivedAt)}
        </time>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="hidden size-4 text-text-subtle transition-transform group-hover:translate-x-0.5 sm:block"
      />
    </Link>
  );
}
