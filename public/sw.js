
const CACHE_NAME = 'mookka-v1';

// Ressources à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/b0bb1f66-b362-4d55-8a5e-5dede4e852e7.png',
  '/lovable-uploads/72025526-1809-42a2-b072-b398f21bffca.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Stratégie de cache : Network First avec fallback sur le cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Si la ressource n'est pas dans le cache et qu'on est hors ligne,
            // on retourne une page d'erreur personnalisée pour les routes de l'application
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Not Found', { status: 404 });
          });
      })
  );
});
