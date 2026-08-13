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
