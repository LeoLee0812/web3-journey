#!/usr/bin/env node
/**
 * Starlight 的 <Steps> 要求内部**只能**是一个有序列表。
 * 作者常在列表前后、甚至列表中间夹带说明段落或代码块，导致构建失败。
 *
 * 处理策略：
 *   - 夹在列表中间的非列表内容（未缩进的段落 / 代码块）→ 直接去掉 <Steps> 包裹，退化成普通有序列表；
 *   - 只是列表前后多了内容 → 把它们挪到组件外面，保留 <Steps> 效果。
 *
 *   node scripts/fix-steps.mjs
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

const isItem = (l) => /^\s*\d+\.\s/.test(l);
const isCont = (l) => l.trim() === '' || /^\s{3,}\S/.test(l);

let changed = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  let touched = false;

  const out = raw.replace(/^[ \t]*<Steps>[ \t]*\n([\s\S]*?)^[ \t]*<\/Steps>[ \t]*$/gm, (whole, inner) => {
    const lines = inner.replace(/\n$/, '').split('\n');
    const idx = lines.map((l, i) => (isItem(l) ? i : -1)).filter((i) => i >= 0);
    if (!idx.length) {
      touched = true;
      return lines.join('\n'); // 里面根本没有有序列表，直接拆掉包裹
    }
    const first = idx[0];
    const last = idx[idx.length - 1];

    // 列表区间内是否混入了未缩进的非列表内容
    let polluted = false;
    for (let i = first; i <= last; i++) {
      if (!isItem(lines[i]) && !isCont(lines[i])) { polluted = true; break; }
    }
    // 最后一个列表项之后、还没到结尾的续行也要一起算进列表
    let end = last;
    while (end + 1 < lines.length && isCont(lines[end + 1])) end++;

    if (polluted) {
      touched = true;
      return lines.join('\n'); // 退化成普通列表，保证能构建
    }

    const before = lines.slice(0, first).join('\n').trim();
    const list = lines.slice(first, end + 1).join('\n').replace(/\s+$/, '');
    const after = lines.slice(end + 1).join('\n').trim();
    if (!before && !after) return whole;

    touched = true;
    return [before, '<Steps>', '', list, '', '</Steps>', after]
      .filter((x) => x !== '')
      .join('\n\n')
      .replace(/\n{3,}/g, '\n\n');
  });

  if (touched) {
    fs.writeFileSync(f, out);
    changed++;
    console.log(`✓ ${path.relative(ROOT, f)}`);
  }
}
console.log(`──────── 共处理 ${files.length} 个文件，修改 ${changed} 个`);
