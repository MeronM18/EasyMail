import { Lock, Eye, ShieldCheck, Clock, type LucideIcon } from "lucide-react";

const trustPoints: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Eye,
    title: "Read-only access",
    description:
      "EasyMail can only read Gmail messages — never send, archive, delete, or modify anything.",
  },
  {
    icon: Lock,
    title: "Encrypted in storage",
    description:
      "Your account connection is encrypted with AES-256-GCM before it's ever stored.",
  },
  {
    icon: ShieldCheck,
    title: "Isolated by design",
    description:
      "Row-level security means your data is never visible to another account — enforced by the database, not just application code.",
  },
  {
    icon: Clock,
    title: "Short retention by design",
    description:
      "EasyMail is designed to retain message bodies for up to 7 days and message records for up to 14 days.",
  },
];

export function SecuritySection() {
  return (
    <section className="border-b border-border" id="security">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium leading-5 text-primary">Security</p>
          <h2 className="mt-4 text-[26px] font-semibold leading-8 tracking-[-0.01em] text-text sm:text-[30px] sm:leading-9">
            Built to be read-only, encrypted, and yours alone
          </h2>
          <p className="mt-5 text-base leading-7 text-text-muted">
            Every claim here maps to something in the codebase, not a compliance page.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {trustPoints.map((point) => (
            <div
              className="rounded-[var(--radius-lg)] border border-border bg-surface p-6"
              key={point.title}
            >
              <point.icon
                aria-hidden="true"
                className="size-5 text-primary"
                strokeWidth={1.8}
              />
              <h3 className="mt-4 text-sm font-semibold leading-5 text-text">
                {point.title}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-text-muted">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
