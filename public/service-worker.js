
// Service Worker pour Mookka
// Version générée dynamiquement à chaque build
const CACHE_VERSION = 'mookka-v' + new Date().getTime();
const RUNTIME = 'runtime';

// Resources à mettre en cache dès l'installation
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_VERSION, RUNTIME];
  
  // Nettoyer les anciens caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache "Network first, fallback to cache"
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non GET
  if (event.request.method !== 'GET') return;
  
  // Ignorer les requêtes d'API Supabase
  if (event.request.url.includes('supabase.co')) return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone la réponse pour la mettre en cache
        const responseToCache = response.clone();
        
        // Mettre en cache la nouvelle réponse
        caches.open(RUNTIME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        // Si offline, essayer de servir depuis le cache
        return caches.match(event.request);
      })
  );
});

// Écoute des messages de l'application
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
