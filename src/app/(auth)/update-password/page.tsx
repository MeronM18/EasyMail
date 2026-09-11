import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { updatePasswordAction } from "@/app/actions/auth";
import { AuthFrame } from "@/components/auth/auth-frame";
import { SubmitButton } from "@/components/forms/submit-button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { getAuthMessage } from "@/lib/auth/messages";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  if (!(await getCurrentUser())) redirect("/sign-in?error=invalid_link");
  const error = (await searchParams).error;
  const message = getAuthMessage(Array.isArray(error) ? error[0] : error);
  return (
    <AuthFrame description="Use at least 10 characters." title="Choose a new password">
      {message ? (
        <Alert className="mb-5" tone="error">
          {message}
        </Alert>
      ) : null}
      <form action={updatePasswordAction} className="space-y-6">
        <div className="space-y-2">
          <label
            className="block text-[13px] font-medium leading-5 text-text"
            htmlFor="password"
          >
            New password
          </label>
          <Input
            autoComplete="new-password"
            id="password"
            minLength={10}
            name="password"
            required
            type="password"
          />
        </div>
        <SubmitButton>Save password</SubmitButton>
      </form>
    </AuthFrame>
  );
}
