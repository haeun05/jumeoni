// 주머니 서비스 워커 — 정적 자산 캐시로 오프라인·재방문을 빠르게
const CACHE = 'jumeoni-v3';
const CORE = [
  './theme.css',
  './',
  './index.html',
  './si.html',
  './chaek.html',
  './post.html',
  './map.html',
  './pocket.html',
  './lib/qrcode.min.js',
  './lib/lz-string.min.js',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // HTML 문서는 네트워크 우선 (배포 후 낡은 화면 방지), 실패 시 캐시
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // 같은 출처 정적 자산은 캐시 우선
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  }
  // 외부(폰트·지도 타일)는 그대로 네트워크에 맡긴다
});
