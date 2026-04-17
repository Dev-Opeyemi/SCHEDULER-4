/* ============================================================
   PES Service Worker — sw.js
   Handles: caching, offline mode, push notifications,
   background sync for reminder loops.
   ============================================================ */

const CACHE_NAME = "pes-v1";
const ASSETS = [
  "./index.html",
  "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap",
];

/* ---- INSTALL: cache core assets ---- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

/* ---- ACTIVATE: clean old caches ---- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

/* ---- FETCH: serve from cache, fallback to network ---- */
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Cache successful responses for core assets
          if (response.ok && event.request.url.includes(self.location.origin)) {
            const clone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: return cached index.html for navigation
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    }),
  );
});

/* ---- PUSH NOTIFICATIONS ---- */
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "PES — Execute Now";
  const options = {
    body: data.body || "Check your execution system.",
    icon:
      data.icon ||
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
    badge:
      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
    tag: data.tag || "pes-notification",
    renotify: data.renotify || false,
    requireInteraction: data.requireInteraction || false,
    data: data.url ? { url: data.url } : {},
    actions: [
      { action: "start", title: "▶ Start Now" },
      { action: "snooze", title: "⏸ Snooze 10m" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/* ---- NOTIFICATION CLICK ---- */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "snooze") {
    // Tell the app to snooze this reminder
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => client.postMessage({ type: "SNOOZE" }));
      }),
    );
    return;
  }

  // Focus or open the app
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        if (clients.length > 0) {
          clients[0].focus();
          clients[0].postMessage({ type: "FOCUS_TASK" });
        } else {
          self.clients.openWindow("./index.html");
        }
      }),
  );
});

/* ---- BACKGROUND SYNC (reminder loop fallback) ---- */
self.addEventListener("sync", (event) => {
  if (event.tag === "pes-reminder") {
    event.waitUntil(
      self.registration.showNotification("PES — Still waiting", {
        body: "Your current task is not started. Execute now.",
        tag: "pes-reminder",
        renotify: true,
        requireInteraction: true,
      }),
    );
  }
});

/* ---- MESSAGE: receive instructions from app ---- */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, tag, requireInteraction } = event.data;
    self.registration.showNotification(title, {
      body,
      tag: tag || "pes-task",
      renotify: true,
      requireInteraction: requireInteraction || false,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
      actions: [
        { action: "start", title: "▶ Start Now" },
        { action: "snooze", title: "⏸ Snooze 10m" },
      ],
    });
  }

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
