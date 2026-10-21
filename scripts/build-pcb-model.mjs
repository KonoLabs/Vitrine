#!/usr/bin/env node
// Bakes a tscircuit Circuit JSON export into a self-contained glTF binary for
// the web 3D viewer. Run by hand whenever the board changes:
//
//   node scripts/build-pcb-model.mjs
//   node scripts/build-pcb-model.mjs ../FieldCam/dist/fab/circuit.json
//
// The output is committed to static/models so builds and CI never need the
// hardware workspace or the converter's WASM dependencies.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { convertCircuitJsonToGltf } from "circuit-json-to-gltf";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(
  process.argv[2] ?? resolve(root, "../FieldCam/dist/circuit.json"),
);
const output = resolve(root, "static/models/fieldcam.glb");

const circuitJson = JSON.parse(await readFile(source, "utf8"));

const glb = await convertCircuitJsonToGltf(circuitJson, {
  format: "glb",
  boardTextureResolution: 2048,
  backgroundColor: "#1F4A2C",
  boardSideColor: "#0E2415",
  copperColor: "#C8A961",
  silkscreenColor: "#F4F4F0",
});

const buffer = Buffer.from(glb);
const gltf = JSON.parse(
  buffer.subarray(20, 20 + buffer.readUInt32LE(12)).toString("utf8"),
);

// The converter degrades silently when the SVG rasteriser is unavailable:
// the board renders as flat colour with no silkscreen or copper.
if ((gltf.images?.length ?? 0) < 2) {
  throw new Error(
    "board textures missing from the export (is @resvg/resvg-js installed?)",
  );
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, buffer);

const size = (buffer.length / 1_000_000).toFixed(2);
console.log(
  `baked ${source}\n  -> ${output} (${size} MB, ${gltf.nodes.length} nodes, ${gltf.meshes.length} meshes, ${gltf.images.length} textures)`,
);
