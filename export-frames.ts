/**
 * Export frames from a Figma section as PNGs.
 * Usage: bun export-frames.ts
 */

const FILE_KEY = "Mq62Nug25i4tWCaZGifzdO";
const TOKEN = process.env.FIGMA_API_KEY!;
const OUTPUT_DIR = "./exports";
const SCALE = 2;

// Frames inside section 435:51464 "Entity name edit"
const FRAME_IDS = [
  "435:53583",
  "435:57116",
  "435:62992",
  "435:65867",
  "435:68640",
  "435:71396",
  "435:60229",
];

async function getExportUrls(ids: string[]): Promise<Record<string, string>> {
  const params = new URLSearchParams({
    ids: ids.join(","),
    format: "png",
    scale: String(SCALE),
  });
  const res = await fetch(`https://api.figma.com/v1/images/${FILE_KEY}?${params}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  const json = await res.json() as { err: string | null; images: Record<string, string> };
  if (json.err) throw new Error(`Figma API error: ${json.err}`);
  return json.images;
}

async function downloadPng(url: string, path: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  await Bun.write(path, res);
}

// Ensure output dir exists
await Bun.$`mkdir -p ${OUTPUT_DIR}`;

console.log(`Requesting export URLs for ${FRAME_IDS.length} frames...`);
const images = await getExportUrls(FRAME_IDS);

const downloads = FRAME_IDS.map((id, i) => {
  const url = images[id];
  if (!url) { console.warn(`  No URL for ${id}`); return Promise.resolve(); }
  const filename = `${OUTPUT_DIR}/frame-${String(i + 1).padStart(2, "0")}-${id.replace(":", "-")}.png`;
  console.log(`  Downloading frame ${i + 1}/${FRAME_IDS.length}: ${id}`);
  return downloadPng(url, filename).then(() => console.log(`  Saved: ${filename}`));
});

await Promise.all(downloads);
console.log("Done.");
