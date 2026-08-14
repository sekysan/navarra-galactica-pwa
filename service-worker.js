const CACHE_NAME = 'navarra-galactica-v2';
const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/images/camping_urobi.jpg'
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

  // Navigation requests: network-first, fallback to cache (offline page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Other requests: cache-first, update cache in background
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(resp => {
          if (resp && resp.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone()));
          }
          return resp.clone();
        })
        .catch(() => null);
      return cached || networkFetch;
    })
  );
});
