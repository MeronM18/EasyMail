import Link from "next/link";

const anchorLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
];

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Link
              className="brand-link -ml-1.5 inline-block rounded-[var(--radius-md)] px-1.5 py-1 text-base font-semibold tracking-[-0.02em] text-text"
              href="/"
            >
              EasyMail
            </Link>
            <p className="mt-2 text-[13px] leading-5 text-text-muted">
              A focused recap across your connected inboxes.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-subtle">
              Product
            </p>
            {anchorLinks.map((link) => (
              <a
                className="text-[13px] text-text-muted hover:text-text"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
            <Link className="text-[13px] text-text-muted hover:text-text" href="/sign-in">
              Sign in
            </Link>
            <Link className="text-[13px] text-text-muted hover:text-text" href="/sign-up">
              Get started
            </Link>
          </nav>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-[12px] text-text-subtle">
          © {new Date().getFullYear()} EasyMail. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
