export const monthly = (amount, period = 'monthly') => Number(amount || 0) * ({weekly:52/12,biweekly:26/12,monthly:1,quarterly:1/3,yearly:1/12}[period] ?? 1);
export const sum = list => list.reduce((total, item) => total + monthly(item.amount, item.period), 0);
export function budget(data) {
  const income = sum(data.income), subscriptionCost = sum((data.subscriptions??[]).filter(s=>s.status==='active')), debtCost = (data.debts??[]).some(d=>d.balance>0)?(data.debts??[]).filter(d=>d.balance>0).reduce((n,d)=>n+d.minPayment,0)+(data.debtExtra??0):0, expenses = sum(data.expenses)+subscriptionCost+debtCost, allocated = data.goals.reduce((n,g)=>n+g.monthly,0);
  return {income,expenses,surplus:income-expenses,allocated,unallocated:income-expenses-allocated,rate:income ? (income-expenses)/income*100:0};
}
export function goalMonths(goal) {
  const gap=Math.max(0,goal.target-goal.saved);
  return gap===0?0:goal.monthly>0?Math.ceil(gap/goal.monthly):null;
}
export function monthsUntil(date, now = new Date()) {
  if (!date) return null;
  const d=new Date(date+'T12:00:00');
  return Math.max(0,(d.getFullYear()-now.getFullYear())*12+d.getMonth()-now.getMonth());
}
export function project({initial=0, contribution=0, years=5, annualReturn=0, inflation=0, fees=0}) {
  // Effective annual rates converted to monthly; end-of-month contributions.
  const net=(1+annualReturn/100)*(1-fees/100)-1;
  const rate=Math.pow(1+net,1/12)-1;
  let value=initial;
  const points=[{month:0,value,contributed:initial,real:initial}];
  for(let month=1;month<=years*12;month++) {
    value=value*(1+rate)+contribution;
    points.push({month,value,contributed:initial+contribution*month,real:value/Math.pow(1+inflation/100,month/12)});
  }
  return points;
}
export const periodKeys=['weekly','biweekly','monthly','quarterly','yearly'];
export const categoryKeys=['housing','food','transport','utilities','health','education','family','leisure','debt','tax','other'];
export const emptyState=()=>({version:1,lang:'en',currency:'USD',theme:'light',income:[],expenses:[],goals:[],transactions:[],annualPlans:[],subscriptions:[],debts:[],debtExtra:0,debtStrategy:'avalanche',caps:{},emergencyMonths:3,taxProfile:{country:'',year:new Date().getFullYear(),notes:'',documents:[]},initial:0,notes:'',projection:{years:5,annualReturn:0,inflation:0,fees:0},scenario:{income:0,expenses:0},savedAt:null});
const amount=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1e12;
const label=v=>typeof v==='string'&&v.length<=160;
const validDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export function validateState(s) {
 if(!s||s.version!==1||!['en','ar','fr','de'].includes(s.lang)||!['light','dark'].includes(s.theme)||!label(s.currency)||!/^[A-Z]{3}$/.test(s.currency))return false;
 try{new Intl.NumberFormat('en',{style:'currency',currency:s.currency});}catch{return false;}
 for(const key of ['income','expenses']){
   if(!Array.isArray(s[key])||s[key].length>300)return false;
   if(!s[key].every(i=>label(i.id)&&label(i.name)&&amount(i.amount)&&periodKeys.includes(i.period)&&(key==='income'||categoryKeys.includes(i.category))))return false;
 }
 if(!Array.isArray(s.goals)||s.goals.length>100||!s.goals.every(g=>label(g.id)&&label(g.name)&&amount(g.target)&&g.target>0&&amount(g.saved)&&amount(g.monthly)&&(!g.deadline||validDate(g.deadline))&&typeof g.notes==='string'&&g.notes.length<=3000))return false;
 if(!Array.isArray(s.transactions)||s.transactions.length>20000||!s.transactions.every(t=>label(t.id)&&label(t.name)&&amount(t.amount)&&['income','expense'].includes(t.type)&&validDate(t.date)&&categoryKeys.includes(t.category)))return false;
 if(!amount(s.initial)||typeof s.notes!=='string'||s.notes.length>5000)return false;
 const p=s.projection;
 if(!p||!Number.isInteger(p.years)||p.years<1||p.years>40||!Number.isFinite(p.annualReturn)||p.annualReturn< -50||p.annualReturn>50||!amount(p.inflation)||p.inflation>30||!amount(p.fees)||p.fees>20)return false;
 if(!s.scenario||!['income','expenses'].every(k=>Number.isFinite(s.scenario[k])&&Math.abs(s.scenario[k])<=1e12))return false;
 if(s.subscriptions!==undefined&&(!Array.isArray(s.subscriptions)||s.subscriptions.length>300||!s.subscriptions.every(x=>label(x.id)&&label(x.name)&&amount(x.amount)&&periodKeys.includes(x.period)&&categoryKeys.includes(x.category)&&['active','paused'].includes(x.status)&&(!x.renewal||validDate(x.renewal)))))return false;
 if(s.debts!==undefined&&(!Array.isArray(s.debts)||s.debts.length>100||!s.debts.every(d=>label(d.id)&&label(d.name)&&amount(d.balance)&&amount(d.minPayment)&&Number.isFinite(d.apr)&&d.apr>=0&&d.apr<=100)))return false;
 if(s.debtExtra!==undefined&&!amount(s.debtExtra))return false;
 if(s.debtStrategy!==undefined&&!['avalanche','snowball'].includes(s.debtStrategy))return false;
 if(s.emergencyMonths!==undefined&&(!Number.isInteger(s.emergencyMonths)||s.emergencyMonths<1||s.emergencyMonths>24))return false;
 if(s.caps!==undefined&&(s.caps===null||typeof s.caps!=='object'||Array.isArray(s.caps)||!Object.keys(s.caps).every(k=>categoryKeys.includes(k)&&amount(s.caps[k]))))return false;
 if(s.taxProfile!==undefined){const p=s.taxProfile;if(!p||typeof p!=='object'||typeof p.country!=='string'||p.country.length>80||!Number.isInteger(p.year)||p.year<1900||p.year>2200||typeof p.notes!=='string'||p.notes.length>5000||!Array.isArray(p.documents)||p.documents.length>100||!p.documents.every(d=>label(d.id)&&label(d.name)&&['pending','done'].includes(d.status)))return false;}
 if(s.annualPlans!==undefined&&(!Array.isArray(s.annualPlans)||s.annualPlans.length>300||!s.annualPlans.every(r=>label(r.id)&&label(r.name)&&validDate(r.deadline)&&['pending','done'].includes(r.status)&&typeof r.notes==='string'&&r.notes.length<=3000)))return false;
 const ids=[...(s.annualPlans??[]),...(s.subscriptions??[]),...(s.debts??[]),...(s.taxProfile?.documents??[]),...s.income,...s.expenses,...s.goals,...s.transactions].map(x=>x.id);
 return new Set(ids).size===ids.length;
}
