import { LogOut } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function AppHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-7">
          <Link
            className="text-base font-semibold tracking-[-0.02em] text-text"
            href="/app"
          >
            EasyMail
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-1 sm:flex">
            <Link
              className="rounded-[var(--radius-md)] px-3 py-2 text-[13px] font-medium text-text hover:bg-surface-muted"
              href="/app"
            >
              Home
            </Link>
            <Link
              className="rounded-[var(--radius-md)] px-3 py-2 text-[13px] font-medium text-text-muted hover:bg-surface-muted hover:text-text"
              href="/app/settings"
            >
              Settings
            </Link>
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
        className="flex border-t border-border px-4 py-2 sm:hidden"
      >
        <Link
          className="flex-1 rounded-[var(--radius-md)] px-3 py-2 text-center text-[13px] font-medium text-text hover:bg-surface-muted"
          href="/app"
        >
          Home
        </Link>
        <Link
          className="flex-1 rounded-[var(--radius-md)] px-3 py-2 text-center text-[13px] font-medium text-text-muted hover:bg-surface-muted hover:text-text"
          href="/app/settings"
        >
          Settings
        </Link>
      </nav>
    </header>
  );
}
