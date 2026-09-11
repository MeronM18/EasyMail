import { describe, expect, it } from "vitest";
import {
  examplePublicEnv,
  exampleServerEnv,
  getPublicEnv,
  getServerEnv,
} from "@/lib/env";

describe("env schema", () => {
  it("parses example public env values", () => {
    const env = getPublicEnv({ ...examplePublicEnv });
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("http://127.0.0.1:54321");
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("test-anon-key");
  });

  it("parses example server env values", () => {
    const env = getServerEnv({ ...exampleServerEnv });
    expect(env.APP_ENV).toBe("local");
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe("test-service-role-key");
    expect(env.TOKEN_ENCRYPTION_KEY.length).toBeGreaterThan(0);
  });

  it("rejects missing required public keys", () => {
    expect(() =>
      getPublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      }),
    ).toThrow();
  });
});
