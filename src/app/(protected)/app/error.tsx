"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
      <p className="text-[13px] font-medium text-error">Recap unavailable</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text">
        We could not load your attention view.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-[22px] text-text-muted">
        Your messages and classifications have not been changed. Check the local Supabase
        stack, then try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
