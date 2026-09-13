import { afterEach, describe, expect, it, vi } from "vitest";
import { exampleServerEnv } from "@/lib/env";
import { AppError } from "@/lib/errors";
import {
  getAiClassifyConfig,
  getCronSecret,
  getGoogleOAuthConfig,
  getMicrosoftOAuthConfig,
  getTokenEncryptionKey,
} from "@/lib/integrations/config";

/**
 * Verifies the Phase 11 adjustment: missing Google/AI/Cron credentials must
 * fail with a clear `AppError("INTEGRATION_NOT_CONFIGURED")` at the point of
 * use, never a raw/opaque error — and must never block once configured.
 */

function stubBaseEnv() {
  for (const [key, value] of Object.entries(exampleServerEnv)) {
    vi.stubEnv(key, value);
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("integration config boundary", () => {
  it("fails clearly when the base server environment is entirely unconfigured", () => {
    vi.stubEnv("TOKEN_ENCRYPTION_KEY", undefined);
    expect(() => getTokenEncryptionKey()).toThrow(AppError);
    try {
      getTokenEncryptionKey();
    } catch (error) {
      expect((error as AppError).code).toBe("INTEGRATION_NOT_CONFIGURED");
    }
  });

  it("returns the token encryption key once the base env is present", () => {
    stubBaseEnv();
    expect(getTokenEncryptionKey()).toBe(exampleServerEnv.TOKEN_ENCRYPTION_KEY);
  });

  it("throws when Google credentials are only partially configured", () => {
    // exampleServerEnv already includes dummy Google values (it exercises
    // the full schema) — clear the other two to isolate "partially set".
    stubBaseEnv();
    vi.stubEnv("GOOGLE_CLIENT_ID", "id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", undefined);
    vi.stubEnv("GOOGLE_REDIRECT_URI", undefined);
    expect(() => getGoogleOAuthConfig()).toThrow(AppError);
  });

  it("returns Google config once fully configured", () => {
    stubBaseEnv();
    vi.stubEnv("GOOGLE_CLIENT_ID", "id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "secret");
    vi.stubEnv("GOOGLE_REDIRECT_URI", "http://localhost:3000/api/oauth/google/callback");
    expect(getGoogleOAuthConfig()).toEqual({
      clientId: "id",
      clientSecret: "secret",
      redirectUri: "http://localhost:3000/api/oauth/google/callback",
    });
  });

  it("throws when Microsoft credentials are only partially configured", () => {
    // exampleServerEnv already includes dummy Microsoft values — clear the
    // other two to isolate "partially set".
    stubBaseEnv();
    vi.stubEnv("MICROSOFT_CLIENT_ID", "id");
    vi.stubEnv("MICROSOFT_CLIENT_SECRET", undefined);
    vi.stubEnv("MICROSOFT_REDIRECT_URI", undefined);
    expect(() => getMicrosoftOAuthConfig()).toThrow(AppError);
  });

  it("returns Microsoft config once fully configured", () => {
    stubBaseEnv();
    vi.stubEnv("MICROSOFT_CLIENT_ID", "id");
    vi.stubEnv("MICROSOFT_CLIENT_SECRET", "secret");
    vi.stubEnv(
      "MICROSOFT_REDIRECT_URI",
      "http://localhost:3000/api/oauth/microsoft/callback",
    );
    vi.stubEnv("MICROSOFT_TENANT_ID", "common");
    expect(getMicrosoftOAuthConfig()).toEqual({
      clientId: "id",
      clientSecret: "secret",
      redirectUri: "http://localhost:3000/api/oauth/microsoft/callback",
      tenantId: "common",
    });
  });

  it("defaults the Microsoft tenant to 'common' when unset", () => {
    stubBaseEnv();
    vi.stubEnv("MICROSOFT_CLIENT_ID", "id");
    vi.stubEnv("MICROSOFT_CLIENT_SECRET", "secret");
    vi.stubEnv(
      "MICROSOFT_REDIRECT_URI",
      "http://localhost:3000/api/oauth/microsoft/callback",
    );
    vi.stubEnv("MICROSOFT_TENANT_ID", undefined);
    expect(getMicrosoftOAuthConfig().tenantId).toBe("common");
  });

  it("throws when AI Gateway is not configured", () => {
    // exampleServerEnv includes a dummy AI_GATEWAY_API_KEY — clear it to
    // isolate the "not configured" case.
    stubBaseEnv();
    vi.stubEnv("AI_GATEWAY_API_KEY", undefined);
    expect(() => getAiClassifyConfig()).toThrow(AppError);
  });

  it("defaults the classify model when only the API key is set", () => {
    stubBaseEnv();
    vi.stubEnv("AI_GATEWAY_API_KEY", "key");
    expect(getAiClassifyConfig().model).toBe("anthropic/claude-haiku-4.5");
  });

  it("respects an explicit AI_CLASSIFY_MODEL pin", () => {
    stubBaseEnv();
    vi.stubEnv("AI_GATEWAY_API_KEY", "key");
    vi.stubEnv("AI_CLASSIFY_MODEL", "openai/gpt-5.4");
    expect(getAiClassifyConfig().model).toBe("openai/gpt-5.4");
  });

  it("throws when the cron secret is not configured", () => {
    stubBaseEnv();
    expect(() => getCronSecret()).toThrow(AppError);
  });

  it("returns the cron secret once configured", () => {
    stubBaseEnv();
    vi.stubEnv("CRON_SECRET", "shh");
    expect(getCronSecret()).toBe("shh");
  });
});
