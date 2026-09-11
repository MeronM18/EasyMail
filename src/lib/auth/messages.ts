export const authMessages = {
  session_required: "Sign in to continue to EasyMail.",
  invalid_credentials: "That email and password combination did not work.",
  email_unconfirmed: "Confirm your email before signing in.",
  account_exists: "An account with that email may already exist. Try signing in.",
  password_too_short: "Use at least 10 characters for your password.",
  invalid_email: "Enter a valid email address.",
  request_failed: "We could not complete that request. Please try again.",
  invalid_link: "That sign-in link is invalid or has expired.",
} as const;

export type AuthMessageCode = keyof typeof authMessages;

export function getAuthMessage(code?: string) {
  if (!code) return null;
  if (code in authMessages) return authMessages[code as AuthMessageCode];
  return authMessages.request_failed;
}

export function mapSupabaseAuthError(message: string): AuthMessageCode {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "invalid_credentials";
  if (normalized.includes("email not confirmed")) return "email_unconfirmed";
  if (
    normalized.includes("already registered") ||
    normalized.includes("already exists")
  ) {
    return "account_exists";
  }
  if (normalized.includes("password") && normalized.includes("characters")) {
    return "password_too_short";
  }
  return "request_failed";
}
