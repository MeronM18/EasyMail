"use server";

import { redirect } from "next/navigation";
import { mapSupabaseAuthError, type AuthMessageCode } from "@/lib/auth/messages";
import {
  passwordResetSchema,
  passwordUpdateSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/auth/validation";
import { getAppUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function authError(path: string, code: AuthMessageCode): never {
  redirect(`${path}?error=${encodeURIComponent(code)}`);
}

function callbackUrl(next: string) {
  const url = new URL("/auth/callback", getAppUrl());
  url.searchParams.set("next", next);
  return url.toString();
}

export async function signInAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
  });
  if (!parsed.success) {
    const code = parsed.error.issues.some((issue) => issue.path[0] === "email")
      ? "invalid_email"
      : "invalid_credentials";
    authError("/sign-in", code);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) authError("/sign-in", mapSupabaseAuthError(error.message));
  redirect("/app");
}

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
  });
  if (!parsed.success) {
    const code = parsed.error.issues.some((issue) => issue.path[0] === "email")
      ? "invalid_email"
      : "password_too_short";
    authError("/sign-up", code);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: callbackUrl("/app") },
  });
  if (error) authError("/sign-up", mapSupabaseAuthError(error.message));
  if (data.session) redirect("/app");
  redirect("/check-email");
}

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = passwordResetSchema.safeParse({ email: field(formData, "email") });
  if (!parsed.success) authError("/forgot-password", "invalid_email");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: callbackUrl("/update-password"),
  });
  if (error) authError("/forgot-password", "request_failed");
  redirect("/check-email?reason=recovery");
}

export async function updatePasswordAction(formData: FormData) {
  const parsed = passwordUpdateSchema.safeParse({
    password: field(formData, "password"),
  });
  if (!parsed.success) authError("/update-password", "password_too_short");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) authError("/sign-in", "session_required");
  const { error } = await supabase.auth.updateUser(parsed.data);
  if (error) authError("/update-password", "request_failed");
  redirect("/app?notice=password_updated");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
