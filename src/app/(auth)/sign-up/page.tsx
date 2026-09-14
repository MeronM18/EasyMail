import type { Metadata } from "next";
import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthFrame } from "@/components/auth/auth-frame";
import { Alert } from "@/components/ui/alert";
import { getAuthMessage } from "@/lib/auth/messages";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const error = (await searchParams).error;
  const message = getAuthMessage(Array.isArray(error) ? error[0] : error);

  return (
    <AuthFrame
      description="Start with a private EasyMail account. You will choose which inboxes to connect separately."
      footer={
        <>
          Already have an account?{" "}
          <Link
            className="font-medium text-primary hover:text-primary-hover"
            href="/sign-in"
          >
            Sign in
          </Link>
        </>
      }
      title="Create your account"
    >
      {message ? (
        <Alert className="mb-5" tone="error">
          {message}
        </Alert>
      ) : null}
      <AuthForm action={signUpAction} mode="sign-up" submitLabel="Create account">
        <p className="text-xs leading-4 text-text-subtle">
          Creating an account does not connect to Gmail or Outlook. Mail access is
          requested separately and remains read-only.
        </p>
      </AuthForm>
    </AuthFrame>
  );
}
