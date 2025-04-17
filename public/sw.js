
const CACHE_NAME = 'mookka-cache-v1';

// Liste des ressources à mettre en cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/b0bb1f66-b362-4d55-8a5e-5dede4e852e7.png',
  '/placeholder.svg',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_RESOURCES);
      })
  );
});

// Stratégie de mise en cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Stratégie réseau d'abord, puis cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache la réponse si c'est une requête GET réussie
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si le réseau échoue, essayer de récupérer depuis le cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Pour les navigations, renvoyer la page d'accueil
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            return new Response('Ressource non disponible hors ligne', { 
              status: 503, 
              statusText: 'Service Unavailable' 
            });
          });
      })
  );
});

// Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
