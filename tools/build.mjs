// Build website Antarala dari folder content/ ke folder public/.
// Pakai: node tools/build.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const P = (...a) => path.join(ROOT, ...a);
const OUT = P("public");

// generator yang sama dengan Antarala Editor
const ctx = { window: {}, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(P("tools/gen.js"), "utf8"), ctx);
const Gen = ctx.window.AntaralaGen;

const A = JSON.parse(fs.readFileSync(P("content/artikel.json"), "utf8"));
const bDir = P("content/berita");
const B = fs.readdirSync(bDir).filter(f => f.endsWith(".json"))
  .map(f => JSON.parse(fs.readFileSync(path.join(bDir, f), "utf8")))
  .filter(b => b && b.slug)
  .sort((a, b) => ((b.tanggal || "") + (b.jam || "")).localeCompare((a.tanggal || "") + (a.jam || "")));

// cadangan topik/tag/judulSeo/poin: dipakai kalau data dari editor belum punya field itu
const TAX = fs.existsSync(P("content/taksonomi.json")) ? JSON.parse(fs.readFileSync(P("content/taksonomi.json"), "utf8")) : {};
for (const a of A.concat(B)) for (const [k, v] of Object.entries(TAX[a.slug] || {})) if (k === "paksa") Object.assign(a, v); else if (a[k] === undefined || a[k] === "" || (Array.isArray(a[k]) && !a[k].length)) a[k] = v;

const all = A.concat(B);
const slugs = new Set();
for (const a of all) { if (slugs.has(a.slug)) throw new Error("Slug dobel: " + a.slug); slugs.add(a.slug); }
const list = all.map(({ _baru, coverAsset, autoCover, ...a }) => a);
const files = Gen.build(list, { ga: "G-LDF85G4VRG", webp: true });

fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, data) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };
for (const [rel, c] of Object.entries(files)) write(rel, c);

// aset statis
fs.cpSync(P("static"), OUT, { recursive: true });
const img = path.join(OUT, "assets/img");
const used = new Set(all.map(a => a.cover));
for (const f of fs.readdirSync(img)) if (f.startsWith("cover-") && !used.has(f)) fs.rmSync(path.join(img, f));

// cover otomatis & cek cover yang hilang
const missing = [];
for (const a of all) {
  const f = path.join(img, a.cover);
  if (a.autoCover) execFileSync("python3", [P("tools/autocover.py"), String(a.judul).replace(/<[^>]+>/g, ""), a.tanggal, f]);
  else if (!fs.existsSync(f)) missing.push(a.cover);
}
if (missing.length) { console.error("Cover tidak ditemukan di static/assets/img:", missing.join(", ")); process.exit(1); }

// versi WebP (lebih ringan) untuk semua cover
execFileSync("python3", [P("tools/webp.py"), img], { stdio: "inherit" });
console.log(`OK: ${A.length} artikel, ${B.length} berita, ${Object.keys(files).length} file halaman.`);
