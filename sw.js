// 智能提词器 — Service Worker
// 提供离线缓存 & PWA 安装能力

const CACHE_NAME = 'teleprompter-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

// === 安装：预缓存核心资源 ===
self.addEventListener('install', (event) => {
  console.log('[SW] 安装中…');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 预缓存资源');
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('[SW] 部分资源缓存失败（正常，可能缺少图标）:', err.message);
      });
    })
  );
  // 立即激活，不等待旧 SW
  self.skipWaiting();
});

// === 激活：清理旧缓存 ===
self.addEventListener('activate', (event) => {
  console.log('[SW] 激活');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// === 请求拦截：缓存优先 + 网络兜底 ===
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求、chrome-extension、语音识别 API
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.protocol === 'chrome-extension:') return;
  // 语音识别不走缓存（Web Speech API 内部请求）
  if (url.pathname.includes('speech')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // 缓存命中 → 返回缓存，同时后台更新
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // 网络失败 → 返回缓存（如果有）
        return cached || new Response('离线模式 — 请连接网络后重试', { status: 503 });
      });

      return cached || fetchPromise;
    })
  );
});
