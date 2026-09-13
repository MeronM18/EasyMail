import { describe, expect, it } from "vitest";
import type { GraphMessage } from "@/lib/integrations/microsoft/graph-client";
import {
  extractGraphBodyText,
  graphWebLink,
  parseGraphFromAddress,
  parseGraphReceivedAt,
} from "@/lib/integrations/microsoft/message-parser";

describe("parseGraphFromAddress", () => {
  it("reads the structured from address and display name", () => {
    const message: GraphMessage = {
      id: "1",
      from: { emailAddress: { address: "jane@example.com", name: "Jane Doe" } },
    };
    expect(parseGraphFromAddress(message)).toEqual({
      address: "jane@example.com",
      name: "Jane Doe",
    });
  });

  it("treats a blank display name as absent", () => {
    const message: GraphMessage = {
      id: "1",
      from: { emailAddress: { address: "jane@example.com", name: "  " } },
    };
    expect(parseGraphFromAddress(message)).toEqual({
      address: "jane@example.com",
      name: null,
    });
  });

  it("falls back gracefully when the from field is missing", () => {
    const message: GraphMessage = { id: "1" };
    expect(parseGraphFromAddress(message)).toEqual({
      address: "unknown@unknown",
      name: null,
    });
  });
});

describe("extractGraphBodyText", () => {
  it("uses the plain-text body content", () => {
    const message: GraphMessage = {
      id: "1",
      body: { contentType: "text", content: "plain text body" },
    };
    expect(extractGraphBodyText(message)).toBe("plain text body");
  });

  it("falls back to bodyPreview when the full body is absent", () => {
    const message: GraphMessage = { id: "1", bodyPreview: "a short preview" };
    expect(extractGraphBodyText(message)).toBe("a short preview");
  });

  it("returns null when there is no body content", () => {
    const message: GraphMessage = { id: "1" };
    expect(extractGraphBodyText(message)).toBeNull();
  });

  it("truncates very long bodies for storage", () => {
    const long = "a".repeat(5000);
    const message: GraphMessage = {
      id: "1",
      body: { contentType: "text", content: long },
    };
    expect(extractGraphBodyText(message)?.length).toBe(4000);
  });
});

describe("parseGraphReceivedAt", () => {
  it("normalizes a Graph timestamp to ISO", () => {
    const message: GraphMessage = { id: "1", receivedDateTime: "2026-09-11T12:00:00Z" };
    expect(parseGraphReceivedAt(message)).toBe("2026-09-11T12:00:00.000Z");
  });

  it("falls back to now when the timestamp is missing", () => {
    const message: GraphMessage = { id: "1" };
    expect(() => new Date(parseGraphReceivedAt(message))).not.toThrow();
  });
});

describe("graphWebLink", () => {
  it("passes through Graph's own webLink", () => {
    const message: GraphMessage = {
      id: "1",
      webLink: "https://outlook.office.com/mail/1",
    };
    expect(graphWebLink(message)).toBe("https://outlook.office.com/mail/1");
  });

  it("returns null when Graph did not provide one", () => {
    expect(graphWebLink({ id: "1" })).toBeNull();
  });
});
