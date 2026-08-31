import { PRODUCTS } from '../../mock/data';
import type { Product } from '../../mock/types';
import type { AppOption } from '../../app';

Page({
  data: {
    user: null as any,
    categories: ['全部', '本地福利', '骑行装备', '通信权益', '工会服务'],
    activeCategory: '全部',
    products: PRODUCTS as Product[],
  },
  onShow() {
    const app = getApp<AppOption>();
    this.setData({ user: app.globalData.user });
  },
  chooseCategory(e: any) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category,
      products: category === '全部' ? PRODUCTS : PRODUCTS.filter((item) => item.category === category),
    });
  },
  openProduct(e: any) {
    const id = e.currentTarget.dataset.id;
    const app = getApp<AppOption>();
    app.globalData.selectedProductId = id;
    wx.navigateTo({ url: `/pages/product/index?id=${id}` });
  },
});
