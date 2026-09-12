import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Barely-visible dotted accent — never a gradient/glow, per DESIGN_SYSTEM.md. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(var(--border-strong) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center lg:px-8 lg:py-28">
        <p className="text-[13px] font-medium leading-5 text-primary">
          Your inboxes, prioritized.
        </p>
        <h1 className="mt-4 text-[30px] font-semibold leading-9 tracking-[-0.02em] text-text sm:text-[38px] sm:leading-[44px]">
          Know what needs you across every inbox.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-text-muted">
          EasyMail turns Gmail and Outlook into one focused recap of what needs a reply,
          what needs action, what matters, and what can wait.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/sign-up">
              Get started
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
