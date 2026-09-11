import type { Metadata } from "next";
import { getFoundationState } from "@/lib/data/foundation";

export const metadata: Metadata = { title: "Overview" };

export default async function AppPage() {
  const state = await getFoundationState();
  const greeting = state.displayName
    ? `Good to see you, ${state.displayName}`
    : "Your attention, in one place";

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-[13px] font-medium leading-5 text-primary">EasyMail recap</p>
        <h1 className="mt-2 text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
          {greeting}
        </h1>
        <p className="mt-3 text-sm leading-[22px] text-text-muted">
          A calm starting point for what needs you across Gmail and Outlook.
        </p>
      </div>

      <section
        className="mt-12 border-t border-border pt-8"
        aria-labelledby="inboxes-heading"
      >
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_180px] sm:gap-12">
          <div className="max-w-xl">
            <h2
              className="text-base font-semibold leading-6 text-text"
              id="inboxes-heading"
            >
              {state.accountCount === 0
                ? "Nothing to recap yet"
                : `${state.accountCount} inbox${state.accountCount === 1 ? "" : "es"} connected`}
            </h2>
            <p className="mt-1 text-sm leading-[22px] text-text-muted">
              Once inboxes are connected, EasyMail will organize their attention items
              here while your messages remain in Gmail and Outlook.
            </p>
          </div>
          <div className="border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <p className="text-[12px] leading-4 text-text-subtle">Connected inboxes</p>
            <p className="mt-1 text-xl font-semibold leading-7 text-text">
              {state.accountCount}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
