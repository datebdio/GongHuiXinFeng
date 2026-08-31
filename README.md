# 工惠新锋（GongHuiXinFeng）

界首市总工会面向外卖骑手、快递员等新就业形态劳动者的微信小程序项目。

当前基线：**PRD FROZEN v1.0 / Phase 1 Mock UI Prototype**。

> 开发前请先阅读 `AGENTS.md` 与 `docs/`。业务规则与验收标准以仓库内稳定编号为准，不从原始需求附件自行扩展。

## 当前已实现

Phase 1 的 T101~T108 已实现：

- 微信原生小程序 + TypeScript 工程；
- TDesign Miniprogram `1.16.0` 依赖与品牌主题；
- 登录 / 协议确认；
- 骑手身份认证 Mock；
- 首页抢单五状态：`WAITING / OPEN / SOLD_OUT / FINISHED / CLAIMED`；
- 3 分钟抢单任务、1 分钟学习 Mock；
- 3 道单选题、通过线、金币必得 + 红包概率 Mock；
- 福利商城、商品详情、认证权限门禁；
- 个人中心、等级/金币/红包/打卡展示；
- 原型演示控制，可切换抢单状态与认证状态。

第一批演示路径：

`登录 → 认证 → 首页 → 抢单 → 学习 → 答题 → 结果/打卡 → 商城 → 商品详情 → 我的`

## 本地自动验收

项目根目录执行：

```bash
npm test
```

当前检查包含：

1. TypeScript typecheck；
2. 小程序页面/JSON/WXML 结构检查；
3. TDesign 版本与品牌色配置检查；
4. Mock 业务烟测：五种抢单状态 → 抢单 deadline → 答题 → 红包命中/未命中 → 金币结算 → 身份兑换门禁 → 等级计算。

## 微信开发者工具运行

1. 安装依赖：

```bash
cd apps/miniprogram
npm install
```

2. 用微信开发者工具打开**仓库根目录**，工具会读取 `project.config.json`。
3. 执行 **工具 → 构建 npm**，生成 `miniprogram_npm`。
4. 编译运行。当前 `appid` 为 `touristappid`，实际项目联调时替换为工会小程序 AppID。
5. 按 `docs/UI_PROTOTYPE.md` 的场景逐项验收。

> 沙盒已验证 TDesign 1.16.0 包内 `button/tag/progress` 组件文件存在；但沙盒没有微信开发者工具，因此 T109 的“开发者工具实际导入/真机视觉验收”仍保持未完成状态。

## 目录

```text
apps/miniprogram/      # Phase 1 微信小程序 Mock UI
  mock/                # 集中 Mock 数据
  services/            # 可测试的 Mock 业务服务
  pages/               # 第一批 9 个页面
  styles/              # 主题 Token / 公共样式
scripts/               # 自动验收脚本
docs/                  # PRD、业务规则、页面规格、决策、任务、验收
```
