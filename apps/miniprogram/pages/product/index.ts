import { canRedeem, productById } from '../../services/mock-service';
import type { AppOption } from '../../app';

Page({
  data: {
    product: null as any,
    user: null as any,
    redeemable: false,
  },
  onLoad(query: any) {
    const app = getApp<AppOption>();
    const product = productById(query?.id || app.globalData.selectedProductId);
    app.globalData.selectedProductId = product.id;
    this.setData({ product, user: app.globalData.user, redeemable: canRedeem(app.globalData.user.authStatus) && product.priceType === 'COIN' });
  },
  onShow() {
    const app = getApp<AppOption>();
    if (this.data.product) this.setData({ user: app.globalData.user, redeemable: canRedeem(app.globalData.user.authStatus) && this.data.product.priceType === 'COIN' });
  },
  redeem() {
    const { product, user } = this.data;
    if (user.authStatus !== 'VERIFIED') {
      wx.showModal({ title: '身份审核中', content: '按照已确认规则，审核通过后才开放商城兑换与现金类权益。', showCancel: false });
      return;
    }
    if (product.priceType === 'COIN_CASH') {
      wx.showModal({ title: '首期暂不开启', content: '金币 + 现金结构已保留，真实微信支付将在资质与对账方案确认后接入。', showCancel: false });
      return;
    }
    wx.showModal({ title: 'Mock 兑换确认', content: `正式版将扣除 ${product.coinPrice} 金币并生成唯一兑换码。当前原型不创建真实订单。`, confirmText: '知道了', showCancel: false });
  },
});
