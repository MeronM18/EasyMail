"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
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
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-[13px] font-medium text-error">Something went wrong</p>
      <h1 className="mt-2 text-2xl font-semibold leading-8 tracking-[-0.02em] text-text">
        We could not load this page.
      </h1>
      <p className="mt-3 text-sm leading-[22px] text-text-muted">
        Your data has not been changed. Try the request again.
      </p>
      <div className="mt-6">
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
