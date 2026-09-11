import type { Intent } from "@/lib/intent";

export const recapWindows = ["since_last_visit", "today", "24h"] as const;
export type RecapWindow = (typeof recapWindows)[number];

export type RecapMessage = {
  id: string;
  accountId: string;
  accountLabel: string;
  accountEmail: string;
  provider: "google" | "microsoft";
  receivedAt: string;
  fromAddress: string;
  fromName: string | null;
  subject: string;
  snippet: string;
  webLink: string | null;
  intent: Intent;
  modelIntent: Intent;
  reason: string | null;
  actionSignal: string | null;
  isUserOverride: boolean;
};

export type RecapGroups = {
  needsNow: RecapMessage[];
  matters: RecapMessage[];
  canIgnore: RecapMessage[];
  cleanup: RecapMessage[];
};

export function parseRecapWindow(value: unknown): RecapWindow {
  return recapWindows.includes(value as RecapWindow)
    ? (value as RecapWindow)
    : "since_last_visit";
}

export function getWindowStart(
  window: RecapWindow,
  now = new Date(),
  lastVisitAt: string | null = null,
): Date {
  if (window === "since_last_visit" && lastVisitAt) {
    const lastVisit = new Date(lastVisitAt);
    if (!Number.isNaN(lastVisit.valueOf()) && lastVisit <= now) return lastVisit;
  }

  if (window === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  return new Date(now.valueOf() - 24 * 60 * 60 * 1000);
}

export function groupRecapMessages(messages: RecapMessage[]): RecapGroups {
  return {
    needsNow: messages.filter(
      ({ intent }) => intent === "needs_reply" || intent === "needs_action",
    ),
    matters: messages.filter(({ intent }) => intent === "matters").slice(0, 4),
    canIgnore: messages.filter(({ intent }) => intent === "can_ignore"),
    cleanup: messages.filter(({ intent }) => intent === "cleanup_candidate"),
  };
}

export const recapSessionDurationMs = 30 * 60 * 1000;

export type RecapVisitWindow = {
  windowStart: Date;
  isExistingSession: boolean;
};

export function resolveRecapVisitWindow({
  now,
  lastVisitAt,
  sessionStartedAt,
  sessionWindowStartAt,
}: {
  now: Date;
  lastVisitAt: string | null;
  sessionStartedAt: string | null;
  sessionWindowStartAt: string | null;
}): RecapVisitWindow {
  const sessionStarted = sessionStartedAt ? new Date(sessionStartedAt) : null;
  const sessionWindowStart = sessionWindowStartAt ? new Date(sessionWindowStartAt) : null;
  const activeCutoff = new Date(now.valueOf() - recapSessionDurationMs);
  const hasActiveSession = Boolean(
    sessionStarted &&
    sessionWindowStart &&
    !Number.isNaN(sessionStarted.valueOf()) &&
    !Number.isNaN(sessionWindowStart.valueOf()) &&
    sessionStarted <= now &&
    sessionStarted >= activeCutoff &&
    sessionWindowStart <= now,
  );

  if (hasActiveSession && sessionWindowStart) {
    return { windowStart: sessionWindowStart, isExistingSession: true };
  }

  return {
    windowStart: getWindowStart("since_last_visit", now, lastVisitAt),
    isExistingSession: false,
  };
}

export function getSetupProgress(
  accounts: Array<{ provider: "google" | "microsoft"; status: string }>,
) {
  const usable = accounts.filter(({ status }) => status !== "disconnected");
  const googleCount = usable.filter(({ provider }) => provider === "google").length;
  const microsoftCount = usable.filter(({ provider }) => provider === "microsoft").length;
  const completed = Math.min(googleCount, 2) + Math.min(microsoftCount, 1);

  return {
    completed,
    total: 3,
    isComplete: googleCount >= 2 && microsoftCount >= 1,
    googleCount,
    microsoftCount,
  };
}
