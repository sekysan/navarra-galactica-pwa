<<<<<<< HEAD
const CACHE_NAME = 'navarra-galactica-v1';
const FILES = [
  'index.html',
  'styles.css',
  'manifest.json',
  'images/camping_urobi.jpg',
  'images/irati.jpg',
  'images/roncesvalles.jpg',
  'images/orbaizeta.jpg',
  'images/pamplona.jpg',
  'images/taconera.jpg',
  'images/roncal.jpg',
  'images/isaba.jpg',
  'images/galactica.jpg',
  'images/arcos.jpg',
  'images/albarracin.jpg'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)));
});

self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
=======
const CACHE_NAME = 'navarra-v2';
const PRECACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // For navigation requests, try network first then cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(resp => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone()));
        return resp;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other requests, cache-first with network update
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(resp => {
        if (resp && resp.status === 200) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone()));
        }
        return resp.clone();
      }).catch(()=>null);
      return cached || networkFetch;
    })
  );
});
>>>>>>> 568c7ea (Modern App UI)
