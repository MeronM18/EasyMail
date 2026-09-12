import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* The page's one reserved highlight moment (DESIGN_SYSTEM.md "one
          highlight moment max") — solid brand color, used only here, for the
          final conversion action. Same dotted-accent technique as Hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8 lg:py-32">
        <h2 className="text-[32px] font-semibold leading-10 tracking-[-0.02em] text-primary-foreground sm:text-[42px] sm:leading-[48px]">
          Stop guessing what needs you.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/80">
          Connect Gmail, get one focused recap, and keep your judgment as the final word
          on every message.
        </p>
        <Button
          asChild
          className="mt-9 bg-background text-text hover:bg-surface-hover"
          size="lg"
        >
          <Link href="/sign-up">
            Get started
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
