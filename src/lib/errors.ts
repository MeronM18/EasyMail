export type AppErrorCode =
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "DATA_ACCESS_FAILED"
  | "INTERNAL_ERROR"
  | "INTEGRATION_NOT_CONFIGURED"
  | "INTEGRATION_ERROR";

const statuses: Record<AppErrorCode, number> = {
  AUTH_REQUIRED: 401,
  FORBIDDEN: 403,
  INVALID_INPUT: 400,
  NOT_FOUND: 404,
  DATA_ACCESS_FAILED: 500,
  INTERNAL_ERROR: 500,
  // Server is missing required provider credentials for this integration.
  INTEGRATION_NOT_CONFIGURED: 503,
  // A configured provider (Google, Microsoft, AI Gateway) returned a failure.
  INTEGRATION_ERROR: 502,
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly safeMessage: string;

  constructor(code: AppErrorCode, safeMessage: string, options?: ErrorOptions) {
    super(safeMessage, options);
    this.name = "AppError";
    this.code = code;
    this.status = statuses[code];
    this.safeMessage = safeMessage;
  }
}

export function normalizeError(error: unknown) {
  if (error instanceof AppError) return error;
  return new AppError("INTERNAL_ERROR", "Something went wrong. Please try again.", {
    cause: error,
  });
}
