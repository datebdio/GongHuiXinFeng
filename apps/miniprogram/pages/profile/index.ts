import type { AuthStatus } from '../../mock/types';
import type { AppOption } from '../../app';

Page({
  data: {
    user: null as any,
    menu: [
      { icon: '章', title: '新锋徽章与等级', subtitle: '查看成长与等级权益' },
      { icon: '币', title: '金币与红包明细', subtitle: '每笔奖励都有记录' },
      { icon: '卡', title: '我的打卡', subtitle: '连续打卡与学习历史' },
      { icon: '盟', title: '工会新锋联盟', subtitle: '高等级骑士的参与入口' },
      { icon: '讯', title: '消息通知', subtitle: '活动、审核与系统消息' },
      { icon: '?', title: '设置与帮助', subtitle: '联系工会、协议与反馈' },
    ],
  },
  onShow() { this.refresh(); },
  refresh() {
    const app = getApp<AppOption>();
    this.setData({ user: app.globalData.user });
  },
  setAuth(e: any) {
    const status = e.currentTarget.dataset.status as AuthStatus;
    const app = getApp<AppOption>();
    app.globalData.user.authStatus = status;
    this.refresh();
    wx.showToast({ title: status === 'VERIFIED' ? '演示：已认证' : '演示：审核中', icon: 'none' });
  },
  tapMenu(e: any) {
    const index = Number(e.currentTarget.dataset.index);
    wx.showToast({ title: `${this.data.menu[index].title} 将在完整用户端阶段接入`, icon: 'none' });
  },
});
