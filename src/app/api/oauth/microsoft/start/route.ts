import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getAppUrl } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { buildMicrosoftAuthorizationUrl } from "@/lib/integrations/microsoft/oauth";
import { createOAuthState } from "@/lib/integrations/oauth-state";
import { logger } from "@/lib/logger";

export async function GET() {
  const user = await requireUser();

  try {
    const { state, codeChallenge } = await createOAuthState(user.id, "microsoft");
    const authorizeUrl = buildMicrosoftAuthorizationUrl({ state, codeChallenge });
    return NextResponse.redirect(authorizeUrl);
  } catch (error) {
    const code = error instanceof AppError ? error.code : "INTERNAL_ERROR";
    logger.error("oauth.microsoft.start_failed", { code });
    const errorParam =
      code === "INTEGRATION_NOT_CONFIGURED"
        ? "microsoft_not_configured"
        : "microsoft_connect_failed";
    return NextResponse.redirect(
      new URL(`/app/settings?error=${errorParam}`, getAppUrl()),
    );
  }
}
