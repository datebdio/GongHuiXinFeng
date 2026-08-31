Page({
  data: {
    agreed: false,
  },
  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },
  login() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先阅读并同意协议', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/auth/index' });
  },
});
