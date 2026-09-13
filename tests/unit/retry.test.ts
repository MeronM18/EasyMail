import { describe, expect, it, vi } from "vitest";
import { retryTransient } from "@/lib/retry";

function transientError() {
  return new Error("transient");
}

function permanentError() {
  return new Error("permanent");
}

describe("retryTransient", () => {
  it("returns the result on the first successful attempt without retrying", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await retryTransient(fn, {
      maxAttempts: 3,
      baseDelayMs: 1,
      isTransient: () => true,
    });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries a transient failure and succeeds on a later attempt", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(transientError())
      .mockRejectedValueOnce(transientError())
      .mockResolvedValueOnce("recovered");

    const onRetry = vi.fn();
    const result = await retryTransient(fn, {
      maxAttempts: 3,
      baseDelayMs: 1,
      isTransient: () => true,
      onRetry,
    });

    expect(result).toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it("exhausts bounded retries on a persistent transient failure and throws the last error", async () => {
    const err = transientError();
    const fn = vi.fn().mockRejectedValue(err);

    await expect(
      retryTransient(fn, { maxAttempts: 3, baseDelayMs: 1, isTransient: () => true }),
    ).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("does not retry a non-transient failure — throws immediately on the first attempt", async () => {
    const err = permanentError();
    const fn = vi.fn().mockRejectedValue(err);

    await expect(
      retryTransient(fn, { maxAttempts: 3, baseDelayMs: 1, isTransient: () => false }),
    ).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("returns a recover() result immediately instead of retrying or throwing", async () => {
    const fn = vi.fn().mockRejectedValue(transientError());
    const result = await retryTransient(fn, {
      maxAttempts: 3,
      baseDelayMs: 1,
      isTransient: () => true,
      recover: () => "repaired",
    });
    expect(result).toBe("repaired");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not treat a recover() returning undefined as a recovery", async () => {
    const err = transientError();
    const fn = vi.fn().mockRejectedValueOnce(err).mockResolvedValueOnce("ok");
    const result = await retryTransient(fn, {
      maxAttempts: 3,
      baseDelayMs: 1,
      isTransient: () => true,
      recover: () => undefined,
    });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
