// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import starlight from '@astrojs/starlight';

// 五个语种的章节侧边栏标签，集中在这里维护
// 结构：[目录名, 简中, 繁中, English, 日本語, 한국어]
const CHAPTERS = [
  ['01-what-is-web3', '第 1 章 · 认识 Web3', '第 1 章 · 認識 Web3', 'Ch.1 · What Is Web3', '第 1 章 · Web3 とは', '1장 · Web3 이해하기'],
  ['02-blockchain-basics', '第 2 章 · 区块链底层', '第 2 章 · 區塊鏈底層', 'Ch.2 · Blockchain Basics', '第 2 章 · ブロックチェーンの基礎', '2장 · 블록체인 기초'],
  ['03-cryptography', '第 3 章 · 密码学基础', '第 3 章 · 密碼學基礎', 'Ch.3 · Cryptography', '第 3 章 · 暗号技術の基礎', '3장 · 암호학 기초'],
  ['04-wallets', '第 4 章 · 钱包实战', '第 4 章 · 錢包實戰', 'Ch.4 · Wallets in Practice', '第 4 章 · ウォレット実践', '4장 · 지갑 실전'],
  ['05-ethereum-smart-contracts', '第 5 章 · 以太坊与智能合约', '第 5 章 · 以太坊與智慧合約', 'Ch.5 · Ethereum & Smart Contracts', '第 5 章 · イーサリアムとスマートコントラクト', '5장 · 이더리움과 스마트 컨트랙트'],
  ['06-tokens-nft', '第 6 章 · 代币世界', '第 6 章 · 代幣世界', 'Ch.6 · Tokens, Stablecoins & NFTs', '第 6 章 · トークンの世界', '6장 · 토큰의 세계'],
  ['07-exchanges-trading', '第 7 章 · 交易所与交易', '第 7 章 · 交易所與交易', 'Ch.7 · Exchanges & Trading', '第 7 章 · 取引所と取引', '7장 · 거래소와 트레이딩'],
  ['08-defi', '第 8 章 · DeFi 全景', '第 8 章 · DeFi 全景', 'Ch.8 · The DeFi Landscape', '第 8 章 · DeFi の全体像', '8장 · DeFi 전경'],
  ['09-layer2-multichain', '第 9 章 · 扩容与多链', '第 9 章 · 擴容與多鏈', 'Ch.9 · Scaling, L2s & Bridges', '第 9 章 · スケーリングとマルチチェーン', '9장 · 확장성과 멀티체인'],
  ['10-onchain-research', '第 10 章 · 链上研究方法', '第 10 章 · 鏈上研究方法', 'Ch.10 · On-Chain Research', '第 10 章 · オンチェーン調査手法', '10장 · 온체인 리서치'],
  ['11-airdrop-farming', '第 11 章 · 空投与打新', '第 11 章 · 空投與打新', 'Ch.11 · Airdrops & Farming', '第 11 章 · エアドロップと新規参加', '11장 · 에어드랍과 파밍'],
  ['12-security-risk', '第 12 章 · 安全与风控', '第 12 章 · 安全與風控', 'Ch.12 · Security & Risk', '第 12 章 · セキュリティとリスク管理', '12장 · 보안과 리스크 관리'],
  ['13-industry-career', '第 13 章 · 行业与职业', '第 13 章 · 行業與職業', 'Ch.13 · Industry & Career', '第 13 章 · 業界とキャリア', '13장 · 산업과 커리어'],
];

const chapterGroups = CHAPTERS.map(([dir, zhCN, zhTW, en, ja, ko]) => ({
  label: zhCN,
  translations: { 'zh-TW': zhTW, en, ja, ko },
  items: [{ autogenerate: { directory: dir } }],
}));

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
      title: {
        'zh-CN': '从 0 开始的 Web3 之旅',
        'zh-TW': '從 0 開始的 Web3 之旅',
        en: 'Web3 from Zero',
        ja: 'ゼロから始める Web3 の旅',
        ko: '0부터 시작하는 Web3 여행',
      },
      description:
        '面向零基础中文读者的 Web3 系统知识库：从区块链原理、钱包安全、DeFi 到链上研究与求职，13 章 104 节、约 18 万字干货，配 52 张图。',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
        'zh-TW': { label: '繁體中文', lang: 'zh-TW' },
        en: { label: 'English', lang: 'en' },
        ja: { label: '日本語', lang: 'ja' },
        ko: { label: '한국어', lang: 'ko' },
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
        {
          label: '开始之前',
          translations: { 'zh-TW': '開始之前', en: 'Before You Start', ja: 'はじめに', ko: '시작하기 전에' },
          items: [
            {
              label: '这本知识库怎么读',
              translations: { 'zh-TW': '這本知識庫怎麼讀', en: 'How to Read This Book', ja: '本書の読み方', ko: '이 책을 읽는 법' },
              slug: 'start-here',
            },
          ],
        },
        ...chapterGroups,
        {
          label: '附录',
          translations: { 'zh-TW': '附錄', en: 'Appendix', ja: '付録', ko: '부록' },
          items: [{ autogenerate: { directory: 'appendix' } }],
        },
      ],
    }),
  ],
});
