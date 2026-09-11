import { describe, expect, it } from "vitest";
import { AppError, normalizeError } from "@/lib/errors";

describe("application errors", () => {
  it("preserves controlled errors", () => {
    const error = new AppError("NOT_FOUND", "The item was not found.");
    expect(normalizeError(error)).toBe(error);
    expect(error.status).toBe(404);
  });

  it("replaces unexpected details with a safe message", () => {
    const normalized = normalizeError(new Error("database password leaked here"));
    expect(normalized.code).toBe("INTERNAL_ERROR");
    expect(normalized.safeMessage).toBe("Something went wrong. Please try again.");
    expect(normalized.safeMessage).not.toContain("password");
  });
});
