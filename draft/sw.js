const CACHE_NAME = 'stracare-pwa-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    'https://stracares.in/assets/logo-app.png',
    'https://stracares.in/assets/logo-header.png'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch Event (Network falling back to cache)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
