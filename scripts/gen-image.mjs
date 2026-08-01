#!/usr/bin/env node
/**
 * AI 生图（yunwu.ai 中转 gpt-image-2），用于章节封面这类需要特定构图/文字的图。
 *
 * 用法：
 *   node scripts/gen-image.mjs "<英文提示词>" <public 下的相对路径> [尺寸]
 * 尺寸只有三档：1536x1024(默认,横) / 1024x1536(竖) / 1024x1024(方)
 * 例：
 *   node scripts/gen-image.mjs "flat isometric illustration of a blockchain ledger, teal and dark navy" images/02-blockchain-basics/cover.png
 *
 * 单张耗时约 40-90 秒，脚本超时 280 秒。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// 本机访问境外接口需要走系统代理，而 Node 的 fetch 默认不认 HTTP_PROXY，
// 这里检测到没开 NODE_USE_ENV_PROXY 就带上它重新执行自己。
if (!process.env.NODE_USE_ENV_PROXY && (process.env.HTTPS_PROXY || process.env.HTTP_PROXY)) {
  const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' },
  });
  process.exit(r.status ?? 1);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const [prompt, outRel, size = '1536x1024'] = process.argv.slice(2);
if (!prompt || !outRel) {
  console.log(JSON.stringify({ ok: false, error: '用法: node scripts/gen-image.mjs "<提示词>" <public 下的相对路径> [尺寸]' }));
  process.exit(1);
}

const ctl = new AbortController();
const timer = setTimeout(() => ctl.abort(), 280_000);

try {
  const r = await fetch(`${env.IMAGE_API_BASE}/images/generations`, {
    method: 'POST',
    signal: ctl.signal,
    headers: {
      Authorization: `Bearer ${env.IMAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: env.IMAGE_MODEL, prompt, size, quality: 'medium', n: 1 }),
  });
  const text = await r.text();
  if (!r.ok) {
    console.log(JSON.stringify({ ok: false, error: `HTTP ${r.status}: ${text.slice(0, 300)}` }));
    process.exit(1);
  }
  const j = JSON.parse(text);
  const d = j.data?.[0];
  let buf;
  if (d?.b64_json) {
    buf = Buffer.from(d.b64_json, 'base64');
  } else if (d?.url) {
    // 部分中转只返回 url，需要再拉一次
    const img = await fetch(d.url);
    buf = Buffer.from(await img.arrayBuffer());
  } else {
    console.log(JSON.stringify({ ok: false, error: '返回里既没有 b64_json 也没有 url' }));
    process.exit(1);
  }
  const outAbs = path.join(ROOT, 'public', outRel);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, buf);
  console.log(JSON.stringify({ ok: true, path: '/' + outRel.replace(/^\/?(public\/)?/, ''), bytes: buf.length }));
} catch (e) {
  console.log(JSON.stringify({ ok: false, error: String(e?.message || e) }));
  process.exit(1);
} finally {
  clearTimeout(timer);
}
