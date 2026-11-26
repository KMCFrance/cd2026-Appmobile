const CACHE_NAME = 'cd2026-v28';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install — cache core assets + force activate immediately
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean ALL old caches + take control immediately
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', e => {
  // Skip non-GET requests
  if (e.request.method !== 'GET') return;
  // Always go network-first for Firebase data
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('firebasedatabase.app')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Fichiers du site : on revalide auprès de GitHub à chaque fois (pas d'attente des 10 min de cache),
  // les autres (polices…) suivent le cache normal du navigateur
  const memeSite = new URL(e.request.url).origin === self.location.origin;
  e.respondWith(
    fetch(e.request, memeSite ? { cache: 'no-cache' } : undefined)
      .then(resp => {
        // Réponse en erreur (404/5xx pendant un déploiement…) : on garde la copie en cache si elle existe
        if (!resp.ok) return caches.match(e.request, { ignoreSearch: true }).then(c => c || resp);
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return resp;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
