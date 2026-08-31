import { POLICY_NEWS, RANKING } from '../../mock/data';
import type { GrabState } from '../../mock/types';
import { canGrab, setGrabState } from '../../services/mock-service';
import type { AppOption } from '../../app';

const STATE_META: Record<GrabState, { label: string; action: string; hint: string; tone: string }> = {
  WAITING: { label: '未开始', action: '等待开抢', hint: '到点自动开放，提前准备好就行', tone: 'waiting' },
  OPEN: { label: '进行中', action: '立即抢单', hint: '手慢无，抢到后 3 分钟内完成学习与答题', tone: 'open' },
  SOLD_OUT: { label: '已抢完', action: '本场已抢完', hint: '下一场还有机会，记得提前回来', tone: 'sold' },
  FINISHED: { label: '已结束', action: '本场已结束', hint: '今日其它时段仍可参与', tone: 'finished' },
  CLAIMED: { label: '已抢到', action: '继续学习任务', hint: '已为你保留名额，请在 3 分钟内完成', tone: 'claimed' },
};

function formatTime(seconds: number): string {
  const safe = Math.max(0, seconds);
  const m = String(Math.floor(safe / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return `${m}:${s}`;
}

Page({
  data: {
    user: null as any,
    grab: null as any,
    stateMeta: STATE_META.WAITING,
    countdownText: '00:00',
    policy: POLICY_NEWS[0],
    ranking: RANKING,
    demoStates: [
      { key: 'WAITING', label: '未开始' },
      { key: 'OPEN', label: '可抢' },
      { key: 'SOLD_OUT', label: '抢完' },
      { key: 'FINISHED', label: '结束' },
      { key: 'CLAIMED', label: '已抢' },
    ],
  },
  timer: 0 as any,
  onShow() {
    this.refresh();
    this.startTimer();
  },
  onHide() { this.stopTimer(); },
  onUnload() { this.stopTimer(); },
  refresh() {
    const app = getApp<AppOption>();
    const grab = app.globalData.grab;
    this.setData({
      user: app.globalData.user,
      grab,
      stateMeta: STATE_META[grab.state],
      countdownText: formatTime(grab.countdownSeconds),
    });
  },
  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      const app = getApp<AppOption>();
      if (app.globalData.grab.state === 'WAITING' && app.globalData.grab.countdownSeconds > 0) {
        app.globalData.grab.countdownSeconds -= 1;
        this.setData({ countdownText: formatTime(app.globalData.grab.countdownSeconds) });
      }
    }, 1000);
  },
  stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = 0;
  },
  switchDemoState(e: any) {
    const state = e.currentTarget.dataset.state as GrabState;
    const app = getApp<AppOption>();
    app.globalData.grab = setGrabState(app.globalData.grab, state);
    if (state === 'WAITING') app.globalData.grab.countdownSeconds = 8 * 60 + 26;
    this.refresh();
  },
  grabNow() {
    const app = getApp<AppOption>();
    const state = app.globalData.grab.state;
    if (state === 'CLAIMED') {
      wx.navigateTo({ url: '/pages/learn-detail/index' });
      return;
    }
    if (!canGrab(state)) {
      wx.showToast({ title: STATE_META[state].hint, icon: 'none' });
      return;
    }
    app.globalData.grab = setGrabState(app.globalData.grab, 'CLAIMED');
    this.refresh();
    wx.showToast({ title: '抢单成功', icon: 'success', duration: 650 });
    setTimeout(() => wx.navigateTo({ url: '/pages/learn-detail/index' }), 450);
  },
  openLearn() { wx.navigateTo({ url: '/pages/learn-detail/index?source=daily' }); },
  openShop() { wx.switchTab({ url: '/pages/shop/index' }); },
});
