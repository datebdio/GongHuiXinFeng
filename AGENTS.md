# AGENTS.md

## 项目目标
开发“工惠新锋”微信小程序及管理后台。核心闭环：抢单 → 学习 → 答题 → 打卡 → 金币/红包 → 成长 → 商城兑换。

## Codex 工作规则
1. 开始任何任务前，先读 `docs/PRODUCT.md`、`docs/BUSINESS_RULES.md`、`docs/DECISIONS.md`，再按任务需要读其他文档。
2. `docs/DECISIONS.md` 中状态为 `OPEN` 的事项不得自行猜测；涉及该事项的实现必须停留在可替换接口/Mock 层。
3. 业务规则以 `BUSINESS_RULES.md` 的 BR 编号为准；不得从自然语言需求自行扩展规则。
4. 页面与交互以 `PAGE_SPEC.md` 的 P 编号为准。
5. 数据结构以 `DATA_MODEL.md` 为准；涉及金币、红包、库存、核销必须保留可审计流水，不得只维护余额字段。
6. 每次只完成 `docs/TASKS.md` 中一个任务。禁止顺手重构或扩展任务范围。
7. 每个任务必须同时提交：实现、必要测试、README/文档更新（若行为变化）。
8. 未接入真实微信能力前统一使用 Provider + Mock；不得把支付、红包、模板消息、对象存储写死到业务层。
9. 抢单、库存、金币扣减、核销等关键写操作必须具备幂等与并发保护。
10. 不输出大段重复说明；优先引用 BR/P/DM/T 编号，减少上下文和 Token。
11. UI 原型阶段不得提前实现真实 API、数据库、微信支付、现金红包或公众号抓取。
12. UI 原型优先保证用户路径完整、状态清晰、移动端可读；所有数据来自 `mock/`，后续替换 API 时页面结构尽量不改。

## 推荐仓库结构
```text
apps/
  miniprogram/   # 微信原生小程序 + TypeScript
  admin/         # Vue 3 + Vben Admin
  api/           # NestJS
packages/
  shared/
docs/
```

## 当前开发门禁
- PRD：`FROZEN v1.0`。
- 当前阶段：`MOCK_UI_PROTOTYPE`。
- P0 决策已全部确认；P1 决策仍为 OPEN，不得自行固化成真实后端规则。
- 当前允许执行：T101~T109。
- 当前禁止进入：T2xx 及之后的正式后端/真实第三方能力，除非任务状态明确切换。
