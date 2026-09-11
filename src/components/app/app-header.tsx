"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/app", label: "Recap" },
  { href: "/app/triage", label: "Triage" },
  { href: "/app/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === "/app" || pathname.startsWith("/app/messages/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-7">
          <Link
            className="brand-link -ml-1.5 rounded-[var(--radius-md)] px-1.5 py-1 text-base font-semibold tracking-[-0.02em] text-text"
            href="/app"
          >
            EasyMail
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-1 sm:flex">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-[var(--radius-md)] px-3 py-2 text-[13px] font-medium ${
                    active
                      ? "bg-surface-muted text-text after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:bg-primary"
                      : "text-text-muted hover:bg-surface-muted hover:text-text"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-48 truncate text-[13px] text-text-subtle md:inline">
            {email}
          </span>
          <form action={signOutAction}>
            <Button
              aria-label="Sign out"
              size="icon"
              title="Sign out"
              type="submit"
              variant="ghost"
            >
              <LogOut aria-hidden="true" className="size-4" />
            </Button>
          </form>
        </div>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="grid grid-cols-3 border-t border-border px-4 py-2 sm:hidden"
      >
        {navigation.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`rounded-[var(--radius-md)] px-2 py-2 text-center text-[13px] font-medium ${
                active
                  ? "bg-surface-muted text-text"
                  : "text-text-muted hover:bg-surface-muted hover:text-text"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
