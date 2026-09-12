import { describe, expect, it } from "vitest";
import {
  buildGmailWebLink,
  extractBodyText,
  getHeader,
  parseFromHeader,
  type GmailMessageResource,
} from "@/lib/integrations/google/message-parser";

function encode(text: string): string {
  return Buffer.from(text, "utf8").toString("base64url");
}

describe("getHeader", () => {
  it("finds a header case-insensitively", () => {
    const headers = [{ name: "Subject", value: "Hello" }];
    expect(getHeader(headers, "subject")).toBe("Hello");
    expect(getHeader(headers, "Missing")).toBeNull();
  });

  it("returns null when there are no headers", () => {
    expect(getHeader(undefined, "Subject")).toBeNull();
  });
});

describe("parseFromHeader", () => {
  it("parses a display name and address", () => {
    expect(parseFromHeader('"Jane Doe" <jane@example.com>')).toEqual({
      address: "jane@example.com",
      name: "Jane Doe",
    });
  });

  it("parses a bare address with no display name", () => {
    expect(parseFromHeader("jane@example.com")).toEqual({
      address: "jane@example.com",
      name: null,
    });
  });

  it("falls back gracefully for null/unparseable input", () => {
    expect(parseFromHeader(null)).toEqual({ address: "unknown@unknown", name: null });
  });
});

describe("extractBodyText", () => {
  it("prefers a text/plain part over text/html", () => {
    const message: GmailMessageResource = {
      id: "1",
      payload: {
        parts: [
          { mimeType: "text/html", body: { data: encode("<p>html</p>") } },
          { mimeType: "text/plain", body: { data: encode("plain text body") } },
        ],
      },
    };
    expect(extractBodyText(message)).toBe("plain text body");
  });

  it("falls back to stripped text/html when no text/plain part exists", () => {
    const message: GmailMessageResource = {
      id: "1",
      payload: {
        mimeType: "text/html",
        body: { data: encode("<p>Hello <b>world</b></p>") },
      },
    };
    expect(extractBodyText(message)).toBe("Hello world");
  });

  it("returns null when there is no body content", () => {
    const message: GmailMessageResource = { id: "1", payload: { headers: [] } };
    expect(extractBodyText(message)).toBeNull();
  });

  it("truncates very long bodies for storage", () => {
    const long = "a".repeat(5000);
    const message: GmailMessageResource = {
      id: "1",
      payload: { mimeType: "text/plain", body: { data: encode(long) } },
    };
    expect(extractBodyText(message)?.length).toBe(4000);
  });
});

describe("buildGmailWebLink", () => {
  it("builds a best-effort Gmail web URL from the message id", () => {
    expect(buildGmailWebLink("18abcd1234ef")).toBe(
      "https://mail.google.com/mail/u/0/#all/18abcd1234ef",
    );
  });
});
