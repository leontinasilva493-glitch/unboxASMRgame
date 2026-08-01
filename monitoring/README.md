# Unbox ASMR 游戏信息监测运维说明

本目录定义公开来源、证据批准载荷和监测操作边界。系统自动发现变化，但不自动确认游戏内部事实，也不自动合并、发布或部署网站内容。

## 当前官方来源

截至 2026-08-01，注册表固定以下 Roblox 公开资源：

| 来源 ID | 等级 | 公开资源 |
| --- | --- | --- |
| `roblox-place-universe` | A | Place `112233638491976` → Universe `10454554751` |
| `roblox-game-details` | A | Universe `10454554751` 的公开游戏详情 |
| `roblox-group-details` | A | ASMR Labs Group `1110056661` 的公开群组详情 |

配置文件为 [`sources.json`](sources.json)。公开 API 可以证明它直接返回的名称、描述、Creator、更新时间和公开指标，不能证明价格、玩法效果、解锁、重生结果或代码有效性。

不需要也不得配置 Roblox Cookie 或 Open Cloud API Key。官方 Discord、YouTube 或社交账号必须先人工确认归属，再作为 B 级来源加入；Wiki、攻略、视频或玩家讨论只能作为 C 级调查线索；D 级推算、解包和泄露内容不登记。

## 本地运行

首次运行：

```powershell
npm.cmd run monitor:dry-run
```

默认行为：

- 从 `monitoring/sources.json` 读取启用来源。
- 将成功标准化快照写入被 Git 忽略的 `.monitor-state/state/`。
- 将原始公开响应、运行摘要和审核 Markdown 写入被 Git 忽略的 `artifacts/monitoring/`。
- 首次运行只建立基线，不把所有字段误报为新增。
- 不访问 GitHub API，不创建 Issue，不修改站点 `data/*.json`。

指定隔离目录运行：

```powershell
node scripts/monitor/run.mjs --mode manual `
  --state-dir artifacts/monitoring/manual-state `
  --output-dir artifacts/monitoring/manual-run
```

只检查一个来源：

```powershell
node scripts/monitor/run.mjs --mode manual --source roblox-game-details
```

小时模式仅在 `data/events.json` 中已登记活动开始前 12 小时至开始后 24 小时运行：

```powershell
node scripts/monitor/run.mjs --mode hourly
```

## 输出

每次非跳过运行产生：

```text
artifacts/monitoring/run-<ISO时间>/
  raw/
    <source-id>.json
  reviews/
    <source-id>-<topic>.md
  run-summary.json
```

`run-summary.json` 中：

- `changes` 包含内容、调查、健康和趋势变化。
- `actionable` 排除普通趋势，只保留需要人工处理的变化。
- `failures` 记录来源、绝对检查时间和稳定错误分类。
- `reviews` 提供去重键、Issue 标题、正文、标签和本地文件路径。

失败响应不会覆盖最近成功快照。连续三次失败、解析结构损坏、累计计数异常回退或连续三次成功响应的在线人数为 0，会进入健康审核。

## GitHub 定时监测

工作流：`.github/workflows/game-information-monitor.yml`

- UTC `01:15`、`13:15` 执行常规检查，对应北京时间约 `09:15`、`21:15`。
- 每小时 `:17` 触发一次活动窗口检查；不在窗口时直接跳过。
- 支持 `workflow_dispatch` 手动运行和指定来源。
- 使用 `contents: write` 仅推进独立 `monitor-state` 分支，使用 `issues: write` 创建或更新审核 Issue。
- 原始响应和摘要作为 GitHub Artifact 保留 30 天。
- 同一 `source id + topic` 使用隐藏 marker 去重；后续变化追加到原 Issue。

主要标签：

- `monitor-change`
- `monitor-health`
- `parser-broken`
- `source-A`、`source-B`、`source-C`
- `needs-in-game-verification`
- `needs-triage`
- `evidence-approved`

监测脚本本地默认 dry-run。只有 GitHub 工作流显式传入 `--apply` 才写 Issue。

## 游戏内复核

涉及价格、按钮、解锁、奖励、代码、Gamepass 效果或重生时：

1. 在当前游戏版本中截图或录屏。
2. 保留能证明目标字段的完整 UI 上下文。
3. 裁剪用户名、聊天和无关个人信息。
4. 记录 `verifiedAt`、游戏版本或活动、来源和证据状态。
5. 在 Issue 中填写结构化 `Approved payload`。
6. 只有维护者确认后添加 `evidence-approved` 标签。

B 级预告不能写成已上线功能，C 级线索不能直接写成确定事实。

## 批准载荷

Schema：[`approved-payload.schema.json`](approved-payload.schema.json)

示例：

```json
{
  "issueNumber": 42,
  "sourceId": "roblox-game-details",
  "verifiedAt": "2026-08-01T12:00:00+08:00",
  "gameVersion": "Update 3",
  "evidence": [
    {
      "status": "in_game_verified",
      "verifiedAt": "2026-08-01T12:00:00+08:00",
      "screenshot": "/evidence/update-3/rebirth-confirmation.webp"
    }
  ],
  "operations": [
    {
      "file": "data/rebirths.json",
      "op": "add",
      "path": "/-",
      "value": {
        "slug": "rebirth-1",
        "evidence": []
      }
    }
  ]
}
```

本地验证载荷，不写文件：

```powershell
npm.cmd run monitor:promote -- --payload .\approved-payload.json
```

显式应用到当前工作树：

```powershell
npm.cmd run monitor:promote -- --payload .\approved-payload.json --expected-issue 42 --apply
```

脚本只接受允许的 `data/*.json`、`add` 和 `replace`；拒绝删除、越权路径、Issue 编号不一致、无效证据日期、未经游戏内验证的 Gamepass verdict，以及只有社区证据的 active code。

## 草稿 PR

工作流：`.github/workflows/promote-approved-monitoring.yml`

维护者手动提供 Issue 编号和批准载荷后，工作流会：

1. 从 GitHub API 精确检查 `evidence-approved` 标签。
2. 校验并应用结构化载荷。
3. 运行测试、lint、类型检查和生产 build。
4. 创建 `codex/monitor-issue-<编号>-<run id>` 候选分支。
5. 创建草稿 PR。

它不会自动合并、发布、解除 `noindex` 或改动批准载荷之外的文件。

## 新增来源

新增来源前必须：

1. 人工确认来源归属和等级。
2. 在 `sources.json` 填写唯一 ID、URL、频率、解析器、允许事实和影响页面。
3. 为解析器添加固定响应样本和失败测试。
4. 将稳定业务字段放入 `contentFields`，公开计数放入 `trendFields`。
5. 先本地建立基线并检查没有误报，再启用定时运行。

不要使用通用整页 HTML 哈希替代字段解析；广告、推荐模块或 DOM 顺序变化会制造噪声。

## 故障恢复

- `monitor-state` 不存在：下一次运行建立新基线，不把所有字段报成新增。
- `monitor-state` 推送失败：本次 Artifact 仍保留，工作流失败；修复权限后重新运行。
- `parser-broken`：保存原始 Artifact，更新固定样本和解析器测试；不要把空结果当成删除。
- 官方页面 `404`：创建高优先级健康 Issue；不要自动删除站内历史内容。
- `429`、超时、`5xx`：采集器指数退避，最多三次；连续三次运行失败才生成健康告警。
- 批准载荷校验失败：修正 Issue 中的结构化字段或证据，不绕过现有 `validate:data`。

## 完整验证

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run monitor:dry-run
npm.cmd run build
```

本地 build 成功只证明当前工作树可构建，不代表 GitHub Actions、Cloudflare 或公开域名已经发布新版本。
