import { applySettlement } from '../../services/mock-service';
import type { AppOption } from '../../app';

Page({
  data: {
    settlement: null as any,
    claimed: false,
  },
  onLoad() {
    const app = getApp<AppOption>();
    const fallback = { correctCount: 3, total: 3, accuracy: 100, passed: true, coinReward: 10, redpackHit: true, redpackAmount: 0.8 };
    this.setData({ settlement: app.globalData.latestSettlement || fallback });
  },
  claim() {
    if (this.data.claimed) return;
    if (!this.data.settlement.passed) {
      wx.redirectTo({ url: '/pages/quiz/index' });
      return;
    }
    const app = getApp<AppOption>();
    app.globalData.user = applySettlement(app.globalData.user, this.data.settlement);
    this.setData({ claimed: true });
    wx.showToast({ title: '打卡成功', icon: 'success', duration: 800 });
    setTimeout(() => wx.reLaunch({ url: '/pages/home/index' }), 650);
  },
});
