// service-worker.js

// Define el nombre de la caché
const CACHE_NAME = 'my-cache';

// Lista de recursos a cachear
const urlsToCache = [
  '/',
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  // Precargamos los recursos en la caché
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  // Limpiamos las cachés antiguas
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptamos las solicitudes y servimos desde la caché si está disponible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la respuesta se encuentra en la caché, la retornamos
        if (response) {
          return response;
        }
        // De lo contrario, hacemos la solicitud a la red
        return fetch(event.request);
      })
  );
});
