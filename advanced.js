import {monthly,sum,categoryKeys} from './finance.js';
export const activeSubscriptions=s=>(s.subscriptions??[]).filter(x=>x.status==='active');
export const subscriptionMonthly=s=>sum(activeSubscriptions(s));
export const subscriptionYearly=s=>subscriptionMonthly(s)*12;
export const debtMinimum=s=>(s.debts??[]).filter(d=>d.balance>0).reduce((n,d)=>n+d.minPayment,0);
export const debtMonthly=s=>(s.debts??[]).some(d=>d.balance>0)?debtMinimum(s)+(s.debtExtra??0):0;
export const plannedCategories=s=>{
 const map=Object.fromEntries(categoryKeys.map(c=>[c,0]));
 for(const e of s.expenses??[])map[e.category]+=monthly(e.amount,e.period);
 for(const x of activeSubscriptions(s))map[x.category]+=monthly(x.amount,x.period);
 map.debt+=debtMonthly(s);
 return map;
};
export function debtPayoff(debts,extra=0,strategy='avalanche',maxMonths=600){
 const active=debts.filter(x=>x.balance>0).map(x=>({...x,remaining:x.balance}));
 const original=active.reduce((n,d)=>n+d.balance,0);
 if(!active.length)return {months:0,interest:0,paid:0,remaining:0,schedule:[],completed:true};
 const payment=active.reduce((n,d)=>n+d.minPayment,0)+extra;
 if(payment<=0)return {months:null,interest:0,paid:0,remaining:original,schedule:[],completed:false};
 let interest=0,paid=0,month=0;
 const schedule=[];
 while(month<maxMonths&&active.some(d=>d.remaining>1e-7)){
  month++;
  const before=active.reduce((n,d)=>n+d.remaining,0);
  for(const d of active){if(d.remaining<=0)continue;const i=d.remaining*d.apr/1200;interest+=i;d.remaining+=i;}
  let left=payment;
  // Minimum payments first. Any freed or unused scheduled minimum is rolled into the target debt.
  for(const d of active){if(d.remaining<=0)continue;const p=Math.min(d.remaining,d.minPayment,left);d.remaining-=p;left-=p;paid+=p;}
  const ordered=active.slice().sort((a,b)=>strategy==='snowball'?a.remaining-b.remaining||b.apr-a.apr:b.apr-a.apr||a.remaining-b.remaining);
  for(const d of ordered){if(left<=0)break;const p=Math.min(d.remaining,left);d.remaining-=p;left-=p;paid+=p;}
  const remaining=active.reduce((n,d)=>n+Math.max(0,d.remaining),0);
  if(month===1||month%12===0||remaining<=1e-7)schedule.push({month,remaining,interest,paid});
  // The debt cannot shrink with this payment (or is growing). Stop promptly.
  if(remaining>=before-1e-7)break;
 }
 const remaining=active.reduce((n,d)=>n+Math.max(0,d.remaining),0);
 const completed=remaining<=1e-6;
 return {months:completed?month:null,interest,paid,remaining,completed,schedule};
}
export const emergencyPlan=({expenses,savings,earmarked=0,months=3})=>{
 const usable=Math.max(0,savings-earmarked),target=expenses*months;
 return {usable,target,shortfall:Math.max(0,target-usable),coverage:expenses>0?usable/expenses:null};
};
export function spendingAnalysis(s,month){
 const actual=Object.fromEntries(categoryKeys.map(c=>[c,0]));
 for(const entry of s.transactions??[]){if(entry.type==='expense'&&entry.date.startsWith(month))actual[entry.category]+=entry.amount;}
 const planned=plannedCategories(s);
 return categoryKeys.map(category=>({category,planned:planned[category],actual:actual[category],cap:(s.caps??{})[category]??0}));
}
