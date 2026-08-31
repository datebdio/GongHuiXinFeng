import type { GrabSession, Product, Question, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  nickname: '骑手小锋',
  riderNo: 'XF20260831',
  riderType: '外卖骑手',
  authStatus: 'UNSUBMITTED',
  level: '新锋骑士',
  coins: 260,
  lifetimeCoins: 260,
  redpackBalance: 0.8,
  streakDays: 3,
};

export const INITIAL_GRAB: GrabSession = {
  state: 'WAITING',
  slot: '14:00 - 14:30',
  remainingSeats: 32,
  totalSeats: 50,
  countdownSeconds: 8 * 60 + 26,
};

export const POLICY_NEWS = [
  '骑手暖“新”服务站本周新增 2 处休息点',
  '职工互助保障政策更新，符合条件可在线咨询',
];

export const RANKING = [
  { rank: 1, name: '陈**杰', level: '银牌新锋骑士', score: '00:42' },
  { rank: 2, name: '李**航', level: '铜牌新锋骑士', score: '00:47' },
  { rank: 3, name: '王**', level: '新锋骑士', score: '00:51' },
];

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: '遇到劳动权益问题时，优先可以向哪个组织寻求帮助？',
    options: ['工会组织', '只在群聊里吐槽', '忽略问题', '随意发布个人信息'],
    correctIndex: 0,
  },
  {
    id: 'q2',
    title: '“工惠新锋”学习任务的核心特点是什么？',
    options: ['时间很长', '碎片化、轻量化', '必须线下完成', '只能工作日参加'],
    correctIndex: 1,
  },
  {
    id: 'q3',
    title: '金币在本平台中的正确用途是？',
    options: ['直接提现', '兑换商品或服务', '转给陌生人', '兑换成红包余额'],
    correctIndex: 1,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'meal-01',
    name: '暖心工作餐兑换券',
    category: '本地福利',
    iconText: '餐',
    iconClass: 'meal',
    coinPrice: 300,
    stock: 26,
    summary: '合作商家到店核销，补充一顿热饭。',
    rule: '兑换后 7 天内有效；到店出示兑换码核销。',
    priceType: 'COIN',
  },
  {
    id: 'rain-01',
    name: '骑行防雨装备',
    category: '骑行装备',
    iconText: '骑',
    iconClass: 'ride',
    coinPrice: 680,
    stock: 12,
    summary: '轻便雨衣 + 防水鞋套组合装。',
    rule: '库存有限；兑换后请按通知到指定驿站领取。',
    priceType: 'COIN',
  },
  {
    id: 'data-01',
    name: '10 元话费权益',
    category: '通信权益',
    iconText: '话',
    iconClass: 'data',
    coinPrice: 500,
    stock: 40,
    summary: '用于日常通讯补贴，具体到账规则以运营配置为准。',
    rule: '原型阶段仅展示商品结构，不触发真实充值。',
    priceType: 'COIN',
  },
  {
    id: 'legal-01',
    name: '工会法律咨询服务',
    category: '工会服务',
    iconText: '法',
    iconClass: 'service',
    coinPrice: 200,
    stock: 99,
    summary: '面向劳动权益相关问题的一次预约咨询。',
    rule: '兑换后由工作人员联系确认时间。',
    priceType: 'COIN',
  },
  {
    id: 'battery-01',
    name: '便携充电宝抵扣权益',
    category: '骑行装备',
    iconText: '电',
    iconClass: 'power',
    coinPrice: 900,
    cashPrice: 19.9,
    stock: 8,
    summary: '金币 + 现金业务结构演示，首期真实支付暂不开启。',
    rule: '真实微信支付接入前仅用于 UI 展示。',
    priceType: 'COIN_CASH',
  },
];
