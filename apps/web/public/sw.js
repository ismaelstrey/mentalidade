// Service worker da aplicação Mentalidade (suporte offline/PWA).
const CACHE_NAME = "mentalidade-v1";

// Arquivos essenciais pré-cacheados durante a instalação.
const PRECACHE_URLS = ["/", "/index.html", "/manifest.webmanifest", "/icons/icon.jpg"];

// Pré-cacheia os arquivos essenciais e ativa o novo service worker imediatamente.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// Remove versões antigas do cache ao ativar.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

// Intercepta as requisições: rede primeiro na navegação e cache primeiro nos recursos estáticos.
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Apenas requisições do tipo GET são tratadas.
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Ignora chamadas à API e recursos de outras origens.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api")) {
    return;
  }

  // Navegação: tenta a rede e recorre ao cache quando offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(() => caches.match("/index.html")),
    );
    return;
  }

  // Demais recursos: serve do cache e atualiza em segundo plano.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
