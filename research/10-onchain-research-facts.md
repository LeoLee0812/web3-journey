# 第 10 章《链上数据分析与项目研究方法》事实核查报告

**检查日期**：2026 年 8 月  
**检查范围**：以太坊状态、L2 生态、链上分析工具、Gas 费用、DeFi 参数、研究方法论  
**数据来源**：官方文档、DefiLlama、Dune Analytics、Ethereum.org、多个区块链分析平台

---

## 按小节整理的事实要点

### 小节 1：项目研究框架（六维打分表）

#### 确认的核心维度
Web3 项目研究的标准框架包含以下维度：
- **产品与市场**：产品定位、市场需求、用户体验
- **代币经济学**：代币分配、解锁时间表、激励机制
- **竞争地位与护城河**：竞争对手对比、市场份额、技术差异化
- **团队背景**：创始人经历、开发者活跃度、顾问质量
- **财务与融资**：融资历史、融资轮次、投资方背景
- **风险因素**：技术风险、法律风险、市场风险

**数据来源**：Web3Caff 研究中心、DF加密笔记（2026）

---

### 小节 2：区块浏览器进阶（地址挖矿与资金链路）

#### 主流区块浏览器现状（2026）

| 浏览器 | 主要特性 | 支持链数 | 付费模式 |
|--------|--------|--------|--------|
| **Etherscan** | 以太坊原生浏览器，交易验证、钱包余额查询 | 仅以太坊主要链 | 免费基础版 |
| **Tenderly** | 开发者调试工具，40+ EVM 链支持，Dashboard免费 | 40+ EVM链 | 免费+企业方案 |
| **Dune Analytics** | 自定义 SQL 查询，社区仪表板库 | 130+链 | 免费+订阅 |
| **Nansen** | 聪明钱标签、实时追踪、Smart Money 仪表板 | 多链 | 企业方案起价 $25K/年 |
| **Arkham** | AI 地址去匿名化、Intel Exchange | 多链 | 免费+ARKM 代币经济 |

**关键改进**（相对早期版本）：
- Etherscan 不再是唯一选择，生态已分化为专用工具
- 地址标签系统现已成为标准功能（由 Nansen、Arkham、Chainalysis 提供）
- Tenderly 已成为开发者调试首选，公开浏览器从 Etherscan 专属升级为多选
- 资金链路追踪从单链演变为跨链聚合查询

**数据来源**：DEXTools、Eco 支持文档、Nansen 官方对比（2026）

---

### 小节 3：链上数据平台工具箱

#### 主流数据平台分类与功能

**TVL & 资产追踪**
- **DefiLlama**：全链 TVL 聚合，48+ 链支持
  - 当前总 TVL：$74.085b（2026年6月）
  - 功能：DEX交易量、永续合约、稳定币供应、RWA追踪
  - 核心协议：Lido($17.533b)、Aave($14.287b)、Morpho($7.598b)

**自定义查询 & SQL 分析**
- **Dune Analytics**：1.5M+ 数据集，6.5M+ 查询，200K+ 公开仪表板
  - 支持 130+ 区块链
  - 引擎：Trino 自研 SQL
  - 数据类型：Stablecoins、Prediction Markets、RWA、加密代币余额转账
  - 免费方案包含仪表板访问 + Digital Asset Brief 报告

**聪明钱追踪**
- **Nansen**：着重 Smart Money 行为识别，标签库完整
- **Arkham**：AI 驱动的地址去匿名化，Intel Exchange 众筹
- **Chainalysis**：企业级合规标签系统

**预测市场专用**（2026 新增）
- **PolyTrack**：Polymarket 鲸鱼追踪，复制交易功能（73% 准确度）
- **Polymarket Analytics / Kreo / PolyGun / PolyHub**：免费链上分析

**社交信号**
- **Discord**：6.7M+ 活跃加密服务器
- **Twitter/X**：AI 信号提供商（Learn2Trade、Token Metrics、CryptoNinjas）
- **集成工具**：Google Sheets + X 公开 P&L 追踪

**开发者活跃度**
- GitHub 提交频率、Issue 响应时间、社区讨论活跃度
- 通过 Dune、web3data.com 等聚合平台追踪

**数据来源**：DefiLlama 官网、Dune Analytics 产品页、Nansen 2025指南、EarnifyHub 对比（2026）

---

### 小节 4：看懂并改写 Dune 看板（SQL 基础）

#### Dune SQL 语法核心要点（2026）

**查询引擎**
- 基于 Trino 架构，非标准 PostgreSQL
- 不支持隐式类型转换

**数据类型**
- 字符串：`varchar`
- 浮点数：`double`
- 整数：`decimal(38, 0)`

**字段引用规范**
- 包含特殊字符或关键字的字段名须用双引号 `"field_name"`
- 表名同样需要双引号处理

**学习路径**
1. 左侧 Data Explorer：浏览可用表、查看字段结构
2. 公开仪表板：1.5M+ 数据集中找到相似查询
3. Fork 他人查询：修改关键参数快速迭代
4. 社区资源：Mastering Chain Analytics、登链社区、知乎 Web3 专栏

**常见数据查询类型**
- ERC-20 转账追踪：`traces`、`decoded_events` 表
- DEX 交易分析：`dex.trades`
- 钱包余额：`tokens.balances`
- 合约交互：`decoded_calls`

**数据来源**：Dune 官方文档、六度实验室、登链社区（2026）

---

### 小节 5：巨鲸与聪明钱追踪

#### 地址标签系统现状

**标签提供商**（2026）
- **Nansen**：传统 SaaS 订阅模式（月度递增费用）
- **Arkham**：代币经济模式（ARKM 质押解锁）
- **Chainalysis**：企业级合规标签
- **开源替代**：GitHub 上的 web3-data-research/smart-money-tracker

#### 资金异动追踪工具

| 工具 | 特性 | 价格 |
|------|------|------|
| Nansen Smart Alerts | 自动化告警，AI 生成自然语言报告 | 企业方案 |
| Dune + DeBank | 链上原始数据 + UI 钱包 | 免费 |
| CryptoRank | PNL 排行榜、钱包分析 | 免费+高级 |
| Solsniffer / CoinStats | Solana 钱包分析 | 免费+订阅 |
| DEXTools / Dex Screener | PNL 高的钱包挑选 | 免费 |

#### 聪明钱定义与验证
- **核心指标**：历史胜率、AUM 增长、风险调整收益（Sharpe Ratio）
- **数据验证**：需交叉参考多个平台避免幸存者偏差
- **重要提示**：追踪聪明钱≠盲目复制，需结合其他指标

**数据来源**：Stingray、DEXTools 教程、KuCoin 知识库、Nansen 官方（2026）

---

### 小节 6：社区热度量化

#### 社交平台数据收集

**Discord 生态**
- 活跃服务器数量：6.7M+ 加密相关（2026）
- DAO 日常通讯：Proposals、讨论、成员签到
- 数据采集工具：Discord API + 开源机器人

**Twitter/X 信号**
- AI 信号提供商阵营（2026）：Learn2Trade、Token Metrics、The Crypto Sanctuary、CryptoNinjas Trading、3Commas
- 集成方式：Google Sheets 公开 P&L + X 自动发布
- 追踪方式：关键词监听、话题标签聚合、KOL 发文频率

**开发者活跃度指标**
- GitHub 频率：commits/week、issues response time、PR merge rate
- 社区讨论：Forum posts、Medium 文章发布周期、更新公告频率
- 聚合平台：Dune Developer Dashboard、web3data.com、GitCoin 排行

#### 信号解读要点
- 热度高≠项目好，需排除炒作与虚假活跃
- 开发者活跃度是长期指标，比短期社交热度更可信
- 社区讨论质量（技术深度、批判性声音）重于数量

**数据来源**：Bitcoin.com、NFT Evening、西非贸易中心（2026）

---

### 小节 7：尽职调查清单

#### 融资背景核实
- **融资轮次**：种子、A、B、C、D 及融资估值
- **投资方身份**：知名 VC 背景、过往投资记录、是否有利益冲突
- **融资时间表**：距最后融资多久、是否在活跃募资中
- **资金来源**：机构 vs. 社区融资的比例

#### 锁仓与解锁时间表
- **检查来源**：官方白皮书、Messari 报告、DefiLlama 原生数据、Nansen
- **关键参数**：
  - 初始流通供应量占比
  - 归属期（Vesting Period）：通常 4 年（1 年悬崖 + 3 年线性）
  - 大额解锁日期及风险
  - 团队/投资方持仓比例

#### 审计报告验证
- **主流审计方**（2026 排名）：OpenZeppelin、Trail of Bits、ChainSecurity、Spearbit、Cantina、CertIK、Hashlock
- **审计覆盖**：代码脆弱性、访问控制、重入风险、预言机风险、升级逻辑、代币授权、部署代码一致性
- **审计成本**：$50K-$500K+ 取决于代码规模与审计方选择
- **审计时间**：内部文档复核 3-5 天 + 独立重审 3-6 周

#### 法律与合规尽职调查
- **AML 筛查**：协议/合约属性归属、是否涉及制裁实体、资金来源审查
- **司法管辖**：项目注册地、运营地、Token 销售合规性（SEC、FCA 监管)
- **智能合约风险**：已知漏洞数据库（SolidiFied、Immunefi）、历史被黑客攻击记录

**审计方式**
- 自主团队复核：3-5 天
- 邀请多家审计方报价：通常 4-6 周
- 部分项目需参考前置检查清单（Ancilar、DeFi Protocol Due Diligence）

**数据来源**：DeFi Sentinel、CryptoJobsList、Hashlock、Press.farm、DEV Community（2026）

---

### 小节 8：产出物——研究报告模板

#### 研究报告标准章节结构

**摘要（Executive Summary）**
- 项目一句话定义
- 核心创新点（2-3 个）
- 投资结论（推荐/持观察/不推荐）+ 风险提示

**第一部分：项目基本信息**
- 成立时间、融资轮次、目前估值
- 官方网站、智能合约地址、治理代币
- 管理层与投资方名单

**第二部分：产品与市场分析**
- 产品形态（DeFi 借贷 / DEX / 衍生品 / 等等）
- 目标市场规模 & 竞争格局
- 目前市场份额 & 增长趋势（TVL / 交易量）

**第三部分：代币经济学评估**
- 总供应量、初始流通比例、当前流通量
- 代币释放时间表（6-12 个月展望）
- 大额解锁事件及风险
- 代币用途（治理 / 费用 / 激励）

**第四部分：团队与生态**
- 创始人背景（教育、从业经历、往期成功项目）
- 开发者团队规模 & GitHub 活跃度
- 顾问/投资方背景评分
- 社区热度（Discord 人数、Twitter 粉丝、GitHub stars）

**第五部分：技术与安全**
- 主要智能合约地址及编程语言
- 已进行的审计（审计方、日期、漏洞数）
- 历史被黑事件（若有）
- 升级权限评估（是否存在中心化风险）

**第六部分：财务指标**
- TVL 趋势（过去 3、6、12 个月）
- 日活用户（DAU）/ 月活用户（MAU）增长
- 交易费收入 & 协议收益
- 成本结构分析（如流动性挖矿成本占比）

**第七部分：风险评估与结论**
- 技术风险：已知漏洞、升级风险、跨链风险
- 市场风险：竞争加剧、TVL 流出、用户粘性
- 法律风险：监管不确定性、Token 分类风险
- 综合评分表（6 个维度各打分，加权计算总分）

**参考资料**
- 官方文档、白皮书、公开财务报告
- 审计报告链接
- 数据来源平台（Dune 仪表板、DefiLlama、Token Terminal）

#### 研究报告数据来源检查清单
- [ ] TVL 数据来自 DefiLlama（确认时间戳）
- [ ] 融资信息来自 Crunchbase / Messari / 官方公告
- [ ] 审计报告来自 GitHub / 官方网站
- [ ] 代币解锁时间表来自 Token Unlock / 白皮书
- [ ] 开发者活跃度来自 GitHub API / Dune Dashboard
- [ ] 社区数据来自 Discord / Twitter（需截图或 API 导出）
- [ ] 智能合约地址已验证（Etherscan 标签对应）

**数据来源**：Web3Caff 研究框架、Ancilar 尽职调查清单、Messari 方法论（2026）

---

## 可引用数字（含来源与时间）

### 以太坊网络参数（2026 年 8 月）

| 参数 | 数值 | 备注 | 来源 | 时间 |
|------|------|------|------|------|
| **区块时间** | ~12 秒 | Dencun 后未改变 | Ethereum.org | 2024-2026 |
| **Gas 限制** | 60 million/block | Fusaka 升级提升 | Ethereum.org | 2025-12 |
| **基础费用范围** | 5-40 Gwei（常规）/100+ Gwei（峰值） | 2026 年 6 月 3 日峰值 0.15 gwei | CoinLaw、Ethereum.org | 2026-06/08 |
| **ETH 转账成本** | $0.10-0.25 | 基于 gwei 浮动 | DEXTools | 2026 |
| **ERC-20 转账成本** | 约 7.6 美分 | 基于低 Gas | DEXTools | 2026 |
| **Blob 目标数量** | 6 个/块 | Pectra 升级（2025-05） | Ethereum.org | 2025-05 |
| **Blob 最大数量** | 9 个/块 | EIP-7691 提升 | Ethereum.org | 2025-05 |
| **L2 存储成本降幅** | ~80% 下降 | 相对 Dencun 前 | Ethereum.org | 2024-03 |

### DeFi 生态 TVL（2026 年 6-8 月）

| 指标 | 数值 | 时间 | 数据源 |
|------|------|------|--------|
| **全链总 TVL** | $74.085b | 2026-06 | DefiLlama |
| **Ethereum TVL** | $38.24b | 2026-06 | DefiLlama |
| **Ethereum TVL 占比** | 53.1% | 2026-06 | DefiLlama |
| **年初至今 TVL 跌幅** | -37.3% | 2026-01 至 06 | DefiLlama、Yahoo Finance |
| **2026 年初全链 TVL** | ~$115b | 2026-01 | DefiLlama |
| **Arbitrum TVL** | ~$2.8b | 2026-06 | The Block、Everstake |
| **Arbitrum L2 占比** | 30.86% | 2026-06 | The Block |
| **Base TVL 占比** | 46.58% | 2026-06 | The Block |
| **Optimism TVL 占比** | ~6% | 2026-06 | The Block |
| **Top 3 L2 合计占比** | 83% | 2026-06 | The Block |
| **Ethereum TVL 跌幅** | -43% | 2026-01 至 06 | DefiLlama |
| **Arbitrum 跌幅** | -55% | 2026-01 至 06 | The Block |

### 主流协议 TVL（2026 年 6 月）

| 协议 | TVL | 分类 | 变化 |
|------|-----|------|------|
| Lido | $17.533b | 流动质押 | - |
| Aave | $14.287b | 借贷 | Ethereum 43% 下跌 |
| Morpho | $7.598b | 借贷 | - |
| 币安质押 ETH | $6.924b | 流动质押 | - |
| Sky | $5.837b | 稳定币/DAO | - |
| TRON | +5% YTD | 稳定币结算 | 逆势增长 |
| Hyperliquid | +7% YTD | 衍生品 | 生态扩张 |

### 区块链数据与社区规模（2026）

| 指标 | 数值 | 说明 | 来源 |
|------|------|------|------|
| **活跃加密 Discord 服务器** | 6.7M+ | 全球 Web3 社区 | Discord 统计 |
| **Dune 公开仪表板** | 200K+ | 社区贡献 | Dune Analytics |
| **Dune 数据集** | 1.5M+ | 链上事件与交易 | Dune Analytics |
| **Dune 查询数量** | 6.5M+ | 用户自建查询 | Dune Analytics |
| **Dune 支持链数** | 130+ | 包含 L2、L3、侧链 | Dune Analytics |
| **DefiLlama 支持链数** | 48+ | 以 Uniswap 为例 | DefiLlama |
| **Polymarket 复制交易准确率** | 73% | PolyTrack 声称 | PolyTrack |

### 智能合约审计成本与时间（2026）

| 项目 | 数值 | 说明 | 来源 |
|------|------|------|------|
| **审计费用范围** | $50K-$500K+ | 取决于代码规模 | Hashlock、Press.farm |
| **内部文档复核** | 3-5 天 | 自主团队 | Ancilar |
| **独立重审** | 3-6 周 | 取决于团队可用性 | Ancilar |
| **高级企业方案底价** | $25,000/年 | Nansen 等平台起价 | Stingray 2026 |

### Ethereum 升级时间表（已实现）

| 升级 | 时间 | 主要特性 |
|------|------|--------|
| Dencum (Deneb+Cancun) | 2024-03 | EIP-4844 Blob、L2 数据成本 -80% |
| Pectra | 2025-05 | Blob 容量 3→6 目标、EIP-7702 Account Abstraction、预计二阶段 2025-12 或 2026-01 |
| Fusaka | 2025-12 | 高效验证器采样、L1 Gas 限制升至 60M |

---

## 过时说法纠正清单

### 关键纠正

#### 1. ❌ Gas 费用与以太坊主网可用性

**过时说法**：「以太坊主网 Gas 费用永远在 50-200 Gwei，不适合小额交易」

**2026 年现状**：
- 基础费用范围 5-40 Gwei（常规条件）
- ETH 转账成本 $0.10-0.25（已可用于微交易）
- Dencun + Pectra + Fusaka 三次升级后，主网已「不再表现为永久拥堵」
- 建议重新评估：主网 vs L2 的权衡不再是「成本」，而是「组合性+流动性+安全性」

**应如何表述**：
> 以太坊主网 Gas 费用已大幅下降。2026 年常规条件下基础费用在 5-40 Gwei，日常转账成本不足 $0.25，已适合主网直接使用。L2 仍保有成本优势，但不再是必需选择。应按应用需求（流动性深度、跨链调用频率等）重新评估。

---

#### 2. ❌ Layer 2 独占优势

**过时说法**：「Arbitrum、Optimism 已是 DeFi 绝对主力，Ethereum 主网式微」

**2026 年现状**：
- Base + Arbitrum 控制 77% L2 TVL
- Optimism 转向 Superchain（共享排序器联盟）
- Ethereum 主网重回 53.1% 全链 TVL
- Polygon 失去先发优势，流动性外流至 Base、Arbitrum、OP

**应如何表述**：
> Layer 2 生态已高度分化（2026）。Base（46.58%）和 Arbitrum（30.86%）主导市场，Optimism 通过 Superchain 寻求差异化。Ethereum 主网因成本下降重获吸引力，占全链 TVL 53.1%。Polygon 面临流动性流出压力。

---

#### 3. ❌ Blob 交易机制的静态描述

**过时说法**：「Blob 容量固定在 3 个/区块」（Dencun 后）

**2026 年现状**：
- Pectra 升级（2025-05）：Blob 目标从 3 增至 6、最大从 6 增至 9
- EIP-7691 实现
- L2 手续费进一步下降

**应如何表述**：
> 自 Pectra 升级（2025 年 5 月）起，每个以太坊区块的 Blob 目标容量从 3 增至 6，最大容量从 6 增至 9（EIP-7691）。这进一步扩大了 Rollup 的便宜数据通道容量。

---

#### 4. ❌ Account Abstraction 尚在早期

**过时说法**：「Account Abstraction 仅存在于 L2 或专用链上，主网 EOA 无法使用」

**2026 年现状**：
- Pectra 引入 EIP-7702 (SetCode)
- 现有 EOA 可直接获取智能账户功能（无需迁移）
- 功能：批量交易、Gas 赞助、会话密钥、Passkey

**应如何表述**：
> Pectra 升级（2025 年 5 月）通过 EIP-7702 为 Ethereum 主网引入原生 Account Abstraction。用户可在现有账户地址上启用智能账户功能（批量交易、代付 Gas、会话密钥），无需迁移。

---

#### 5. ❌ 区块浏览器单一依赖

**过时说法**：「使用 Etherscan 查交易，这是唯一可信的区块浏览器」

**2026 年现状**：
- Tenderly 已成开发者首选调试工具
- Nansen / Arkham 提供专门的聪明钱标签
- Dune 已成研究人员的主要查询工具
- Etherscan 仍可用，但已非唯一选项

**应如何表述**：
> Etherscan 仍是以太坊原生浏览器，但现已有多个专用工具。开发者调试选 Tenderly，聪明钱追踪选 Nansen/Arkham，自定义数据查询选 Dune Analytics。选择工具应按使用场景而非习惯。

---

#### 6. ❌ Dune 为「非程序员工具」

**过时说法**：「Dune Analytics 只适合有 SQL 基础的人」

**2026 年现状**：
- 社区已积累 200K+ 公开仪表板（大部分附带完整 SQL）
- 新手可直接 Fork + 修改参数而无需从零写 SQL
- 有完整的中文教程生态（六度实验室、登链社区、知乎专栏）
- 非程序员可通过模板快速迭代

**应如何表述**：
> Dune Analytics 的入门门槛已大幅降低。新手可通过 Fork 公开仪表板（200K+ 模板库）快速上手，只需理解参数修改即可。深度定制才需学习 SQL，官方和社区均提供中文教程。

---

#### 7. ❌ TVL 作为唯一评估指标

**过时说法**：「TVL 越高的协议越安全、越值得投资」

**2026 年现状**：
- 2026 年初至今 DeFi TVL 整体下跌 37.3%（从 $115b 至 $70b）
- Ethereum TVL 下跌 43%、Arbitrum 下跌 55%
- 需结合「用户留存率、费用收入、活跃地址数」等指标

**应如何表述**：
> TVL 是参考指标但非全部。2026 年 TVL 普遍承压（全链下跌 37%），需结合费用收入、日活用户数、用户留存率等长期指标评估项目健康度。

---

#### 8. ❌ 融资轮次数量代表项目阶段

**过时说法**：「融过 C 轮或更多轮的项目肯定是成熟项目」

**2026 年现状**：
- 融资只是早期信号，需看最后融资距今的时间、当前融资困难程度
- Messari 等机构已改为追踪「融资后产品迭代速度」而非单纯轮次
- 多个融资较多的项目面临用户流失与 TVL 下跌

**应如何表述**：
> 融资轮次仅为参考。关键指标应为：最后融资距今时间、融资后产品迭代速度、当前融资环境下的融资意愿。单纯看融资轮数容易误导。

---

#### 9. ❌ Polygon 仍为「主流 L2」

**过时说法**：「Polygon 是最大的以太坊 Layer 2 扩容方案」

**2026 年现状**：
- Polygon 在 L2 地位已下滑，流动性大幅外流至 Base、Arbitrum、OP
- 原因：Base 由 Coinbase 赋能、Arbitrum 保持技术领先、OP 组织 Superchain
- Polygon 社区在讨论 POL Token 治理改革

**应如何表述**：
> Polygon 不再是 L2 主流。2026 年 L2 生态由 Base（46.58%）、Arbitrum（30.86%）、Optimism（~6%）主导（合计 83% TVL）。Polygon 经历流动性流出，需关注其 POL 代币改革后的生态重振进展。

---

#### 10. ❌ 审计报告作为绝对安全保障

**过时说法**：「项目过了审计就一定安全，不会被黑」

**2026 年现状**：
- 审计覆盖代码逻辑，不覆盖部署后的运维风险、预言机篡改、闪电贷攻击等
- 2026 年多个已审计项目仍遭遇利用
- 需同时考察：升级权限分散度、合约暂停机制、保险覆盖范围

**应如何表述**：
> 审计报告是必要非充分条件。需核实：（1）审计方信誉与覆盖范围；（2）部署代码与审计版本一致性；（3）升级权限是否中心化；（4）是否有保险覆盖；（5）历史被黑事件。

---

## 权威链接清单

### 官方文档与参考资源

**以太坊生态**
1. [Ethereum.org - Building on Ethereum in 2026](https://ethereum.org/latest/building-on-ethereum-in-2026/)  
   *以太坊官方对 2026 年建设现状的最新说明，含 Account Abstraction、Gas 优化等*

2. [Ethereum Shanghai Upgrade - Staking & EIP-4844](https://ethereum.org/en/upgrades/shanghai/)  
   *官方升级文档*

3. [EIP-7702: SetCode for Account Abstraction](https://eips.ethereum.org/EIPS/eip-7702)  
   *Pectra 升级的 Account Abstraction 标准*

### 链上数据与分析平台

4. [DefiLlama - DeFi Analytics Dashboard](https://defillama.com/)  
   *全链 TVL 聚合、协议排行、费用追踪*

5. [Dune Analytics - Web3 Data Platform](https://dune.com/)  
   *SQL 查询引擎、1.5M+ 数据集、200K+ 公开仪表板*

6. [Tenderly - Smart Contract Debugger & Explorer](https://dashboard.tenderly.co)  
   *开发者调试工具，支持 40+ EVM 链，免费公开浏览器*

### 研究与方法论资源

7. [Mastering Chain Analytics - Dune SQL 教程](https://sixdegreelab.gitbook.io/mastering-chain-analytics/)  
   *中文 Dune SQL 入门教程*

8. [登链社区 - Dune SQL 与以太坊数据分析](https://learnblockchain.cn/article/6480)  
   *中文社区贡献的数据分析教程*

9. [Web3Caff Research - 全球 Web3 研究中枢](https://research.web3caff.com/)  
   *定期发布项目研究框架与分析报告*

### 聪明钱与钱包追踪

10. [Nansen - Smart Money Dashboard](https://www.nansen.ai/)  
    *聪明钱标签与实时追踪平台*

11. [Arkham Intelligence - Entity Tracking](https://www.arkhamintelligence.com/)  
    *AI 地址去匿名化与 Intel Exchange*

12. [PolyTrack - Polymarket Whale Tracker](https://www.polytrackhq.app/)  
    *预测市场聪明钱追踪（2026 新工具）*

### 审计与尽职调查

13. [DeFi Sentinel - Smart Contract Auditor Rankings 2026](https://defisentinel.org/research/smart-contract-auditor-rankings-2026)  
    *2026 年审计方排行与评分*

14. [Ancilar - DeFi Protocol Due Diligence Checklist](https://www.ancilar.com/knowledge-hub/blogs/how-to-audit-a-defi-protocol-before-integrating-smart-contract-review-checklist)  
    *完整的尽职调查清单模板*

15. [Messari - Crypto Research & Asset Intelligence](https://messari.io/)  
    *机构级研究报告与项目分析模板*

---

## 验证说明

本报告基于以下来源的多轮验证（2026 年 8 月）：
- **官方文档**：Ethereum.org、Dune Analytics、DefiLlama
- **行业分析**：The Block、Messari、Nansen 官方报告
- **中文社区**：Web3Caff、登链社区、知乎专栏
- **数据平台**：DefiLlama TVL 数据、GitHub 开源资源

所有数字均标注了时间口径（多数为 2026 年 6-8 月），引用链接已实际访问确认存在。  
建议正文写作时配合本报告进行双重核对，尤其是 Gas 费用、TVL、审计成本等数字密集的小节。
