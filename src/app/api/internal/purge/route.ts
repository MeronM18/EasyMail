import { AppError } from "@/lib/errors";
import { jsonError, jsonSuccess } from "@/lib/http";
import { getCronSecret } from "@/lib/integrations/config";
import { purgeExpiredMailData } from "@/lib/integrations/purge";

/**
 * Retention purge (SCHEMA.md, DEC-009). Manually invokable now via a shared
 * bearer secret; Vercel Cron scheduling (using this same `CRON_SECRET`
 * convention) is wired alongside incremental sync in a later Phase 11 step.
 */
export async function POST(request: Request) {
  try {
    const secret = getCronSecret();
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      throw new AppError("AUTH_REQUIRED", "Not authorized.");
    }

    const result = await purgeExpiredMailData();
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error, "internal.purge_failed");
  }
}
