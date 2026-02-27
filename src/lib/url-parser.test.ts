import { describe, expect, test } from "bun:test";
import { parseFigmaUrl } from "./url-parser.ts";

describe("parseFigmaUrl", () => {
  test("design URL with node-id", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/ABC123/Name?node-id=435-51464"
    );
    expect(result).toEqual({ fileKey: "ABC123", nodeId: "435:51464" });
  });

  test("design URL without node-id", () => {
    const result = parseFigmaUrl("https://www.figma.com/design/ABC123/Name");
    expect(result).toEqual({ fileKey: "ABC123", nodeId: undefined });
  });

  test("branch URL with node-id", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/ABC123/branch/XYZ/Name?node-id=1-2"
    );
    expect(result).toEqual({ fileKey: "XYZ", nodeId: "1:2" });
  });

  test("board URL (FigJam)", () => {
    const result = parseFigmaUrl("https://www.figma.com/board/ABC123/Name");
    expect(result).toEqual({ fileKey: "ABC123", nodeId: undefined });
  });

  test("make URL", () => {
    const result = parseFigmaUrl("https://www.figma.com/make/ABC123/Name");
    expect(result).toEqual({ fileKey: "ABC123", nodeId: undefined });
  });

  test("file URL (legacy format)", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/file/ABC123/Name?node-id=10-20"
    );
    expect(result).toEqual({ fileKey: "ABC123", nodeId: "10:20" });
  });

  test("URL without protocol", () => {
    const result = parseFigmaUrl(
      "figma.com/design/ABC123/Name?node-id=1-2"
    );
    expect(result).toEqual({ fileKey: "ABC123", nodeId: "1:2" });
  });

  test("node-id with multiple hyphens converts all to colons", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/ABC123/Name?node-id=1-2-3"
    );
    expect(result).toEqual({ fileKey: "ABC123", nodeId: "1:2:3" });
  });

  test("throws for non-Figma URL", () => {
    expect(() => parseFigmaUrl("https://google.com/foo")).toThrow(
      /Not a Figma URL/
    );
  });

  test("throws for invalid URL", () => {
    expect(() => parseFigmaUrl("not-a-url")).toThrow(/Not a Figma URL/);
  });

  test("throws for unsupported Figma path", () => {
    expect(() =>
      parseFigmaUrl("https://figma.com/unknown/ABC123/Name")
    ).toThrow(/Unsupported Figma URL format/);
  });
});
