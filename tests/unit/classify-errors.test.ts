import { APICallError, NoObjectGeneratedError } from "ai";
import { describe, expect, it } from "vitest";
import {
  isTransientClassifyError,
  tryRepairNoObjectGenerated,
} from "@/lib/integrations/classify-errors";

function apiCallError(isRetryable: boolean, statusCode: number) {
  return new APICallError({
    message: "boom",
    url: "https://example.com",
    requestBodyValues: {},
    statusCode,
    isRetryable,
  });
}

const stubUsage = {
  inputTokens: 1,
  inputTokenDetails: {
    noCacheTokens: 1,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
  },
  outputTokens: 1,
  outputTokenDetails: { textTokens: 1, reasoningTokens: 0 },
  totalTokens: 2,
};

function noObjectGeneratedError(text: string) {
  return new NoObjectGeneratedError({
    message: "no object generated",
    text,
    response: { id: "1", timestamp: new Date(), modelId: "test-model" },
    usage: stubUsage,
    finishReason: "stop",
  });
}

describe("isTransientClassifyError", () => {
  it("treats a retryable APICallError (rate limit / 5xx) as transient", () => {
    expect(isTransientClassifyError(apiCallError(true, 429))).toBe(true);
    expect(isTransientClassifyError(apiCallError(true, 503))).toBe(true);
  });

  it("treats a non-retryable APICallError (client error) as non-transient", () => {
    expect(isTransientClassifyError(apiCallError(false, 400))).toBe(false);
  });

  it("treats a malformed structured-output error as non-transient (handled by repair, not retry)", () => {
    expect(isTransientClassifyError(noObjectGeneratedError("{}"))).toBe(false);
  });

  it("treats a network-level TypeError as transient", () => {
    expect(isTransientClassifyError(new TypeError("fetch failed"))).toBe(true);
  });

  it("does not blindly retry an unrecognized error shape", () => {
    expect(isTransientClassifyError(new Error("something unexpected"))).toBe(false);
    expect(isTransientClassifyError("not even an error")).toBe(false);
  });
});

describe("tryRepairNoObjectGenerated", () => {
  it("repairs an over-length reason by truncating and re-validating", () => {
    const longReason = "a".repeat(200);
    const error = noObjectGeneratedError(
      JSON.stringify({ intent: "matters", reason: longReason, actionSignal: null }),
    );
    const repaired = tryRepairNoObjectGenerated(error);
    expect(repaired?.reason).toHaveLength(160);
    expect(repaired?.intent).toBe("matters");
  });

  it("repairs an over-length actionSignal the same way", () => {
    const longSignal = "b".repeat(200);
    const error = noObjectGeneratedError(
      JSON.stringify({ intent: "needs_action", reason: "ok", actionSignal: longSignal }),
    );
    const repaired = tryRepairNoObjectGenerated(error);
    expect(repaired?.actionSignal).toHaveLength(160);
  });

  it("returns undefined for a genuinely invalid intent (not repairable)", () => {
    const error = noObjectGeneratedError(
      JSON.stringify({ intent: "not_a_real_intent", reason: "ok", actionSignal: null }),
    );
    expect(tryRepairNoObjectGenerated(error)).toBeUndefined();
  });

  it("returns undefined for non-JSON text", () => {
    const error = noObjectGeneratedError("not json at all");
    expect(tryRepairNoObjectGenerated(error)).toBeUndefined();
  });

  it("returns undefined for an unrelated error type", () => {
    expect(tryRepairNoObjectGenerated(new Error("unrelated"))).toBeUndefined();
  });
});
