
const CACHE_NAME = 'mookka-v2';

// Ressources à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/b0bb1f66-b362-4d55-8a5e-5dede4e852e7.png',
  '/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png',
  '/lovable-uploads/59160824-2c34-4d40-82c6-d9f9f5b4d1f3.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Force activation immédiate
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('Service Worker: Clearing old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Prendre le contrôle immédiatement
  self.clients.claim();
});

// Stratégie de cache : Cache First avec fallback sur le réseau
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes sans GET
  if (event.request.method !== 'GET') return;
  
  // Ignorer les requêtes API
  if (event.request.url.includes('/functions/v1/') || 
      event.request.url.includes('/auth/v1/') ||
      event.request.url.includes('/rest/v1/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si trouvé dans le cache, retourner le fichier
        if (response) {
          return response;
        }
        
        // Sinon, chercher sur le réseau
        return fetch(event.request)
          .then((networkResponse) => {
            // Ne pas mettre en cache les réponses non-réussies
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Mettre en cache la nouvelle ressource
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return networkResponse;
          });
      })
      .catch(() => {
        // Si la ressource n'est pas dans le cache et qu'on est hors ligne,
        // on retourne une page d'erreur personnalisée pour les routes de l'application
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Not Found', { status: 404 });
      })
  );
});

// Précharger les ressources importantes en arrière-plan
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE') {
    const urls = event.data.urls;
    if (Array.isArray(urls) && urls.length > 0) {
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urls);
      });
    }
  }
});
