"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { CornerFrame } from "@/components/forms/corner-frame";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <CornerFrame>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : null}
        {pending ? "Please wait" : children}
      </Button>
    </CornerFrame>
  );
}
