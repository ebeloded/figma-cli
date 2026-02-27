import { defineCommand } from "citty";
import { resolve } from "node:path";
import { parseFigmaUrl } from "../lib/url-parser.ts";
import { discoverFrames } from "../lib/frames.ts";
import { figmaFetch } from "../lib/api-client.ts";
import { isPretty, printJSON, printError } from "../lib/output.ts";

interface ExportUrlsResponse {
  err: string | null;
  images: Record<string, string>;
}

type ExportFormat = "png" | "jpg" | "svg" | "pdf";

export default defineCommand({
  meta: {
    name: "export",
    description: "Export frames to PNG/JPG/SVG/PDF",
  },
  args: {
    url: { type: "positional", description: "Figma file or node URL" },
    format: {
      type: "string",
      description: "Export format: png, jpg, svg, pdf",
      default: "png",
    },
    scale: {
      type: "string",
      description: "Scale multiplier (1, 2, 3) for PNG/JPG",
      default: "1",
    },
    out: {
      type: "string",
      description: "Output directory",
      default: "./exports",
    },
  },
  async run({ args }) {
    try {
      const format = args.format as ExportFormat;
      if (!["png", "jpg", "svg", "pdf"].includes(format)) {
        printError(
          `Invalid format "${args.format}". Must be png, jpg, svg, or pdf.`
        );
        process.exit(1);
      }

      const scale = parseInt(args.scale, 10);
      if (![1, 2, 3].includes(scale)) {
        printError(
          `Invalid scale "${args.scale}". Must be 1, 2, or 3.`
        );
        process.exit(1);
      }

      const outDir = resolve(args.out);
      const { fileKey, nodeId } = parseFigmaUrl(args.url);
      const frames = await discoverFrames(fileKey, nodeId);

      if (frames.length === 0) {
        printError("No frames found at the given URL");
        process.exit(1);
      }

      const pretty = isPretty();
      if (pretty) {
        const scaleLabel =
          format === "png" || format === "jpg" ? ` (${scale}x)` : "";
        console.error(
          `Exporting ${frames.length} frames as ${format.toUpperCase()}${scaleLabel}...`
        );
      }

      // Request export URLs from Figma
      const ids = frames.map((f) => f.id).join(",");
      const params: Record<string, string> = {
        ids,
        format,
      };
      if ((format === "png" || format === "jpg") && scale !== 1) {
        params.scale = String(scale);
      }

      const data = await figmaFetch<ExportUrlsResponse>(
        `/v1/images/${fileKey}`,
        params
      );
      if (data.err) {
        throw new Error(`Figma export error: ${data.err}`);
      }

      // Create output directory
      await Bun.$`mkdir -p ${outDir}`.quiet();

      // Download all files in parallel
      const padWidth = String(frames.length).length;
      const results = await Promise.all(
        frames.map(async (frame, i) => {
          const url = data.images[frame.id];
          if (!url) {
            const msg = `No export URL returned for ${frame.id} (${frame.name})`;
            if (pretty) {
              console.error(`  [${String(i + 1).padStart(padWidth, "0")}/${frames.length}] SKIPPED: ${msg}`);
            }
            return null;
          }

          const index = String(i + 1).padStart(2, "0");
          const safeId = frame.id.replace(/:/g, "-");
          const filename = `frame-${index}-${safeId}.${format}`;
          const filepath = `${outDir}/${filename}`;

          const res = await fetch(url);
          if (!res.ok) {
            const msg = `Failed to download ${frame.name} (${frame.id}): HTTP ${res.status}`;
            if (pretty) {
              console.error(`  [${String(i + 1).padStart(padWidth, "0")}/${frames.length}] ERROR: ${msg}`);
            }
            return null;
          }

          await Bun.write(filepath, res);
          const file = Bun.file(filepath);
          const size = file.size;

          if (pretty) {
            const sizeStr = formatBytes(size);
            console.error(
              `  [${String(i + 1).padStart(padWidth, "0")}/${frames.length}] ${filename}  (${sizeStr})`
            );
          }

          return { id: frame.id, file: filename, size };
        })
      );

      const successful = results.filter(
        (r): r is { id: string; file: string; size: number } => r !== null
      );

      if (pretty) {
        console.error(
          `Done. ${successful.length} files saved to ${outDir}/`
        );
      } else {
        printJSON(successful);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      printError(msg);
      process.exit(1);
    }
  },
});

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
