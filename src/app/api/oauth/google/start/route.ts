import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getAppUrl } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { buildGoogleAuthorizationUrl } from "@/lib/integrations/google/oauth";
import { createOAuthState } from "@/lib/integrations/oauth-state";
import { logger } from "@/lib/logger";

export async function GET() {
  const user = await requireUser();

  try {
    const { state, codeChallenge } = await createOAuthState(user.id, "google");
    const authorizeUrl = buildGoogleAuthorizationUrl({ state, codeChallenge });
    return NextResponse.redirect(authorizeUrl);
  } catch (error) {
    const code = error instanceof AppError ? error.code : "INTERNAL_ERROR";
    logger.error("oauth.google.start_failed", { code });
    const errorParam =
      code === "INTEGRATION_NOT_CONFIGURED"
        ? "google_not_configured"
        : "google_connect_failed";
    return NextResponse.redirect(
      new URL(`/app/settings?error=${errorParam}`, getAppUrl()),
    );
  }
}
