import Image from "next/image";
import Link from "next/link";

/**
 * Centered auth shell shared by sign-in/sign-up/forgot-password/
 * update-password/check-email. Presentation only — every page still posts
 * to its own existing server action; nothing about how auth works changed
 * here, only how it looks. EasyMail has no GitHub/Google account-login
 * (only Gmail/Outlook mailbox connection, a separate later step), so this
 * intentionally does not add social login buttons.
 */
export function AuthFrame({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-3xl"
      />

      <div className="relative w-full max-w-[400px]">
        <Link
          className="brand-link mx-auto flex w-fit items-center gap-2 rounded-[var(--radius-md)] px-1.5 py-1"
          href="/"
        >
          <Image
            alt=""
            aria-hidden="true"
            className="size-[22px] shrink-0 rounded-[6px]"
            height={22}
            src="/logo.png"
            width={22}
          />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-text">
            EasyMail
          </span>
        </Link>

        <div className="mt-8 text-center">
          <h1 className="text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-[22px] text-text-muted">{description}</p>
        </div>

        <div className="mt-8 rounded-[16px] border border-border bg-surface p-7 shadow-[0_20px_50px_rgba(18,18,18,0.06)]">
          {children}
        </div>

        {footer ? (
          <div className="mt-6 text-center text-[13px] leading-5 text-text-muted">
            {footer}
          </div>
        ) : null}
      </div>
    </main>
  );
}
