#!/usr/bin/env node
/**
 * 免费图库搜图 + 下载（Pexels 主用，Pixabay 兜底）
 *
 * 用法：
 *   node scripts/search-image.mjs "<英文搜索词>" <输出相对路径>
 * 例：
 *   node scripts/search-image.mjs "abstract network nodes" images/02-blockchain-basics/hero.jpg
 *
 * 输出路径相对于 public/。成功时打印一行 JSON：
 *   {"ok":true,"path":"/images/...","source":"pexels","photographer":"...","url":"..."}
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// 读取 .env
const env = {};
for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const [query, outRel] = process.argv.slice(2);
if (!query || !outRel) {
  console.log(JSON.stringify({ ok: false, error: '用法: node scripts/search-image.mjs "<英文搜索词>" <public 下的相对路径>' }));
  process.exit(1);
}

async function tryPexels() {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
  const r = await fetch(url, { headers: { Authorization: env.PEXELS_API_KEY } });
  if (!r.ok) return null;
  const j = await r.json();
  const p = j.photos?.[0];
  if (!p) return null;
  return { src: p.src.large2x || p.src.large, source: 'pexels', photographer: p.photographer, url: p.url };
}

async function tryPixabay() {
  const url = `https://pixabay.com/api/?key=${env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  const p = j.hits?.[0];
  if (!p) return null;
  return { src: p.largeImageURL, source: 'pixabay', photographer: p.user, url: p.pageURL };
}

const hit = (await tryPexels()) || (await tryPixabay());
if (!hit) {
  console.log(JSON.stringify({ ok: false, error: '两个图库都没搜到，换个更通用的英文搜索词再试' }));
  process.exit(1);
}

const outAbs = path.join(ROOT, 'public', outRel);
fs.mkdirSync(path.dirname(outAbs), { recursive: true });
const img = await fetch(hit.src);
if (!img.ok) {
  console.log(JSON.stringify({ ok: false, error: `下载失败 HTTP ${img.status}` }));
  process.exit(1);
}
fs.writeFileSync(outAbs, Buffer.from(await img.arrayBuffer()));

console.log(
  JSON.stringify({
    ok: true,
    path: '/' + outRel.replace(/^\/?(public\/)?/, ''),
    bytes: fs.statSync(outAbs).size,
    source: hit.source,
    photographer: hit.photographer,
    url: hit.url,
  })
);
