import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/actions/auth";
import { AuthFrame } from "@/components/auth/auth-frame";
import { SubmitButton } from "@/components/forms/submit-button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { getAuthMessage } from "@/lib/auth/messages";

export const metadata: Metadata = { title: "Reset password" };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const error = (await searchParams).error;
  const message = getAuthMessage(Array.isArray(error) ? error[0] : error);
  return (
    <AuthFrame
      description="We will send a secure password-reset link if the address matches an account."
      footer={
        <Link
          className="font-medium text-primary hover:text-primary-hover"
          href="/sign-in"
        >
          Back to sign in
        </Link>
      }
      title="Reset your password"
    >
      {message ? (
        <Alert className="mb-5" tone="error">
          {message}
        </Alert>
      ) : null}
      <form action={requestPasswordResetAction} className="space-y-6">
        <div className="space-y-2">
          <label
            className="block text-[13px] font-medium leading-5 text-text"
            htmlFor="email"
          >
            Email
          </label>
          <Input autoComplete="email" id="email" name="email" required type="email" />
        </div>
        <SubmitButton>Send reset link</SubmitButton>
      </form>
    </AuthFrame>
  );
}
