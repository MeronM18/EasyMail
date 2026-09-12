import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { getGmailProfile } from "@/lib/integrations/google/gmail-client";
import { syncGmailAccount } from "@/lib/integrations/google/gmail-sync";
import { exchangeGoogleAuthorizationCode } from "@/lib/integrations/google/oauth";
import { upsertGoogleMailAccount } from "@/lib/integrations/mail-accounts";
import { consumeOAuthState } from "@/lib/integrations/oauth-state";
import { logger } from "@/lib/logger";

function settingsRedirect(query: string) {
  return NextResponse.redirect(new URL(`/app/settings?${query}`, getAppUrl()));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const providerError = url.searchParams.get("error");

  if (providerError) return settingsRedirect("error=oauth_denied");
  if (!code || !state) return settingsRedirect("error=oauth_denied");

  const consumed = await consumeOAuthState(state, "google");
  if (!consumed || !consumed.codeVerifier) {
    return settingsRedirect("error=oauth_state_invalid");
  }

  try {
    const grant = await exchangeGoogleAuthorizationCode({
      code,
      codeVerifier: consumed.codeVerifier,
    });
    const profile = await getGmailProfile(grant.accessToken);

    const { id: mailAccountId } = await upsertGoogleMailAccount({
      userId: consumed.userId,
      emailAddress: profile.emailAddress,
      grant,
    });

    // Bounded to a 14-day/300-message window, so running inline stays well
    // inside Vercel's default 300s function budget. Cron-driven incremental
    // sync is separate follow-up work (approved Phase 11 order, step 5).
    await syncGmailAccount(mailAccountId, "onboarding");

    return settingsRedirect("connected=google");
  } catch (error) {
    const errorCode = error instanceof AppError ? error.code : "INTERNAL_ERROR";
    logger.error("oauth.google.callback_failed", { errorCode });
    return settingsRedirect("error=google_connect_failed");
  }
}
