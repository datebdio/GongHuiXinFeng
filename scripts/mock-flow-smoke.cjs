const path = require('path');
const out = process.argv[2];
const svc = require(path.join(out, 'services/mock-service.js'));
let state = svc.createInitialAppState();
if (state.grab.state !== 'WAITING') throw new Error('initial grab state');
for (const name of ['WAITING','OPEN','SOLD_OUT','FINISHED','CLAIMED']) {
  const next = svc.setGrabState(state.grab, name);
  if (next.state !== name) throw new Error(`state switch ${name}`);
  if (name === 'SOLD_OUT' && next.remainingSeats !== 0) throw new Error('sold out must have zero seats');
}
state.grab = svc.setGrabState(state.grab, 'OPEN');
if (!svc.canGrab(state.grab.state)) throw new Error('open should be grabbable');
state.grab = svc.setGrabState(state.grab, 'CLAIMED');
if (!state.grab.taskDeadline) throw new Error('claimed should create deadline');
const win = svc.settleQuiz([0,1,1], () => 0.9);
if (!win.passed || win.coinReward !== 10 || !win.redpackHit) throw new Error('reward win scenario');
state.user = svc.applySettlement({ ...state.user, authStatus: 'PENDING' }, win);
if (state.user.coins !== 270) throw new Error('coin apply');
if (svc.canRedeem('PENDING')) throw new Error('pending auth must not redeem');
if (!svc.canRedeem('VERIFIED')) throw new Error('verified auth should redeem');
const miss = svc.settleQuiz([0,1,1], () => 0.1);
if (miss.redpackHit || miss.redpackAmount !== 0) throw new Error('reward miss scenario');
const fail = svc.settleQuiz([3,3,3], () => 0.9);
if (fail.passed || fail.coinReward !== 0) throw new Error('failed quiz reward');
if (svc.levelForLifetimeCoins(999) !== '新锋骑士') throw new Error('level <1000');
if (svc.levelForLifetimeCoins(1000) !== '铜牌新锋骑士') throw new Error('level 1000');
console.log('mock flow smoke passed: five grab states -> quiz -> win/miss reward -> auth gate -> level');
