const CACHE_NAME = 'jpviet-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/jlpt.html',
  '/vocab.html',
  '/grammar.html',
  '/flashcard.html',
  '/quiz.html',
  '/offline.html',
  '/demo-sidebar.html',
  '/demo-effects.html',
  '/create-audio.html',
  '/style.css',
  '/app.js',
  '/flashcard.js',
  '/quiz.js',
  '/pwa.js',
  '/sidebar.js',
  '/data/vocab.json',
  '/data/grammar.json',
  '/audio/hi.mp3',
  '/audio/mizu.mp3',
  '/audio/ひ.mp3',
  '/audio/ありがとう.mp3',
  '/audio/ひと.mp3',
  '/audio/おお.mp3',
  '/audio/ちい.mp3',
  '/audio/あたら.mp3',
  '/audio/ふる.mp3',
  '/audio/たか.mp3',
  '/audio/やす.mp3',
  '/audio/うつく.mp3',
  '/audio/しず.mp3',
  '/audio/さんせい.mp3',
  '/audio/反対.mp3',
  '/audio/けいざい.mp3',
  '/audio/せいじ.mp3'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync any offline data when connection is restored
  console.log('Background sync triggered');
}
