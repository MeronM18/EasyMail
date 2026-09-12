import { describe, expect, it } from "vitest";
import {
  decryptToken,
  encryptToken,
  TokenCipherConfigError,
  TokenCipherDecryptError,
} from "@/lib/crypto/token-cipher";

const KEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="; // 32 zero bytes, test-only
const OTHER_KEY = "//////////////////////////////////////////8="; // 32 0xff bytes, test-only

describe("token cipher", () => {
  it("round-trips a plaintext token through encrypt/decrypt", () => {
    const plaintext = "refresh-token-value-with-unicode-🔒";
    const ciphertext = encryptToken(plaintext, KEY);
    expect(ciphertext.startsWith("\\x")).toBe(true);
    expect(decryptToken(ciphertext, KEY)).toBe(plaintext);
  });

  it("produces a different ciphertext each time (random IV)", () => {
    const a = encryptToken("same-plaintext", KEY);
    const b = encryptToken("same-plaintext", KEY);
    expect(a).not.toBe(b);
  });

  it("rejects a key that is not 32 bytes", () => {
    expect(() => encryptToken("value", "short")).toThrow(TokenCipherConfigError);
  });

  it("fails closed when the wrong key is used to decrypt", () => {
    const ciphertext = encryptToken("value", KEY);
    expect(() => decryptToken(ciphertext, OTHER_KEY)).toThrow(TokenCipherDecryptError);
  });

  it("fails closed on a truncated/tampered payload", () => {
    const ciphertext = encryptToken("value", KEY);
    const tampered = ciphertext.slice(0, ciphertext.length - 4);
    expect(() => decryptToken(tampered, KEY)).toThrow(TokenCipherDecryptError);
  });
});
