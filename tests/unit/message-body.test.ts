import { describe, expect, it } from "vitest";
import { parseMessageBodySegments, summarizeLinkLabel } from "@/lib/message-body";

describe("summarizeLinkLabel", () => {
  it("uses the wrapped destination's hostname for a SafeLink-style redirect", () => {
    const safelink =
      "https://nam.safelink.emails.azure.net/redirect/?destination=https%3A%2F%2Fportal.azure.com%2F%23home&p=abc123";
    expect(summarizeLinkLabel(safelink)).toBe("portal.azure.com");
  });

  it("falls back to the URL's own hostname when there is no destination param", () => {
    expect(summarizeLinkLabel("https://example.com/some/long/path?x=1")).toBe(
      "example.com",
    );
  });

  it("strips a leading www.", () => {
    expect(summarizeLinkLabel("https://www.example.com/path")).toBe("example.com");
  });

  it("falls back to a generic label for an unparseable URL", () => {
    expect(summarizeLinkLabel("not a url")).toBe("Open link");
  });

  it("ignores a destination param that isn't itself a valid URL", () => {
    expect(summarizeLinkLabel("https://redirect.example/go?destination=not-a-url")).toBe(
      "redirect.example",
    );
  });
});

describe("parseMessageBodySegments", () => {
  it("returns a single text segment when there are no URLs", () => {
    expect(parseMessageBodySegments("Hello there, no links here.")).toEqual([
      { type: "text", value: "Hello there, no links here." },
    ]);
  });

  it("splits text around a bare URL and strips it from the label", () => {
    const segments = parseMessageBodySegments("Visit https://example.com/path today");
    expect(segments).toEqual([
      { type: "text", value: "Visit " },
      { type: "link", href: "https://example.com/path", label: "example.com" },
      { type: "text", value: " today" },
    ]);
  });

  it("strips angle brackets around a URL without including them in the href", () => {
    const segments = parseMessageBodySegments("Log in ><https://example.com/x>");
    expect(segments).toEqual([
      { type: "text", value: "Log in >" },
      { type: "link", href: "https://example.com/x", label: "example.com" },
    ]);
  });

  it("preserves newlines in surrounding text", () => {
    const segments = parseMessageBodySegments(
      "line one\nhttps://example.com\nline three",
    );
    expect(segments).toEqual([
      { type: "text", value: "line one\n" },
      { type: "link", href: "https://example.com", label: "example.com" },
      { type: "text", value: "\nline three" },
    ]);
  });

  it("handles multiple links in the same body", () => {
    const segments = parseMessageBodySegments(
      "First https://a.example then https://b.example done",
    );
    expect(segments.filter((s) => s.type === "link")).toHaveLength(2);
    expect(segments).toEqual([
      { type: "text", value: "First " },
      { type: "link", href: "https://a.example", label: "a.example" },
      { type: "text", value: " then " },
      { type: "link", href: "https://b.example", label: "b.example" },
      { type: "text", value: " done" },
    ]);
  });

  it("never includes the raw href text as visible label text for a long tracking URL", () => {
    const safelink =
      "https://nam.safelink.emails.azure.net/redirect/?destination=https%3A%2F%2Fportal.azure.com%2F%23home&p=abc123";
    const segments = parseMessageBodySegments(`Log in ><${safelink}>`);
    const link = segments.find((s) => s.type === "link");
    expect(link).toEqual({ type: "link", href: safelink, label: "portal.azure.com" });
  });
});
