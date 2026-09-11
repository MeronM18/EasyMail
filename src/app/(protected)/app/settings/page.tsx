import type { Metadata } from "next";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
          Settings
        </h1>
        <p className="mt-3 text-sm leading-[22px] text-text-muted">
          Manage your EasyMail account and session.
        </p>
      </div>
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
