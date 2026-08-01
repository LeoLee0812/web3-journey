#!/usr/bin/env node
/**
 * 由简体中文原稿生成繁体中文（台湾正体）版本。
 *
 * 用 OpenCC 的 cn → twp 词组级转换（会把「软件/网络/数据/用户/默认」正确转成
 * 「軟體/網路/資料/使用者/預設」，不是逐字硬转），再做三件事：
 *   1. 站内链接统一加 /zh-TW 前缀（图片路径除外）；
 *   2. 少数加密圈术语按台湾习惯做人工覆盖；
 *   3. 组件 import、代码里的英文标识符原样保留（OpenCC 只动汉字，天然安全）。
 *
 *   node scripts/gen-zh-tw.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as OpenCC from 'opencc-js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'src/content/docs');
const LOCALES = ['zh-TW', 'en', 'ja', 'ko'];
const OUT = path.join(DOCS, 'zh-TW');

const convert = OpenCC.Converter({ from: 'cn', to: 'twp' });

// 词组转换后仍需按加密圈台湾用法修正的少数词
const OVERRIDES = [
  ['智慧合約', '智能合約'], // 台湾加密圈普遍仍用「智能合約」
  ['公鑰密碼學', '公開金鑰密碼學'],
  // 台湾把「账」一律写成「帐」
  ['記賬', '記帳'],
  ['賬本', '帳本'],
  ['賬戶', '帳戶'],
  ['賬號', '帳號'],
  ['賬單', '帳單'],
  ['對賬', '對帳'],
  ['賬面', '帳面'],
  ['分類賬', '分類帳'],
  ['小賬', '小帳'],
  ['賬', '帳'],
  // twp 会把「连接」转成偏向「上线」的「連線」，文中多指结构上的连结
  ['相互連線', '相互連結'],
  ['連線起來', '連結起來'],
  ['連線成鏈', '連結成鏈'],
];

/** 收集 root locale 下的所有 mdx（排除其它语种目录） */
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (d === DOCS && LOCALES.includes(e.name)) continue;
      walk(path.join(d, e.name));
    } else if (e.name.endsWith('.mdx')) {
      files.push(path.join(d, e.name));
    }
  }
})(DOCS);

let n = 0;
for (const f of files) {
  const rel = path.relative(DOCS, f);
  let s = fs.readFileSync(f, 'utf8');

  s = convert(s);
  for (const [from, to] of OVERRIDES) s = s.split(from).join(to);

  // 站内链接加语种前缀：](/xxx) 与 href="/xxx" 与 frontmatter 的 link: /xxx
  s = s.replace(/\]\(\/(?!images\/|zh-TW\/)/g, '](/zh-TW/');
  s = s.replace(/href="\/(?!images\/|zh-TW\/)/g, 'href="/zh-TW/');
  s = s.replace(/^(\s*link:\s*)\/(?!zh-TW\/)/gm, '$1/zh-TW/');

  const out = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, s);
  n++;
}
console.log(`✓ 繁体中文版生成完成：${n} 个文件 → src/content/docs/zh-TW/`);
