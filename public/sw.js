const CACHE_NAME = 'devcommons-v3';
const urlsToCache = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event - cache static setup safely
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.log('SW install error:', err))
  );
  self.skipWaiting();
});

// Activate event - instantly clean up ALL old caches (v1, v2) and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Purging old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event — FAQAT statik assetlarni keshlaymiz.
// HTML hujjatlar va RSC javoblarni HECH QACHON keshlamaymiz: ular
// foydalanuvchiga xos bo'lishi mumkin (/profile, /saved) va umumiy brauzer
// keshiga tushib qolmasligi kerak; RSC/HTML bir xil URL'da to'qnashadi.
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and valid HTTP schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const req = event.request;
  const url = new URL(req.url);

  // Faqat shu origin va faqat statik asset destination'lar keshlanadi.
  const isStaticAsset =
    url.origin === self.location.origin &&
    ['style', 'script', 'image', 'font'].includes(req.destination);

  if (!isStaticAsset) {
    // Hujjatlar, RSC, API, navigatsiyalar — to'g'ridan-to'g'ri tarmoqqa, keshsiz.
    return;
  }

  // Statik asetlar uchun Network-First (offline'da keshdan).
  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(req))
  );
});
