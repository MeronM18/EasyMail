import { ShieldCheck } from "lucide-react";

const providers = [
  {
    name: "Gmail",
    mono: "G",
    detail: "Personal & school inboxes",
  },
  {
    name: "Outlook",
    mono: "O",
    detail: "Work & Microsoft 365 inboxes",
  },
];

export function IntegrationsSection() {
  return (
    <section className="border-b border-border bg-surface-subtle">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium leading-5 text-primary">Integrations</p>
          <h2 className="mt-4 text-[26px] font-semibold leading-8 tracking-[-0.01em] text-text sm:text-[30px] sm:leading-9">
            Gmail and Outlook, read-only
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-text-muted">
            EasyMail connects to the two inboxes people actually use for work and life. No
            unnecessary permissions — access is read-only, and nothing is ever sent,
            archived, or deleted on your behalf.
          </p>
        </div>

        <div className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-6 sm:grid sm:grid-cols-[minmax(0,1fr)_44px_auto] sm:items-center sm:gap-0">
          <div className="flex w-full flex-col gap-5 sm:w-auto">
            {providers.map((provider) => (
              <div
                className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-4 shadow-[var(--shadow-sm)]"
                key={provider.name}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary-subtle text-sm font-semibold text-primary">
                  {provider.mono}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-5 text-text">
                    {provider.name}
                  </p>
                  <p className="truncate text-[11px] leading-4 text-text-subtle">
                    {provider.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <svg
            aria-hidden="true"
            className="hidden h-full w-11 text-border-strong sm:block"
            preserveAspectRatio="none"
            viewBox="0 0 44 160"
          >
            <path
              d="M0 34 C 22 34, 22 80, 44 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M0 126 C 22 126, 22 80, 44 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <svg
            aria-hidden="true"
            className="block h-8 w-px text-border-strong sm:hidden"
            preserveAspectRatio="none"
            viewBox="0 0 2 32"
          >
            <path d="M1 0 V32" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          <div className="flex w-[168px] flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-primary/30 bg-surface px-5 py-6 text-center shadow-[var(--shadow-md)]">
            <span className="text-sm font-semibold tracking-[-0.01em] text-text">
              EasyMail
            </span>
            <span className="text-[11px] leading-4 text-text-subtle">
              One focused recap
            </span>
          </div>
        </div>

        <p className="mt-12 inline-flex w-full items-center justify-center gap-2 text-[12px] leading-4 text-text-subtle">
          <ShieldCheck
            aria-hidden="true"
            className="size-3.5 text-primary"
            strokeWidth={1.8}
          />
          Message bodies are scrubbed after 7 days; messages are removed after 14.
        </p>
      </div>
    </section>
  );
}
