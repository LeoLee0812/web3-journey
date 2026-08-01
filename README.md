# 从 0 开始的 Web3 之旅

[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Starlight](https://img.shields.io/badge/Starlight-docs-14b8a6?style=flat-square&logo=astro&logoColor=white)](https://starlight.astro.build/)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://web3.saveme505.help)
[![Last Commit](https://img.shields.io/github/last-commit/LeoLee0812/web3-journey?style=flat-square&color=14b8a6)](https://github.com/LeoLee0812/web3-journey/commits/main)
[![Repo Size](https://img.shields.io/github/repo-size/LeoLee0812/web3-journey?style=flat-square&color=0d9488)](https://github.com/LeoLee0812/web3-journey)

> 面向**中文零基础读者**的 Web3 系统知识库。13 章 104 节、约 18 万字，从区块链底层原理一路讲到链上研究方法与行业求职。
>
> 在线阅读：**<https://web3.saveme505.help>**

## 这是什么

不是术语词典，也不是喊单频道。每一节都从「你现在能理解的东西」出发，讲清一个概念的**原理、边界与实操**，再说明它在真实市场里怎么用、怎么亏钱。

内容组织成五个层次：

| 阶段 | 章节 | 解决的问题 |
| --- | --- | --- |
| 原理层 | 第 1–3 章 | 术语不再是黑话，能自己推导「为什么」 |
| 操作层 | 第 4–5 章 | 敢动手，且知道每一步的风险在哪 |
| 资产层 | 第 6–9 章 | 看懂链上金融的收益与风险从哪来 |
| 研究层 | 第 10–11 章 | 有一套可复用的研究与实操流水线 |
| 生存层 | 第 12–13 章 | 保住本金，并把这件事变成工作 |

## 章节目录

1. **认识 Web3** — 三代互联网的所有权之争、术语速通、技术栈全景、十七年简史
2. **区块链底层** — 账本结构、哈希与区块、节点、PoW/PoS、不可能三角、分叉治理
3. **密码学基础** — 非对称加密、私钥公钥地址、BIP-39、HD 钱包、数字签名、默克尔树、ZK 入门
4. **钱包实战** — 钱包分类、建钱包、助记词备份、第一笔转账、Gas 机制、授权撤销、硬件钱包、账户抽象
5. **以太坊与智能合约** — EVM 与状态机、合约模型、读懂 Solidity、交易生命周期、MEV、合约核验、可升级代理
6. **代币世界** — ERC 标准、代币经济学、解锁曲线、稳定币三流派、崩盘复盘、NFT、RWA
7. **交易所与交易** — CEX 全景、订单簿与滑点、DEX 与 AMM、LP 与无常损失、Swap 实操、永续杠杆、套利、交易纪律
8. **DeFi 全景** — 赛道地图、借贷清算、流动性挖矿、LST/LRT、衍生品、收益来源辨伪、风险清单、协议评估十二步
9. **扩容与多链** — 为何扩容、Optimistic/ZK Rollup、L2 格局、非以太坊 L1、跨链桥三模型、桥安全、多链管理
10. **链上研究方法** — 六维打分表、区块浏览器进阶、数据平台工具箱、Dune 最小 SQL、鲸鱼追踪、社区热度量化、尽调清单、研究报告模板
11. **空投与打新** — 空投本质、机会发现、交互策略、成本核算、女巫检测、Launchpad、积分赛季制、预期管理
12. **安全与风控** — 威胁模型、钓鱼图鉴、签名攻击、Rug Pull 识别、读审计报告、个人 OPSEC、钱包分层、被盗应急
13. **行业与职业** — 行业地图、岗位说明书、社区增长、KOL 与内容、出海运营、AI 自动化提效、作品集、面试避坑

完整目录见 [`outline.json`](./outline.json)。

## 技术栈

- **[Astro 7](https://astro.build/) + [Starlight](https://starlight.astro.build/)** — 纯静态输出，零客户端 JS 基线
- **MDX** — 正文可直接用 `<Aside> <Steps> <Tabs> <CardGrid>` 等组件
- **[Pagefind](https://pagefind.app/)** — 构建期生成全文索引，支持中文搜索，无需后端
- **Mermaid** — 自定义 `<Mermaid>` 组件客户端渲染，随明暗主题切换配色
- **Vercel** — GitHub push 自动部署

### 为什么选 Starlight 而不是 Nextra / Docusaurus / VitePress

| 维度 | Starlight | Nextra 4 | Docusaurus | VitePress |
| --- | --- | --- | --- | --- |
| 100+ 页构建速度 | 秒级 | 依赖 Next 构建，较慢 | 中等 | 快 |
| 侧边栏 | 目录自动生成 | 需逐层维护 `_meta` | 需 `sidebars.js` | 需手写配置 |
| 中文全文搜索 | 内置 Pagefind，开箱可用 | 需配置 | Algolia 或本地插件 | 内置 |
| 客户端 JS 基线 | 0（按需 island） | React 全量 | React 全量 | Vue 运行时 |
| 版本耦合风险 | 只依赖 Astro | 强绑 Next 版本 | 强绑 React 生态 | 强绑 Vite/Vue |

这是一个 104 个 MDX 文件、以阅读为唯一目的的静态知识库，Starlight 的「目录即导航 + 构建期搜索 + 零 JS」正好命中。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 输出到 dist/
npm run preview
```

## 目录结构

```
src/
  content/docs/          # 全部正文，每章一个目录
    01-what-is-web3/     # 8 个小节 MDX
    ...
    13-industry-career/
    appendix/            # 术语表等附录
  components/Mermaid.astro
  styles/custom.css      # 主题配色与中文排版
public/images/           # 章节配图，按章节目录分类
research/                # 写作前的事实核查简报（每章 2 份）
outline.json             # 全书大纲（章节 / 小节 / 目标）
WRITING_GUIDE.md         # 写作规范
```

## 内容生产方式

本知识库由多层 AI Agent 协作产出，人工定大纲与终审：

```
Opus（总编）      定 13 章 104 节结构、章节衔接、全局一致性
  └─ 每章：
       Haiku ×2   联网检索最新事实与真实案例 → research/*.md
       Haiku ×8   依据简报与写作规范产出 8 个小节 MDX
       Sonnet ×1  通读全章审校：纠错、去重、补衔接、写章节导读
       Sonnet ×1  配图：搜图（Pexels / Pixabay）+ AI 生图，插入正文
```

所有涉及时效的表述都经过联网核查并标注时间口径。

## 免责声明

本站内容仅供**学习与研究**，不构成投资、法律或税务建议。加密资产波动极大，各地监管要求差异显著，文中提到的任何协议、平台、策略都可能失效或造成本金全部损失。你对自己的每一笔操作负全部责任。

## License

内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)，代码部分 MIT。
