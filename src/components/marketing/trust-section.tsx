import { ArrowRight, MousePointerClick } from "lucide-react";
import { IntentLabel } from "@/components/app/intent-label";

export function TrustSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <p className="text-[13px] font-medium leading-5 text-primary">
            Your judgment wins
          </p>
          <h2 className="mt-4 text-[26px] font-semibold leading-8 tracking-[-0.01em] text-text sm:text-[30px] sm:leading-9">
            The model suggests. You decide.
          </h2>
          <p className="mt-5 text-base leading-7 text-text-muted">
            Classification is a starting point, not a verdict. Correct any message and
            EasyMail remembers your call — the model won&apos;t quietly reclassify it back
            on the next sync.
          </p>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-md)]">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface-muted px-4 py-3">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#ff5f57]" />
            <span aria-hidden="true" className="size-2 rounded-full bg-[#febc2e]" />
            <span aria-hidden="true" className="size-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[11px] text-text-subtle">EasyMail — Message</span>
          </div>

          <div className="p-6 sm:p-7">
            <p className="text-[13px] font-medium leading-5 text-text">
              &quot;Still interested? Everything&apos;s 40% off&quot;
            </p>
            <p className="mt-0.5 text-[12px] leading-5 text-text-subtle">
              Promo Deals · Personal · Gmail
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-subtle">
                  Model suggested
                </span>
                <IntentLabel className="opacity-60" full intent="cleanup_candidate" />
              </div>
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 text-text-subtle sm:mt-5"
              />
              <div className="flex flex-col gap-1.5 rounded-[var(--radius-md)] bg-primary-subtle p-2.5 ring-1 ring-primary/25">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-primary">
                  <MousePointerClick
                    aria-hidden="true"
                    className="size-3"
                    strokeWidth={2}
                  />
                  You corrected to
                </span>
                <IntentLabel full intent="needs_action" />
              </div>
            </div>

            <p className="mt-5 border-t border-border pt-4 text-[12px] leading-5 text-text-subtle">
              This correction is permanent. Future syncs won&apos;t override it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
