
// Service Worker pour Mookka
const CACHE_NAME = 'mookka-cache-v1';
const DYNAMIC_CACHE = 'mookka-dynamic-cache-v1';

// Ressources à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Nettoyage des anciennes caches lors de l'activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME && name !== DYNAMIC_CACHE;
        }).map((name) => {
          console.log('Suppression de l\'ancienne cache', name);
          return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ne pas mettre en cache les requêtes API (Supabase)
  if (url.pathname.includes('/supabase/') || 
      url.hostname.includes('supabase') || 
      url.pathname.includes('/auth/') ||
      url.pathname.includes('/rest/')) {
    return;
  }
  
  // Pour les requêtes de navigation HTML, toujours aller au réseau et mettre à jour le cache
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Mettre en cache la dernière version
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // Si hors ligne, essayer de servir depuis le cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Pour les ressources statiques, stratégie "stale-while-revalidate"
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Même si on a une réponse en cache, on lance une requête réseau pour actualiser le cache
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Mettre la nouvelle réponse en cache
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Si la requête réseau échoue, on ne fait rien ici
          console.log('Échec de la requête réseau pour', event.request.url);
        });
      
      // Renvoyer la réponse en cache si elle existe, sinon attendre la réponse réseau
      return cachedResponse || fetchPromise;
    })
  );
});

// Écouter les messages
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
