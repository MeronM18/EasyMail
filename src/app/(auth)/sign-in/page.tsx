import type { Metadata } from "next";
import Link from "next/link";
import { signInAction } from "@/app/actions/auth";
import { AuthFrame } from "@/components/auth/auth-frame";
import { PasswordFields } from "@/components/auth/password-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { Alert } from "@/components/ui/alert";
import { getAuthMessage } from "@/lib/auth/messages";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const error = (await searchParams).error;
  const message = getAuthMessage(Array.isArray(error) ? error[0] : error);

  return (
    <AuthFrame
      description="Return to your EasyMail recap."
      footer={
        <>
          New to EasyMail?{" "}
          <Link
            className="font-medium text-primary hover:text-primary-hover"
            href="/sign-up"
          >
            Create an account
          </Link>
        </>
      }
      title="Welcome back"
    >
      {message ? (
        <Alert className="mb-5" tone="error">
          {message}
        </Alert>
      ) : null}
      <form action={signInAction} className="space-y-6">
        <PasswordFields mode="sign-in" />
        <SubmitButton>Sign in</SubmitButton>
      </form>
    </AuthFrame>
  );
}
