const DEFAULT_AUTH_REDIRECT = "/app";

export function safeRedirectPath(
  candidate: string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
) {
  if (!candidate?.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(candidate, "https://easymail.local");
    if (parsed.origin !== "https://easymail.local") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
