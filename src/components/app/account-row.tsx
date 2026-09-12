import { ProviderMark } from "@/components/app/provider-mark";
import { Badge } from "@/components/ui/badge";
import type { MailAccountSummary } from "@/lib/data/recap";

const statusMeta: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "neutral" }
> = {
  active: { label: "Connected", variant: "success" },
  needs_reconnect: { label: "Needs reconnect", variant: "warning" },
  sync_error: { label: "Sync error", variant: "danger" },
  disconnected: { label: "Disconnected", variant: "neutral" },
};

function formatLastSynced(value: string | null): string {
  if (!value) return "Not yet synced";
  const diffMs = Date.now() - new Date(value).valueOf();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "Synced just now";
  if (diffMin < 60) return `Synced ${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `Synced ${diffHr}h ago`;
  return `Synced ${Math.round(diffHr / 24)}d ago`;
}

export function AccountRow({ account }: { account: MailAccountSummary }) {
  const status = statusMeta[account.status] ?? {
    label: account.status,
    variant: "neutral" as const,
  };
  // Reconnect only reaches the real /api/oauth/google/start route, which only
  // exists for Google — Microsoft OAuth isn't implemented, so a Microsoft
  // account only ever shows status, never an actionable control.
  const canReconnect =
    account.provider === "google" &&
    (account.status === "needs_reconnect" || account.status === "sync_error");

  return (
    <li className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <ProviderMark provider={account.provider} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate text-sm font-medium text-text">{account.label}</p>
            {account.isDemo ? (
              <Badge className="shrink-0" variant="neutral">
                Demo data
              </Badge>
            ) : null}
          </div>
          <p className="truncate text-[12px] text-text-subtle">
            {account.emailAddress} ·{" "}
            <span className="capitalize">{account.provider}</span>
          </p>
          {account.statusMessage ? (
            <p className="mt-0.5 text-[12px] text-text-muted">{account.statusMessage}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
        <div className="flex items-center gap-2.5">
          <Badge variant={status.variant}>{status.label}</Badge>
          {canReconnect ? (
            <a
              aria-label={`Reconnect ${account.label}`}
              className="text-[12px] font-medium text-primary hover:text-primary-hover"
              href="/api/oauth/google/start"
            >
              Reconnect
            </a>
          ) : null}
        </div>
        <p className="text-[11px] text-text-subtle">
          {formatLastSynced(account.lastSyncedAt)}
        </p>
      </div>
    </li>
  );
}
