import "server-only";
import { requireUser } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

export type FoundationState = {
  displayName: string | null;
  accountCount: number;
};

/**
 * Reads only the authenticated user's rows. The user id comes from a verified
 * Supabase session, never from request input; RLS remains the second boundary.
 */
export async function getFoundationState(): Promise<FoundationState> {
  const user = await requireUser();
  const supabase = await createClient();
  const [profileResult, accountResult] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("mail_accounts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (profileResult.error || accountResult.error) {
    throw new AppError("DATA_ACCESS_FAILED", "We could not load your workspace.");
  }

  return {
    displayName: profileResult.data?.display_name ?? null,
    accountCount: accountResult.count ?? 0,
  };
}
