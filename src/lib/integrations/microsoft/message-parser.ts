/**
 * Pure normalization helpers for Microsoft Graph message resources.
 * No network, no env — kept separate from graph-client.ts so normalization
 * logic is directly unit-testable, matching the Gmail message-parser split.
 */
import type { GraphMessage } from "@/lib/integrations/microsoft/graph-client";

const MAX_BODY_TEXT_LENGTH = 4000;

export type ParsedFromAddress = { address: string; name: string | null };

/** Graph already returns a structured from address — no header parsing needed. */
export function parseGraphFromAddress(message: GraphMessage): ParsedFromAddress {
  const address = message.from?.emailAddress?.address;
  const name = message.from?.emailAddress?.name;
  return {
    address: address ? address.trim() : "unknown@unknown",
    name: name && name.trim() ? name.trim() : null,
  };
}

/**
 * Graph's `body.content` is already plain text here because every request
 * sets `Prefer: outlook.body-content-type="text"` — no HTML stripping is
 * needed, unlike Gmail's MIME parts. Falls back to `bodyPreview` if the full
 * body is unexpectedly absent.
 */
export function extractGraphBodyText(message: GraphMessage): string | null {
  const content = message.body?.content ?? message.bodyPreview ?? null;
  if (!content) return null;
  return content.slice(0, MAX_BODY_TEXT_LENGTH);
}

export function parseGraphReceivedAt(message: GraphMessage): string {
  return message.receivedDateTime
    ? new Date(message.receivedDateTime).toISOString()
    : new Date().toISOString();
}

/** Graph provides a ready-made deep link — no URL construction needed. */
export function graphWebLink(message: GraphMessage): string | null {
  return message.webLink ?? null;
}
