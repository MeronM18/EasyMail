import * as React from "react";
import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info";
const toneClasses: Record<AlertTone, string> = {
  error: "border-error/20 bg-error-bg text-error-fg",
  success: "border-success/20 bg-success-bg text-success-fg",
  info: "border-info/20 bg-info-bg text-info-fg",
};

function Alert({
  className,
  tone = "info",
  ...props
}: React.ComponentProps<"div"> & { tone?: AlertTone }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border px-4 py-3 text-[13px] leading-5",
        toneClasses[tone],
        className,
      )}
      role={tone === "error" ? "alert" : "status"}
      {...props}
    />
  );
}

export { Alert };
