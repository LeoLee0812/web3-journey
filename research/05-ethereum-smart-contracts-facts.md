# 第 5 章《以太坊与智能合约》事实核查报告

**核查时间**：2026年8月  
**数据口径**：截至2026年8月1日公开数据

---

## 按小节整理的事实要点

### 1. 以太坊与比特币的根本分歧

**账户模型 vs UTXO模型**
- **以太坊**：采用账户模型（Account Model），用户和合约各有一个账户，直接存储余额和状态。账户内部可以直接读写数据，便于智能合约复杂状态管理。
- **比特币**：采用UTXO模型（Unspent Transaction Output），每笔交易产出的UTXO都是离散的价值块，无全局状态存储，设计精简但不适合复杂应用。

**编程模型的差异**
- 以太坊的账户模型更接近**命令式编程**（Imperative Programming），合约调用会产生副作用，修改全局状态，这使得复杂合约容易出现逻辑错误。
- 比特币的UTXO模型更接近**函数式编程**（Functional Programming），每次执行是无状态的，更容易验证正确性，但灵活性受限。

**核心区别总结**
- **以太坊的本质**：世界计算机（World Computer），支持通用图灵完备的计算。
- **比特币的本质**：数字货币和价值存储，账本设计简洁不可篡改。

---

### 2. EVM 与状态机：链上「世界状态」是怎么被改写的

**EVM是什么**
- EVM（Ethereum Virtual Machine）是一个**栈式虚拟机**，执行合约字节码。每个节点都维护一份相同的EVM副本，共同维护网络的「世界状态」。

**状态改写的机制**
1. 交易被打包进区块
2. 每笔交易在EVM中执行，修改accounts树（账户余额、nonce、合约存储）和receipts（日志、Gas使用）
3. 所有节点执行相同交易序列，得到相同的新状态
4. 新状态由一个状态根（State Root，Merkle树根hash）表示，写入区块头

**EVM Object Format (EOF) 进展**
- EVM Object Format 在Dencun后的升级中被提议为下一代EVM代码格式，但截至2026年8月尚未全面激活
- 不应在教材中强调EOF已成为标准机制，目前仍属前沿特性

**关键参数**
- 交易执行的并发性：EVM内部无并行执行机制，但通过状态根证明可支持rollup级别的批量验证
- 预编译合约（Precompiles）：SHA256、RIPEMD-160、elliptic curve等，Gas开销远低于Solidity实现版本

---

### 3. 智能合约到底是什么

**自动售货机类比的准确性**
- ✅ 合约 = 自动售货机的极简模型是正确的
- 流程：输入（交易）→ 状态检查（if余额>=金额）→ 状态改变（扣款、发送token）→ 输出（收据）
- 合约无法主动启动（无时钟），只能响应外部交易调用

**合约的三大构成**
1. **代码**：Solidity编写，编译为EVM字节码（bytecode）
2. **存储**：持久化的键值对（key-value store），每个合约256位为单位
3. **余额**：以wei计的ETH余额（1 ETH = 10^18 wei）

**部署时的变化**
- 部署交易的`data`字段包含编译后的bytecode和constructor参数
- EVM执行constructor，返回合约代码（不含constructor本身）
- 新合约地址由(部署者地址, nonce)计算，或在CREATE2中由(salt, bytecode)计算

---

### 4. 看懂 Solidity：非开发者需要认识的十个关键词

**当前Solidity版本状态（2026年8月）**
- **最新稳定版**：0.8.36（发布于2026年7月）
- **下一版预览**：0.8.37-develop（2026年7月24日文档）
- **发布周期**：目标每月发布一个非breaking版本，约每年一个breaking版本

**Solidity 0.8.35~0.8.36新特性**（不要写0.7版本的说法）
1. **ERC-7201支持**（0.8.35）：内置`erc7201`函数计算命名空间存储布局
2. **SSA-CFG代码生成器**（0.8.35）：实验性特性，解决"stack-too-deep"错误
3. **内存溢出处理**（0.8.36）：栈转内存溢出机制，减少编译超时
4. **Amsterdam EVM支持**（0.8.36）：为即将推进的Ethereum升级预留
5. **--experimental flag**：实验功能需显式启用

**十个关键概念对非开发者的解释**
| 关键词 | 非技术者理解 | 风险提示 |
|--------|------------|--------|
| **状态变量** | 合约的"记忆"，存储在区块链上 | 所有状态变量都公开可读，密钥不能存合约 |
| **require/assert** | 合约的"检查条件"，失败则交易回滚 | require失败返还Gas，assert不返还，容易被利用 |
| **payable** | 函数允许接收ETH | 未加payable的函数收到ETH会失败 |
| **mapping** | 合约的"字典/哈希表" | 大规模mapping会导致存储很贵 |
| **event** | 合约发出的"通知"，存在日志不影响链上状态 | 日志可被伪造但链上无法验证，常用于前端监听 |
| **modifier** | 函数的"前置检查"（如onlyOwner） | 错误的modifier组合会导致权限漏洞 |
| **delegatecall** | 一个合约"借用"另一合约的代码执行 | 代理模式的关键，错误使用会导致存储混乱 |
| **fallback/receive** | 合约收到不匹配的调用或ETH时的处理 | 没有fallback的合约收到ETH会失败 |
| **interface** | 合约的"菜单"（函数签名清单） | 接口不包含实现，用于多合约互动 |
| **inheritance** | 合约的"继承"关系 | 多重继承时方法查找顺序（MRO）容易出错 |

---

### 5. 一笔交易的一生：从签名到打包再到最终确定

**交易生命周期时间表**

| 阶段 | 时间耗时 | 2026年具体数据 |
|------|--------|--------------|
| **1. 签名**（本地） | 毫秒级 | 用户钱包签名交易 |
| **2. 广播到mempool** | 秒级 | 节点收到交易，放入pending队列 |
| **3. 打包进区块** | 12秒左右 | 下一个slot（12秒）中被选中的validator提议区块 |
| **4. 一次确认** | ~12秒 | 交易在区块中被至少1个validator投票认可 |
| **5. 最终确定性(Finality)** | 12.8分钟 | 需2个epoch（64个slot），≈66%质押ETH锁定 |

**关键参数不要写错**
- ✅ **正确**：Ethereum PoS的slot时间是12秒，1 epoch = 32 slots ≈ 6.4分钟
- ❌ **错误**：说block time是15秒、1 epoch是6分钟、finality是1分钟等
- 历史注意：这些参数在The Merge（2022年9月）后就已确定，2026年没有改变

**Gas的作用**
- **Gas是交易执行的资源单位**，不同操作消耗不同Gas：
  - 基础转账（转ETH）：21,000 Gas
  - 智能合约调用：21,000 + 合约操作消耗
  - 存储写入（SSTORE）：最贵，20,000~22,100 Gas
- **Gas费 = Gas用量 × Gas价格（gwei）**
- EIP-1559后的Gas机制：
  - **Base Fee**（基础费）：由协议自动设置，按需调整，被销毁
  - **Priority Fee**（优先费）：用户自设的小费，给validator

---

### 6. 内存池与 MEV：你的交易在被谁抢跑

**Mempool的真实面目**
- Mempool（内存池）不是单一的池，而是**每个节点维护的pending交易集合**
- 全节点的mempool大小不同步，这导致交易可见性不对称——有些节点更早看到某笔交易
- **透明的mempool是必要之恶**：去中心化需要交易流动透明，但也成为MEV的温床

**MEV的三个关键角色（2026年状态）**

1. **Searcher（搜索者）**
   - 监听mempool的机器人，寻找有利可图的交易
   - 常见策略：
     - DEX套利：在不同交易所以不同价格买卖代币
     - 清算竞争：争先在借贷协议中清算欠债用户
     - 三明治攻击（Sandwich Attack）：先买入、让受害者交易、后卖出获利

2. **Builder（构建者）**
   - 收集searcher的交易和普通用户交易，组建区块
   - 从searcher那里获得MEV收益分成

3. **Validator（验证者/Proposer）**
   - 选择使用哪个builder的区块
   - 从builder处获得MEV收益的一部分

**Flashbots MEV-Boost的作用**
- Flashbots开发的MEV-Boost中间件，让validator可以从多个builder中拍卖区块机会
- **作用**：提高builder的竞争，让更多参与者分享MEV，而非全部被大型validator垄断
- **权衡**：中心化程度提高（relayer成为单点故障），但收益分配更公平

**Glamsterdam升级的ePBS改进（2026）**
- ePBS = Enshrined Proposer-Builder Separation
- 将MEV拍卖**直接编入协议**，无需第三方relayer
- 预期进一步分散MEV权力，减少builder的中心化

**Sandwich Attack的具体例子**
1. 你在DEX提交"买入1000 USDC换DAI"的交易
2. Searcher看到你的交易，立即提交相同交易**并优先执行**（用更高Gas费）
3. Searcher的大额买入推高DAI价格
4. 你的交易执行，买到更贵的DAI
5. Searcher立即卖出DAI，套现价差
- **损失**：你多付了几百到几千块钱（取决于交易大小）

**2026年MEV的新现象**
- MEV值取决于链的活跃度：主网中等，L2低，L1竞争少的时期最低
- 大型LP（流动性提供者）通过私有池（如MEV-hiding pools）规避sandwich风险
- MEV价值远超block reward + gas fee（2024-2025时期）

---

### 7. 实操：核验一个合约是否开源、是否有后门函数

**合约验证在2026年的现状**

**三大验证方案**（按使用频度）
1. **Etherscan验证**（最广泛）
   - 开发者上传Solidity源码到Etherscan，编译器重新编译
   - Etherscan将编译后的字节码与链上部署的代码对比
   - 一致则标记为"Verified"（绿色对勾）
   - 缺陷：只验证代码一致性，不验证功能是否安全

2. **Sourcify验证**（开源去中心化）
   - 开源的、无权限限制的验证工具
   - 支持多条EVM链（Ethereum、Polygon、Arbitrum等）
   - 作为公共基础设施，其他工具可在其上构建
   - 用于Etherscan如果其关键依赖

3. **Blockscout验证**（开源区块浏览器）
   - 开源的区块浏览器项目，提供合约验证服务
   - 支持私有部署，透明度高

**快速审核工作流（2026年推荐）**
1. 在DEXTools上检查交易对是否有审计标记
2. 如果显示黄色警告，升级到区块浏览器查看合约源码
3. 用TokenSniffer或RugCheck交叉验证（这些工具检查常见后门）
4. 观察owner权限、升级权限、黑名单等危险函数

**常见的后门函数模式**（非开发者需要知道）
| 后门特征 | 风险 | 检查方法 |
|--------|------|--------|
| `setFees()` / `setTaxes()` | Owner可改提现税率到100% | 搜"setFees"，看有无权限检查 |
| `blacklist()` / `ban()` | Owner可禁止地址转账 | 搜"blacklist"，查是否有权限控制 |
| `mint()` 无上限 | Owner可无限增发，割韭菜 | 检查是否有最大供应量cap |
| `pauseTransfer()` | Owner可冻结所有转账 | 搜"pause"，看是否可被恶意冻结 |
| `emergencyWithdraw()` | Owner可直接提走合约资金 | 检查是否能提走他人存款 |
| `delegatecall` 到用户合约 | 任意代码执行，直接被黑 | 任何delegatecall都是大红旗 |

**"Verified"不等于"安全"**
- ✅ 验证 = 代码透明
- ❌ 验证 ≠ 代码安全
- 验证只是审计的**前置条件**，不是审计本身

---

### 8. 可升级合约与代理模式：项目方能偷偷改规则吗

**代理模式的核心原理**

代理合约通过**delegatecall**实现可升级：
```
用户 → 代理合约(ProxyContract) 
     ↓ delegatecall
     实现合约(Implementation)
     ↓ 返回结果
用户 ← 代理合约 ← 结果
```

**代理合约存储所有状态**，实现合约只提供代码逻辑。升级时只改变实现地址，无需迁移数据。

**UUPS vs ERC-1967代理模式对比（2026标准）**

| 特性 | **UUPS**（ERC-1822） | **ERC-1967** |
|------|-------------------|------------|
| 升级权在 | 实现合约中 | 代理合约中 |
| Gas开销 | 更低（少一次跳转） | 较高 |
| 安全性 | 需检查`proxiableUUID()` | 有标准存储槽定义 |
| 项目风险 | 升级函数忘记检查权限→任意升级 | 管理员私钥泄露→任意升级 |
| 当前主流 | ✅ OpenZeppelin推荐 | ✅ 仍被广泛使用 |

**ERC-1967标准定义的关键存储槽**（防止存储冲突）
- `0x360894a13ba1a3210667c828492db98dca3e2caf58c6f07e0a3e39a5c27eb8c4`：实现地址
- `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`：管理员地址
- `0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50`：信标地址（信标代理）

**代理模式的透明性检查**
```
✅ 透明的升级方案：
- 合约开源且验证
- 升级权由多签钱包（≥3/5）或DAO治理
- 升级提案公示期≥48小时
- 历史升级记录公开

❌ 高风险的升级方案：
- Owner是单一账户或中心化账户
- 无升级延迟（TimeLock）
- 合约代码未公开（无法验证)
- 历史升级频繁且不透明
```

**OpenZeppelin标准库的实现**
- 当前版本支持UUPS、ERC-1967、Beacon代理
- `UUPSUpgradeable`合约包含升级逻辑
- `ERC1967Proxy`是标准实现

---

## 可引用数字（含来源与时间）

### 以太坊基础参数（2026年8月）

| 指标 | 数值 | 来源 | 时间 |
|------|------|------|------|
| **Slot时间** | 12秒 | ethereum.org官网 | 2022年9月后固定 |
| **Epoch长度** | 32个slot ≈ 6.4分钟 | ethereum.org共识层文档 | PoS标准参数 |
| **最终确定性(Finality)** | 12.8分钟（2 epochs） | Chainstack 2026报告 | 2026年8月有效 |
| **验证者最小质押** | 32 ETH | Ethereum官方 | 2020年12月后固定 |
| **验证者最大单次质押** | 2,048 ETH | ethereum.org官网 | PoS规范 |
| **当前活跃验证者数** | 约100万 | Chainstack 2026 | 2026年8月 |
| **当前质押ETH总量** | 约4千万ETH | Chainstack 2026 | 2026年8月 |

### Gas费用数据（2026年8月）

| 指标 | 数值 | 来源 | 备注 |
|------|------|------|------|
| **Base Fee（base case）** | 0.05-0.16 gwei | Etherscan Gas Tracker | 2026年6月-8月平均 |
| **简单ETH转账** | 21,000 Gas | EVM标准 | 固定值 |
| **转账成本** | ~$0.01 | BloFin / DEXTools 2026 | 按0.15 gwei、ETH=$2,500计 |
| **ERC-20 Transfer** | 65,000 Gas | 典型合约 | 含存储写入 |
| **Uniswap V3 Swap** | 120,000-180,000 Gas | 取决于池深度 | 一次典型交易 |

**Gas费用的历史对比**（不要混淆）
- ❌ **错误说法**：2026年Gas费仍然很贵
- ✅ **正确说法**：主网Gas费已降至历史低位，原因是大量活动迁至Layer 2

### Dencun升级影响数据（已激活，2024年3月）

| 指标 | 改进幅度 | 来源 |
|------|---------|------|
| **L2交易成本降幅** | 90-99% | Symbiosis报告 |
| **Blob存储周期** | 约18天（4,096 epochs） | ethereum.org Dencun FAQ |
| **L2费用（激活blob后）** | 从$0.1-$1→$0.001-$0.01 | Arbitrum/Optimism官方 |

### Solidity版本发布历史（不要混版本号）

| 版本 | 发布时间 | 关键特性 | 来源 |
|------|---------|--------|------|
| 0.8.34 | 2026年2月18日 | 例行维护 | soliditylang.org |
| 0.8.35 | 2026年4月29日 | ERC-7201、SSA-CFG实验 | soliditylang.org |
| 0.8.36 | 2026年7月（推断） | 内存溢出、Amsterdam支持 | Solidity文档 |
| 0.8.37-dev | 2026年7月24日 | 开发版本 | PDF文档版本 |

---

## 过时说法纠正清单

**《第5章》常见错误，2026年必须纠正：**

| 说法 | ❌ 为什么错 | ✅ 2026年正确说法 |
|------|-----------|-----------------|
| **Gas费仍然很贵，动辄几百块钱** | 2021-2022年的状态，已过时 | 主网简单交易只需几美分，大部分用户已迁移L2 |
| **Ethereum的block time是15秒** | 这是以太坊2.0前的旧参数 | PoS下slot固定12秒，从2022年起就是这样 |
| **Finality需要1分钟** | 混淆了不同的确认阈值 | 完全确定性需要12.8分钟（2 epochs），1分钟是被广泛接受但未最终确定的状态 |
| **EVM Object Format (EOF) 已激活** | EOF仍在开发中，未大规模启用 | 截至2026年8月，EOF仍属实验性特性，不应作为现行EVM描述 |
| **Dencun升级只适用于Layer 2** | 描述不准确 | Dencun是主网升级，EIP-4844在主网激活，为L2提供了Blob便宜存储，主网本身也受益 |
| **可升级合约总是不安全的** | 言过其实 | 透明的多签/DAO治理升级是安全的，风险在Owner是单一EOA的情况 |
| **验证合约 = 审计合约** | 概念混淆 | 验证只是公开代码，审计是找bug。验证是审计的前置条件，不等同于审计 |
| **Solidity 0.7是当前主流** | 0.7在2021年就停止更新 | 0.8是当前主流，0.8.36是最新（2026年7月），所有新项目应该用0.8 |
| **MEV完全无法预防** | 夸大了 | 基于encrypted mempools（如Shutter Network）和ePBS的方案在推进，不是无解 |
| **所有validator都能参与MEV分享** | 现实中solo validator难以获益 | 小validator通常通过MEV-Boost等中间件才能获得分享机会，但中心化风险已知 |

---

## 权威链接清单

### 官方文档与标准

1. **Ethereum官方**
   - [ethereum.org - 共识层文档](https://ethereum.org/developers/docs/consensus-mechanisms/pos)
   - [ethereum.org - MEV 深度解析](https://ethereum.org/developers/docs/mev/)
   - [ethereum.org - Dencun升级FAQ](https://ethereum.org/roadmap/dencun/)
   - [ethereum.org - 2026年变更指南](https://ethereum.org/latest/building-on-ethereum-in-2026/)

2. **Solidity官方**
   - [soliditylang.org - 官方文档](https://www.soliditylang.org/)
   - [soliditylang.org - 版本发布历史](https://www.soliditylang.org/blog/category/releases/)

### 智能合约工具与验证

3. **Etherscan**
   - [Etherscan 合约验证](https://etherscan.io/verifyContract)
   - [Etherscan 验证说明](https://info.etherscan.com/how-to-verify-contracts/)

4. **Sourcify**
   - [Sourcify - 去中心化验证](https://sourcify.dev)
   - [Sourcify 文档](https://docs.sourcify.dev)

5. **OpenZeppelin Contracts**
   - [OpenZeppelin - UUPS代理标准](https://docs.openzeppelin.com/contracts-stylus/uups-proxy)
   - [OpenZeppelin - ERC-1967标准](https://docs.openzeppelin.com/contracts-stylus/erc1967)

### MEV与交易生命周期

6. **Flashbots**
   - [Flashbots MEV-Boost](https://boost.flashbots.net)
   - [MEV-Inspect - MEV数据仪表板](https://mev-inspect.flashbots.net)

7. **协议级改进**
   - [Ethereum Magicians - ePBS讨论](https://ethereum-magicians.org)（关于Glamsterdam升级）

### 研究与数据

8. **Chainstack**
   - [Ethereum PoS 共识机制2026指南](https://chainstack.com/ethereum-proof-of-stake-consensus-mechanism/)

9. **学术论文**
   - [ArXiv 2405.17944 - 三明治攻击分析](https://arxiv.org/pdf/2405.17944)
   - [ArXiv 2401.01622 - 去中心化金融套利分析](https://arxiv.org/pdf/2401.01622)

### 代币与交易数据

10. **DEXTools**
    - [DEXTools - Gas教程2026版](https://www.dextools.io/tutorials/what-is-gas-price-gwei-ethereum-fees-guide-2026)
    - [DEXTools - MEV指南](https://www.dextools.io/tutorials/what-is-mev-in-crypto-guide-2026)

11. **Blockscout**
    - [Blockscout - 开源区块浏览器](https://blockscout.com)

12. **实时Gas追踪**
    - [Etherscan Gas Tracker](https://etherscan.io/gastracker)
    - [ChainGate - ETH Gas Tracker](https://chaingate.dev/gas-tracker/ethereum)

---

## 事实检查重点总结

**本章8个小节的事实最敏感区域**：

1. **第1节（以太坊vs比特币）**
   - 必须强调：UTXO vs 账户模型是**架构**差异，不只是功能差异
   - 比特币的智能合约能力已大幅增强（Taproot、Ordinals时代），但基础模型仍是UTXO

2. **第2节（EVM与状态机）**
   - ❌ 不应该说EOF已激活为EVM标准
   - ✅ 应该说EOF正在开发中，目标是下一代EVM

3. **第5节（交易生命周期）**
   - 12秒slot、12.8分钟finality是**2022年9月后的固定参数**，不会再变
   - 2026年Gas费如果说"很贵"是错的，应该对比L1和L2

4. **第6节（MEV）**
   - MEV的**三角关系**（Searcher-Builder-Validator）已成为2026年的新常态
   - ePBS在Glamsterdam升级中被提议，但截至8月仍未激活

5. **第8节（代理模式）**
   - UUPS需检查`proxiableUUID()`防止非法升级
   - ERC-1967通过标准存储槽避免冲突，但升级权仍需多签保护

---

## 本报告适用范围

**数据精确度**：所有数字引用来自2026年1月-8月的公开信息  
**适用章节**：第5章《以太坊与智能合约：可编程的钱》全8个小节  
**使用建议**：正文每处关键数据请注明来源链接或"2026年8月数据"标注  
**更新周期**：建议每季度审查Gas数据、升级进展、Solidity版本，其余内容相对稳定
