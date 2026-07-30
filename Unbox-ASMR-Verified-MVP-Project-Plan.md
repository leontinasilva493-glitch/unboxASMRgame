# Unbox ASMR 快攻实证型 MVP 项目方案

> 文档用途：直接交给 Codex 作为项目实施规格。  
> 数据截点：2026-07-30（America/Los_Angeles）。动态数据上线前必须重新核验。  
> 项目性质：非官方 Roblox 游戏攻略与数据站。  
> 首版约束：单人 12–18 小时完成，不做账号、社区、数据库后台或批量 AI 内容。

---

## 0. 给 Codex 的执行原则

1. 开始前先读取项目中的 `AGENTS.md`、README、包管理器和现有目录结构。
2. 如果已有项目：
   - 复用现有框架、组件、样式、部署和分析方案；
   - 不迁移技术栈，不大改架构，不修改无关代码。
3. 如果是空项目：
   - 使用适合静态内容站的轻量方案；
   - 默认可采用 Next.js App Router + TypeScript + Tailwind CSS；
   - 页面以静态生成或服务端渲染为主，仅筛选器和倒计时使用客户端 JavaScript。
4. 不私自开启 Subagent，不增加 Ultra 模式，不引入非必要依赖。
5. 对低风险、可逆的细节按本方案和项目既有规范直接实现，不要反复询问。
6. 遇到缺失的游戏数据时：
   - 可以继续搭建页面、组件和数据接口；
   - 不得编造 toy、crate、掉率、代码、rebirth 效果或 Gamepass 结论；
   - 将缺失项写入 `DATA_NEEDED.md`；
   - 未完成的数据页使用明确的“Verification in progress”，必要时暂时 `noindex`。
7. 每完成一个阶段就运行现有 lint、类型检查和构建命令；最后完成响应式、链接和页面元数据检查。

---

## 1. 项目一句话定义

为 Roblox 新游 **Unbox ASMR** 建立一个“真实截图、真实数值、带验证时间”的英文攻略与数据站，帮助玩家快速解决：

- 新手如何开始；
- 如何出售物品、获得更多 crates 和免费 workers；
- 各 crates、toys、rebirths 的真实数据；
- 哪个 Gamepass 更值得购买；
- 当前 codes、活动时间和更新内容。

本站不靠“页面多”取胜，而靠以下三点形成差异化：

1. **可核验**：关键结论附来源、验证日期和证据状态。
2. **直接解决问题**：先回答玩家当下要做什么，再解释原因。
3. **更新快**：围绕每周活动、codes 和游戏版本及时更新。

---

## 2. 为什么现在做

### 2.1 当前热度快照

以下仅作为立项依据，不能长期硬编码为“实时数据”：

| 指标 | 2026-07-30 快照 |
|---|---:|
| 创建时间 | 2026-07-05 |
| 同时在线 | 约 42,300 |
| 历史峰值 CCU | 约 42,399 |
| 总访问 | 约 16.2M |
| 收藏 | 约 508K |
| 好评率 | 约 97% |
| 平均游玩时间 | 约 11.47 分钟 |
| ASMR Labs 群组成员 | 约 549K |
| Update 3 活动预约 | 约 72K |

公开来源：

- Roblox 游戏页：<https://www.roblox.com/games/112233638491976/Unbox-ASMR>
- Rolimon’s 数据页：<https://www.rolimons.com/game/112233638491976>
- Roblox Trending：<https://www.roblox.com/charts/top-trending>
- ASMR Labs 群组：<https://www.roblox.com/communities/1110056661/ASMR-Labs>
- 活动信息：<https://allthings.how/unbox-asmr-events-schedule/>

### 2.2 SEO 机会

主词 `Unbox ASMR` 与普通 ASMR 开箱内容混淆，不能只押主词。真正的机会来自刚形成的 Roblox 长尾：

- unbox asmr roblox
- unbox asmr wiki
- unbox asmr guide
- unbox asmr crates
- unbox asmr toys
- unbox asmr rebirth
- unbox asmr workers
- unbox asmr complete index
- unbox asmr gamepasses
- unbox asmr update
- unbox asmr admin abuse time
- unbox asmr codes

当前 SERP 已出现多个新建 EMD Wiki，但普遍存在：

- 只复述游戏简介；
- 缺少真实表格和截图；
- 没有清楚的验证时间；
- 编造 pets、codes、drop rates 或其他系统；
- 批量生成大量同质文章。

因此本站必须始终在 Title、H1、首屏正文和结构化数据里强调 **Roblox**，并以真实数据避开通用 ASMR 搜索意图。

---

## 3. 商业目标与首版成功标准

### 3.1 业务目标

在游戏爆发窗口内快速上线，验证是否能获得：

- Roblox 游戏长尾自然搜索曝光；
- 更新和攻略型回访；
- 广告变现所需的页面浏览基础；
- 后续工具化的真实用户需求。

### 3.2 上线后 7 天观察指标

以下是判断是否继续投入的阈值，不是首日 KPI：

| 指标 | 继续扩展信号 |
|---|---|
| 游戏热度 | 7 日中位 CCU 仍高于 10,000 |
| Google 曝光 | Search Console 达到 500+ impressions/day |
| 关键词 | 至少 2 个目标长尾进入前 20 |
| 用户行为 | `Play on Roblox`、攻略卡片或数据表有稳定点击 |
| 内容维护 | 游戏仍保持约每周更新 |

若游戏 CCU 连续 5 天低于 3,000，且网站没有自然搜索增长，则停止工具化扩建，只维护 codes、updates 和已有攻略。

---

## 4. 目标用户与核心任务

### 4.1 目标用户

#### A. 第一次进入游戏的新玩家

需要：

- 30 秒内理解核心循环；
- 知道第一批钱该怎么花；
- 找到出售物品的 NPC；
- 领取免费 workers；
- 避免浪费初始资源。

#### B. 进入中期的效率玩家

需要：

- 判断下一种 crate 是否值得解锁；
- 了解 worker 和 rebirth 的真实效果；
- 找到更高效率的升级顺序；
- 判断哪些重复物品应该出售。

#### C. 收集型玩家

需要：

- 查看完整 toy/index；
- 找出自己缺少的物品；
- 确认稀有度、来源和活动限定状态；
- 完成 Complete Index。

#### D. 活动与更新玩家

需要：

- 确认 Update、Admin Abuse 的本地时间；
- 快速查看新 crates、toys、rebirths 和修复；
- 确认 codes 是否真的有效。

#### E. 准备购买 Gamepass 的玩家

需要：

- 查看当前价格；
- 了解功能和适合阶段；
- 判断对免费玩家是否必要；
- 避免为低收益或过早的能力花 Robux。

### 4.2 核心 Jobs To Be Done

用户进入页面时，优先回答：

1. **我现在该做什么？**
2. **这个东西在哪里或怎么获得？**
3. **我花钱或 rebirth 后会得到什么、失去什么？**
4. **这条数据是否仍然有效？**
5. **下一次活动在我的时区几点开始？**

---

## 5. 产品定位与内容承诺

### 5.1 定位

**Unbox ASMR Verified Player Guide**

不是传统百科，而是“攻略入口 + 数据表 + 更新看板”。

### 5.2 对外价值主张

推荐核心文案：

> Real gameplay. Verified data. No made-up codes.

辅助文案：

> Find current crates, toys, rebirths, workers, gamepasses, codes and event times for Unbox ASMR on Roblox.

### 5.3 证据状态

所有会影响玩家决策的事实必须属于以下一种：

| 状态 | 展示标签 | 使用规则 |
|---|---|---|
| 官方公开 | Official | 来自 Roblox 游戏页、官方群组或官方活动 |
| 游戏内实测 | In-game verified | 有当前版本截图或录屏 |
| 社区报告 | Community reported | 至少标明来源，不作为绝对结论 |
| 未验证 | Unverified | 不进入排名、计算器或推荐结论 |

页面中不要用模糊的 “Updated recently”。必须显示具体日期，例如：

> Verified in-game on July 30, 2026 · Honey Event

---

## 6. MVP 范围

### 6.1 P0：必须上线

1. 首页聚合仪表盘
2. Beginner Guide
3. Crates & Toys
4. Rebirths & Workers
5. Gamepasses
6. Updates / Events
7. Codes
8. About / Sources / Disclaimer
9. Sitemap、robots、canonical、基础结构化数据
10. 移动端适配、性能优化、基础分析事件

### 6.2 P1：有余力再做

- Crates/Toys 客户端搜索和筛选；
- 活动时间自动转换用户本地时区；
- 简单事件倒计时；
- Changelog 新旧版本对比；
- 页面内目录；
- 数据过期提醒。

### 6.3 明确不做

- 用户注册、登录和云同步；
- 评论区、论坛、Discord 镜像；
- 后台 CMS 或数据库；
- 自动抓取大量第三方网站；
- 开箱模拟器；
- 完整概率或 ROI 计算器；
- 多语言；
- 每个 toy 单独生成 SEO 页面；
- exploits、scripts、外挂下载；
- 虚构的 tier list；
- 邮箱订阅和未成年人信息收集；
- 大量 Coming Soon 页面参与索引。

---

## 7. 信息架构与导航

### 7.1 主导航

```text
Home
Beginner Guide
Crates & Toys
Rebirths & Workers
Gamepasses
Updates
Codes
```

移动端允许将 `Rebirths & Workers` 缩写为 `Rebirths`，但页面 H1 保持完整。

### 7.2 路由建议

```text
/
/beginner-guide/
/crates-and-toys/
/rebirths-and-workers/
/gamepasses/
/updates/
/codes/
/about/
/sources/
/privacy/
/terms/
```

如果项目已有 URL 规范，应沿用既有 trailing slash、locale 和 slug 方案，不要为了本方案修改全站规范。

---

## 8. 页面级详细规格

## 8.1 首页

### SEO

- Title：`Unbox ASMR Roblox Wiki: Crates, Toys & Rebirths`
- H1：`Unbox ASMR Roblox Guide & Verified Wiki`
- Description：`Verified Unbox ASMR Roblox guides for crates, toys, workers, rebirths, gamepasses, codes and weekly events. Checked after every update.`

### 首屏

必须包含：

1. `Unofficial fan guide` 标签；
2. H1 和一句定位；
3. 两个 CTA：
   - `Start the Beginner Guide`
   - `Play on Roblox`
4. 当前更新标签；
5. `Last verified` 日期。

### 首屏下方状态卡

最多 4 张：

- Current event
- Next event / countdown
- Codes status
- Latest verification

不要把动态玩家数伪装成实时数据。如果没有稳定接口，显示：

> Player snapshot: 42K+ · Checked July 30, 2026

### 首页内容顺序

1. Hero
2. Quick status cards
3. `What do you need help with?` 六张任务卡
4. 新玩家四步路线
5. Crates/Toys 数据摘要
6. Rebirth/Workers 摘要
7. Gamepass 摘要
8. 最新更新
9. 常见问题
10. 来源与非官方声明

### 验收

- 用户在首屏或首屏下一屏能进入所有 P0 页面；
- 5 秒内能看出这是 Roblox 游戏攻略，不会误认为普通 ASMR 网站；
- 所有动态信息显示验证日期；
- `Play on Roblox` 链接必须指向官方游戏页。

---

## 8.2 Beginner Guide

### SEO

- Title：`Unbox ASMR Beginner Guide: Sell Toys, Workers & Crates`
- H1：`Unbox ASMR Beginner Guide for Roblox`
- 主要意图：`unbox asmr guide`、`how to play unbox asmr`

### 页面结构

1. 30 秒快速答案
2. 游戏核心循环
3. 第一次进入后的 5 个步骤
4. 如何购买/获得 crates
5. 如何打开和摆放 ASMR toys
6. 如何获得收益
7. 如何出售给 frog NPC
8. 如何领取两个免费 workers
9. 新手升级顺序
10. 常见卡点与排查
11. 下一步进入 Crates、Rebirths、Gamepasses

### 内容要求

- 每个“怎么做”至少一张实际截图；
- 使用有序步骤，避免长段落；
- 如果 UI 名称无法确认，不要写“点击某按钮”，改为明确待验证；
- 不给出未经实测的升级倍数。

### 验收

- 一个新玩家只看本页即可完成首轮游戏循环；
- “frog NPC”“free workers”“more crates”均能通过页内目录直达；
- 不包含任何 exploit 或第三方脚本。

---

## 8.3 Crates & Toys

### SEO

- Title：`All Unbox ASMR Crates & Toys: Prices, Rarity and Cash`
- H1：`Unbox ASMR Crates and Toys List`
- 主要意图：`unbox asmr crates`、`unbox asmr toys`、`complete index`

### 页面结构

1. 快速说明：Crates、Toys 与收益的关系
2. Crates 表格
3. Toys 表格
4. 活动限定项
5. Complete Index 说明
6. 数据验证说明
7. 相关指南

### Crate 表字段

| 字段 | 必填 |
|---|---|
| Name | 是 |
| Area / unlock stage | 是 |
| Unlock requirement | 有公开信息时 |
| Cost | 有游戏内证据时 |
| Possible toys | 有证据时 |
| Displayed odds | 仅游戏明确显示时 |
| Event limited | 是 |
| Verified at | 是 |
| Evidence status | 是 |

### Toy 表字段

| 字段 | 必填 |
|---|---|
| Name | 是 |
| Rarity | 有游戏内证据时 |
| Source crate | 有证据时 |
| Cash / earning value | 有证据时 |
| Sound or interaction type | 可选 |
| Event limited | 是 |
| Index number | 若游戏显示 |
| Verified at | 是 |
| Screenshot | 推荐 |

### 交互

MVP 可实现：

- 关键词搜索；
- 按 crate、rarity、event 筛选；
- URL query 保留筛选状态属于 P1，不强制。

不要实现：

- 未验证掉率推算；
- “最佳 toy”排行榜；
- 将 rarity 自动等同于实际收益。

### 验收

- 空字段显示 `Not publicly verified`，而不是补写猜测；
- 筛选器在移动端可用；
- 数据表可横向滚动，但首要字段在小屏幕保持可读；
- 若真实数据不足，页面 `noindex`，首页只展示已核验摘要。

---

## 8.4 Rebirths & Workers

### SEO

- Title：`Unbox ASMR Rebirth & Workers Guide: Costs and Resets`
- H1：`Unbox ASMR Rebirths and Workers Guide`

### 页面结构

1. 什么是 Rebirth
2. Rebirth 前会失去什么、保留什么
3. 各 Rebirth 条件和奖励表
4. 什么时候适合第一次 Rebirth
5. Workers 的作用
6. 两个免费 workers 的领取步骤
7. Worker 不显示或不工作的排查
8. Honey Event 新增 Rebirths
9. 常见问题

### Rebirth 表字段

- Rebirth number/name
- Requirement
- What resets
- What remains
- Permanent reward/multiplier
- New ASMR unlocked
- Event/version
- Verified at
- Evidence

### Worker 表字段

- Worker source
- Unlock condition
- Cost
- Slot requirement
- Task/function
- Offline behavior
- Known issue/fix
- Verified at

### 验收

- 未确认“离线收益”前不得写 workers 24/7 工作；
- 重生按钮前的重置提示必须来自截图或录屏；
- 明确区分长期奖励和单局收益。

---

## 8.5 Gamepasses

### SEO

- Title：`Best Unbox ASMR Gamepasses: Prices and Value Guide`
- H1：`Unbox ASMR Gamepasses: Which Are Worth It?`

### 当前公开价格快照

上线前重新核验：

| Gamepass | 公开价格快照 |
|---|---:|
| 2x Money | 11 Robux |
| 2x Walkspeed | 49 Robux |
| 2x Luck | 75 Robux |
| Fast Conveyor | 149 Robux |
| Quick Unlock | 199 Robux |
| V.I.P | 299 Robux |
| Roll 3x Crates | 499 Robux |

来源：<https://www.rolimons.com/game/112233638491976>

### 页面结构

1. 一句话结论
2. 当前 Gamepass 比较表
3. Free-to-play 玩家是否需要购买
4. 新手、中期、收集玩家的购买建议
5. 每个 Gamepass 的详细说明
6. 价格或效果变化记录
7. 免责声明

### 比较表字段

- Name
- Current Robux price
- Official/in-game effect
- Best for
- Game stage
- Value verdict
- Evidence
- Verified at

### 推荐规则

只有在效果经过游戏内验证后，才能出现：

- Best overall
- Best for beginners
- Best for collectors
- Skip for now

价格本身不能直接推出 ROI。

### 验收

- 不放置虚假的购买按钮；
- 点击购买只跳转官方 Roblox；
- 清楚声明本站不出售 Robux 或 Gamepass；
- 推荐结论带验证日期。

---

## 8.6 Updates / Events

### SEO

初始页面：

- Title：`Unbox ASMR Update 3 & Admin Abuse Time`
- H1：`Unbox ASMR Update 3 and Admin Abuse`

更新结束后保留文章内容，但首页应自动展示下一条 active/upcoming event。

### 初始已知事件

- Honey Event：2026-07-26 至 2026-08-02
- Admin Abuse + Update 3：
  - 开始：2026-08-02 15:00 ET / 12:00 PT
  - 结束：2026-08-09 15:00 ET / 12:00 PT

所有时间在数据文件中使用 ISO 8601 + 明确时区，不要在多个组件里重复硬编码。

### 页面结构

1. 当前状态：upcoming/live/ended
2. 倒计时
3. 用户本地时间
4. 已确认内容
5. 尚未公布内容
6. 上一版本回顾
7. 上线后的真实 changelog
8. 更新后需要重新核验的页面清单

### 展示原则

- 官方只写 “coming soon” 时，不得猜测新增内容；
- “预计”必须显式标注为预测；
- 更新后将预告与实装内容分栏展示；
- 每次更新同步刷新 codes、crates、toys、rebirths、gamepasses。

### 验收

- 倒计时结束后不会显示负数；
- JavaScript 关闭时仍显示 ET/PT 原始时间；
- 活动结束后自动切换为 ended；
- 页面具备 `Last checked`。

---

## 8.7 Codes

### SEO

- Title：`Unbox ASMR Codes (July 2026): No Active Codes Yet`
- H1：`Unbox ASMR Codes`

月份和年份必须由当前内容状态生成或维护，不能长期停留在 July 2026。

### 当前状态

截至 2026-07-30：

- 没有经过可靠来源确认的 active code；
- 有来源报告游戏尚未提供 redemption system；
- 官方简介提到未来会有 special codes。

辅助核验来源：<https://beebom.com/unbox-asmr-codes/>

### 页面结构

1. 直接答案
2. Active codes 表
3. Expired codes 表
4. 游戏是否已有兑换入口
5. 两个免费 workers 等非代码奖励
6. 如何验证新代码
7. 更新日志
8. 虚假代码提醒

### 数据规则

- `RELEASE`、`THANKS`、`SORRY` 等未经核验的代码不得展示为有效；
- 新代码至少由官方渠道或实际游戏兑换成功确认；
- 每个代码记录：
  - code
  - reward
  - status
  - addedAt
  - expiresAt
  - checkedAt
  - source
  - inGameResult

### 验收

- 没有代码时仍能解决用户问题，而不是只显示空表；
- 代码状态必须带最后检查日期；
- 不使用“Updated daily”之类无法履行的承诺。

---

## 8.8 About / Sources

必须包含：

- 本站是非官方 fan-made guide；
- 与 Roblox、ASMR Labs 无关联；
- 信息来源优先级；
- 纠错方式；
- 数据可能随更新变化；
- Roblox 和游戏名称归各自权利人所有。

不在 MVP 中建立公开评论区。纠错入口可以是简单的外部表单或联系邮箱，但如果项目尚无合规的联系方案，先只展示来源说明。

---

## 9. 首页与组件设计

### 9.1 视觉方向

目标感觉：

- relaxing；
- satisfying；
- collectible；
- clean data dashboard。

避免：

- 传统深色电竞风；
- 满屏霓虹；
- 大量闪烁动画；
- 直接复制 Roblox 或游戏 Logo；
- 看起来像未成年人抽奖/赌博网站。

### 9.2 推荐配色

| 用途 | 色值 |
|---|---|
| 页面背景 | `#FFF9F0` 暖奶油 |
| 卡片背景 | `#FFFFFF` |
| 主色 | `#F2B84B` 蜂蜜黄 |
| 次色 | `#69C7B7` 柔和薄荷绿 |
| 强调色 | `#B99AE8` 淡紫 |
| 轻提醒 | `#F49AA7` 淡粉 |
| 主文字 | `#252A34` |
| 次文字 | `#667085` |
| 边框 | `#E9E2D7` |

必须检查文本与背景对比度。黄色不要直接作为小字号正文颜色。

### 9.3 组件

优先复用以下组件：

- SiteHeader
- MobileNav
- Hero
- StatusCard
- GuideCard
- VerificationBadge
- LastVerified
- DataTable
- FilterBar
- EventCountdown
- CodeStatus
- SourceList
- InlineCallout
- Breadcrumbs
- TableOfContents
- EmptyVerifiedState
- FooterDisclaimer

### 9.4 组件规则

- 卡片圆角统一，建议 14–18px；
- 阴影轻，不使用厚重浮层；
- VerificationBadge 四种状态必须颜色和文字双重区分；
- 表格第一列在移动端可选 sticky；
- CTA 主次清晰；
- 所有外部链接带 `rel="noopener noreferrer"`；
- 不把整张卡片和卡片内部多个链接叠加成嵌套交互。

---

## 10. 数据模型

如果项目使用 TypeScript，可参考以下概念结构；其他技术栈保持同样字段语义。

```ts
type VerificationStatus =
  | "official"
  | "in_game_verified"
  | "community_reported"
  | "unverified";

type Evidence = {
  status: VerificationStatus;
  verifiedAt: string;
  gameVersion?: string;
  eventName?: string;
  sourceUrl?: string;
  screenshot?: string;
  notes?: string;
};

type GameSnapshot = {
  capturedAt: string;
  playing?: number;
  visits?: number;
  favorites?: number;
  rating?: number;
  averagePlaytimeMinutes?: number;
  sourceUrl: string;
};

type EventRecord = {
  slug: string;
  name: string;
  startsAt: string;
  endsAt?: string;
  status: "upcoming" | "live" | "ended";
  confirmedChanges: string[];
  unconfirmedNotes: string[];
  evidence: Evidence[];
};

type CodeRecord = {
  code: string;
  reward?: string;
  status: "active" | "expired" | "unverified";
  addedAt?: string;
  expiresAt?: string;
  checkedAt: string;
  evidence: Evidence[];
};

type GamepassRecord = {
  slug: string;
  name: string;
  priceRobux?: number;
  effect?: string;
  bestFor?: string[];
  gameStage?: "beginner" | "midgame" | "late_game" | "all";
  verdict?: string;
  evidence: Evidence[];
};

type CrateRecord = {
  slug: string;
  name: string;
  area?: string;
  unlockRequirement?: string;
  cost?: number;
  currency?: string;
  eventLimited: boolean;
  toyIds: string[];
  displayedOdds?: Record<string, number>;
  evidence: Evidence[];
};

type ToyRecord = {
  slug: string;
  name: string;
  rarity?: string;
  sourceCrateIds: string[];
  cashValue?: number;
  indexNumber?: number;
  eventLimited: boolean;
  soundType?: string;
  evidence: Evidence[];
};

type RebirthRecord = {
  id: string;
  name: string;
  requirement?: string;
  resets: string[];
  keeps: string[];
  rewards: string[];
  evidence: Evidence[];
};
```

### 10.1 推荐数据目录

```text
data/
  game.json
  snapshots.json
  events.json
  codes.json
  gamepasses.json
  crates.json
  toys.json
  rebirths.json
  workers.json
  changelog.json
```

### 10.2 构建时校验

至少校验：

- slug 唯一；
- 日期能正确解析；
- external URL 合法；
- `in_game_verified` 必须存在截图或明确证据；
- active event 的时间区间有效；
- active code 必须有 checkedAt 和证据；
- unverified 数据不得带推荐 verdict；
- Toy 引用的 crate id 必须存在。

可使用项目已有校验库；若没有，优先写轻量构建脚本，不为此引入大型依赖。

---

## 11. 实证数据采集方案

### 11.1 最低采集包

使用全新 Roblox 账号，从零开始录制 90–120 分钟，采集：

1. 出生点和完整 HUD；
2. 第一种 crate 的购买、生成、打开流程；
3. toy 的名称、稀有度和收益显示；
4. 物品放置与收益方式；
5. frog NPC 的位置和出售步骤；
6. workers 面板；
7. 加入群组前后免费 workers 变化；
8. 下一 crate 的解锁条件；
9. rebirth 面板和确认弹窗；
10. 每个 Gamepass 的游戏内说明；
11. Complete Index 页面；
12. Honey Event / Update 3 面板；
13. 设置和可能的 code 入口。

### 11.2 截图命名

```text
public/images/gameplay/
  beginner-spawn-2026-07-30.webp
  frog-sell-location-2026-07-30.webp
  free-workers-panel-2026-07-30.webp
  crate-[slug]-2026-07-30.webp
  toy-[slug]-2026-07-30.webp
  rebirth-confirmation-2026-07-30.webp
  gamepass-[slug]-2026-07-30.webp
```

图片应：

- 裁掉用户名、聊天和无关个人信息；
- 保留能够证明数值的 UI；
- 需要时添加简单箭头和编号；
- 转为 WebP/AVIF 并压缩；
- 提供描述性 alt；
- 不复制竞争网站的图片。

### 11.3 来源优先级

1. 游戏内当前版本截图/录屏
2. Roblox 官方游戏页和活动
3. ASMR Labs 官方群组或官方公告
4. Roblox 公共 API / Rolimon’s 等统计快照
5. 可信媒体
6. YouTube/社区报告

后一级来源不能覆盖前一级的最新实测结果。

---

## 12. SEO 实施要求

### 12.1 实体消歧

由于主词与普通 ASMR 内容混淆：

- 首页和所有核心页 Title 必须包含 `Roblox` 或明确游戏语境；
- H1 或首段必须出现完整名称 `Unbox ASMR on Roblox`；
- About 明确开发者为 ASMR Labs；
- 链接到唯一官方 Roblox 游戏页；
- 页面图片 alt 使用 `Unbox ASMR Roblox`，但避免关键词堆砌。

### 12.2 页面基础

每页必须有：

- 唯一 Title；
- 唯一 meta description；
- 一个 H1；
- canonical；
- Open Graph；
- breadcrumb；
- 最后核验日期；
- 至少两个相关内链；
- 来源区；
- 非官方声明。

### 12.3 结构化数据

只添加页面真实可见的信息，可使用：

- WebSite / Organization
- VideoGame
- BreadcrumbList
- Article（更新与攻略）
- ItemList（真实数据表）

FAQ 仅在页面可见问题与答案完全一致时添加。不要为了富结果重复或隐藏内容。

### 12.4 内容质量

- 英文为首版唯一语言；
- 开头先给 direct answer；
- 一页只解决一个主意图；
- 数据表优先于泛泛段落；
- 不复制竞品措辞；
- 不创建内容高度重复的单实体页；
- 未达到可用内容量的页面不参与 sitemap 或设为 noindex。

### 12.5 技术 SEO

- 自动 sitemap；
- 正确 robots；
- 404 页面；
- 无死链；
- 图片尺寸固定，避免 CLS；
- 语义化 HTML；
- 页面主内容不依赖 JavaScript 才能被抓取；
- 活动倒计时不是页面唯一内容；
- 统一 URL 和 canonical 规则。

---

## 13. 技术实现建议

### 13.1 架构

- 内容和数据本地化存储；
- 无数据库；
- 无登录；
- 无管理后台；
- 通过 Git 修改 JSON/Markdown 完成更新；
- 数据表和事件页由结构化数据生成；
- 页面尽量静态生成；
- 客户端只负责筛选、倒计时和本地时区转换。

### 13.2 内容实现

若项目已有 MDX，可用：

- MDX：长篇攻略；
- JSON/TS：events、codes、gamepasses、crates、toys；
- 页面组件负责统一证据标签和更新时间。

若无 MDX，不要为了 7 个页面强行增加复杂内容系统。

### 13.3 动态玩家数据

MVP 不要求实时请求第三方统计：

- 使用带时间戳的 snapshot；
- 不在每次页面请求访问 Rolimon’s；
- 不让外部 API 故障拖慢页面；
- 后续如需自动更新，再单独实现定时抓取与缓存。

### 13.4 环境变量

建议预留：

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_ROBLOX_GAME_URL
NEXT_PUBLIC_ANALYTICS_ID
```

若部署环境已有命名，沿用现有名称。

### 13.5 性能目标

在正常生产构建和移动网络下争取：

- Lighthouse Performance ≥ 90
- Accessibility ≥ 95
- SEO ≥ 95
- 无严重 CLS
- 首屏不加载大型视频

视频使用缩略图和点击后加载，禁止首页直接自动播放。

---

## 14. 分析事件

复用项目现有分析工具。至少记录：

| 事件 | 触发 |
|---|---|
| `play_roblox_click` | 点击官方游戏 |
| `guide_card_click` | 首页进入某攻略 |
| `event_countdown_view` | 看到活动卡片 |
| `table_filter_use` | 使用 crate/toy 筛选 |
| `gamepass_official_click` | 前往官方 Gamepass |
| `source_open` | 展开或点击来源 |

不要记录：

- Roblox 用户名；
- 未成年人身份；
- 搜索框中的潜在个人信息；
- 不必要的设备指纹。

---

## 15. 合规与信任

1. 全站显著声明非官方。
2. 不使用“Official Wiki”。
3. 不假冒 ASMR Labs 或 Roblox。
4. 不出售 Robux、codes 或账号。
5. 不提供外挂、脚本和绕过机制。
6. 不复制游戏音频。
7. 截图仅用于说明玩法，优先使用自己采集并添加说明的图片。
8. 不在 MVP 收集用户账户或个人资料。
9. 对未验证和过期信息进行明确标识。
10. 所有购买建议均提醒价格和效果可能随更新变化。

页脚推荐：

> Unbox ASMR Guide is an independent fan-made resource and is not affiliated with Roblox Corporation or ASMR Labs. Roblox and the game’s names and assets belong to their respective owners.

---

## 16. 18 小时执行计划

| 阶段 | 任务 | 时间预算 |
|---|---|---:|
| 1 | 检查仓库、确定复用方案、列出缺失数据 | 1h |
| 2 | 建立数据模型、种子数据和校验 | 1.5h |
| 3 | 设计 token、Header/Footer、证据组件 | 1.5h |
| 4 | 首页仪表盘 | 2.5h |
| 5 | Beginner、Updates、Codes | 3h |
| 6 | Crates/Toys、Rebirths/Workers、Gamepasses | 4h |
| 7 | SEO、结构化数据、sitemap、robots | 1.5h |
| 8 | 移动端、可访问性、性能和错误状态 | 1.5h |
| 9 | 构建、链接、内容和发布检查 | 1.5h |
| 合计 |  | **18h** |

真实游戏数据采集可由用户与 Codex 开发并行完成。若不能并行，优先保证：

1. 首页
2. Beginner Guide
3. Updates
4. Codes
5. Gamepasses
6. 数据模型

Crates/Toys 和 Rebirths/Workers 在缺少证据时允许先完成 UI 与数据接口，但不得填入编造数据。

---

## 17. 分阶段实施清单

### Phase 1：仓库检查

- [ ] 阅读 AGENTS.md / README
- [ ] 确认框架、包管理器、部署方式
- [ ] 检查现有设计系统和分析工具
- [ ] 检查是否已有 `.openai/hosting.json`
- [ ] 检查当前 git 状态，不覆盖用户已有改动
- [ ] 生成 `DATA_NEEDED.md`

### Phase 2：基础与数据

- [ ] 路由和导航
- [ ] 数据类型
- [ ] JSON/TS 数据文件
- [ ] 构建时校验
- [ ] Evidence / LastVerified 组件
- [ ] 事件状态计算

### Phase 3：首页和核心页面

- [ ] 首页
- [ ] Beginner
- [ ] Crates & Toys
- [ ] Rebirths & Workers
- [ ] Gamepasses
- [ ] Updates
- [ ] Codes
- [ ] About / Sources

### Phase 4：SEO 和体验

- [ ] metadata
- [ ] canonical
- [ ] sitemap
- [ ] robots
- [ ] structured data
- [ ] Open Graph
- [ ] breadcrumbs
- [ ] 404
- [ ] 移动端导航
- [ ] 键盘访问
- [ ] 图片优化

### Phase 5：验证

- [ ] lint
- [ ] typecheck
- [ ] production build
- [ ] 关键页面无控制台错误
- [ ] 所有官方链接有效
- [ ] 倒计时在结束前后正确
- [ ] 无负数倒计时
- [ ] 无 fabricated data
- [ ] 无未标记的旧数据
- [ ] 无意外 index 的空页面

---

## 18. MVP 验收标准

项目只有同时满足以下条件才算完成：

### 功能

- 7 个核心页面均可访问；
- 导航、面包屑和内链正常；
- 活动时间可正确显示；
- 代码状态可由数据文件维护；
- 数据表能展示证据状态和最后验证时间；
- 缺少数据有明确空状态；
- 所有 Roblox CTA 指向官方页面。

### 内容

- 不存在未经标记的猜测；
- 不存在虚假 codes、pets 或掉率；
- 每个核心页面开头有直接答案；
- 动态信息有具体检查日期；
- 来源页解释验证规则；
- 英文表达清楚、简洁、面向玩家。

### SEO

- 页面 Title/H1 唯一；
- 核心页包含 Roblox 实体消歧；
- canonical、sitemap、robots 正确；
- 页面可在无 JavaScript 时读取主要内容；
- 未完成数据页不会作为薄内容索引。

### 工程

- 使用项目既有 lint/typecheck/build 验证通过；
- 不增加无必要依赖；
- 不破坏已有页面；
- 移动端无明显溢出；
- 图片不造成严重布局跳动；
- README 写明如何更新 events、codes 和 verified data。

---

## 19. 上线后维护工作流

### 每次活动前

1. 核验官方时间；
2. 新建或更新 event record；
3. 首页展示 upcoming；
4. 更新 Title/Description；
5. 检查时区转换。

### 活动开始后 30–60 分钟

1. 进入游戏录屏；
2. 区分“预告内容”和“实际内容”；
3. 更新 changelog；
4. 重新核验 codes；
5. 更新 crates/toys/rebirths；
6. 标记受影响的 Gamepass 建议；
7. 更新 `verifiedAt`。

### 每周一次

- 检查官方游戏页；
- 检查 active/upcoming events；
- 检查 codes；
- 检查 Gamepass 价格；
- 检查过期数据；
- 查看 Search Console 新查询；
- 将真实查询转成 FAQ 或下一篇指南。

---

## 20. 后续扩展触发条件

满足“7 日中位 CCU > 10K + Search Console 500 impressions/day + 至少两个长尾 Top 20”后，再进入第二阶段：

1. Complete Index 本地收集清单；
2. Rebirth Planner；
3. Crate 成本与进度计算器；
4. Gamepass ROI 工具；
5. 版本差异对比；
6. 根据 Search Console 决定西语、葡语或印尼语；
7. 只有数据足够时才建设单个 toy/crate 实体页。

所有用户进度先保存于浏览器 localStorage，不需要登录或服务器账户。

---

## 21. 可直接复制给 Codex 的执行任务

```text
请按《Unbox ASMR 快攻实证型 MVP 项目方案》推进项目。

目标：
在不超过 18 小时的 MVP 范围内，构建一个英文的 Unbox ASMR Roblox 非官方攻略与数据站。首页是玩家答案仪表盘，核心差异化是真实截图、真实数据、验证日期和证据状态，不是批量 AI Wiki。

执行要求：
1. 先读取 AGENTS.md、README 和现有项目结构。
2. 复用现有技术栈、组件和部署方案；不要修改无关架构。
3. 不开启 Subagent，不添加非必要依赖，不建立账号、数据库、CMS 或评论系统。
4. 完成以下页面：
   - Home
   - Beginner Guide
   - Crates & Toys
   - Rebirths & Workers
   - Gamepasses
   - Updates
   - Codes
   - About / Sources / legal pages
5. 建立统一的数据与证据模型：Official、In-game verified、Community reported、Unverified。
6. 任何没有可靠来源的数据都不得编造；写入 DATA_NEEDED.md，并使用明确空状态。未完成的数据页必要时 noindex。
7. 页面默认英文，项目实施说明和提交总结可使用中文。
8. 做好 Roblox 实体消歧、metadata、canonical、sitemap、robots、结构化数据、移动端和可访问性。
9. 完成事件倒计时、本地时间显示、codes 状态、数据表和 Last verified。
10. 最后运行项目已有 lint、typecheck、test（若已有）和 production build，并修复本次变更导致的问题。

实施顺序：
仓库检查 → 数据模型与验证组件 → 首页 → Beginner/Updates/Codes → 数据页与 Gamepasses → SEO → 响应式与验收。

交付时请报告：
- 实现了哪些页面和功能；
- 哪些数据已核验；
- DATA_NEEDED.md 中仍缺什么；
- 运行了哪些验证命令和结果；
- 是否有与 MVP 无关的内容未改动。
```

