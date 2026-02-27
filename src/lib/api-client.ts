import { getToken } from "./config.ts";

const BASE_URL = "https://api.figma.com";

export class FigmaApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "FigmaApiError";
  }
}

export async function figmaFetch<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const token = await getToken();
  if (!token) {
    throw new FigmaApiError(
      "Not authenticated. Run `figma auth set <token>`"
    );
  }

  let url = `${BASE_URL}${path}`;
  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams(params);
    url += `?${search.toString()}`;
  }

  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        throw new FigmaApiError(
          "Invalid token. Run `figma auth set <token>`",
          401
        );
      case 404:
        throw new FigmaApiError(`Not found: ${path}`, 404);
      case 429:
        throw new FigmaApiError(
          "Rate limit exceeded. Figma allows 15 requests/min.",
          429
        );
      default: {
        let message = `Figma API error: ${res.status} ${res.statusText}`;
        try {
          const body = (await res.json()) as { message?: string; err?: string };
          if (body.message) message = body.message;
          else if (body.err) message = body.err;
        } catch {
          // ignore parse errors, use default message
        }
        throw new FigmaApiError(message, res.status);
      }
    }
  }

  return (await res.json()) as T;
}
