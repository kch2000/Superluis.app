
self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open('sl-v1').then(c=>c.addAll([
      './',
      './index.html',
      './manifest.json',
      './assets/audio/beep1.wav',
      './assets/audio/beep2.wav',
      './assets/audio/beep3.wav'
    ]))
  );
});
self.addEventListener('activate',e=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request))
  );
});
