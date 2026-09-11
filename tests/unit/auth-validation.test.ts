import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "@/lib/auth/validation";

describe("auth input validation", () => {
  it("normalizes email without altering passwords", () => {
    const parsed = signInSchema.parse({
      email: "  person@example.com  ",
      password: " password with spaces ",
    });
    expect(parsed.email).toBe("person@example.com");
    expect(parsed.password).toBe(" password with spaces ");
  });

  it("rejects invalid email and short signup passwords", () => {
    expect(
      signUpSchema.safeParse({ email: "invalid", password: "long-enough" }).success,
    ).toBe(false);
    expect(
      signUpSchema.safeParse({ email: "person@example.com", password: "short" }).success,
    ).toBe(false);
  });
});
