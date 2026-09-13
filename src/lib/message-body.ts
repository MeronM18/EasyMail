/**
 * Pure presentation helpers for rendering a plain-text message body as
 * readable content with clickable links — no HTML parsing, no
 * dangerouslySetInnerHTML. Never mutates or re-derives stored content; this
 * only decides how the existing `body_text`/`snippet` string is split into
 * text and link segments for display.
 */

export type MessageBodySegment =
  { type: "text"; value: string } | { type: "link"; href: string; label: string };

// Matches an http(s) URL, optionally wrapped in `<...>` (a common plaintext
// email convention, e.g. "Log in ><https://example.com>") — the brackets are
// consumed but not included in the captured URL.
const URL_PATTERN = /<?(https?:\/\/[^\s<>]+)>?/g;

// Common query-param names redirect/tracking wrappers (e.g. Microsoft
// SafeLinks) use to carry the real destination URL.
const REDIRECT_DESTINATION_PARAMS = ["destination", "url", "u", "target"];

function hostnameOf(rawUrl: string): string | null {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

/**
 * Picks a short, safe label for a URL — the wrapped destination's hostname
 * when the URL looks like a redirect/tracking link with a straightforward
 * encoded destination, otherwise the URL's own hostname, otherwise a
 * generic fallback. Never returns the raw URL itself.
 */
export function summarizeLinkLabel(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return "Open link";
  }

  for (const paramName of REDIRECT_DESTINATION_PARAMS) {
    const value = parsed.searchParams.get(paramName);
    if (!value) continue;
    const destinationHost = hostnameOf(value);
    if (destinationHost) return destinationHost;
  }

  return hostnameOf(rawUrl) ?? "Open link";
}

/**
 * Splits plain message text into alternating text/link segments. Line
 * breaks and spacing inside text segments are preserved verbatim — the
 * caller renders them inside a `white-space: pre-wrap` container.
 */
export function parseMessageBodySegments(text: string): MessageBodySegment[] {
  const segments: MessageBodySegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    const href = match[1];
    segments.push({ type: "link", href, label: summarizeLinkLabel(href) });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}
