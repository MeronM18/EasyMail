import { describe, expect, it } from "vitest";
import {
  bodyRetentionDeadline,
  messageRetentionCutoff,
  MESSAGE_RETENTION_DAYS,
  BODY_RETENTION_DAYS,
} from "@/lib/integrations/retention";

describe("retention windows", () => {
  it("computes the message retention cutoff as 14 days before now", () => {
    const now = new Date("2026-09-20T00:00:00.000Z");
    expect(messageRetentionCutoff(now).toISOString()).toBe("2026-09-06T00:00:00.000Z");
    expect(MESSAGE_RETENTION_DAYS).toBe(14);
  });

  it("computes the body retention deadline as 7 days after now", () => {
    const now = new Date("2026-09-20T00:00:00.000Z");
    expect(bodyRetentionDeadline(now).toISOString()).toBe("2026-09-27T00:00:00.000Z");
    expect(BODY_RETENTION_DAYS).toBe(7);
  });
});
