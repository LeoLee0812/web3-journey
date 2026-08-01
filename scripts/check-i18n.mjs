#!/usr/bin/env node
/**
 * 多语种完整度检查：以简体中文原稿为基准，列出各语种缺失或明显没翻的文件。
 *   node scripts/check-i18n.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const LOCALES = ['zh-TW', 'en', 'ja', 'ko'];

const src = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (d === DOCS && LOCALES.includes(e.name)) continue;
      walk(path.join(d, e.name));
    } else if (e.name.endsWith('.mdx')) src.push(path.relative(DOCS, path.join(d, e.name)));
  }
})(DOCS);

const han = (s) => (s.match(/[一-龥]/g) || []).length;

for (const loc of LOCALES) {
  const missing = [];
  const suspicious = [];
  for (const rel of src) {
    const p = path.join(DOCS, loc, rel);
    if (!fs.existsSync(p)) { missing.push(rel); continue; }
    const body = fs.readFileSync(p, 'utf8');
    // en / ja / ko 里如果还有大量汉字，多半是没翻或只翻了一半
    if (loc === 'en' && han(body) > 40) suspicious.push(`${rel} (残留汉字 ${han(body)})`);
    if ((loc === 'ja' || loc === 'ko') && han(body) > 400) suspicious.push(`${rel} (汉字 ${han(body)}，疑似未翻)`);
    if (body.length < 400) suspicious.push(`${rel} (文件过短 ${body.length}B)`);
  }
  const ok = src.length - missing.length;
  console.log(`\n【${loc}】 ${ok}/${src.length} 存在`);
  if (missing.length) console.log('  缺失：\n    ' + missing.join('\n    '));
  if (suspicious.length) console.log('  可疑：\n    ' + suspicious.slice(0, 30).join('\n    '));
}
console.log(`\n基准文件数：${src.length}`);
