import type { Metadata } from "next";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { getMailAccountsForSettings } from "@/lib/data/recap";
import { getIntegrationMessage } from "@/lib/integrations/messages";

export const metadata: Metadata = { title: "Settings" };

type PageProps = {
  searchParams: Promise<{ error?: string; connected?: string }>;
};

const statusLabel: Record<string, string> = {
  active: "Connected",
  needs_reconnect: "Needs reconnect",
  sync_error: "Sync error",
  disconnected: "Disconnected",
};

export default async function SettingsPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const errorMessage = getIntegrationMessage(query.error);
  const accounts = await getMailAccountsForSettings();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
          Settings
        </h1>
        <p className="mt-3 text-sm leading-[22px] text-text-muted">
          Manage your EasyMail account and connected inboxes.
        </p>
      </div>

      {errorMessage ? (
        <p
          className="mt-6 max-w-xl rounded-[var(--radius-md)] border border-border bg-surface-muted px-4 py-3 text-sm text-text"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
      {query.connected === "google" ? (
        <p
          className="mt-6 max-w-xl rounded-[var(--radius-md)] border border-border bg-surface-muted px-4 py-3 text-sm text-text"
          role="status"
        >
          Google account connected and synced.
        </p>
      ) : null}
      {query.connected === "microsoft" ? (
        <p
          className="mt-6 max-w-xl rounded-[var(--radius-md)] border border-border bg-surface-muted px-4 py-3 text-sm text-text"
          role="status"
        >
          Outlook account connected and synced.
        </p>
      ) : null}

      <section
        className="mt-10 border-t border-border pt-8"
        aria-labelledby="inboxes-heading"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-base font-semibold leading-6 text-text"
              id="inboxes-heading"
            >
              Connected inboxes
            </h2>
            <p className="mt-1 text-[13px] leading-5 text-text-muted">
              Gmail and Outlook access are read-only — EasyMail never sends, archives, or
              deletes on your behalf.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button asChild size="sm">
              <a href="/api/oauth/google/start">Connect Google account</a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="/api/oauth/microsoft/start">Connect Outlook account</a>
            </Button>
          </div>
        </div>

        {accounts.length === 0 ? (
          <p className="mt-6 text-sm text-text-muted">No inboxes connected yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {accounts.map((account) => (
              <li
                className="flex items-center justify-between gap-4 py-3"
                key={account.id}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">
                    {account.label}
                  </p>
                  <p className="truncate text-[12px] capitalize text-text-subtle">
                    {account.provider} · {account.emailAddress}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-text-muted">
                  {statusLabel[account.status] ?? account.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="mt-10 border-t border-border pt-8"
        aria-labelledby="account-heading"
      >
        <h2 className="text-base font-semibold leading-6 text-text" id="account-heading">
          EasyMail account
        </h2>
        <dl className="mt-5 grid max-w-xl grid-cols-[120px_1fr] gap-x-6 gap-y-3 text-sm leading-[22px]">
          <dt className="text-text-subtle">Email</dt>
          <dd className="truncate text-text">{user.email ?? "Unavailable"}</dd>
        </dl>
        <form action={signOutAction} className="mt-7">
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>
    </main>
  );
}
