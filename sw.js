/* =========================================================================
   WindyCity Trip 2026 — Service Worker
   Même logique que whova-contacts-esker-chicago :
   - une seule constante VERSION pilote tous les caches
   - réseau d'abord avec une patience de 1200 ms, puis bascule sur le cache
   - pas de skipWaiting automatique : la page propose « Recharger »
   ========================================================================= */

const VERSION  = '2026-08-30a';
const SHELL    = 'cx-shell-'  + VERSION;   // fichiers du site
const VENDOR   = 'cx-vendor-' + VERSION;   // Tailwind, Font Awesome, Google Fonts, images
const PATIENCE = 1200;                      // ms avant de servir le cache

/* Le shell : tout ce qui doit fonctionner hors ligne dès la première visite. */
const SHELL_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/apple-touch-icon-180.png'
];

/* ---------------------------------------------------------------- INSTALL */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // addAll échoue en bloc si une seule URL tombe : on tolère les absences.
    await Promise.all(SHELL_URLS.map(async (url) => {
      try { await cache.add(new Request(url, { cache: 'reload' })); }
      catch (e) { /* fichier absent ou hors ligne : on continue */ }
    }));
  })());
});

/* --------------------------------------------------------------- ACTIVATE */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k.startsWith('cx-') && k !== SHELL && k !== VENDOR)
          .map((k) => caches.delete(k))
    );
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.disable(); } catch (e) {}
    }
    await self.clients.claim();
  })());
});

/* ---------------------------------------------------------------- MESSAGE */
self.addEventListener('message', (event) => {
  if (event.data === 'cx-skip-waiting') self.skipWaiting();
  if (event.data === 'cx-version') {
    event.source && event.source.postMessage({ type: 'cx-version', version: VERSION });
  }
});

/* ------------------------------------------------------------------ UTILS */
function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('slow')), ms));
}

async function networkThenCache(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await Promise.race([fetch(request), timeout(PATIENCE)]);
    if (fresh && (fresh.status === 200 || fresh.type === 'opaque')) {
      cache.put(request, fresh.clone()).catch(() => {});
    }
    return fresh;
  } catch (e) {
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    if (fallbackUrl) {
      const fb = await cache.match(fallbackUrl, { ignoreSearch: true });
      if (fb) return fb;
    }
    // Dernière chance : la requête réseau sans limite de temps.
    return fetch(request);
  }
}

async function cacheThenNetwork(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) {
    // Rafraîchissement silencieux en arrière-plan.
    fetch(request).then((fresh) => {
      if (fresh && (fresh.status === 200 || fresh.type === 'opaque')) {
        cache.put(request, fresh.clone()).catch(() => {});
      }
    }).catch(() => {});
    return hit;
  }
  const fresh = await fetch(request);
  if (fresh && (fresh.status === 200 || fresh.type === 'opaque')) {
    cache.put(request, fresh.clone()).catch(() => {});
  }
  return fresh;
}

/* ------------------------------------------------------------------ FETCH */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // On ne touche pas aux tuiles Google Maps ni aux appels d'itinéraire.
  if (/google\.[a-z.]+$/.test(url.hostname) && url.pathname.indexOf('/maps') === 0) return;

  // 1. Navigation (ouverture de l'app) : réseau d'abord, cache si ça traîne.
  if (req.mode === 'navigate') {
    event.respondWith(networkThenCache(req, SHELL, './index.html'));
    return;
  }

  // 2. Même origine : le shell et les icônes.
  if (url.origin === self.location.origin) {
    event.respondWith(networkThenCache(req, SHELL, null));
    return;
  }

  // 3. CDN et images distantes : cache d'abord, c'est immuable.
  event.respondWith(cacheThenNetwork(req, VENDOR));
});
