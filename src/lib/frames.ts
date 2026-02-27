import { figmaFetch } from "./api-client.ts";

export interface FrameInfo {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  children?: FrameInfo[];
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

function collectChildren(node: FigmaNode, deep: boolean): FrameInfo[] {
  const results: FrameInfo[] = [];

  for (const child of node.children ?? []) {
    if (child.type === "FRAME" || child.type === "COMPONENT") {
      const frame: FrameInfo = {
        id: child.id,
        name: child.name,
        type: child.type,
        width: child.absoluteBoundingBox?.width ?? 0,
        height: child.absoluteBoundingBox?.height ?? 0,
      };
      if (deep) {
        const nested = collectChildren(child, true);
        if (nested.length > 0) frame.children = nested;
      }
      results.push(frame);
    } else if (child.type === "SECTION" || child.type === "GROUP") {
      const children = collectChildren(child, deep);
      if (children.length > 0) {
        results.push({
          id: child.id,
          name: child.name,
          type: child.type,
          width: child.absoluteBoundingBox?.width ?? 0,
          height: child.absoluteBoundingBox?.height ?? 0,
          children,
        });
      }
    }
  }

  return results;
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

    if (doc.type === "FRAME" || doc.type === "COMPONENT") {
      const frame: FrameInfo = {
        id: doc.id,
        name: doc.name,
        type: doc.type,
        width: doc.absoluteBoundingBox?.width ?? 0,
        height: doc.absoluteBoundingBox?.height ?? 0,
      };
      if (deep) {
        const nested = collectChildren(doc, true);
        if (nested.length > 0) frame.children = nested;
      }
      return [frame];
    }

    return collectChildren(doc, deep);
  }

  // No nodeId -- get top-level pages with depth=3 to include section contents
  const data = await figmaFetch<FileResponse>(`/v1/files/${fileKey}`, {
    depth: "3",
  });
  const frames: FrameInfo[] = [];
  for (const page of data.document.children) {
    frames.push(...collectChildren(page, deep));
  }
  return frames;
}
