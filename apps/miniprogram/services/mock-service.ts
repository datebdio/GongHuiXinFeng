import { INITIAL_GRAB, INITIAL_USER, PRODUCTS, QUESTIONS } from '../mock/data';
import type { AuthStatus, GrabSession, GrabState, Product, QuizSettlement, UserProfile } from '../mock/types';

export interface AppState {
  user: UserProfile;
  grab: GrabSession;
  latestSettlement?: QuizSettlement;
  selectedProductId?: string;
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createInitialAppState(): AppState {
  return { user: clone(INITIAL_USER), grab: clone(INITIAL_GRAB) };
}

export function levelForLifetimeCoins(total: number): string {
  if (total >= 10000) return '王牌新锋骑士';
  if (total >= 6000) return '金牌新锋骑士';
  if (total >= 3000) return '银牌新锋骑士';
  if (total >= 1000) return '铜牌新锋骑士';
  return '新锋骑士';
}

export function setGrabState(session: GrabSession, state: GrabState): GrabSession {
  const next = clone(session);
  next.state = state;
  if (state === 'SOLD_OUT') next.remainingSeats = 0;
  if (state === 'OPEN' && next.remainingSeats === 0) next.remainingSeats = 32;
  if (state === 'CLAIMED') {
    next.remainingSeats = Math.max(0, next.remainingSeats - 1);
    next.taskDeadline = Date.now() + 3 * 60 * 1000;
  } else {
    delete next.taskDeadline;
  }
  return next;
}

export function canGrab(state: GrabState): boolean {
  return state === 'OPEN';
}

export function scoreQuiz(answers: number[]): Omit<QuizSettlement, 'coinReward' | 'redpackHit' | 'redpackAmount'> {
  const correctCount = QUESTIONS.reduce((count, question, index) => count + (answers[index] === question.correctIndex ? 1 : 0), 0);
  const total = QUESTIONS.length;
  const accuracy = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  return { correctCount, total, accuracy, passed: correctCount >= 2 };
}

export function settleQuiz(answers: number[], random: () => number = Math.random): QuizSettlement {
  const scored = scoreQuiz(answers);
  if (!scored.passed) return { ...scored, coinReward: 0, redpackHit: false, redpackAmount: 0 };
  const redpackHit = random() >= 0.55;
  const redpackAmount = redpackHit ? Number((0.3 + random() * 4.7).toFixed(2)) : 0;
  return { ...scored, coinReward: 10, redpackHit, redpackAmount };
}

export function applySettlement(user: UserProfile, settlement: QuizSettlement): UserProfile {
  if (!settlement.passed) return clone(user);
  const next = clone(user);
  next.coins += settlement.coinReward;
  next.lifetimeCoins += settlement.coinReward;
  next.redpackBalance = Number((next.redpackBalance + settlement.redpackAmount).toFixed(2));
  next.streakDays += 1;
  next.level = levelForLifetimeCoins(next.lifetimeCoins);
  return next;
}

export function canRedeem(authStatus: AuthStatus): boolean {
  return authStatus === 'VERIFIED';
}

export function productById(id?: string): Product {
  return PRODUCTS.find((item) => item.id === id) || PRODUCTS[0];
}
