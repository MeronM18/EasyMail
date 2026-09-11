import Link from "next/link";

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
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex h-[72px] w-full max-w-5xl items-center px-6 lg:px-8">
        <Link className="flex items-center gap-3 text-text" href="/">
          <span className="text-base font-semibold tracking-[-0.02em]">EasyMail</span>
          <span className="hidden border-l border-border pl-3 text-[12px] leading-4 text-text-subtle sm:block">
            Cross-inbox recap
          </span>
        </Link>
      </header>
      <div className="mx-auto grid w-full max-w-5xl gap-12 px-6 pb-16 pt-12 md:grid-cols-[minmax(0,400px)_minmax(0,1fr)] md:gap-20 md:pt-20 lg:gap-28 lg:px-8">
        <div>
          <section>
            <h1 className="text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-[22px] text-text-muted">{description}</p>
            <div className="mt-7">{children}</div>
          </section>
          {footer ? (
            <div className="mt-6 text-[13px] leading-5 text-text-muted">{footer}</div>
          ) : null}
        </div>
        <aside className="border-t border-border pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-1 lg:pl-12">
          <p className="text-[12px] font-medium leading-4 text-text-subtle">
            What EasyMail does
          </p>
          <h2 className="mt-3 max-w-sm text-xl font-semibold leading-7 tracking-[-0.015em] text-text">
            One place to decide where your attention goes next.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-[22px] text-text-muted">
            EasyMail organizes a focused recap across your connected inboxes. Your mail
            stays in Gmail and Outlook, where you continue to read and reply.
          </p>
          <p className="mt-8 max-w-sm border-t border-border pt-5 text-[12px] leading-5 text-text-subtle">
            Connecting a mailbox is a separate, read-only step. EasyMail does not send,
            archive, or delete email for you.
          </p>
        </aside>
      </div>
    </main>
  );
}
