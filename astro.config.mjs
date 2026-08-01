// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import starlight from '@astrojs/starlight';

// 站点配置：从 0 开始的 Web3 之旅
// 纯静态输出，部署在 Vercel，自定义域名 web3.saveme505.help
export default defineConfig({
  site: 'https://web3.saveme505.help',
  // 正文 MDX 分布在不同深度的目录里，用别名引组件，免得相对路径层数写错
  vite: {
    resolve: {
      alias: { '@components': fileURLToPath(new URL('./src/components', import.meta.url)) },
    },
  },
  integrations: [
    starlight({
      title: '从 0 开始的 Web3 之旅',
      description:
        '面向零基础中文读者的 Web3 系统知识库：从区块链原理、钱包安全、DeFi 到链上研究与求职，13 章 104 节，约 10 万字干货。',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/LeoLee0812' },
      ],
      sidebar: [
        { label: '开始之前', items: [{ label: '这本知识库怎么读', slug: 'start-here' }] },
        { label: '第 1 章 · 认识 Web3', items: [{ autogenerate: { directory: '01-what-is-web3' } }] },
        { label: '第 2 章 · 区块链底层', items: [{ autogenerate: { directory: '02-blockchain-basics' } }] },
        { label: '第 3 章 · 密码学基础', items: [{ autogenerate: { directory: '03-cryptography' } }] },
        { label: '第 4 章 · 钱包实战', items: [{ autogenerate: { directory: '04-wallets' } }] },
        { label: '第 5 章 · 以太坊与智能合约', items: [{ autogenerate: { directory: '05-ethereum-smart-contracts' } }] },
        { label: '第 6 章 · 代币世界', items: [{ autogenerate: { directory: '06-tokens-nft' } }] },
        { label: '第 7 章 · 交易所与交易', items: [{ autogenerate: { directory: '07-exchanges-trading' } }] },
        { label: '第 8 章 · DeFi 全景', items: [{ autogenerate: { directory: '08-defi' } }] },
        { label: '第 9 章 · 扩容与多链', items: [{ autogenerate: { directory: '09-layer2-multichain' } }] },
        { label: '第 10 章 · 链上研究方法', items: [{ autogenerate: { directory: '10-onchain-research' } }] },
        { label: '第 11 章 · 空投与打新', items: [{ autogenerate: { directory: '11-airdrop-farming' } }] },
        { label: '第 12 章 · 安全与风控', items: [{ autogenerate: { directory: '12-security-risk' } }] },
        { label: '第 13 章 · 行业与职业', items: [{ autogenerate: { directory: '13-industry-career' } }] },
        { label: '附录', items: [{ autogenerate: { directory: 'appendix' } }] },
      ],
    }),
  ],
});
