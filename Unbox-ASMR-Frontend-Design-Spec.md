# Unbox ASMR 前端设计执行规格（Final Design Spec for Codex）

> 配套文档：《Unbox-ASMR-Verified-MVP-Project-Plan.md》（下称"主方案"）。本规格只覆盖前端样式与组件，不重复主方案的 SEO/数据模型/内容规则。
> 工期约束：单人 12–18 小时。本规格已按此裁剪，标注【MVP】的必须做，【P1 延后】的不做。
> 站点语言：英文；受众：Roblox 玩家（含大量未成年人，移动端为主）。

---

## 1. 设计定位（一句话）

**"暖系拆箱数据台"**：像收藏游戏一样有温度，像数据产品一样可信。

- 不是传统深色游戏 Wiki，不是高饱和 Roblox 街机风，不是幼儿玩具站。
- 5 秒内必须看出：这是 Unbox ASMR（Roblox 游戏）的攻略+数据站，不是普通 ASMR 网站。
- 信任感是第一视觉目标：验证徽章、Last verified、来源链接是全站最重要的"装饰"。

### 四条不可违反的红线（来自主方案 §9.1 / §15）

1. 禁止深色电竞风、满屏霓虹、闪烁/循环动效。
2. 禁止任何"开箱抽奖/赌博站"观感（发光宝箱、转动轮盘、概率暗示图形）。
3. 禁止复制 Roblox / 游戏官方 Logo 与素材；不出售 Robux 的暗示。
4. 禁止把 Honey 等限时活动写死进 Logo、品牌色、基础组件——活动只存在于可替换的 Banner 和内容数据中。

---

## 2. 设计 Token

### 2.1 色彩

```css
:root {
  /* 基底 */
  --background: #FFF9F0;        /* 暖奶油页面底 */
  --surface: #FFFFFF;           /* 卡片 */
  --surface-soft: #FFF4DF;      /* 次级填充：图标底、表头、code 底 */

  /* 品牌 */
  --primary: #F2B84B;           /* 蜂蜜黄：主 CTA、小面积高亮、图标 */
  --primary-hover: #DFA32F;
  --primary-ink: #3D2E10;       /* 蜂蜜黄按钮上的深色文字（保证对比度） */
  --accent-purple: #B99AE8;     /* 分类点缀色 A */
  --accent-pink: #F49AA7;       /* 分类点缀色 B */

  /* 文字 */
  --text: #252A34;
  --text-secondary: #667085;
  --border: #E9E2D7;            /* 暖灰边框 */

  /* 验证状态四态（绿色家族只用于验证，不做装饰） */
  --verified: #23856D;          /* In-game verified */
  --verified-bg: #E4F4EE;
  --official: #2F6FB2;          /* Official */
  --official-bg: #E7F0FA;
  --reported: #A96B00;          /* Community reported */
  --reported-bg: #FBF0DC;
  --unverified: #7A7183;        /* Unverified */
  --unverified-bg: #F0EDF2;

  --danger: #C84B5A;            /* 过期 code、错误提示 */
}
```

**用色纪律：**

- 蜂蜜黄 `--primary` 只用于：主 CTA 按钮、当前导航态、小面积高亮条、图标。**禁止**作为小字号正文色、禁止大面积铺底。
- 分类/标签点缀只允许在 `--accent-purple` 与 `--accent-pink` 中轮换，同一屏强调色不超过两种。
- **薄荷绿/任何绿色不做装饰色**——绿色家族整体留给"已验证"状态，避免语义混淆（这是对 ChatGPT 方案的关键修正）。
- 所有文本/背景组合对比度 ≥ 4.5:1（正文）/ 3:1（大字与图标），重点检查蜂蜜黄、淡紫上的文字。

### 2.2 圆角 / 阴影 / 间距

```css
:root {
  --radius-small: 10px;    /* 徽章、标签、小按钮 */
  --radius-button: 12px;
  --radius-card: 16px;     /* 全站卡片统一 */
  --radius-hero: 24px;

  --shadow-card: 0 8px 28px rgba(55, 42, 25, 0.07);
  --shadow-hover: 0 12px 34px rgba(55, 42, 25, 0.11);
  /* 阴影必须轻、带暖色调，不用纯黑透明阴影，不用厚重浮层 */

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

  --container: 1180px;
}
```

### 2.3 字体

性能优先，**只引入一个 webfont**：

- 标题：`Plus Jakarta Sans`，只引 700 / 800 两个字重，`font-display: swap`，配合 `size-adjust` 或预加载防 CLS。
- 正文 / 数据 / UI：系统字体栈 `-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`。
- 数字（价格、数值、倒计时、表格数字列）：`font-variant-numeric: tabular-nums`。
- 禁用卡通/手写体。

字号阶梯（移动端基准）：

| 用途 | 字号 / 行高 |
|---|---|
| H1 | 32/40（桌面 40/48） |
| H2 | 24/32 |
| H3 | 19/28 |
| 正文 | 16/26（**移动端最小 16px**，不得更小） |
| 辅助/徽章/表格次要列 | 13–14/20 |
| 表格正文 | 14/22 |

---

## 3. 语义系统

### 3.1 验证徽章（全站最高优先级组件）

四态 = 颜色 + 图标 + 文字三者同时呈现，缺一不可（色盲友好，主方案 §9.4）：

| 状态 | 文案 | 色 | 图标建议 |
|---|---|---|---|
| Official | `Official` | 蓝 | ✓ 盾牌 |
| In-game verified | `In-game verified` | 绿 | ✓ 游戏手柄/相机 |
| Community reported | `Community reported` | 琥珀 | 💬/人形 |
| Unverified | `Unverified` | 灰 | ? |

- 文案固定为以上四种英文（与数据模型 `VerificationStatus` 一致），不要改写。
- 徽章旁必须可挂 `Last verified: Jul 30, 2026` 小字（组件 `LastVerified`）。
- 数据缺失字段显示 `Not publicly verified`，用 `--unverified` 灰，不留空白、不猜。

### 3.2 Rarity 色阶（仅用于 Crates/Toys 页）

灰(Common) → 绿⚠️ 改青(Uncommon) → 蓝(Rare) → 紫(Epic) → 金(Legendary)。

- **注意：Uncommon 不用绿色**（避免与验证绿冲突），用青色 `#3AA6B9`。
- 每个 rarity 徽章必须同时显示文字，不允许纯颜色块。

### 3.3 事件状态

`upcoming`（蜂蜜黄）/ `live`（验证绿 + "Live" 文字，不做闪烁）/ `ended`（灰）。

### 3.4 Code 状态

`active`（绿）/ `expired`（灰+删除线）/ `unverified`（灰）。每条带 `checkedAt` 日期。

---

## 4. 布局系统

- 内容最大宽度 1180px，居中；长文攻略正文列收窄到 720px 保证可读性。
- 断点：`≥1024px` 桌面 / `768–1023px` 平板 / `<768px` 手机。
- 桌面 Hero：左 7 右 5；平板与手机：上下堆叠（文案在上）。
- 移动端表格策略（**按页选型，不做通用切换**）：
  - Crates / Toys / Rebirths（列多）：容器横向滚动 + 首列 sticky，首列保持可读最小宽度。
  - Gamepasses 比较表（决策页、列少）：改为 key-value 卡片堆叠。

---

## 5. 组件规格（按开发优先级）

标注依据主方案 §9.3 组件清单收敛，共 14 个。【MVP】必做。

1. **SiteHeader**【MVP】：Logo（纯文字/自绘小图标，不用官方素材）+ 7 项导航 + 右侧蜂蜜黄 `Play on Roblox` 按钮。导航当前态用蜂蜜黄下划条。外链 `rel="noopener noreferrer"`。
2. **MobileNav**【MVP】：汉堡抽屉；`Rebirths & Workers` 可缩写 `Rebirths`（H1 保持完整）。抽屉展开无动画依赖也能开合。
3. **Hero**【MVP】：左——`Unofficial fan guide` 灰色小胶囊、H1（含 `Unbox ASMR ... Roblox`，SEO 消歧）、一句定位、双 CTA（主：`Start the Beginner Guide` 蜂蜜黄深字；次：`Play on Roblox` 描边）、`Last verified` 小字。右——16:9 真实游戏截图（WebP，固定宽高比防 CLS），图下小字标注版本与来源；可叠一张小 Current Event 卡。
4. **StatusCard**【MVP】：首页四张（Current event / Next event countdown / Codes status / Latest verification）。白卡 + 1px 暖边框 + 轻阴影 + 淡色方块图标。手机端横滑。
5. **GuideCard / TaskShortcutCard**【MVP】：首页 "What do you need help with?" 六卡，对应主方案 §4.2 的五类问题。整卡一个链接，不做卡内嵌套链接。
6. **VerificationBadge + LastVerified**【MVP】：见 §3.1。
7. **DataTable**【MVP】：表头 `--surface-soft` 底、行 hover 浅蜜色、空字段统一 `Not publicly verified` 灰字、数字列 tabular-nums 右对齐。桌面密度舒适、移动端按 §4 规则。
8. **FilterBar**【MVP】：关键词搜索 + crate/rarity/event 筛选（客户端 JS）。手机端可横滑、可点达 44px。URL query 保留筛选态【P1 延后】。
9. **EventCountdown**【MVP】：纯增强组件——JS 关闭时仍显示 ET/PT 原始时间；结束后不显示负数、自动切 `ended`。数字 tabular-nums。
10. **CodeStatus / InlineCallout**【MVP】：Codes 页"直接答案"callout（当前无 active code 时也要有用：给非代码奖励入口）。callout 用 `--surface-soft` 底 + 左侧 3px 强调条。
11. **SourceList + FooterDisclaimer**【MVP】：每页底部来源区；页脚固定非官方声明（文案用主方案 §15 原文）。
12. **Breadcrumbs + TableOfContents**【MVP】：攻略页页内目录，锚点直达 frog NPC / free workers / more crates 等小节。
13. **EmptyVerifiedState**【MVP】：数据不足页的统一空状态："Verification in progress" + 说明 + 指向已验证内容的链接。此类页面 `noindex`。
14. **EventBanner**【MVP 简化版】：**不做换肤 token 系统**。一张静态横幅 + 数据文件中的 `accentColor`（只允许 `--accent-purple` / `--accent-pink` 二选一）+ 活动名/时间/倒计时。活动结束换 JSON 即下架。不做霓虹、不做发光宝箱。

【P1 延后，本次不写】Collection Progress 进度勾选、Obtained/Missing 状态、图片网格/表格视图切换、Toy Card 图鉴网格（等第一批真实截图到位后再加）、多语言、深色模式。

---

## 6. 页面模板要点（样式层面）

1. **首页**：Hero → StatusCards → 六任务卡 → 新手四步路线（编号步骤条）→ Crates/Toys 摘要 → Rebirth/Workers 摘要 → Gamepass 摘要 → 最新更新 → FAQ → 来源+声明。一屏一个主 CTA，首屏只有蜂蜜黄一种强调色。
2. **Beginner Guide**：顶部"30 秒快速答案"callout；正文 720px 窄列 + 右侧/上方目录；步骤用有序编号卡片（步骤号用蜂蜜黄圆底深字）；每个"怎么做"配一张带编号箭头的截图。
3. **Crates & Toys**：FilterBar 置顶 sticky；两表 + 活动限定区；rarity 徽章按 §3.2；截图缩略图固定尺寸。
4. **Rebirths & Workers**："失去什么/保留什么"做成两栏对比卡（失=danger 细边框，留=verified 细边框）；表格 + 排查小节。
5. **Gamepasses**：比较表（移动端 key-value 卡）；推荐结论徽章（`Best overall` 等）样式=验证徽章同款但用蜂蜜黄；**禁止仿购买按钮**——只有一个中性 `View on Roblox` 描边链接；价格变化记录用小字时间线。
6. **Updates / Events**：状态横幅（upcoming/live/ended）+ 倒计时 + 本地时间切换；"已确认/未公布"分两栏卡；预告 vs 实装分栏。
7. **Codes**：直接答案 callout 置顶；active/expired 两表；"虚假代码提醒"用 `--reported-bg` 琥珀底 callout（不用 danger 红，避免惊恐感）。
8. **About / Sources**：朴素排版，来源优先级有序列表，免责声明完整可读（不藏小字）。

---

## 7. 动效规则

- 卡片 hover：上浮 2px + 阴影切换，150–180ms ease-out。
- 按钮按压：`transform: scale(0.98)` 上限。
- 允许：倒计时数字跳动、徽章 hover 提示、步骤条进度。
- 禁止：循环漂浮/掉落/闪烁动画、自动播放音频或视频、开箱动效、视差滚动。
- 全站 `@media (prefers-reduced-motion: reduce)` 关闭一切非必要动效。
- 页面不依赖任何动画也能完整使用（无 JS 时主要内容可读）。

## 8. 响应式与可访问性验收线

- 按钮/可点区域高 ≥ 44px；正文 ≥ 16px。
- 状态卡手机端横滑；表格按 §4 规则不溢出；无横向整页滚动条。
- 键盘可达：导航、筛选器、倒计时、目录全部可 Tab 到达，focus 态可见（2px `--official` 描边）。
- 徽章/状态不单独依赖颜色传达；图片全有描述性 alt（含 `Unbox ASMR Roblox` 语境，不堆砌）。
- 目标：Lighthouse Performance ≥ 90 / Accessibility ≥ 95 / SEO ≥ 95，无严重 CLS。

## 9. 性能预算

- 仅 1 个 webfont（2 字重），预加载；系统字体兜底。
- 截图统一 WebP/AVIF、压缩、固定宽高；首屏不加载视频（缩略图点击后加载）。
- 客户端 JS 只服务：筛选、倒计时、本地时区转换。其余静态生成。

## 10. MVP 验收清单（样式部分）

- [ ] 3 秒识别测试：首屏能看出是 Unbox ASMR（Roblox）专站，H1 含 Roblox。
- [ ] 首屏强调色 ≤ 1 种（蜂蜜黄）；同屏强调色 ≤ 2 种。
- [ ] 绿色只出现在"已验证"语义中。
- [ ] 四态验证徽章 = 颜色+图标+文字，全站统一。
- [ ] 所有动态数据旁有具体日期，无 "Updated recently/daily" 字样。
- [ ] 无仿购买按钮；所有外链 `rel="noopener noreferrer"` 且指向官方 Roblox。
- [ ] 页脚非官方声明完整；活动元素不出现在 Logo/品牌色中。
- [ ] 数据不足页使用 EmptyVerifiedState 且 noindex。
- [ ] `prefers-reduced-motion` 下无动效；无 JS 时内容可读。
- [ ] Lighthouse 三项达标；无 CLS；移动端无溢出。
