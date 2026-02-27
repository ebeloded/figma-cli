import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test";
import { figmaFetch, FigmaApiError } from "./api-client.ts";
import * as config from "./config.ts";

// Mock getToken
const getTokenMock = mock(() => Promise.resolve("fake-token" as string | undefined));
mock.module("./config.ts", () => ({
  getToken: getTokenMock,
}));

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  getTokenMock.mockReset();
  getTokenMock.mockImplementation(() => Promise.resolve("fake-token"));
});

describe("figmaFetch", () => {
  test("throws when no token is configured", async () => {
    getTokenMock.mockImplementation(() => Promise.resolve(undefined));
    await expect(figmaFetch("/v1/me")).rejects.toThrow(
      "Not authenticated. Run `figma auth set <token>`"
    );
  });

  test("makes request with token header and returns JSON", async () => {
    const mockData = { id: "123", handle: "Test" };
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify(mockData), { status: 200 }))
    ) as typeof fetch;

    const result = await figmaFetch("/v1/me");
    expect(result).toEqual(mockData);

    const call = (globalThis.fetch as ReturnType<typeof mock>).mock.calls[0]!;
    expect(call[0]).toBe("https://api.figma.com/v1/me");
    expect(call[1].headers["X-Figma-Token"]).toBe("fake-token");
  });

  test("appends query params correctly", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response("{}", { status: 200 }))
    ) as typeof fetch;

    await figmaFetch("/v1/files/ABC", { depth: "1", version: "123" });

    const call = (globalThis.fetch as ReturnType<typeof mock>).mock.calls[0]!;
    const url = call[0] as string;
    expect(url).toContain("depth=1");
    expect(url).toContain("version=123");
  });

  test("throws on 401 with auth message", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response("Unauthorized", { status: 401 }))
    ) as typeof fetch;

    try {
      await figmaFetch("/v1/me");
      expect(true).toBe(false); // should not reach
    } catch (err) {
      expect(err).toBeInstanceOf(FigmaApiError);
      expect((err as FigmaApiError).message).toContain("figma auth set");
      expect((err as FigmaApiError).statusCode).toBe(401);
    }
  });

  test("throws on 404 with path", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response("Not Found", { status: 404 }))
    ) as typeof fetch;

    try {
      await figmaFetch("/v1/files/NOPE");
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(FigmaApiError);
      expect((err as FigmaApiError).message).toContain("/v1/files/NOPE");
      expect((err as FigmaApiError).statusCode).toBe(404);
    }
  });

  test("throws on 429 with rate limit message", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response("Too Many Requests", { status: 429 }))
    ) as typeof fetch;

    try {
      await figmaFetch("/v1/me");
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(FigmaApiError);
      expect((err as FigmaApiError).message).toContain("15 requests/min");
      expect((err as FigmaApiError).statusCode).toBe(429);
    }
  });

  test("throws API error message on other failures", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ message: "Something went wrong" }), {
          status: 500,
        })
      )
    ) as typeof fetch;

    try {
      await figmaFetch("/v1/me");
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(FigmaApiError);
      expect((err as FigmaApiError).message).toBe("Something went wrong");
      expect((err as FigmaApiError).statusCode).toBe(500);
    }
  });
});
