import type { AppOption } from '../../app';

function format(seconds: number): string {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

Page({
  data: {
    source: 'grab',
    progress: 0,
    completed: false,
    playing: false,
    taskTime: '03:00',
  },
  progressTimer: 0 as any,
  deadlineTimer: 0 as any,
  onLoad(query: any) {
    this.setData({ source: query?.source || 'grab' });
    this.refreshDeadline();
    this.deadlineTimer = setInterval(() => this.refreshDeadline(), 1000);
  },
  onUnload() { this.stopTimers(); },
  stopTimers() {
    if (this.progressTimer) clearInterval(this.progressTimer);
    if (this.deadlineTimer) clearInterval(this.deadlineTimer);
  },
  refreshDeadline() {
    if (this.data.source !== 'grab') return;
    const app = getApp<AppOption>();
    const deadline = app.globalData.grab.taskDeadline || Date.now() + 180000;
    this.setData({ taskTime: format(Math.ceil((deadline - Date.now()) / 1000)) });
  },
  simulatePlay() {
    if (this.data.completed) return;
    if (this.data.playing) {
      if (this.progressTimer) clearInterval(this.progressTimer);
      this.progressTimer = 0;
      this.setData({ playing: false });
      return;
    }
    this.setData({ playing: true });
    this.progressTimer = setInterval(() => {
      const next = Math.min(100, this.data.progress + 10);
      this.setData({ progress: next, completed: next >= 100, playing: next < 100 });
      if (next >= 100 && this.progressTimer) {
        clearInterval(this.progressTimer);
        this.progressTimer = 0;
      }
    }, 220);
  },
  finishNow() {
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.progressTimer = 0;
    this.setData({ progress: 100, completed: true, playing: false });
  },
  goQuiz() {
    if (!this.data.completed) {
      wx.showToast({ title: '请先完成学习内容', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/quiz/index' });
  },
});
