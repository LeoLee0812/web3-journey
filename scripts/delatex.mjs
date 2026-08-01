#!/usr/bin/env node
/**
 * 把正文里的 LaTeX 公式转成中文读者直接看得懂的纯文本。
 * 原因：站点没有装 KaTeX（装了会把正文里大量的美元价格 `$100` 误判成行内公式），
 * 而 `$$...$$` 里的花括号又会被 MDX 当成 JS 表达式导致构建失败。
 *
 *   node scripts/delatex.mjs
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

/** 把一段 LaTeX 尽量翻成人能读的算式 */
function toPlain(tex) {
  let s = tex;
  for (let i = 0; i < 6; i++) {
    s = s
      .replace(/\\text\{([^{}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^{}]*)\}/g, '$1')
      .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1) ÷ ($2)')
      .replace(/\\sqrt\{([^{}]*)\}/g, '√($1)')
      .replace(/\\pmod\{([^{}]*)\}/g, ' mod $1')
      .replace(/\\left\(/g, '(')
      .replace(/\\right\)/g, ')')
      .replace(/\\left\[/g, '[')
      .replace(/\\right\]/g, ']')
      .replace(/\\cdot/g, '×')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\approx/g, '≈')
      .replace(/\\ge(?:q)?\b/g, '≥')
      .replace(/\\le(?:q)?\b/g, '≤')
      .replace(/\\%/g, '%')
      .replace(/\\,|\\;|\\!/g, ' ');
  }
  return s
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

let changed = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  let s = raw;

  // 独占一行的 $$...$$ → 纯文本代码块
  s = s.replace(/^[ \t]*\$\$([\s\S]*?)\$\$[ \t]*$/gm, (_, tex) => '```text\n' + toPlain(tex) + '\n```');
  // 行内 $...$（只处理明显是公式的：含反斜杠或只有单个字母变量）
  s = s.replace(/\$([^$\n]{1,60})\$/g, (m, tex) => {
    if (!/\\/.test(tex) && !/^[A-Za-z][A-Za-z0-9_]{0,3}$/.test(tex.trim())) return m; // 像 $100 这类价格，放过
    return '`' + toPlain(tex) + '`';
  });

  if (s !== raw) {
    fs.writeFileSync(f, s);
    changed++;
    console.log(`✓ ${path.relative(ROOT, f)}`);
  }
}
console.log(`──────── 共处理 ${files.length} 个文件，改写 ${changed} 个`);
