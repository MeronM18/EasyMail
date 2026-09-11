import { z } from "zod";

/**
 * Environment validation (Phase 8).
 * Public vars may be read in the browser; server vars must stay server-only.
 */

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverEnvSchema = publicEnvSchema.extend({
  APP_ENV: z.enum(["local", "staging", "production"]).default("local"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1).optional(),
  TOKEN_ENCRYPTION_KEY: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  MICROSOFT_CLIENT_ID: z.string().min(1).optional(),
  MICROSOFT_CLIENT_SECRET: z.string().min(1).optional(),
  MICROSOFT_REDIRECT_URI: z.string().url().optional(),
  MICROSOFT_TENANT_ID: z.string().min(1).optional(),
  AI_GATEWAY_API_KEY: z.string().min(1).optional(),
  AI_CLASSIFY_MODEL: z.string().min(1).optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getPublicEnv(
  source: Record<string, string | undefined> = process.env,
): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: source.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: source.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: source.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function getServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnv {
  return serverEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: source.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: source.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: source.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    APP_ENV: source.APP_ENV,
    SUPABASE_SERVICE_ROLE_KEY: source.SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_URL: source.DATABASE_URL,
    TOKEN_ENCRYPTION_KEY: source.TOKEN_ENCRYPTION_KEY,
    GOOGLE_CLIENT_ID: source.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: source.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: source.GOOGLE_REDIRECT_URI,
    MICROSOFT_CLIENT_ID: source.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: source.MICROSOFT_CLIENT_SECRET,
    MICROSOFT_REDIRECT_URI: source.MICROSOFT_REDIRECT_URI,
    MICROSOFT_TENANT_ID: source.MICROSOFT_TENANT_ID,
    AI_GATEWAY_API_KEY: source.AI_GATEWAY_API_KEY,
    AI_CLASSIFY_MODEL: source.AI_CLASSIFY_MODEL,
  });
}

export function getAppUrl(
  source: Record<string, string | undefined> = process.env,
): string {
  return z.string().url().parse(source.NEXT_PUBLIC_APP_URL);
}

/** Example values used by unit tests — not real secrets. */
export const examplePublicEnv = {
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
} as const;

export const exampleServerEnv = {
  ...examplePublicEnv,
  APP_ENV: "local" as const,
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  TOKEN_ENCRYPTION_KEY: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
  GOOGLE_CLIENT_ID: "google-client-id",
  GOOGLE_CLIENT_SECRET: "google-client-secret",
  GOOGLE_REDIRECT_URI: "http://localhost:3000/api/oauth/google/callback",
  MICROSOFT_CLIENT_ID: "microsoft-client-id",
  MICROSOFT_CLIENT_SECRET: "microsoft-client-secret",
  MICROSOFT_REDIRECT_URI: "http://localhost:3000/api/oauth/microsoft/callback",
  MICROSOFT_TENANT_ID: "common",
  AI_GATEWAY_API_KEY: "ai-gateway-key",
} as const;
