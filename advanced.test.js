import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyState,validateState,budget} from '../assets/finance.js';
import {activeSubscriptions,subscriptionMonthly,subscriptionYearly,debtPayoff,spendingAnalysis,emergencyPlan} from '../assets/advanced.js';
test('recurring subscriptions count only while active and are normalized',()=>{
 const s=emptyState();s.income=[{id:'i',name:'pay',amount:2000,period:'monthly'}];
 s.subscriptions=[{id:'a',name:'phone',amount:120,period:'yearly',category:'utilities',status:'active',renewal:''},{id:'b',name:'paused',amount:20,period:'monthly',category:'leisure',status:'paused',renewal:''}];
 assert.equal(activeSubscriptions(s).length,1);assert.equal(subscriptionMonthly(s),10);assert.equal(subscriptionYearly(s),120);assert.equal(budget(s).surplus,1990);assert.equal(validateState(s),true);
});
test('debts and extra payments are in planned expenses exactly once and zero balance is skipped',()=>{
 const s=emptyState();s.income=[{id:'1',name:'pay',amount:1000,period:'monthly'}];s.debts=[{id:'2',name:'card',balance:3000,minPayment:100,apr:12},{id:'3',name:'old',balance:0,minPayment:500,apr:10}];s.debtExtra=50;
 assert.equal(budget(s).expenses,150);assert.equal(budget(s).surplus,850);assert.equal(validateState(s),true);
});
test('debt payoff zero interest is exact, and higher payments repay faster',()=>{
 const d=[{balance:1200,apr:0,minPayment:100}];const a=debtPayoff(d,0),b=debtPayoff(d,100);
 assert.equal(a.months,12);assert.equal(a.interest,0);assert.equal(b.months,6);assert.equal(b.paid,1200);
});
test('unpayable debts are flagged, not shown as paid off',()=>{
 const d=[{balance:10000,apr:36,minPayment:100}];const r=debtPayoff(d,0);
 assert.equal(r.completed,false);assert.equal(r.months,null);assert.ok(r.remaining>0);
});
test('avalanche and snowball may differ but both pay off valid debts',()=>{
 const d=[{balance:8000,apr:23,minPayment:220},{balance:900,apr:2,minPayment:40}];
 const a=debtPayoff(d,100,'avalanche'),b=debtPayoff(d,100,'snowball');
 assert.ok(a.completed&&b.completed);assert.ok(a.interest<=b.interest+0.001);
});
test('emergency fund excludes goal earmarks',()=>{
 assert.deepEqual(emergencyPlan({expenses:1000,savings:5000,earmarked:3500,months:3}),{usable:1500,target:3000,shortfall:1500,coverage:1.5});
});
test('category analysis separates manually recorded expenses from planned commitments',()=>{
 const s=emptyState();s.expenses=[{id:'x',name:'food plan',amount:200,period:'monthly',category:'food'}];s.transactions=[{id:'y',name:'lunch',amount:25,category:'food',type:'expense',date:'2026-11-02'}];s.caps={food:300};const food=spendingAnalysis(s,'2026-11').find(x=>x.category==='food');assert.deepEqual(food,{category:'food',planned:200,actual:25,cap:300});
});
test('reject malformed advanced backup and duplicate ids across new collections',()=>{
 const s=emptyState();assert.equal(validateState(s),true);assert.equal(validateState({...s,debtStrategy:'scam'}),false);assert.equal(validateState({...s,emergencyMonths:2.1}),false);assert.equal(validateState({...s,caps:{food:-1}}),false);
 assert.equal(validateState({...s,taxProfile:{country:'DE',year:2026,notes:'',documents:[{id:'t',name:'payroll',status:'done'}]}}),true);
 assert.equal(validateState({...s,subscriptions:[{id:'x',name:'bad',status:'active',category:'other',amount:5,period:'monthly',renewal:'2026-02-30'}]}),false);
});
