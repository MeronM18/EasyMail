"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <div className="group relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 -left-1 size-2 border-t-2 border-l-2 border-primary transition-all duration-200 group-hover:size-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 -right-1 size-2 border-t-2 border-r-2 border-primary transition-all duration-200 group-hover:size-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1 -left-1 size-2 border-b-2 border-l-2 border-primary transition-all duration-200 group-hover:size-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1 -right-1 size-2 border-b-2 border-r-2 border-primary transition-all duration-200 group-hover:size-3.5"
      />
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : null}
        {pending ? "Please wait" : children}
      </Button>
    </div>
  );
}
