const CACHE='athletiq-v6-20261031-15';
const ASSETS=['./','./index.html','./icon.svg','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('athletiq-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Réseau d'abord, sans le cache HTTP du navigateur : la dernière version arrive tout de suite. Hors connexion : copie locale.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith(fetch(same?new Request(e.request,{cache:'no-cache'}):e.request).then(r=>{if(r.ok&&same){const clone=r.clone();caches.open(CACHE).then(c=>c.put(e.request,clone))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))
});
