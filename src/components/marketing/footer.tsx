import Image from "next/image";
import Link from "next/link";

const productLinks = [
  { href: "#features", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
];

const accountLinks = [
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up", label: "Get started" },
];

export function Footer() {
  return (
    <footer className="overflow-hidden bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8 lg:px-8 lg:pt-20">
        <div className="grid gap-12 pb-14 sm:grid-cols-[minmax(0,1fr)_140px_140px] sm:gap-10">
          <div className="max-w-sm">
            <Link
              className="brand-link -ml-1.5 inline-flex items-center gap-2 rounded-[var(--radius-md)] px-1.5 py-1"
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
              <span className="text-[17px] font-semibold tracking-[-0.02em] text-text">
                EasyMail
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-6 text-text-muted">
              The read-only attention layer for people with more than one inbox.
            </p>
          </div>

          <nav aria-label="Product links">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-text-subtle">
              Product
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {productLinks.map((link) => (
                <a
                  className="text-[13px] text-text-muted transition-colors hover:text-text"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <nav aria-label="Account links">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-text-subtle">
              Account
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {accountLinks.map((link) => (
                <Link
                  className="text-[13px] text-text-muted transition-colors hover:text-text"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div aria-hidden="true" className="overflow-hidden pt-8 sm:pt-12">
          <p className="marketing-footer-wordmark select-none whitespace-nowrap text-center text-[clamp(5.5rem,20vw,17rem)] font-bold leading-[0.78] tracking-[-0.08em] text-text/[0.07]">
            EasyMail
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[11px] text-text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EasyMail. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.05em]">
            Gmail · Outlook · Read-only access
          </p>
        </div>
      </div>
    </footer>
  );
}
