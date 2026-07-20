const CACHE_NAME = 'stracare-pwa-v1';

// Add the core files your app needs to load quickly
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/logo-app.png',
  '/assets/logo.png',
  '/assets/name.png',
  '/1000777295.png', // Splash screen
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://unpkg.com/lucide@latest',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Install Event - Caches the assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Cleans up old caches if you update CACHE_NAME
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network-first strategy with cache fallback
self.addEventListener('fetch', event => {
  // Skip cross-origin requests like Firebase API calls
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('unpkg') && !event.request.url.includes('cdnjs') && !event.request.url.includes('fonts')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If network request succeeds, clone and update cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If offline, return from cache
        return caches.match(event.request);
      })
  );
});
