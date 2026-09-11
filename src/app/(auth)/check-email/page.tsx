import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthFrame } from "@/components/auth/auth-frame";

export const metadata: Metadata = { title: "Check your email" };

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string | string[] }>;
}) {
  const reasonParam = (await searchParams).reason;
  const reason = Array.isArray(reasonParam) ? reasonParam[0] : reasonParam;
  const recovery = reason === "recovery";
  return (
    <AuthFrame
      description={
        recovery
          ? "Use the secure link we sent to choose a new password."
          : "Use the confirmation link we sent to finish creating your account."
      }
      footer={
        <Link
          className="font-medium text-primary hover:text-primary-hover"
          href="/sign-in"
        >
          Back to sign in
        </Link>
      }
      title="Check your email"
    >
      <div className="flex items-start gap-3 border-t border-border pt-5 text-sm leading-[22px] text-text-muted">
        <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          The link expires for your protection. If it does not arrive, check spam or
          submit the form again.
        </p>
      </div>
    </AuthFrame>
  );
}
