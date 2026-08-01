#!/usr/bin/env node
/**
 * 逐个文件编译 MDX，定位语法错误（astro build 的报错不带文件名，很难查）
 *   node scripts/mdx-check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from '@mdx-js/mdx';

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

let bad = 0;
for (const f of files.sort()) {
  const raw = fs.readFileSync(f, 'utf8');
  // 去掉 frontmatter，MDX 编译器不认
  const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '');
  try {
    await compile(body, { jsx: true });
  } catch (e) {
    bad++;
    const rel = path.relative(ROOT, f);
    const line = e.line ?? e.place?.start?.line ?? '?';
    const col = e.column ?? e.place?.start?.column ?? '?';
    const fmOffset = (raw.match(/^---\n[\s\S]*?\n---\n?/) || [''])[0].split('\n').length - 1;
    const realLine = typeof line === 'number' ? line + fmOffset : line;
    const srcLine = raw.split('\n')[realLine - 1] || '';
    console.log(`✗ ${rel}:${realLine}:${col}\n   ${e.reason || e.message}\n   > ${srcLine.trim().slice(0, 160)}\n`);
  }
}
console.log(`──────── 共 ${files.length} 个文件，${bad} 个有语法错误`);
