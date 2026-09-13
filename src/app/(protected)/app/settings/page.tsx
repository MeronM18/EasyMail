import type { Metadata } from "next";
import { signOutAction } from "@/app/actions/auth";
import { AccountRow } from "@/components/app/account-row";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { getMailAccountsForSettings } from "@/lib/data/recap";
import { getIntegrationMessage } from "@/lib/integrations/messages";

export const metadata: Metadata = { title: "Settings" };

type PageProps = {
  searchParams: Promise<{ error?: string; connected?: string }>;
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
        <p className="mt-2 text-sm leading-[22px] text-text-muted">
          Manage your EasyMail account and connected inboxes.
        </p>
      </div>

      {errorMessage ? (
        <Alert className="mt-6 max-w-xl" tone="error">
          {errorMessage}
        </Alert>
      ) : null}
      {query.connected === "google" ? (
        <Alert className="mt-6 max-w-xl" tone="success">
          Google account connected and synced.
        </Alert>
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
        aria-labelledby="inboxes-heading"
        className="mt-10 border-t border-border pt-7"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {accounts.map((account) => (
              <AccountRow account={account} key={account.id} />
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby="account-heading"
        className="mt-9 border-t border-border pt-7"
      >
        <h2 className="text-base font-semibold leading-6 text-text" id="account-heading">
          EasyMail account
        </h2>
        <dl className="mt-4 grid max-w-xl grid-cols-[120px_1fr] gap-x-6 gap-y-2.5 text-sm leading-[22px]">
          <dt className="text-text-subtle">Email</dt>
          <dd className="truncate text-text">{user.email ?? "Unavailable"}</dd>
        </dl>
        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>
    </main>
  );
}
