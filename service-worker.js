const CACHE_NAME = 'superluis-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js'
];

// Install
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null)))
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  const url = new URL(req.url);

  // App shell cache-first
  if(APP_SHELL.some(p=>url.pathname.endsWith(p.replace('./','/')) || url.pathname === '/')){
    e.respondWith(
      caches.match(req).then(cached=> cached || fetch(req).then(res=>{
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c=>c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // Otros: network-first con fallback a cache
  e.respondWith(
    fetch(req).then(res=>{
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c=>c.put(req, copy));
      return res;
    }).catch(()=>caches.match(req))
  );
});