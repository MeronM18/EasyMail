import { describe, expect, it } from "vitest";
import { decideSyncOutcome } from "@/lib/integrations/sync-outcome";

describe("decideSyncOutcome", () => {
  it("treats a legitimately empty result as a successful sync (Phase 12, G1)", () => {
    const outcome = decideSyncOutcome({ fetchFailed: 0, classifyFailed: 0 });
    expect(outcome).toEqual({
      accountStatus: "active",
      statusMessage: null,
      finishStatus: "succeeded",
    });
  });

  it("treats a fully successful sync with real messages the same as an empty one", () => {
    // decideSyncOutcome only ever sees failure counts — how many messages
    // were stored/classified is irrelevant to the status decision.
    const outcome = decideSyncOutcome({ fetchFailed: 0, classifyFailed: 0 });
    expect(outcome.accountStatus).toBe("active");
  });

  it("marks a partial failure (some messages failed, some succeeded) as sync_error/partial", () => {
    const outcome = decideSyncOutcome({ fetchFailed: 2, classifyFailed: 0 });
    expect(outcome).toEqual({
      accountStatus: "sync_error",
      statusMessage: "The last sync only partially completed.",
      finishStatus: "partial",
    });
  });

  it("marks a classify-only failure as sync_error/partial too", () => {
    const outcome = decideSyncOutcome({ fetchFailed: 0, classifyFailed: 3 });
    expect(outcome.accountStatus).toBe("sync_error");
    expect(outcome.finishStatus).toBe("partial");
  });

  it("never claims an automatic retry will happen", () => {
    const outcome = decideSyncOutcome({ fetchFailed: 1, classifyFailed: 1 });
    expect(outcome.statusMessage).not.toMatch(/automatically/i);
  });
});
