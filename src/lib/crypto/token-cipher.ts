import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * AES-256-GCM encryption for provider OAuth tokens (SECURITY.md).
 *
 * Output/input format is a Postgres bytea hex literal ("\x" + hex), the
 * format Supabase's PostgREST layer actually round-trips for `bytea`
 * columns — passing a raw Buffer to supabase-js serializes it as
 * `{"type":"Buffer","data":[...]}` text instead of the intended bytes, so
 * every caller must use this encoding, never a bare Buffer.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

export class TokenCipherConfigError extends Error {}
export class TokenCipherDecryptError extends Error {}

function loadKey(base64Key: string): Buffer {
  let key: Buffer;
  try {
    key = Buffer.from(base64Key, "base64");
  } catch {
    throw new TokenCipherConfigError("TOKEN_ENCRYPTION_KEY is not valid base64.");
  }
  if (key.length !== 32) {
    throw new TokenCipherConfigError("TOKEN_ENCRYPTION_KEY must decode to 32 bytes.");
  }
  return key;
}

/** Encrypts a plaintext token; returns a Postgres bytea hex literal ready to insert. */
export function encryptToken(plaintext: string, base64Key: string): string {
  const key = loadKey(base64Key);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, authTag, ciphertext]);
  return `\\x${payload.toString("hex")}`;
}

/** Decrypts a Postgres bytea hex literal (as read back from Supabase) to plaintext. */
export function decryptToken(pgBytea: string, base64Key: string): string {
  const key = loadKey(base64Key);
  const hex = pgBytea.startsWith("\\x") ? pgBytea.slice(2) : pgBytea;
  const payload = Buffer.from(hex, "hex");
  if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new TokenCipherDecryptError("Ciphertext payload is too short to be valid.");
  }
  const iv = payload.subarray(0, IV_LENGTH);
  const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  try {
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
      "utf8",
    );
  } catch (error) {
    throw new TokenCipherDecryptError("Ciphertext failed authentication or decryption.", {
      cause: error,
    });
  }
}
