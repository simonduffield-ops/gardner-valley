const CACHE_NAME = 'gardner-valley-v21';
const STATIC_CACHE = 'gardner-valley-static-v21';
const DYNAMIC_CACHE = 'gardner-valley-dynamic-v21';
const CDN_CACHE = 'gardner-valley-cdn-v21';

// Static assets that rarely change
const staticAssets = [
    '/gardner-valley/',
    '/gardner-valley/index.html',
    '/gardner-valley/app.js',
    '/gardner-valley/supabase-config.js',
    '/gardner-valley/api-service.js',
    '/gardner-valley/manifest.json',
];

// Large assets to cache separately
const largeAssets = [
    '/gardner-valley/gardner-valley-map.png',
];

// CDN resources with longer cache
const cdnAssets = [
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Install event - cache resources with better error handling
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Caching static assets');
                return cache.addAll(staticAssets).catch(err => {
                    console.error('Failed to cache static assets:', err);
                });
            }),
            // Cache CDN resources
            caches.open(CDN_CACHE).then(cache => {
                console.log('Caching CDN resources');
                return Promise.all(
                    cdnAssets.map(url =>
                        cache.add(url).catch(err => {
                            console.warn('Failed to cache CDN resource:', url, err);
                        })
                    )
                );
            }),
            // Cache large assets
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Caching large assets');
                return Promise.all(
                    largeAssets.map(url =>
                        cache.add(url).catch(err => {
                            console.warn('Failed to cache large asset:', url, err);
                        })
                    )
                );
            })
        ]).then(() => self.skipWaiting())
    );
});

// Optimized fetch strategy based on request type
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and chrome-extension requests
    if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
        return;
    }

    // Strategy 1: Cache first for CDN resources (they don't change often)
    if (url.origin !== location.origin) {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) return cached;
                return fetch(request).then(response => {
                    if (response.ok) {
                        caches.open(CDN_CACHE).then(cache => {
                            cache.put(request, response.clone());
                        });
                    }
                    return response;
                }).catch(() => {
                    return new Response('Offline - resource not available', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
        );
        return;
    }

    // Strategy 2: Network first with cache fallback for app files
    if (request.url.includes('/gardner-valley/')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Only cache successful responses
                    if (response.ok) {
                        const cacheName = request.url.includes('.png') ? DYNAMIC_CACHE : STATIC_CACHE;
                        caches.open(cacheName).then(cache => {
                            cache.put(request, response.clone());
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed, try all caches
                    return caches.match(request).then(response => {
                        if (response) {
                            console.log('Serving from cache (offline):', request.url);
                            return response;
                        }
                        return new Response('Offline - content not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
                })
        );
    }
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', event => {
    const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, CDN_CACHE, CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim()) // Take control of all pages immediately
    );
});

// Handle cache size limits - prevent cache from growing too large
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        // Delete oldest items
        const itemsToDelete = keys.slice(0, keys.length - maxItems);
        await Promise.all(itemsToDelete.map(key => cache.delete(key)));
    }
}

// Periodic cache maintenance
self.addEventListener('message', event => {
    if (event.data === 'TRIM_CACHES') {
        event.waitUntil(
            Promise.all([
                trimCache(DYNAMIC_CACHE, 50),
                trimCache(STATIC_CACHE, 20),
                trimCache(CDN_CACHE, 10)
            ])
        );
    }
});
