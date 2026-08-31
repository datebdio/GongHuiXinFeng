# DATA_MODEL.md

状态：概念模型。正式编码时可由 Prisma schema 落地，但字段命名与关系不得破坏以下审计要求。

## DM-01 users
- id
- wechat_openid / unionid（按实际可用能力）
- nickname / avatar_url
- status
- created_at / updated_at

## DM-02 rider_profiles
- user_id
- rider_type: DELIVERY / COURIER
- newfeng_no
- certification_status: NOT_SUBMITTED / PENDING / APPROVED / REJECTED
- certification_submitted_at / approved_at
- current_level_id
- joined_union_alliance

## DM-03 certification_submissions
- id / user_id
- proof_type
- proof_file_url
- status
- reviewer_id
- review_reason
- reviewed_at
- created_at

保留历史提交，不覆盖旧材料。

## DM-04 learning_contents
- id
- type: VIDEO / AUDIO / ARTICLE
- title / cover_url / media_url / article_url
- duration_seconds
- category_id
- status: DRAFT / PENDING_REVIEW / PUBLISHED / OFFLINE
- default_coin_reward
- source_type
- created_by / reviewed_by

## DM-05 questions / question_options
question：content/category、题干、难度、正确选项、状态。  
question_options：选项文本与排序。

## DM-06 grab_events
- id / title
- start_at / end_at
- quota_total
- quota_available（真实实现可由 Redis 维护热状态，DB 保存权威/结算状态）
- daily_limit
- learning_content_id
- status
- reward_config_id

## DM-07 grab_records
- id / event_id / user_id
- status: CLAIMED / LEARNING / ANSWERING / COMPLETED / EXPIRED / CANCELLED
- claimed_at
- deadline_at
- completed_at
- idempotency_key

约束：同一活动、用户、有效抢单实例必须满足业务唯一性。

## DM-08 answer_sessions / answer_records
session：grab_record_id、开始/提交时间、总题数、正确数、得分。  
record：question_id、用户选项、是否正确、答题耗时。

## DM-09 checkins
- id / user_id / business_date
- source_type / source_id
- created_at

同一业务日期的重复奖励必须具备唯一约束/幂等键。

## DM-10 coin_accounts
- user_id
- available_balance
- frozen_balance
- lifetime_earned
- updated_at

`lifetime_earned` 用于等级，消费不降低等级进度。

## DM-11 coin_transactions
- id / user_id
- type: EARN / FREEZE / UNFREEZE / SPEND / EXPIRE / ADJUST
- amount
- balance_after
- source_type / source_id
- idempotency_key
- operator_id（人工调整时必填）
- reason
- created_at

金币变动必须先有流水再体现到账户状态，禁止只改余额。

## DM-12 redpack_accounts / redpack_transactions
与金币完全分账。真实资金通道通过 payment_provider_ref、external_trade_no 等字段关联外部系统。

## DM-13 levels
- id / code / name
- lifetime_coin_threshold
- badge_url
- benefits_json
- sort_order

等级名称以 D-LEVEL-001 为准，门槛后台可配置但调整需审计。

## DM-14 products
- id / merchant_id
- title / description / image_url
- price_type: COIN / COIN_CASH
- coin_price / cash_price
- stock_total / stock_available
- fulfillment_type
- redeem_valid_days
- status

## DM-15 redemption_orders
- id / order_no / user_id / product_id / merchant_id
- coin_amount / cash_amount
- status: PENDING / PAID / REDEEMED / EXPIRED / CANCELLED / REFUNDED
- redeem_code_hash
- expires_at
- created_at / redeemed_at

订单创建、扣币、库存扣减需保持一致性。

## DM-16 verification_records
- order_id
- merchant_id
- verifier_user_id
- verified_at
- verification_method
- device/ip audit info

同一订单只能成功核销一次。

## DM-17 merchants / merchant_users
商家主体、商家子账号、核销权限、状态。

## DM-18 announcements / notifications
公告、活动、系统消息；用户通知记录含 read_at、channel、delivery_status。

## DM-19 audit_logs
覆盖至少：认证审核、金币人工调整、红包资金操作、商品/库存调整、核销、管理员配置变更。

## DM-20 analytics_events
事件名、用户、页面、业务对象、时间、必要属性。不得记录不必要的敏感原文。

## 一致性原则
1. 金币、红包、库存、订单、核销均有独立流水/审计记录。
2. 关键外部调用使用 idempotency_key / external_trade_no 防重复。
3. 文件仅保存 URL/对象 key，敏感认证材料设置受控访问权限。
4. 删除内容优先软删除/下线，涉及资金与审核历史的数据不得物理删除。
