// Same-origin, static-only offline cache. No user financial data is intercepted or cached.
const CACHE='my-budget-static-v2';
const ASSETS=['./','./index.html','./guide.html','./privacy.html','./manifest.webmanifest','./assets/app.js','./assets/finance.js','./assets/advanced.js','./assets/i18n.js','./assets/i18n-v2.js','./assets/style.css','./assets/advanced.css','./assets/pages.css','./assets/pages.js','./assets/icon.svg'];
self.addEventListener('install', event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('my-budget-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}return res;}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
 }else if(new URL(req.url).pathname.startsWith(new URL(self.registration.scope).pathname)){
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}return res;})));
 }
});
