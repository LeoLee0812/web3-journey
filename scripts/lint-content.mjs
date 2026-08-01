#!/usr/bin/env node
/**
 * 内容体检 + 机械修复
 *
 *   node scripts/lint-content.mjs        # 只报告
 *   node scripts/lint-content.mjs --fix  # 顺手把能机械修的修掉
 *
 * 检查项：
 *  1. 小节文件是否存在、是否还是占位内容
 *  2. frontmatter 是否缺失 / title 与 order 是否与 outline.json 一致
 *  3. 用了 <Mermaid> 但没 import
 *  4. 用了 Starlight 组件但没 import
 *  5. 中文正文字数
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIX = process.argv.includes('--fix');
const outline = JSON.parse(fs.readFileSync(path.join(ROOT, 'outline.json'), 'utf8'));

const SL_COMPONENTS = ['Aside', 'Steps', 'Card', 'CardGrid', 'LinkCard', 'Tabs', 'TabItem', 'Badge', 'Icon', 'FileTree', 'LinkButton'];

let problems = 0;
let totalWords = 0;
const rows = [];

for (const ch of outline.chapters) {
  for (const [i, sec] of ch.sections.entries()) {
    const rel = `src/content/docs/${ch.id}/${sec.id}.mdx`;
    const abs = path.join(ROOT, rel);
    const issues = [];

    if (!fs.existsSync(abs)) {
      rows.push({ rel, words: 0, issues: ['文件不存在'] });
      problems++;
      continue;
    }
    let src = fs.readFileSync(abs, 'utf8');

    if (src.includes('占位内容，待生成')) issues.push('仍是占位内容');

    // ── frontmatter ──
    const fmMatch = src.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!fmMatch) {
      issues.push('缺 frontmatter');
      if (FIX) {
        const title = sec.title.includes(':') || sec.title.includes('：') ? `"${sec.title.replace(/"/g, '')}"` : sec.title;
        // 从正文里摘一句当 description
        const firstLine = (src.match(/\*\*一句话结论：\*\*\s*(.+)/) || [])[1] || sec.title;
        const desc = firstLine.replace(/[*`\[\]()]/g, '').slice(0, 88);
        src = `---\ntitle: ${title}\ndescription: ${desc}\nsidebar:\n  order: ${i + 1}\n---\n\n${src}`;
        fs.writeFileSync(abs, src);
        issues.push('→ 已补 frontmatter');
      }
    } else {
      const fm = fmMatch[1];
      if (!/^title:/m.test(fm)) issues.push('frontmatter 缺 title');
      if (!/order:\s*\d+/.test(fm)) {
        issues.push('frontmatter 缺 sidebar.order');
        if (FIX) {
          src = src.replace(/^---\n([\s\S]*?)\n---/, `---\n$1\nsidebar:\n  order: ${i + 1}\n---`);
          fs.writeFileSync(abs, src);
          issues.push('→ 已补 order');
        }
      } else {
        const got = Number(fm.match(/order:\s*(\d+)/)[1]);
        if (got !== i + 1) {
          issues.push(`order 应为 ${i + 1}，实为 ${got}`);
          if (FIX) {
            src = src.replace(/order:\s*\d+/, `order: ${i + 1}`);
            fs.writeFileSync(abs, src);
            issues.push('→ 已修正 order');
          }
        }
      }
    }

    // ── import 检查 ──
    const body = src.replace(/^---\n[\s\S]*?\n---\n?/, '');
    if (/<Mermaid[\s/]/.test(body) && !/from ['"]@components\/Mermaid\.astro['"]/.test(body)) {
      issues.push('用了 <Mermaid> 但没 import');
      if (FIX) {
        src = src.replace(/^(---\n[\s\S]*?\n---\n)/, `$1\nimport Mermaid from '@components/Mermaid.astro';\n`);
        fs.writeFileSync(abs, src);
        issues.push('→ 已补 Mermaid import');
      }
    }
    const used = SL_COMPONENTS.filter((c) => new RegExp(`<${c}[\\s/>]`).test(body));
    const importedLine = (body.match(/import\s*\{([^}]*)\}\s*from\s*['"]@astrojs\/starlight\/components['"]/) || [])[1] || '';
    const missing = used.filter((c) => !importedLine.includes(c));
    if (missing.length) {
      issues.push(`未 import 的组件: ${missing.join(',')}`);
      if (FIX) {
        if (importedLine) {
          src = src.replace(
            /import\s*\{([^}]*)\}\s*from\s*['"]@astrojs\/starlight\/components['"]/,
            `import { ${[...new Set([...importedLine.split(',').map((s) => s.trim()).filter(Boolean), ...missing])].join(', ')} } from '@astrojs/starlight/components'`
          );
        } else {
          src = src.replace(/^(---\n[\s\S]*?\n---\n)/, `$1\nimport { ${missing.join(', ')} } from '@astrojs/starlight/components';\n`);
        }
        fs.writeFileSync(abs, src);
        issues.push('→ 已补组件 import');
      }
    }

    // ── 字数 ──
    const words = (body.replace(/```[\s\S]*?```/g, '').match(/[一-龥]/g) || []).length;
    totalWords += words;
    if (words < 900) issues.push(`正文偏短 ${words} 字`);

    if (issues.length) problems++;
    rows.push({ rel, words, issues });
  }
}

for (const r of rows) {
  if (r.issues.length) console.log(`✗ ${r.rel}  [${r.words}字]  ${r.issues.join(' | ')}`);
}
console.log('\n────────────────────────────────');
console.log(`小节总数：${rows.length}`);
console.log(`有问题的：${problems}`);
console.log(`正文中文总字数（不含代码块）：${totalWords.toLocaleString()}`);
console.log(`平均每节：${Math.round(totalWords / rows.length)} 字`);
