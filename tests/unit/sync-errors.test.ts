import { describe, expect, it } from "vitest";
import { SyncAlreadyInProgressError } from "@/lib/integrations/sync-errors";

describe("SyncAlreadyInProgressError", () => {
  it("is distinguishable from a generic error (Phase 12, G6)", () => {
    const error = new SyncAlreadyInProgressError();
    expect(error).toBeInstanceOf(SyncAlreadyInProgressError);
    expect(error).toBeInstanceOf(Error);
    expect(new Error("unrelated")).not.toBeInstanceOf(SyncAlreadyInProgressError);
  });

  it("carries a clear, safe default message", () => {
    const error = new SyncAlreadyInProgressError();
    expect(error.message).toBe("A sync is already in progress for this mailbox.");
    expect(error.name).toBe("SyncAlreadyInProgressError");
  });
});
