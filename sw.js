const CACHE_NAME = 'thyroguide-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// התקנת ה-Service Worker ושמירת הקבצים בזיכרון
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// הפעלת האפליקציה מהזיכרון כשאין אינטרנט או כדי להאיץ טעינה
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // מחזיר את הקובץ מהזיכרון אם קיים, אחרת מוריד מהרשת
        return response || fetch(event.request);
      })
  );
});

// ניקוי גרסאות ישנות של הזיכרון בעת עדכון האפליקציה
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});