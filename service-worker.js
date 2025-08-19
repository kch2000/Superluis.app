// service-worker.js
const CACHE = 'superluis-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE) && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  // Estrategia: cache-first para assets, network-first para lo demás
  if (ASSETS.some(p => request.url.includes(p))) {
    e.respondWith(
      caches.match(request).then(r => r || fetch(request))
    );
  } else {
    e.respondWith(
      fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(request, clone)).catch(()=>{});
        return res;
      }).catch(() => caches.match(request))
    );
  }
});