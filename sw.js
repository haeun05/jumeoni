// 주머니 서비스 워커
// 배포 직후 새로고침 한 번이면 최신 화면이 보이도록:
//   - HTML 문서와 내가 작성한 CSS/JS는 네트워크 우선 (실패 시 캐시)
//   - 버전이 고정된 외부 라이브러리·아이콘만 캐시 우선
const CACHE = 'jumeoni-v5';
const CORE = [
  './',
  './index.html',
  './si.html',
  './chaek.html',
  './post.html',
  './map.html',
  './pocket.html',
  './theme.css',
  './ui.js',
  './lib/qrcode.min.js',
  './lib/lz-string.min.js',
  './manifest.webmanifest',
  './icon.svg'
];

// 내용이 바뀌지 않는 자산만 캐시 우선으로 다룬다
const IMMUTABLE = /\/(lib\/|icon\.svg|og-|manifest\.webmanifest)/;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // 일부 파일이 없어도 설치가 실패하지 않도록 개별 처리
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(req, fallback) {
  return fetch(req)
    .then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    })
    .catch(() => caches.match(req).then(r => r || (fallback ? caches.match(fallback) : undefined)));
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  if (e.request.mode === 'navigate') {
    e.respondWith(networkFirst(e.request, './index.html'));
    return;
  }

  if (url.origin !== location.origin) return;  // 폰트·지도 타일은 네트워크에 맡긴다

  if (IMMUTABLE.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
    return;
  }

  // 내가 작성한 CSS/JS — 항상 최신을 먼저
  e.respondWith(networkFirst(e.request));
});
