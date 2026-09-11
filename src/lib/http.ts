import { NextResponse } from "next/server";
import { normalizeError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export function jsonSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function jsonError(error: unknown, event: string) {
  const normalized = normalizeError(error);
  logger.error(event, { code: normalized.code, status: normalized.status });
  return NextResponse.json(
    { error: { code: normalized.code, message: normalized.safeMessage } },
    { status: normalized.status },
  );
}
