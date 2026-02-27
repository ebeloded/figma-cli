export interface ParsedFigmaUrl {
  fileKey: string;
  nodeId?: string;
}

export function parseFigmaUrl(url: string): ParsedFigmaUrl {
  let parsed: URL;
  try {
    parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  if (!parsed.hostname.endsWith("figma.com")) {
    throw new Error(
      `Not a Figma URL: ${url}. Expected a URL containing figma.com`
    );
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  // segments[0] = "design" | "board" | "make"
  // segments[1] = fileKey
  // For branches: segments[2] = "branch", segments[3] = branchKey

  const type = segments[0];
  if (!type || !["design", "board", "make", "file"].includes(type)) {
    throw new Error(
      `Unsupported Figma URL format: ${url}. Expected /design/, /board/, /make/, or /file/ path`
    );
  }

  const fileKey = segments[1];
  if (!fileKey) {
    throw new Error(`Could not extract file key from URL: ${url}`);
  }

  // Check for branch URLs: /design/:fileKey/branch/:branchKey/:name
  let resolvedFileKey = fileKey;
  if (segments[2] === "branch" && segments[3]) {
    resolvedFileKey = segments[3];
  }

  // Extract node-id from query params
  const rawNodeId = parsed.searchParams.get("node-id");
  const nodeId = rawNodeId ? rawNodeId.replace(/-/g, ":") : undefined;

  return { fileKey: resolvedFileKey, nodeId };
}
