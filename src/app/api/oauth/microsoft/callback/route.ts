import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { upsertMicrosoftMailAccount } from "@/lib/integrations/mail-accounts";
import { getMicrosoftProfile } from "@/lib/integrations/microsoft/graph-client";
import { syncMicrosoftAccount } from "@/lib/integrations/microsoft/graph-sync";
import { exchangeMicrosoftAuthorizationCode } from "@/lib/integrations/microsoft/oauth";
import { consumeOAuthState } from "@/lib/integrations/oauth-state";
import { SyncAlreadyInProgressError } from "@/lib/integrations/sync-errors";
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

  const consumed = await consumeOAuthState(state, "microsoft");
  if (!consumed || !consumed.codeVerifier) {
    return settingsRedirect("error=oauth_state_invalid");
  }

  try {
    const grant = await exchangeMicrosoftAuthorizationCode({
      code,
      codeVerifier: consumed.codeVerifier,
    });
    const profile = await getMicrosoftProfile(grant.accessToken);

    const { id: mailAccountId } = await upsertMicrosoftMailAccount({
      userId: consumed.userId,
      emailAddress: profile.emailAddress,
      grant,
    });

    try {
      // Bounded to a 14-day/300-message window, so running inline stays well
      // inside Vercel's default 300s function budget — same rationale as the
      // Google callback. Cron-driven incremental sync is separate follow-up
      // work for both providers.
      await syncMicrosoftAccount(mailAccountId, "onboarding");
    } catch (syncError) {
      if (!(syncError instanceof SyncAlreadyInProgressError)) throw syncError;
      // The account above was just connected/upserted successfully; a
      // different sync for it is already legitimately running (e.g. a
      // near-simultaneous double-connect). That sync will finish and set
      // its own status — this is not a connection failure (Phase 12, G6).
      logger.info("oauth.microsoft.sync_already_in_progress", { mailAccountId });
    }

    return settingsRedirect("connected=microsoft");
  } catch (error) {
    const errorCode = error instanceof AppError ? error.code : "INTERNAL_ERROR";
    logger.error("oauth.microsoft.callback_failed", { errorCode });
    return settingsRedirect("error=microsoft_connect_failed");
  }
}
