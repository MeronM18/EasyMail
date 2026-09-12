import {
  Link2,
  RefreshCw,
  Sparkles,
  ListChecks,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const steps: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Link2,
    title: "Connect",
    description:
      "Link Gmail and Outlook accounts with read-only access. Nothing is ever sent on your behalf.",
  },
  {
    icon: RefreshCw,
    title: "Sync",
    description:
      "EasyMail pulls in recent messages from every connected account on a regular schedule.",
  },
  {
    icon: Sparkles,
    title: "Classify",
    description:
      "Each message is scored into one of five intents — what needs a reply, action, or can wait.",
  },
  {
    icon: ListChecks,
    title: "Recap",
    description:
      "One prioritized view replaces switching between inboxes to figure out what matters.",
  },
  {
    icon: CheckCircle2,
    title: "Act",
    description:
      "Open a message in its own inbox to reply or handle it — EasyMail never acts for you.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border" id="how-it-works">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium leading-5 text-primary">How it works</p>
          <h2 className="mt-4 text-[26px] font-semibold leading-8 tracking-[-0.01em] text-text sm:text-[30px] sm:leading-9">
            From five inboxes to one recap
          </h2>
          <p className="mt-5 text-base leading-7 text-text-muted">
            Five steps, running quietly in the background, so you open one page instead of
            five.
          </p>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-y-0">
          {steps.map((step, index) => (
            <li className="relative flex gap-4 lg:flex-col lg:gap-0" key={step.title}>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-8 left-4 hidden h-[calc(100%+3rem)] w-px bg-border sm:block lg:top-4 lg:left-[calc(50%+1rem)] lg:h-px lg:w-[calc(100%-2rem)]"
                />
              )}
              <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[12px] font-semibold text-primary lg:mx-auto">
                {index + 1}
              </span>
              <div className="lg:mt-5 lg:text-center">
                <step.icon
                  aria-hidden="true"
                  className="mb-2 hidden size-4 text-primary lg:mx-auto lg:block"
                  strokeWidth={1.8}
                />
                <h3 className="text-sm font-semibold leading-5 text-text">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-6 text-text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
