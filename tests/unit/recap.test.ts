import { describe, expect, it } from "vitest";
import type { RecapMessage } from "@/lib/recap";
import {
  countPendingMessages,
  getSetupProgress,
  getWindowStart,
  groupRecapMessages,
  parseRecapWindow,
  resolveRecapVisitWindow,
} from "@/lib/recap";

function message(id: string, intent: RecapMessage["intent"]): RecapMessage {
  return {
    id,
    accountId: "account",
    accountLabel: "Work",
    accountEmail: "work@example.com",
    provider: "microsoft",
    receivedAt: "2026-09-11T12:00:00.000Z",
    fromAddress: "sender@example.com",
    fromName: "Sender",
    subject: id,
    snippet: "Preview",
    webLink: null,
    intent,
    modelIntent: intent,
    reason: null,
    actionSignal: null,
    isUserOverride: false,
  };
}

describe("deterministic recap", () => {
  it("groups the five intents into the approved recap hierarchy", () => {
    const groups = groupRecapMessages([
      message("reply", "needs_reply"),
      message("action", "needs_action"),
      message("matters", "matters"),
      message("ignore", "can_ignore"),
      message("cleanup", "cleanup_candidate"),
    ]);

    expect(groups.needsNow.map(({ id }) => id)).toEqual(["reply", "action"]);
    expect(groups.matters.map(({ id }) => id)).toEqual(["matters"]);
    expect(groups.canIgnore).toHaveLength(1);
    expect(groups.cleanup).toHaveLength(1);
  });

  it("caps Also matters at four items", () => {
    const groups = groupRecapMessages(
      Array.from({ length: 6 }, (_, index) => message(String(index), "matters")),
    );
    expect(groups.matters).toHaveLength(4);
  });

  it("uses a safe fallback for invalid or future recap windows", () => {
    const now = new Date("2026-09-11T16:00:00.000Z");
    expect(parseRecapWindow("unexpected")).toBe("since_last_visit");
    expect(
      getWindowStart("since_last_visit", now, "2026-09-10T12:00:00.000Z").toISOString(),
    ).toBe("2026-09-10T12:00:00.000Z");
    expect(
      getWindowStart("since_last_visit", now, "2026-09-12T12:00:00.000Z").toISOString(),
    ).toBe("2026-09-10T16:00:00.000Z");
  });

  it("keeps the prior recap boundary throughout an active visit session", () => {
    const visit = resolveRecapVisitWindow({
      now: new Date("2026-09-11T16:00:00.000Z"),
      lastVisitAt: "2026-09-11T15:55:00.000Z",
      sessionStartedAt: "2026-09-11T15:55:00.000Z",
      sessionWindowStartAt: "2026-09-10T14:00:00.000Z",
    });

    expect(visit.isExistingSession).toBe(true);
    expect(visit.windowStart.toISOString()).toBe("2026-09-10T14:00:00.000Z");
  });

  it("starts a new visit from the previous successful visit after the session expires", () => {
    const visit = resolveRecapVisitWindow({
      now: new Date("2026-09-11T16:00:00.000Z"),
      lastVisitAt: "2026-09-11T12:00:00.000Z",
      sessionStartedAt: "2026-09-11T12:00:00.000Z",
      sessionWindowStartAt: "2026-09-10T12:00:00.000Z",
    });

    expect(visit.isExistingSession).toBe(false);
    expect(visit.windowStart.toISOString()).toBe("2026-09-11T12:00:00.000Z");
  });

  it("tracks the approved two-Gmail plus one-Outlook setup target", () => {
    expect(
      getSetupProgress([
        { provider: "google", status: "active" },
        { provider: "microsoft", status: "needs_reconnect" },
      ]),
    ).toMatchObject({ completed: 2, total: 3, isComplete: false });

    expect(
      getSetupProgress([
        { provider: "google", status: "active" },
        { provider: "google", status: "active" },
        { provider: "microsoft", status: "active" },
      ]).isComplete,
    ).toBe(true);
  });
});

describe("countPendingMessages", () => {
  it("counts only messages still pending", () => {
    expect(
      countPendingMessages([
        { classification_status: "pending" },
        { classification_status: "classified" },
        { classification_status: "pending" },
      ]),
    ).toBe(2);
  });

  it("excludes permanently failed classifications (Phase 12, G2)", () => {
    expect(
      countPendingMessages([
        { classification_status: "pending" },
        { classification_status: "failed" },
        { classification_status: "failed" },
      ]),
    ).toBe(1);
  });

  it("does not hide genuinely pending messages alongside failed ones", () => {
    expect(
      countPendingMessages([
        { classification_status: "failed" },
        { classification_status: "pending" },
        { classification_status: "classified" },
        { classification_status: "pending" },
      ]),
    ).toBe(2);
  });
});
