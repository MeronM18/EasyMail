import { getPublicEnv } from "@/lib/env";
import { jsonError, jsonSuccess } from "@/lib/http";

export function GET() {
  try {
    getPublicEnv();
    return jsonSuccess({ status: "ok" as const });
  } catch (error) {
    return jsonError(error, "health.configuration_failed");
  }
}
