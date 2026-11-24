/* Shell-only offline fallback. No RPCs, tokens, role responses or gameplay cached. */
const CACHE='hazerha-shell-333',SHELL=['offline.html','identity332.css','brand-mark.svg','fonts/tajawal/regular.ttf','fonts/tajawal/bold.ttf','fonts/tajawal/black.ttf'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('hazerha-shell-')&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url),base=new URL(self.registration.scope);if(e.request.method!=='GET'||u.origin!==base.origin||!u.pathname.startsWith(base.pathname))return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.open(CACHE).then(c=>c.match(new URL('offline.html',base))).then(async r=>new Response((await r.text()).replace('<head>','<head><base href="'+base.href+'">'),{headers:{'Content-Type':'text/html; charset=utf-8'}}))));return}
const allowed=SHELL.map(p=>new URL(p,base).href);if(allowed.includes(u.href))e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
