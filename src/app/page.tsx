import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const attentionLayers = [
  {
    number: "01",
    title: "Needs you now",
    description: "Replies, decisions, and deadlines rise to the top.",
  },
  {
    number: "02",
    title: "Also matters",
    description: "Useful updates stay visible without crowding the urgent work.",
  },
  {
    number: "03",
    title: "Everything else",
    description: "Low-priority mail stays quiet until you choose to look.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link className="flex items-center gap-3 text-text" href="/">
          <span className="text-base font-semibold tracking-[-0.02em]">EasyMail</span>
          <span className="hidden border-l border-border pl-3 text-[12px] leading-4 text-text-subtle sm:block">
            Cross-inbox recap
          </span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Account">
          <Link
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            href="/sign-in"
          >
            Sign in
          </Link>
          <Link className={cn(buttonVariants({ size: "sm" }))} href="/sign-up">
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-14 px-6 pb-16 pt-16 md:grid-cols-[1.06fr_0.94fr] md:gap-16 md:pt-20 lg:gap-24 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="max-w-xl">
          <p className="mb-4 text-[13px] font-medium leading-5 text-primary">
            A recap across every inbox
          </p>
          <h1 className="max-w-xl text-[30px] font-semibold leading-9 tracking-[-0.025em] text-text">
            Your inboxes, distilled into what needs you.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-text-muted">
            EasyMail gives you one calm recap across Gmail and Outlook, so you can act on
            what matters and leave the rest for later.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link className={cn(buttonVariants({ size: "lg" }))} href="/sign-up">
              Create your account
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              href="/sign-in"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <aside
          aria-labelledby="attention-brief-heading"
          className="border-t border-border pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-1 lg:pl-12"
        >
          <div className="flex items-baseline justify-between gap-6">
            <h2
              className="text-[13px] font-medium leading-5 text-text"
              id="attention-brief-heading"
            >
              The EasyMail brief
            </h2>
            <span className="text-[12px] leading-4 text-text-subtle">
              Gmail + Outlook
            </span>
          </div>
          <ol className="mt-4 border-t border-border">
            {attentionLayers.map((layer) => (
              <li
                className="grid grid-cols-[28px_1fr] gap-3 border-b border-border py-4"
                key={layer.number}
              >
                <span className="pt-0.5 text-[12px] leading-4 text-text-subtle">
                  {layer.number}
                </span>
                <div>
                  <h3 className="text-sm font-medium leading-[22px] text-text">
                    {layer.title}
                  </h3>
                  <p className="mt-0.5 text-[13px] leading-5 text-text-muted">
                    {layer.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[12px] leading-5 text-text-subtle">
            Read and reply in the mail apps you already use. EasyMail never sends,
            archives, or deletes email for you.
          </p>
        </aside>
      </section>
    </main>
  );
}
