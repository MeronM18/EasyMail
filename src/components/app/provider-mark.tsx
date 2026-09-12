import { cn } from "@/lib/utils";

const providerMono: Record<"google" | "microsoft", string> = {
  google: "G",
  microsoft: "O",
};

export function ProviderMark({
  provider,
  className,
}: {
  provider: "google" | "microsoft";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary-subtle text-sm font-semibold text-primary",
        className,
      )}
    >
      {providerMono[provider]}
    </span>
  );
}
