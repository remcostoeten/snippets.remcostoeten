import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
// @ts-ignore - types may be missing
import pngToIco from "png-to-ico";

async function ensureDir(path: string) {
  try {
    await mkdir(path, { recursive: true });
  } catch (_) {}
}

async function generate() {
  const publicDir = resolve(process.cwd(), "public");
  await ensureDir(publicDir);
  const srcSvgPath = resolve(publicDir, "favicon.svg");
  const svg = await readFile(srcSvgPath);

  const sizesPng = [16, 32, 48, 64, 128, 192, 256, 512] as const;
  const outputs: Array<{ name: string; buf: Buffer }> = [];

  for (const size of sizesPng) {
    const buf = await sharp(svg, { density: 384 })
      .resize(size, size, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toBuffer();
    const name = size === 16 || size === 32
      ? `favicon-${size}x${size}.png`
      : `icon-${size}x${size}.png`;
    outputs.push({ name, buf });
  }

  const apple = await sharp(svg, { density: 384 })
    .resize(180, 180, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  outputs.push({ name: "apple-touch-icon.png", buf: apple });

  await Promise.all(outputs.map(o => writeFile(resolve(publicDir, o.name), o.buf)));

  const icoSizes = outputs.filter(o => o.name === "favicon-16x16.png" || o.name === "favicon-32x32.png").map(o => o.buf);
  if (icoSizes.length) {
    const ico = await pngToIco(icoSizes as unknown as Buffer[]);
    await writeFile(resolve(publicDir, "favicon.ico"), ico);
  }

  await writeFile(resolve(publicDir, "browserconfig.xml"),
    Buffer.from(`<?xml version="1.0" encoding="utf-8"?>\n` +
      `<browserconfig><msapplication><tile>` +
      `<square150x150logo src="/icon-256x256.png"/>` +
      `<TileColor>#0B1020</TileColor>` +
      `</tile></msapplication></browserconfig>\n`));

  return {
    written: outputs.map(o => o.name).concat(["favicon.ico", "browserconfig.xml"]).sort(),
  };
}

generate()
  .then(result => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

