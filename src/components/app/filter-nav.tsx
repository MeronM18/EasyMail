import Link from "next/link";
import { cn } from "@/lib/utils";

export type FilterNavItem = {
  href: string;
  label: string;
  active: boolean;
};

export function FilterNav({
  ariaLabel,
  items,
  className,
}: {
  ariaLabel: string;
  items: FilterNavItem[];
  className?: string;
}) {
  return (
    <nav aria-label={ariaLabel} className={cn("flex flex-wrap gap-1", className)}>
      {items.map((item) => (
        <Link
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "rounded-[var(--radius-md)] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
            item.active
              ? "bg-surface-muted text-text"
              : "text-text-muted hover:bg-surface-muted hover:text-text",
          )}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
