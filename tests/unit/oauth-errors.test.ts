import { describe, expect, it } from "vitest";
import {
  isInvalidGrantError,
  parseOAuthErrorBody,
  ProviderReauthRequiredError,
} from "@/lib/integrations/oauth-errors";

describe("parseOAuthErrorBody", () => {
  it("parses a valid JSON error body", () => {
    expect(parseOAuthErrorBody('{"error":"invalid_grant"}')).toEqual({
      error: "invalid_grant",
    });
  });

  it("returns null for an empty body", () => {
    expect(parseOAuthErrorBody("")).toBeNull();
  });

  it("returns null for a malformed body rather than throwing", () => {
    expect(parseOAuthErrorBody("not json")).toBeNull();
  });
});

describe("isInvalidGrantError", () => {
  it("detects Google's expired/revoked refresh token response", () => {
    expect(isInvalidGrantError({ error: "invalid_grant" })).toBe(true);
  });

  it("detects Microsoft's expired/revoked refresh token response (same RFC 6749 code)", () => {
    expect(
      isInvalidGrantError(
        parseOAuthErrorBody(
          '{"error":"invalid_grant","error_description":"AADSTS70000"}',
        ),
      ),
    ).toBe(true);
  });

  it("does not treat a transient/server error body as invalid_grant", () => {
    expect(isInvalidGrantError({ error: "temporarily_unavailable" })).toBe(false);
  });

  it("does not treat a null body (e.g. a 5xx with no JSON) as invalid_grant", () => {
    expect(isInvalidGrantError(null)).toBe(false);
  });

  it("does not treat a body with no error field as invalid_grant", () => {
    expect(isInvalidGrantError({})).toBe(false);
  });
});

describe("ProviderReauthRequiredError", () => {
  it("carries a safe, generic message that never echoes provider response text", () => {
    const error = new ProviderReauthRequiredError();
    expect(error.name).toBe("ProviderReauthRequiredError");
    expect(error.message).not.toMatch(/invalid_grant|AADSTS/);
  });
});
