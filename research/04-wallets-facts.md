# 第 4 章《钱包实战》事实核查报告
**核查时间**：2026年8月1日  
**检索次数**：12次 WebSearch/WebFetch  

---

## 按小节整理的事实要点

### 1. 热钱包、冷钱包、托管钱包类型

**定义与运作（稳定）**
- **热钱包**：私钥存在联网设备。定义是联网状态，不是钱包类型本身。
- **冷钱包**：私钥从不接触联网设备。可通过硬件钱包、纸钱包或签名设备实现。
- **托管钱包**：第三方（交易所、机构）持管你的私钥。使用者无私钥管理权。

**2026年主流钱包产品线**（截至8月）
- 自托管浏览器钱包：MetaMask、Rabby、Trust Wallet、OKX Wallet
- 硬件钱包品牌在线：Ledger（Nano Gen5/Flex/Stax）、Trezor（Safe 5/Safe 7）、Keystone、Foundation 等
- 交易所托管钱包：币安、OKX、Bybit 等平台内置钱包

**最大误解纠正**
- ⚠️ **不要说"钱包存币"** → 正确说法：钱包存的是私钥，币（代币）实际上在区块链上，由私钥所有者控制。

### 2. 创建自托管钱包

**当前工具与流程（已验证）**
- MetaMask 支持 EIP-7702（允许 EOA 获得智能合约功能）自 Pectra 升级（2025年5月7日）
- Rabby 于2025年底前实现了 ERC-7702 支持，支持"委托 EOA 模式"
- Phantom 主要支持 Solana 生态，在以太坊 EIP-7702 适配中参与有限

**关键参数**（不变）
- BIP-39 标准：12字或24字助记词（12字已足够强）
- BIP-32/BIP-44：确定性密钥派生路径
- 地址格式：以太坊使用 0x 前缀的40字符十六进制地址

### 3. 助记词备份的正确姿势

**BIP-39 与 SLIP-39 标准**（截至2026）
- **BIP-39**（广泛支持）：12或24个单词从2048词表中选出，包含校验位
- **SLIP-39**（部分支持）：Shamir 秘密共享，可分成 M-of-N 份额，任意 M 份可恢复。Trezor 支持，但不是所有钱包都支持
- 建议：新手用 BIP-39，多签安全需求用 SLIP-39

**传统过时说法纠正**
- ⚠️ **不要说"生成12个确认"（对备份）** → 这是 PoW 遗留误解，备份的安全性与转账确认数无关
- ⚠️ **不要说"冷钱包 = 硬件钱包"** → 冷钱包是私钥离线的状态定义，硬件钱包是实现方式之一，插上电脑签恶意交易照样会被清空

**助记词与通行码**
- 助记词可重生成私钥，通行码（Passphrase）可修改派生路径，二者分离存储
- 通行码不存在任何设备，只在用户脑海/独立纸条中，即便他人拿到助记词也无法通过通行码恢复资金
- 建议：长度 ≥16 字符，包含大小写、数字、符号，避免字典单词

### 4. 第一笔转账

**以太坊 PoS 后的新术语与参数**（2026 仍有效）
- **Slot 时间**：12秒（固定），32 个 slot = 1 epoch = 6.4 分钟
- **Finality**：2 个 epoch 后确定（约12.8分钟），此后交易不可逆
- 旧说"等12个确认"已过时 → 现代说法是"等待 finalized 状态" = 等待 Gasper 共识下 2/3 验证者确认

**Gas 参数（截至2026年8月）**
- 普通 ETH 转账：21,000 gas
- Base fee：因网络拥堵动态调整（当前约 1-2 gwei，可最高 100+ gwei 在网络繁忙时）
- Priority fee（小费）：通常 1-3 gwei，由用户设定以激励验证者优先打包
- **最新动态**：EIP-4844（Dencun，2024年3月激活）后，每个区块最多 6 个 blob（0.75 MB），与 calldata 竞争减少，L2 成本大幅下降

**典型成本**（截至 2026年8月1日抓取）
- 以太坊 Mainnet ETH 转账：约 $0.01（基于当前 gas 价格 1.099 gwei 左右与 ETH 价格）
- L2 成本：Arbitrum/Optimism 约为 Mainnet 的 1/100 到 1/1000

### 5. Gas 费机制：EIP-1559 之后

**EIP-1559 机制**（2021年伦敦升级激活，现状未变）
- **Base Fee**（基础费）：根据前一区块 gas 使用情况自动调整，用 `fake_exponential` 公式计算
  - 公式：`base_fee_per_blob_gas = MIN_BASE_FEE_PER_BLOB_GAS * e^(excess_blob_gas / BLOB_BASE_FEE_UPDATE_FRACTION)`
  - **关键**：基础费被销毁（burning），不给验证者或任何人
- **Priority Fee**（优先费/小费）：由交易发送者指定，完全给予验证者
- 总 Gas 费 = (Base Fee + Priority Fee) × Gas Used

**EIP-4844 Blob 费用市场**（2024年3月激活，现况）
- 每个 blob：262,144 gas（2^17），但用独立的费用市场
- 目标每区块 3 个 blob（0.375 MB），最多 6 个（0.75 MB）
- Blob 基础费也用指数调整公式，且与主链 gas 独立计算
- **用途**：L2 Rollup 存储交易数据，cost/byte 远低于 calldata

**过时说法纠正**
- ⚠️ **不要说"矿工费" 或"gas 给矿工"** → PoS 后没有矿工；Priority fee 给验证者，Base fee 燃烧掉
- ⚠️ **不要说"等待 gas 下降就能免费"** → Base fee 无法为零，有最小值（MIN_BASE_FEE_PER_BLOB_GAS）

### 6. 授权（Approve）与撤销

**授权的真实危险**（核心风险）
- **ERC-20 Approve**：调用 `approve(spender, amount)` 授予特定合约无限或特定额度的代币转移权
- **问题**：一旦授权无限额度（`uint256(-1)`），智能合约可随时转走所有该代币
- **EIP-2612 离线签名更危险** → 可离线签名授权，签名直接当链上交易用，无须用户二次确认，在钱包外部进行且易被钓鱼

**NFT 授权**（容易忽视）
- **setApprovalForAll**：一次授权整个钱包中某合约标准的所有 NFT 给某个操作者
- 风险大于 ERC-20 单笔授权，容易导致整个 NFT 组合被清空
- 国内教程常漏掉这一点

**当前撤销工具（2026年8月）**
- **Revoke.cash**（最流行）：支持 100+ 网络，包括 Ethereum、Base、Polygon、Arbitrum 等
  - ⚠️ 警告：存在 revoke.cash 钓鱼克隆，务必书签收藏真正网址
- **Etherscan 内置**：Token Approvals 页面有 Revoke 按钮，每个授权各一个
- **钱包内置管理**：MetaMask、Rabby 等都有授权管理界面

**关键限制**
- 撤销授权只能阻止后续转账，**无法追回已经被转走的代币**
- 撤销本身是链上交易，需要支付 gas

### 7. 硬件钱包选购与使用

**2026年主流品牌与最新型号**（截至8月）

**Ledger**
- Nano Gen5（179 USD）：2.8 英寸 E Ink 屏、蓝牙、NFC、10小时续航
- Flex（249 USD）：现代 e-ink 触摸屏、易上手、安全恢复
- Stax（399 USD）：高端选项

**Trezor**
- Safe 5（晚2025发布）：1.54 英寸彩色触摸屏、触觉反馈、Optiga Trust M 安全芯片（首次集成）
- Safe 7（249 USD）：后量子加密支持、2.5 英寸彩色屏、IP67 防水

**新兴选手**
- Keystone、Foundation、ELLIPAL、NGRAVE Zero 等气隙设备
- 特点：完全离线签名、支持多链、开源固件选项

**选购建议**（客观标准）
- **何时值得买**：持币量 > $10,000、需要长期持有、接触 DeFi 风险高
- **何时不必买**：新手、资金量小、主要用交易所、害怕技术复杂性
- **2026 趋势**：后量子加密、开源固件、单芯片安全元件、触屏交互成为标配

**使用误区纠正**
- ⚠️ **不要认为"硬件钱包就绝对安全"** → 硬件钱包只能保护私钥不外泄，不能保护你不签恶意授权或 approve
- ⚠️ **不要认为"气隙 = 绝对隔离"** → QR 码、USB、蓝牙都是信号通道，设计不当也可能被中间人攻击

### 8. 账户抽象与智能钱包

**ERC-4337 标准**（现况，2026年8月）
- **当前版本**：v0.7（生产环境）
- **EntryPoint 地址**：0x0000000071727De22E5E9d8BAf0edAc6f37da032（Ethereum 及绝大多数 EVM 链通用）
- **UserOp 处理**：2026 Q1 统计中，Top 3 bundler（Pimlico、Stackup、Coinbase）处理约 78% 的 UserOp

**EIP-7702：EOA 智能化**（Pectra 升级，2025年5月7日激活）
- 允许 EOA 临时委托自己的代码到智能合约，获得批处理、赞助、权限分级等功能
- **MetaMask 支持**：已整合 EIP-7702 委托功能（Etherscan 可查看相关合约）
- **Rabby 支持**：2025 年底前实现完整支持

**钱包适配现状**
- EIP-7702 后，用户无需弃用现有地址即可获得智能合约功能
- 部分钱包仍未跟进，需查阅官方公告确认支持

**与 ERC-4337 的区别**
- **ERC-4337**：通过 Bundler + EntryPoint 合约打包 UserOp，不改变 EOA 地址
- **EIP-7702**：直接修改 EOA 的代码，地址不变但行为变化
- **前景**：两种方案并存，覆盖不同安全/费用/易用性需求

**过时说法纠正**
- ⚠️ **不要说"账户抽象只有 ERC-4337"** → EIP-7702 同样是账户抽象的实现，且是原生方案
- ⚠️ **不要说"智能钱包需要弃掉现有地址"** → EIP-7702 保持地址不变，迁移成本最低

---

## 可引用数字（含来源与时间）

| 指标 | 数值 | 来源 | 时间口径 | 说明 |
|------|------|------|---------|------|
| **以太坊 Slot 时间** | 12 秒 | Ethereum Consensus Spec | 固定不变 | 自 PoS（2022年9月）起 |
| **Epoch（1 Epoch）** | 32 Slot = 6.4 分钟 | Beacon Chain 规范 | 固定不变 | 衡量 finality 的单位 |
| **Finality 时间** | ~12.8-16 分钟 | Gasper 共识设计 | 2026年有效 | 2/3 验证者确认后不可逆 |
| **普通 ETH 转账 Gas** | 21,000 gas | 以太坊黄皮书 | 固定不变 | 最小交易单位 |
| **Base Fee（典型）** | 1-40 gwei | Etherscan Gas Tracker | 截至 2026-08-01 | 网络拥堵时可达 100+ gwei |
| **Priority Fee（typical）** | 1-3 gwei | Gas Tracker 实时数据 | 截至 2026-08-01 | 用户指定，激励验证者 |
| **当前 ETH 转账成本** | ~$0.01 | Etherscan + 当日 ETH 价格 | 截至 2026-08-01 | 假设 ETH = $2,000+ |
| **Blob 大小** | 262,144 gas (2^17) | EIP-4844 规范 | 固定不变 | 每个 blob 的 gas 成本 |
| **Blob 目标/最大** | 3/6 个 blob 每区块 | EIP-4844 | 2024-03-13 激活后 | 0.375 MB/0.75 MB |
| **Base Chain TVS** | $11.53B | L2BEAT | 截至 2026-08-01 | Layer 2 排名第一 |
| **Arbitrum One TVS** | $10.15B | L2BEAT | 截至 2026-08-01 | Layer 2 排名第二 |
| **OP Mainnet TVS** | $1.43B | L2BEAT | 截至 2026-08-01 | Layer 2 排名第三 |
| **ERC-4337 EntryPoint 版本** | v0.7 | eth-infinitism/account-abstraction | 生产状态 | 标准地址 0x0000...032 |
| **Top 3 Bundler 市占** | ~78% | Q1 2026 数据 | Pimlico/Stackup/Coinbase | 按 UserOp 数计 |
| **Pectra 升级激活** | 2025-05-07 | 官方公告 | EIP-7702、EIP-7623 等 | 包含 EOA 智能化 |
| **Fusaka 升级激活** | 2025-12-03 | 官方公告 | PeerDAS、Blob 参数调整 | 可扩展性增强 |
| **Ledger Nano Gen5 价格** | 179 USD | Ledger 官网 | 2026 现货 | 现代 E Ink 屏 |
| **Trezor Safe 5 价格** | 249 USD | Trezor 官网 | 2026 现货 | 含 Optiga Trust M |
| **Revoke.cash 支持网络** | 100+ | Revoke.cash 官方 | 2026年 | 包括所有主流 L1/L2 |

---

## 过时说法纠正清单

| 过时说法 | 为什么错 | 正确说法（2026年） | 影响范围 |
|---------|---------|------------------|---------|
| "钱包里存有我的币" | 钱包只存私钥，币在区块链上 | 钱包存私钥，币由私钥控制的地址在链上持有 | 全章通用，最常见误解 |
| "等 12 个确认就安全了" | PoW 遗留概念；PoS 无需数个确认 | 等待 Finalized 状态（2 epoch ≈ 12.8 分钟） | 第 4 节（转账） |
| "冷钱包就是硬件钱包" | 冷钱包是状态定义，硬件钱包是实现方式 | 冷钱包 = 私钥离线；硬件钱包是实现冷钱包的工具，但插上电脑签恶意交易照样会被骗 | 第 1、7 节 |
| "Gas 给了矿工" | PoS 后无矿工；Base fee 被销毁 | Priority fee 给验证者，Base fee 销毁（deflation） | 第 5 节 |
| "无限授权没关系，我不会点"  | EIP-2612 离线签名可绕过用户二次确认 | 避免无限授权；定期用 Revoke.cash 检查；对 Permit 签名谨慎 | 第 6 节 |
| "NFT 授权没有 Token 授权危险" | setApprovalForAll 可清空整个 NFT 组合 | NFT 的 setApprovalForAll 风险 > ERC-20 approve | 第 6 节 |
| "智能钱包需要换地址" | EIP-7702 后 EOA 原地升级 | EIP-7702 允许 EOA 保持地址、获得智能合约能力 | 第 8 节 |
| "撤销授权就能追回被转走的币" | 链上交易不可逆 | 撤销只阻止后续转账，已转走的资金无法追回 | 第 6 节 |
| "硬件钱包 = 绝对安全" | 硬件钱包保护私钥，不保护用户不签恶意 TX | 硬件钱包是私钥安全的必要条件，不是充分条件 | 第 7 节 |
| "Blob 定价和 Gas 一样" | Blob 费用市场独立，不与 calldata 竞争 | EIP-4844 引入独立的 Blob 费用市场 | 第 5 节 |

---

## 权威链接清单

### 官方规范与文档

1. **以太坊官方路线图**  
   https://ethereum.org/roadmap/

2. **以太坊共识与 Finality 说明**  
   https://ethereum.org/roadmap/fusaka/

3. **EIP-1559：基础费用机制**  
   https://eips.ethereum.org/EIPS/eip-1559

4. **EIP-4844：Blob 和 ProtoDAL**  
   https://eips.ethereum.org/EIPS/eip-4844

5. **EIP-7702：EOA 智能化**  
   https://eips.ethereum.org/EIPS/eip-7702

6. **BIP-39 标准规范**  
   https://github.com/trezor/python-mnemonic/blob/master/vectors.json

7. **ERC-4337 GitHub 官方仓库**  
   https://github.com/eth-infinitism/account-abstraction

### 分析与数据工具

8. **L2BEAT：Layer 2 TVS 排名与安全评分**  
   https://l2beat.com

9. **Revoke.cash：授权检查与撤销工具**  
   https://revoke.cash/token-approval-checker/ethereum

10. **Etherscan 代币授权检查**  
    https://etherscan.io/tokenapprovalchecker

11. **Gas Tracker（Etherscan）**  
    https://etherscan.io/gastracker

12. **Blobscan：Blob 费用与使用情况**  
    https://blobscan.com

### 教育与研究

13. **ethereum.org 官方开发文档 - Gas**  
    https://ethereum.org/developers/docs/gas/

14. **Vitalik 论文：Epoch/Slot 与确认时间**  
    https://vitalik.eth.limo/general/2024/06/30/epochslot.html

15. **HackMD：ERC-4337 v0.7 UserOp 打包变化**  
    https://hackmd.io/@tomteman-ef/userop_packing_changes

---

## 核查员注记

### 已验证的稳定信息
- ✅ 以太坊 Slot 时间、Epoch、Finality 参数（自 PoS 起已固定）
- ✅ EIP-1559、EIP-4844、ERC-4337 v0.7 仍为现行标准
- ✅ BIP-39/SLIP-39 备份标准未变
- ✅ 主流钱包产品线（MetaMask、Rabby、Ledger、Trezor）2026年8月现况

### 需要定期重新检验的数据
- ⚠️ **Gas 价格**（每日波动）：本报告数据截至 2026-08-01，读者应重新查询实时追踪工具
- ⚠️ **L2 TVS**（月度变化）：DeFi 流向动态，建议每月更新
- ⚠️ **硬件钱包新品发布**（持续更新）：厂商持续推出新型号，本报告覆盖 2026上半年的产品

### 可能需要补充的细节
- 后续若涉及 Glamsterdam 升级（2026 下半年预期）的具体 EIP，需要拉取最新提案状态
- Hegotá 升级（2027 预期）仍在草案阶段，不在本章讨论范围

