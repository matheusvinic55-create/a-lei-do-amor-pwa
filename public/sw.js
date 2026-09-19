const CACHE_NAME = "a-lei-do-amor-v28-quiz";
const CORE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/app-icon.svg",
  "/home-hero-background.webp",
  "/soundtrack-cast.webp",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/cast/ana-luiza-leitao.jpg",
  "/cast/tiago-leitao.jpg",
  "/cast/isabela-dias.jpg",
  "/cast/pedro-guedes-leitao.jpg",
  "/cast/heloisa-martins.jpg",
  "/cast/magnolia-costa-leitao.jpg",
  "/cast/sebastiao-bezerra-tiao.jpg",
  "/cast/salete.jpg",
  "/cast/jessica.jpg",
  "/cast/vitoria-costa-leitao.jpg",
  "/cast/luciane-leitao.jpg",
  "/cast/elio-bataglia.jpg",
  "/cast/antonio-ferrari.jpg",
  "/cast/flavia-cardoso.jpg",
  "/cast/camila-costa-leitao.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match("/")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    }),
  );
});
