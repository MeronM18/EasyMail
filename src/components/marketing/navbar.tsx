"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Anchor ids match the section ids Pass C ("Product"/"How it works") and
// Pass F ("Security") will add to the same page — harmless no-ops until then.
const navLinks = [
  { href: "#features", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
];

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link
          className="brand-link -ml-1.5 inline-flex items-center gap-2 rounded-[var(--radius-md)] px-1.5 py-1"
          href="/"
        >
          <span
            aria-hidden="true"
            className="size-[18px] shrink-0 rounded-[6px] bg-primary"
          />
          <span className="text-[17px] font-bold tracking-[-0.02em] text-text">
            EasyMail
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              className="text-sm font-medium text-text-muted transition-colors hover:text-text"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
            href="/sign-in"
          >
            Sign in
          </Link>
          <Button asChild size="sm">
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              aria-label="Open menu"
              className="md:hidden"
              size="icon"
              variant="ghost"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>EasyMail</SheetTitle>
            </SheetHeader>
            <nav aria-label="Main" className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    className="rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-text hover:bg-surface-muted"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-2 flex flex-col gap-2 border-t border-border px-4 pt-4">
              <SheetClose asChild>
                <Button asChild variant="outline">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild>
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
