# 第3章《密码学基础》事实核查调研

## 真实案例库

### 1. Bybit $1.4 亿冷钱包盗窃案（2025年2月）

**时间：** 2025 年 2 月 21 日  
**涉及方：** Bybit 交易所（冷钱包），Safe{Wallet}，北朝鲜 Lazarus 黑客组织  
**发生了什么：** 
- 攻击者通过盗用 Safe Wallet 开发人员的机器获得访问权限，向 Safe UI 注入恶意 JavaScript 代码
- Bybit 多签钱包管理员被欺骗签署了外观正常但底层改写了交易目标地址的恶意交易
- 攻击利用了硬件钱包的**盲签名缺陷**：钱包无法完全解码复杂交易，只能显示交易哈希，无法验证实际被转账的目标地址

**损失量级：** $1.4 亿美元（401,347 ETH）  
**关键教训：**
- 多签钱包的安全不仅依赖私钥管理，还要防止 UI 欺骗攻击
- 盲签名是硬件钱包架构的根本局限，单凭显示哈希无法防止恶意交易
- 供应链安全（开发人员机器被入侵）是交易基础设施的关键脆弱点

**参考资源：**
- https://www.nccgroup.com/research/in-depth-technical-analysis-of-the-bybit-hack/
- https://www.certora.com/blog/bybit-hack-multisig-wallet-security
- https://dfns.co/article/the-bybit-safe-hack

---

### 2. Ledger Connect Kit 供应链攻击（2023年12月）

**时间：** 2023 年 12 月 14 日  
**涉及方：** Ledger Connect Kit（npm 包），前 Ledger 员工（被钓鱼），Angel Drainer 恶意软件  
**发生了什么：**
- 攻击者通过复杂的钓鱼攻击（**不是盗取凭证，而是直接盗取会话令牌**，绕过了 2FA）获得了 Ledger 前员工的 NPMJS 账户权限
- 攻击者发布了三个受感染的版本（1.1.5、1.1.6、1.1.7），其中注入了 Angel Drainer 恶意软件
- Angel Drainer 是一个"恶意软件即服务"（MaaS），专门设计用来生成盗窃交易，诱骗硬件钱包用户签署这些交易
- 所有使用这些 npm 版本的 DApp 的用户被欺骗签署了转账他们资金的交易

**损失量级：** 约 $600,000（Ledger 在发现后 40 分钟内下架恶意代码）  
**关键教训：**
- 开源生态的供应链安全至关重要；恶意代码可以通过依赖链条快速扩散
- npm 包劫持通常针对会话令牌而非密码，防御思路需要升级
- 即使硬件钱包也无法防止用户被诱骗签署恶意交易

**参考资源：**
- https://www.ledger.com/blog/security-incident-report
- https://slowmist.medium.com/supply-chain-attack-on-ledger-connect-kit-analyzing-the-impact-and-preventive-measures-1005e39422fd
- https://thehackernews.com/2023/12/crypto-hardware-wallet-ledgers-supply.html

---

### 3. Wintermute $1.6 亿盗窃案（2022年9月）

**时间：** 2022 年 9 月 20 日  
**涉及方：** Wintermute（量化做市商），Profanity 虚荣地址生成工具  
**发生了什么：**
- Wintermute 使用 Profanity 工具生成个性化钱包地址（如地址前缀为 0x000000 的虚荣地址）
- Profanity 的致命缺陷：**它只用 32 位数字作为伪随机数生成器（CPRNG）的种子**，而不是加密级别的熵源
- 攻击者有足够的计算资源暴力枚举 2^32（约 40 亿）个可能的种子值，重建出 Wintermute 热钱包的私钥
- 特别是生成虚荣地址（如 0x000000 开头）需要枚举大量值，进一步削弱了熵

**损失量级：** $1.6 亿美元  
**关键教训：**
- 虚荣地址生成工具必须使用**加密级伪随机数生成器**，而非通用 PRNG（如 MT19937）
- 32 位熵对于现代 GPU/ASIC 计算能力而言远远不够（可在几小时内穷举）
- 追求地址美观性（虚荣前缀）会严重妥协安全性——这是一个经典的安全与便利性权衡

**参考资源：**
- https://www.halborn.com/blog/post/explained-the-wintermute-hack-september-2022
- https://medium.com/amber-group/exploiting-the-profanity-flaw-e986576de7ab
- https://safeheron.com/blog/how-profanity-caused-wintermute-to-lose-160m/

---

### 4. Trust Wallet 浏览器扩展弱熵漏洞（2022年11月-2023年3月）

**时间：** 2022 年 11 月 14-23 日生成的钱包受影响；2023 年 3 月发生实际盗窃；2023 年 4 月公开披露  
**CVE 编号：** CVE-2023-31290  
**涉及方：** Trust Wallet 浏览器扩展（0.0.172-0.0.182 版本），Wallet Core < 3.1.1  
**发生了什么：**
- Trust Wallet Core 在 2022 年 4 月开始支持 WebAssembly（Wasm）目标，以便在浏览器和 Node.js 环境中运行
- Wasm 目标缺少系统强 PRNG 接口，Trust Wallet 采用了 Mersenne Twister（MT19937）
- **关键缺陷：Mersenne Twister 的种子只有 32 位**，导致只能生成 2^32 ≈ 40 亿个可能的助记词
- 攻击者可以在单台计算机上用几个小时生成所有可能的助记词，推导出相应地址的私钥
- 虽然漏洞在 11 月底被修复，但直到 2023 年 3 月才被发现真实盗窃，12 月已有用户报告资金丢失

**损失量级：** 约 $170,000（仅已报告的受害者）  
**受影响的钱包数量：** 所有在 2022 年 11 月 14-23 日间使用 Trust Wallet 浏览器扩展创建的钱包  
**关键教训：**
- 熵的来源必须在**密码学意义**上足够强；通用 PRNG 完全不适合生成密钥
- 浏览器和 Wasm 环境的随机数生成需要特殊处理（如 Web Crypto API 的 `crypto.getRandomValues()`）
- 即使安全漏洞被修复，受害者资金仍然处于风险中，原则上应该让用户迁移到新钱包
- Trust Wallet 最终向受影响用户进行了赔偿

**参考资源：**
- https://www.ledger.com/blog/funds-of-every-wallet-created-with-the-trust-wallet-browser-extension-could-have-been-stolen
- https://tangem.com/en/blog/post/entropy/
- https://www.bitget.com/amp/news/detail/12560605123154

---

### 5. zkSync Era 零知识证明电路缺陷（2023年9月）

**时间：** 2023 年 9 月（ChainLight 安全公司披露）  
**涉及方：** zkSync Era（L2 扩容方案），ChainLight 研究员，Matter Labs  
**发生了什么：**
- ChainLight 安全团队在 zkSync Era 的零知识证明电路中发现了**关键的完备性（soundness）漏洞**
- 该漏洞属于"欠约束电路"（underconstrained circuit）类缺陷：电路中的多项式方程系统对某些无效输入没有进行充分的约束检查
- 结果：恶意证明者可以为**无效执行的区块**生成有效的证明，L1 验证合约会错误地接受这些伪证明
- 这意味着攻击者可能能够在 L2 上提交和最终化虚假的区块

**影响：** 如果被恶意利用，可能导致 zkSync Era L2 验证系统的完整性破裂  
**响应：** Matter Labs 迅速部署了修复；ChainLight 获得了 50,000 USDC 的漏洞赏金  
**关键教训：**
- 零知识证明系统的安全性严格依赖电路的正确约束；编译器 Bug 或人工设计缺陷都会导致完备性失败
- "零知识"不意味着"零风险"；证明系统的完备性（soundness）需要正式验证
- 这类缺陷通常很难通过测试发现，需要专门的静态分析工具（如 Circomspect）
- 即使是成熟的 L2 项目也可能引入 ZK 电路缺陷

**参考资源：**
- https://blog.zksecurity.xyz/posts/zkbugs-website/
- https://eprint.iacr.org/2023/512.pdf（学术论文：自动检测欠约束电路）
- https://muellerberndt.medium.com/finding-soundness-bugs-in-zk-circuits-ea23387a0e1e

---

## 新手坑清单

### 1. 导入种子短语后资金"消失"（派生路径混淆）

**表现：** 用正确的 12/24 个单词导入钱包后，余额显示为 0，看起来资金全部丢失  
**根本原因：** 不同钱包软件使用不同的 **HD 派生路径**（derivation path）生成地址
- MetaMask：`m/44'/60'/0'/0`（仅支持这一个路径）
- Ledger Live：默认路径为 `m/44'/60'/0'/0`，但也支持"Legacy"路径（`m/44'/60'`）
- Trust Wallet、imKey 等可能使用其他路径

**例子：** 用助记词在 Ledger Live 创建钱包（使用 Ledger 的路径），然后在 MetaMask 导入相同的种子短语。MetaMask 会根据自己的路径生成完全不同的地址集合，导致看起来资金消失了

**如何判断："资金"真的消失了吗？**
- 种子短语本身没有丢失，只是在错误的地址上查找
- 在原钱包软件（生成地址的软件）中重新导入，资金会重新出现
- 可以用区块浏览器（Etherscan 等）查询原地址，确认资金仍在链上

**预防方案：**
- 导入前，验证钱包是否支持目标派生路径
- 不要在不同钱包间随意导入种子短语，除非完全理解路径差异
- 保留原钱包软件的访问权限，作为"恢复 Plan B"
- 在导入新钱包前，用原钱包发送小额测试交易

**参考资源：**
- https://support.metamask.io/managing-my-wallet/secret-recovery-phrase-and-private-keys/importing-a-seed-phrase-from-another-wallet-software-derivation-path/
- https://support.imkey.im/hc/en-001/articles/42011175218201-Oh-No-My-Assets-Are-Gone-After-Importing-My-Seed-Phrase
- https://www.dextools.io/tutorials/how-to-recover-a-wallet-with-the-wrong-derivation-path

---

### 2. 盲签名陷阱（硬件钱包无法显示真实意图）

**是什么：** 硬件钱包（Ledger、Trezor）屏幕显示的信息与实际签署的交易数据不一致

**为什么会发生：**
- 硬件钱包屏幕极小，无法显示复杂的智能合约调用数据
- 交易数据通常是十六进制编码（如 `0x095ea7b3...`），对普通用户毫无意义
- 硬件钱包的固件无法完全解码所有可能的合约 ABI，所以只能显示哈希值

**具体场景：**
- 你在 Etherscan 上看到交易显示"批准 USDC 转账"，屏幕上的 Ledger 也显示类似信息
- 但实际上，恶意 DApp 改写了交易数据，让你批准的是**无限额授权**（setApprovalForAll）或**转账目标地址改写**
- 硬件钱包只显示了交易哈希，无法验证真实目标

**现状（2026 年）：**
- **Ledger：** 推出"Clear Sign Everything"计划，试图在更多合约上显示人类可读的交易意图。但这需要合约支持标准化的签名格式
- **Trezor：** 集成 Blockaid 服务，将交易数据解析为可读格式（如"发送 0.5 BTC 到地址 xxx"）。但依然需要信任 Blockaid 的解析

**风险没有消除的根本原因：** 硬件钱包不是"完全隔离"的——它仍需从外部获取交易数据，而这些数据可能被篡改

**预防措施：**
- 只在官方 DApp 网站（验证 DNS 和 HTTPS 证书）进行交易
- 在签署前，用区块浏览器的"Decode Input Data"功能验证交易的真实意图
- 如非必要，不启用"盲签名"开关（某些硬件钱包有此选项）
- 使用 Blockaid、Pocket Universe 等交易模拟工具预演合约调用

**参考资源：**
- https://www.ledger.com/academy/cryptos-greatest-weakness-blind-signing-explained
- https://coinbureau.com/education/what-is-crypto-blind-signing
- https://theonchaindiary.com/articles/blind-signing-explained-the-hidden-risk-in-every-hardware-wallet-transaction

---

### 3. BIP-39 助记词误解

**常见误解 1：** "12 个词和 24 个词的熵差异很大"
- **实际：** 12 词 = 128 位熵，24 词 = 256 位熵
- **在实践中：** 128 位熵（2^128 ≈ 3.4×10^38 种可能）对任何可预见的攻击都足够了。暴力破解需要的计算量远超全球算力总和
- 选择 24 词的主要原因是**冗余性和保险**，而非必要的安全增强

**常见误解 2：** "BIP-39 助记词在任何钱包中都能生成相同地址"
- **实际：** 能否生成相同地址取决于**派生路径**的一致性
- BIP-39 本身只定义"如何从 12/24 个词生成 512 位种子"，不定义派生路径
- 派生路径由 BIP-44、BIP-49、BIP-84 等标准定义，不同钱包可能选择不同标准

**常见误解 3：** "第 25 个词（BIP-39 passphrase）总是更安全"
- **实际：** Passphrase 会生成完全不同的地址集，也会生成完全不同的私钥
- 如果忘记 passphrase，原地址永远无法恢复（即使拥有 12/24 个词）
- Passphrase 的安全收益（针对种子短语泄露的防御）与丢失风险不一定成正比

**参考资源：** 
- BIP-39 官方：https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
- https://dev.to/_56d7718cea8fe00ec1610/understanding-hd-wallets-and-master-key-derivation-bip-39bip-32-3p2a

---

### 4. EIP-55 校验和地址被忽视

**症状：** 复制地址时不小心改变了大小写，导致转账到错误地址

**背景：** 以太坊地址是 40 个十六进制字符，容易被误抄或误粘贴
- 简单校验和（如 Bitcoin 的 Base58Check）会让地址变得很长
- EIP-55 采用了更精妙的方案：**使用 Keccak-256 哈希来决定大小写**

**工作原理：**
1. 对地址（小写）计算 Keccak-256 哈希
2. 遍历地址中的每个十六进制字符：
   - 如果对应哈希字节的值 > 7，该字符大写
   - 否则保持小写
3. 示例：`0xd3CdB9B7995686C4960417TA` 中的 T、A 被大写表示校验有效

**新手坑：** 
- 很多人认为大小写无关紧要（在以太坊技术上确实无关）
- 但如果地址在大小写上被篡改，EIP-55 校验会失败
- 钱包应该在粘贴地址时校验 EIP-55，但许多钱包并不严格执行

**预防：** 
- 复制地址时，保留原有的大小写格式
- 主要钱包（MetaMask、Ledger Live）都支持 EIP-55 验证，但不是强制的

**参考资源：**
- https://dev.to/sendotltd/three-address-checksums-three-engineering-philosophies-verifying-base58check-bech32m-and-59kp

---

## 实操细节

### 派生路径速查表

| 钱包 | 以太坊路径 | 比特币路径 | 备注 |
|------|----------|----------|------|
| MetaMask | `m/44'/60'/0'/0` | 不支持 BTC | 固定，无法更改 |
| Ledger Live | `m/44'/60'/0'/0` (默认) | `m/44'/0'/0'` | 有 Legacy 旧路径选项 |
| Trezor | `m/44'/60'/0'/0` | `m/44'/0'/0'` | 支持多个派生路径 |
| Trust Wallet | `m/44'/60'/0'/0` | `m/44'/0'/0'` | 移动端与浏览器可能不同 |
| imKey | 可配置 | 可配置 | 需要在创建时选择 |
| MyEtherWallet | `m/44'/60'/0'/0` | 可配置 | 支持自定义派生路径 |

**关键点：**
- `44'` = BIP-44（Hierarchical Deterministic wallets）
- `60'` = 以太坊的 SLIP-44 coin type
- `0'/0/0` 代表账户、链、地址索引
- 单引号 `'` 表示"强化"派生（Hardened Derivation），无法从公钥推导

---

### 硬件钱包盲签名现状

**Ledger 设备的显示内容：**
- 基本交易：显示 To 地址、转账金额（如需要的话，使用"Clear Sign Everything"）
- 代币转账：显示代币符号、数量、目标地址
- 智能合约调用：通常显示合约名称（如"Uniswap V3"）和核心参数（如果编解码器可用）
- 未知数据：仅显示交易哈希 + "Blind Signature Required"

**Trezor 设备的显示内容：**
- 通过 Trezor Suite 中的 Blockaid 解析器，将交易转换为人类可读文本
- 屏幕显示："Send 1.5 USDC to 0xabc..."，而非原始十六进制数据
- 但 Blockaid 的解析有延迟（首次交易可能不显示摘要）

**访问检查清单（交易前）：**
- [ ] URL 使用 HTTPS，DNS 记录与官网一致
- [ ] 硬件钱包屏幕显示的地址与目标一致
- [ ] 如可能，用区块浏览器的"Decode Input Data"验证交易
- [ ] 金额、代币类型、Gas 费用都符合预期
- [ ] 如是代币授权，检查授权额度（限制而非无限）

**参考资源：**
- https://support.ledger.com/article/...（Ledger 官方清签指南）
- https://docs.trezor.io/trezor-suite/...（Trezor Suite 指南）

---

### 导入钱包的完整流程（安全版本）

**场景：** 从旧钱包（A）迁移到新钱包（B）

**步骤：**
1. **准备阶段**
   - 在钱包 A 中记录当前余额和所有代币
   - 访问区块浏览器（Etherscan），记录钱包地址及其内容快照
   - 确保钱包 B 与钱包 A 使用相同的派生路径标准

2. **小额测试**
   - 在钱包 B 中导入种子短语
   - 生成第一个地址（通常是 Account 0），记录地址
   - 在钱包 A 中向该地址发送 0.01 ETH 或小额代币
   - 确认钱包 B 显示接收到资金

3. **验证完整性**
   - 在钱包 B 中，逐个查看 Account 0, Account 1, ... 的地址
   - 在 Etherscan 上查询这些地址，确认所有资金都可以在某个账户下找到
   - 如果某个地址为空，查看是否需要切换派生路径或 passphrase

4. **完整迁移**
   - 一旦找到所有资金地址，可以开始转账
   - 建议分多笔交易转账（降低风险）
   - 保留原钱包 A 的访问权限 6 个月，作为应急恢复点

5. **记录和备份**
   - 记录最终使用的派生路径
   - 如使用了 passphrase，记录（存放在安全位置）
   - 更新钱包安全计划文档

---

## 有争议的地方

### 1. 12 词 vs 24 词的实际差异（未定论）

**观点 A：** 24 词提供 256 位熵，相比 12 词的 128 位明显更强  
**观点 B：** 128 位熵已经是密码学意义上的"坚不可摧"，24 词的额外安全收益在现实中微乎其微

**实际情况：**
- 密码学标准认为 128 位熵足以对抗所有已知的攻击（如果是真随机）
- 但考虑到：(1) 熵源质量不确定，(2) 人类可能以非标准方式处理种子，(3) 量子计算的威胁，24 词提供了更大的安全裕度
- 无学术共识，只有实务建议

**源头参考：** NIST SP 800-63B，加密社区最佳实践

---

### 2. BIP-39 Passphrase（"第 25 个词"）的收益与风险（未定论）

**支持者：** 
- 即使种子短语泄露，没有 passphrase 攻击者无法访问资金
- 可以创建"隐钱包"，用于多签或资产隔离

**反对者：**
- Passphrase 是另一个需要记忆和备份的秘密，丢失风险高
- 忘记 passphrase 比忘记种子短语更糟（种子短语无法恢复）
- 在安全的环境（如硬件钱包）下，passphrase 的额外安全收益边际递减

**现实：** 没有完美选择，取决于威胁模型和个人风险承受能力

---

### 3. 后量子密码学时间线的不确定性

**乐观派：** 量子计算至少还需要 10-20 年才能威胁 secp256k1  
**悲观派：** 黑天鹅事件（量子计算意外突破）可能更早发生

**区块链的具体困境：**
- 改造 secp256k1 需要硬分叉，可能破裂共识
- 大多数"后量子算法"尚未在实战中验证
- 过渡策略（多签、智能合约钱包）仍在探索阶段

**当前状态：** 行业尚未达成共识，Ethereum、Bitcoin 都没有正式的后量子迁移计划

**参考：** https://en.wikipedia.org/wiki/Post-quantum_cryptography（学术视角）

---

### 4. SHA-256 vs Keccak-256 vs SHA3-256 的混淆（技术定论但认知混乱）

**技术事实：** NIST 在最终确定 SHA-3 时改变了填充方式，导致 Keccak-256 ≠ SHA3-256

| 算法 | 来源 | 使用场景 | 输出举例 |
|------|------|---------|---------|
| SHA-256 | SHA-2 家族 | Bitcoin、大多数区块链 | 不同 |
| Keccak-256 | 原始 SHA-3 候选（2012） | Ethereum、EVM 链 | 不同 |
| SHA3-256 | NIST 标准（2015） | 政府应用、新项目 | 不同 |

**新手坑：**
- 文档经常混用术语"SHA-3"和"Keccak-256"
- 在以太坊代码中看到 `keccak256()` 函数，不能假设它是 NIST SHA3-256
- 如果错用了算法（如用 SHA3-256 替代 Keccak），链上验证会失败

**现状：** 这是已知的技术区别，但因为名字接近，新手仍经常出错

**参考资源：**
- https://byteatatime.dev/posts/sha3-vs-keccak256
- https://www.geeksforgeeks.org/difference-between-sha-256-and-keccak-256

---

### 5. Merkle 树完备性：CVE-2012-2459 的反复出现（设计缺陷）

**事件：**
- 2012 年：Bitcoin 发现 CVE-2012-2459，树重复叶子导致哈希碰撞
- 2016 年：修复被 Bitcoin 0.13.0 意外重新引入
- 2017 年：0.14.0 再次修复

**根本原因：** 当 Merkle 树某一层有奇数个节点时，最后一个节点被复制（duplicate）再与自身配对
- 理论上，这会导致两个不同的交易序列映射到相同的 Merkle 根
- 实际利用难度极高（需要精心构造交易顺序），但理论上可能

**为什么反复出现：**
- 问题不是代码 Bug，而是**架构设计的根本缺陷**
- 快速修复（检查）不如重新设计，但重新设计需要更多时间和共识

**对 DeFi 的启示：** Airdrop Merkle 证明实现中，如果叶子和中间节点大小相同，也会遭遇类似问题

**参考资源：**
- https://bitcoinops.org/en/topics/merkle-tree-vulnerabilities/
- https://github.com/bitcoin/bitcoin/issues/19598
- https://zokyo-auditing-tutorials.gitbook.io/zokyo-tutorials/tutorial-53-airdrops/airdrop-vulnerability-merkle-leaves-and-parent-node-hash-collisions

---

## 检索来源总结

以下是本调研的 8 次网络搜索及其关键资源：

1. **Bybit 盗窃案** - NCC Group 技术分析、Certora 安全报告
2. **Ledger Connect Kit** - Ledger 官方安全声明、SlowMist 深度分析
3. **Uniswap Permit2** - Uniswap 官方指南与生态学习资源
4. **Wintermute Profanity** - Halborn、Amber Group、The Block 的事件分析
5. **Trust Wallet CVE-2023-31290** - Ledger Donjon、Tangem、Bitget 新闻
6. **MetaMask vs Ledger 派生路径** - MetaMask 官方帮助中心、MyEtherWallet 指南
7. **Keccak-256 vs SHA3-256** - GeeksforGeeks、ByteATime 技术对比
8. **Merkle 树漏洞与 ZK 电路缺陷** - Bitcoin Optech、ZK/SEC 数据库、IACR ePrint

**数据更新截止：** 2026 年 8 月（基于实时网络搜索）
