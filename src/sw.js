/* eslint-disable */
// Custom service worker for LocalBites Admin PWA.
// Layers Web Push handling on top of Angular's ngsw-worker.js so we get
// caching/asset behavior AND background notifications.

importScripts('./ngsw-worker.js');

self.addEventListener('push', (event) => {
  const data = (() => {
    try {
      return event.data ? event.data.json() : {};
    } catch (e) {
      return { title: 'New Order', body: event.data ? event.data.text() : '' };
    }
  })();

  const title = data.title || 'New Order';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-72x72.png',
    tag: data.tag || 'new-order',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: data.url || '/orders',
      orderId: data.orderId,
    },
  };

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      const focused = wins.some((w) => w.focused);
      if (focused) {
        return;
      }
      return self.registration.showNotification(title, options);
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/orders';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((wins) => {
        const scope = self.registration.scope;
        const existing = wins.find((w) => w.url.startsWith(scope));
        if (existing) {
          existing.focus();
          if ('navigate' in existing) {
            existing.navigate(targetUrl).catch(() => {});
          }
          return;
        }
        return self.clients.openWindow(targetUrl);
      })
  );
});
