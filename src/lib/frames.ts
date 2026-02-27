import { figmaFetch } from "./api-client.ts";

export interface FrameInfo {
  id: string;
  name: string;
  width: number;
  height: number;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface FileNodesResponse {
  nodes: Record<
    string,
    {
      document: FigmaNode;
    }
  >;
}

interface FileResponse {
  document: {
    children: FigmaNode[];
  };
}

function collectFrames(node: FigmaNode, deep: boolean): FrameInfo[] {
  const frames: FrameInfo[] = [];

  if (node.type === "FRAME" || node.type === "COMPONENT") {
    frames.push({
      id: node.id,
      name: node.name,
      width: node.absoluteBoundingBox?.width ?? 0,
      height: node.absoluteBoundingBox?.height ?? 0,
    });
    if (!deep) return frames;
  }

  if (node.children) {
    for (const child of node.children) {
      if (child.type === "FRAME" || child.type === "COMPONENT") {
        frames.push({
          id: child.id,
          name: child.name,
          width: child.absoluteBoundingBox?.width ?? 0,
          height: child.absoluteBoundingBox?.height ?? 0,
        });
        if (deep && child.children) {
          for (const nested of child.children) {
            frames.push(...collectFrames(nested, true));
          }
        }
      } else if (
        child.type === "SECTION" ||
        child.type === "GROUP" ||
        child.type === "CANVAS"
      ) {
        frames.push(...collectFrames(child, deep));
      }
    }
  }

  return frames;
}

export async function discoverFrames(
  fileKey: string,
  nodeId: string | undefined,
  deep: boolean = false
): Promise<FrameInfo[]> {
  if (nodeId) {
    const data = await figmaFetch<FileNodesResponse>(
      `/v1/files/${fileKey}/nodes`,
      { ids: nodeId }
    );
    const entry = data.nodes[nodeId];
    if (!entry) {
      throw new Error(`Node ${nodeId} not found in file`);
    }
    const doc = entry.document;
    return collectFrames(doc, deep);
  }

  // No nodeId -- get top-level pages with depth=2
  const data = await figmaFetch<FileResponse>(`/v1/files/${fileKey}`, {
    depth: "2",
  });
  const frames: FrameInfo[] = [];
  for (const page of data.document.children) {
    frames.push(...collectFrames(page, deep));
  }
  return frames;
}
