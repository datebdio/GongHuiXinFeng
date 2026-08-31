import type { RiderType } from '../../mock/types';
import type { AppOption } from '../../app';

Page({
  data: {
    riderType: '外卖骑手' as RiderType,
    proofType: '平台接单截图',
    uploaded: false,
    submitting: false,
  },
  chooseRider(e: any) {
    this.setData({ riderType: e.currentTarget.dataset.value });
  },
  chooseProof(e: any) {
    this.setData({ proofType: e.currentTarget.dataset.value, uploaded: false });
  },
  mockUpload() {
    this.setData({ uploaded: true });
    wx.showToast({ title: '已添加示例材料', icon: 'success' });
  },
  submit() {
    if (!this.data.uploaded) {
      wx.showToast({ title: '请先添加认证材料', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    const app = getApp<AppOption>();
    app.globalData.user.riderType = this.data.riderType;
    app.globalData.user.authStatus = 'PENDING';
    setTimeout(() => {
      this.setData({ submitting: false });
      wx.showToast({ title: '提交成功', icon: 'success', duration: 700 });
      setTimeout(() => wx.reLaunch({ url: '/pages/home/index' }), 500);
    }, 450);
  },
});
