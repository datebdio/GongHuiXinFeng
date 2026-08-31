export type AuthStatus = 'UNSUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type RiderType = '外卖骑手' | '快递员';
export type GrabState = 'WAITING' | 'OPEN' | 'SOLD_OUT' | 'FINISHED' | 'CLAIMED';

export interface UserProfile {
  nickname: string;
  riderNo: string;
  riderType: RiderType;
  authStatus: AuthStatus;
  level: string;
  coins: number;
  lifetimeCoins: number;
  redpackBalance: number;
  streakDays: number;
}

export interface GrabSession {
  state: GrabState;
  slot: string;
  remainingSeats: number;
  totalSeats: number;
  countdownSeconds: number;
  taskDeadline?: number;
}

export interface Question {
  id: string;
  title: string;
  options: string[];
  correctIndex: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  iconText: string;
  iconClass: string;
  coinPrice: number;
  cashPrice?: number;
  stock: number;
  summary: string;
  rule: string;
  priceType: 'COIN' | 'COIN_CASH';
}

export interface QuizSettlement {
  correctCount: number;
  total: number;
  accuracy: number;
  passed: boolean;
  coinReward: number;
  redpackHit: boolean;
  redpackAmount: number;
}
