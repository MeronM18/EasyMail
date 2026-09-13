import { describe, expect, it } from "vitest";
import {
  isSyncRunStale,
  STALE_SYNC_RUN_THRESHOLD_MS,
  staleSyncRunCutoff,
} from "@/lib/integrations/sync-staleness";

describe("staleSyncRunCutoff", () => {
  it("computes the cutoff as the threshold before now", () => {
    const now = new Date("2026-09-20T00:10:00.000Z");
    expect(staleSyncRunCutoff(now).toISOString()).toBe("2026-09-20T00:00:00.000Z");
    expect(STALE_SYNC_RUN_THRESHOLD_MS).toBe(10 * 60 * 1000);
  });
});

describe("isSyncRunStale", () => {
  const now = new Date("2026-09-20T00:10:00.000Z");

  it("treats a run started well within the threshold as not stale", () => {
    const startedAt = new Date("2026-09-20T00:08:00.000Z");
    expect(isSyncRunStale(startedAt, now)).toBe(false);
  });

  it("treats a run started exactly at the cutoff as not stale (strict inequality)", () => {
    const startedAt = staleSyncRunCutoff(now);
    expect(isSyncRunStale(startedAt, now)).toBe(false);
  });

  it("treats a run started before the cutoff as stale", () => {
    const startedAt = new Date("2026-09-20T00:00:00.000Z");
    // Exactly one threshold before now — expect one millisecond further back
    // to be unambiguously past the cutoff regardless of edge rounding.
    startedAt.setMilliseconds(startedAt.getMilliseconds() - 1);
    expect(isSyncRunStale(startedAt, now)).toBe(true);
  });

  it("treats a long-dead run as stale", () => {
    const startedAt = new Date("2026-09-19T00:00:00.000Z");
    expect(isSyncRunStale(startedAt, now)).toBe(true);
  });
});
