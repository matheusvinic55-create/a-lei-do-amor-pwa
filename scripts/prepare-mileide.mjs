// Materialize and optimize the licensed deck at build time. Browsers receive only
// local WebP assets; no runtime third-party requests or image service is needed.
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");
const sources = JSON.parse(await readFile(new URL("./mileide-sources.json", import.meta.url), "utf8"));
const directory = new URL("../public/mileide/cards/", import.meta.url);
await mkdir(directory, { recursive: true });

async function prepare(source) {
  const target = new URL(`${source.id}.webp`, directory);
  try {
    const existing = await sharp(await readFile(target)).metadata();
    if (existing.width >= 480 && existing.height >= 800) return;
  } catch { /* First build: obtain the actual card, never a placeholder. */ }
  const file = source.file.replaceAll(" ", "_");
  const hash = createHash("md5").update(file).digest("hex");
  const url = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(file)}`;
  let error;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(45000), headers: { "User-Agent": "CasaMileide/1.0 (https://a-lei-do-amor.vercel.app; licensed artwork build)" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      const metadata = await sharp(buffer).metadata();
      if (!metadata.width || !metadata.height || metadata.width < 480 || metadata.height < 800) throw new Error("Invalid card image");
      await sharp(buffer).rotate().resize({ width: 600, withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toFile(target.pathname);
      console.log(`Mileide: ${source.id} ready (${(await stat(target)).size} bytes)`);
      return;
    } catch (reason) { error = reason; if (attempt < 3) await delay(1500 * 2 ** attempt); }
  }
  throw new Error(`Mileide: could not prepare ${source.file}: ${error}`);
}

// Keep Wikimedia requests bounded and respectful.
for (let i = 0; i < sources.length; i += 2) await Promise.all(sources.slice(i, i + 2).map(prepare));
await writeFile(new URL("sources.json", directory), JSON.stringify({
  artist: "Nicolas Conver (1760)",
  reproduction: "Tarot World Project / Reality Publishing (2020)",
  license: "https://creativecommons.org/licenses/by-sa/4.0/",
  modifications: "Resized to 600px wide and converted to WebP. Artwork preserved.",
  cards: sources.map(source => ({ image: `${source.id}.webp`, source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(source.file.replaceAll(" ", "_"))}` })),
}, null, 2));
console.log(`Mileide: all ${sources.length} images ready for production.`);
