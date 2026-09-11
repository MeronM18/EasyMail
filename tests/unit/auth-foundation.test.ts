import { describe, expect, it } from "vitest";
import { getAuthMessage, mapSupabaseAuthError } from "@/lib/auth/messages";
import { safeRedirectPath } from "@/lib/auth/redirect";

describe("auth foundation", () => {
  it("accepts only same-origin relative redirect paths", () => {
    expect(safeRedirectPath("/app/settings?from=auth")).toBe("/app/settings?from=auth");
    expect(safeRedirectPath("https://attacker.example/steal")).toBe("/app");
    expect(safeRedirectPath("//attacker.example/steal")).toBe("/app");
    expect(safeRedirectPath(null)).toBe("/app");
  });

  it("maps provider errors to controlled user-facing codes", () => {
    expect(mapSupabaseAuthError("Invalid login credentials")).toBe("invalid_credentials");
    expect(mapSupabaseAuthError("Email not confirmed")).toBe("email_unconfirmed");
    expect(mapSupabaseAuthError("Unexpected internal detail")).toBe("request_failed");
  });

  it("does not display unknown provider details", () => {
    expect(getAuthMessage("unknown-sensitive-provider-error")).toBe(
      "We could not complete that request. Please try again.",
    );
  });
});
