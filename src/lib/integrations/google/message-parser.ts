/**
 * Pure parsing helpers for Gmail API message resources (format=full).
 * No network, no env — kept separate from gmail-client.ts so parsing logic
 * is directly unit-testable.
 */

export type GmailHeader = { name: string; value: string };

export type GmailMessagePart = {
  mimeType?: string;
  body?: { size?: number; data?: string };
  parts?: GmailMessagePart[];
};

export type GmailMessageResource = {
  id: string;
  threadId?: string;
  snippet?: string;
  internalDate?: string;
  payload?: {
    headers?: GmailHeader[];
    mimeType?: string;
    body?: { size?: number; data?: string };
    parts?: GmailMessagePart[];
  };
};

const MAX_BODY_TEXT_LENGTH = 4000;

export function getHeader(
  headers: GmailHeader[] | undefined,
  name: string,
): string | null {
  if (!headers) return null;
  const lower = name.toLowerCase();
  const match = headers.find((header) => header.name.toLowerCase() === lower);
  return match ? match.value : null;
}

export type ParsedFromHeader = { address: string; name: string | null };

/** Parses an RFC 5322 "From" header like `Name <a@b.com>` or a bare address. */
export function parseFromHeader(value: string | null): ParsedFromHeader {
  if (!value) return { address: "unknown@unknown", name: null };
  const trimmed = value.trim();
  const angleMatch = trimmed.match(/^(.*)<([^<>]+)>$/);
  if (!angleMatch) return { address: trimmed, name: null };

  const rawName = angleMatch[1].trim().replace(/^"|"$/g, "").trim();
  const address = angleMatch[2].trim();
  return { address, name: rawName || null };
}

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findPart(
  part: GmailMessagePart | undefined,
  mimeType: string,
): GmailMessagePart | null {
  if (!part) return null;
  if (part.mimeType === mimeType && part.body?.data) return part;
  for (const child of part.parts ?? []) {
    const found = findPart(child, mimeType);
    if (found) return found;
  }
  return null;
}

/** Prefers text/plain; falls back to a tag-stripped text/html; truncates for storage. */
export function extractBodyText(message: GmailMessageResource): string | null {
  const root: GmailMessagePart = {
    mimeType: message.payload?.mimeType,
    body: message.payload?.body,
    parts: message.payload?.parts,
  };

  const plain = findPart(root, "text/plain");
  if (plain?.body?.data) {
    return decodeBase64Url(plain.body.data).slice(0, MAX_BODY_TEXT_LENGTH);
  }

  const html = findPart(root, "text/html");
  if (html?.body?.data) {
    return stripHtml(decodeBase64Url(html.body.data)).slice(0, MAX_BODY_TEXT_LENGTH);
  }

  return null;
}

/** Best-effort Gmail web deep link (ARCHITECTURE.md — always paired with a UX fallback). */
export function buildGmailWebLink(messageId: string): string {
  return `https://mail.google.com/mail/u/0/#all/${messageId}`;
}
