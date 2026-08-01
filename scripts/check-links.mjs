#!/usr/bin/env node
/**
 * 站内链接校验：正文里形如 (/04-wallets/05-gas-mechanics/) 的内部链接，
 * 必须能对应到 src/content/docs 下真实存在的 .mdx。
 *   node scripts/check-links.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'src/content/docs');

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.mdx')) files.push(p);
  }
})(DOCS);

// 站内所有合法路径
const slugs = new Set(
  files.map((f) => '/' + path.relative(DOCS, f).replace(/\.mdx$/, '').replace(/\/index$/, '') + '/')
);
slugs.add('/');

let bad = 0;
let total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g)) {
    const href = m[1];
    if (href.startsWith('/images/')) continue;
    total++;
    const norm = href.endsWith('/') ? href : href + '/';
    if (!slugs.has(norm)) {
      bad++;
      console.log(`✗ ${path.relative(ROOT, f)} → ${href}`);
    }
  }
}
console.log(`──────── 内部链接 ${total} 条，失效 ${bad} 条`);
