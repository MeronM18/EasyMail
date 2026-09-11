import {
  CircleCheckBig,
  Eye,
  EyeOff,
  ListFilter,
  Reply,
  type LucideIcon,
} from "lucide-react";
import { intentMeta, type Intent } from "@/lib/intent";
import { cn } from "@/lib/utils";

const intentIcons: Record<Intent, LucideIcon> = {
  needs_reply: Reply,
  needs_action: CircleCheckBig,
  matters: Eye,
  can_ignore: EyeOff,
  cleanup_candidate: ListFilter,
};

export function IntentLabel({
  intent,
  className,
  full = false,
}: {
  intent: Intent;
  className?: string;
  full?: boolean;
}) {
  const Icon = intentIcons[intent];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-[var(--radius-md)] border border-border bg-surface px-2 py-1 text-[11px] font-medium leading-4 text-text-muted",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3 text-primary" strokeWidth={1.8} />
      {full ? intentMeta[intent].label : intentMeta[intent].shortLabel}
    </span>
  );
}
