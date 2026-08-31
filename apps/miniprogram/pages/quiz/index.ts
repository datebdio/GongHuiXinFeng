import { QUESTIONS } from '../../mock/data';
import { settleQuiz } from '../../services/mock-service';
import type { AppOption } from '../../app';

Page({
  data: {
    questions: QUESTIONS,
    letters: ['A', 'B', 'C', 'D'],
    current: 0,
    answers: [] as number[],
    selected: -1,
    remaining: 45,
  },
  timer: 0 as any,
  onLoad() {
    this.timer = setInterval(() => {
      const next = this.data.remaining - 1;
      this.setData({ remaining: Math.max(0, next) });
      if (next <= 0) this.submitQuiz();
    }, 1000);
  },
  onUnload() { if (this.timer) clearInterval(this.timer); },
  choose(e: any) { this.setData({ selected: Number(e.currentTarget.dataset.index) }); },
  next() {
    if (this.data.selected < 0) {
      wx.showToast({ title: '请选择一个答案', icon: 'none' });
      return;
    }
    const answers = [...this.data.answers];
    answers[this.data.current] = this.data.selected;
    if (this.data.current >= this.data.questions.length - 1) {
      this.setData({ answers }, () => this.submitQuiz());
      return;
    }
    this.setData({ answers, current: this.data.current + 1, selected: answers[this.data.current + 1] ?? -1 });
  },
  submitQuiz() {
    if ((this as any).submitted) return;
    (this as any).submitted = true;
    if (this.timer) clearInterval(this.timer);
    const app = getApp<AppOption>();
    app.globalData.latestSettlement = settleQuiz(this.data.answers);
    wx.redirectTo({ url: '/pages/result/index' });
  },
});
