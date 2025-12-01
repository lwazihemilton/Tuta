// sw.js — TUTs 2025 Service Worker
const CACHE_NAME = 'tuts-v2025';
const CACHE_FILES = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/findtutor.html',
  '/book.html',
  '/confirmation.html',
  '/tutor-dashboard.html',
  '/editP.html',
  '/terms.html',
  '/map.html',
  '/leaderboard.html',
  '/video-call.html',
  '/admin.html',
  '/css/main.css',
  '/js/app.js',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Install & Cache Everything
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// Activate & Clean Old Caches
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
    })
  );
  self.clients.claim();
});

// Fetch from Cache First, Then Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Optional: Show offline fallback page
      return caches.match('/index.html');
    })
  );
});