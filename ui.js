/* 주머니 공용 UI — 테마 전환과 움직임.
   페이지마다 화면을 .hidden 토글과 innerHTML로 갈아끼우기 때문에,
   DOM 변화를 지켜보다가 등장 애니메이션을 붙여준다. */
(() => {
  'use strict';

  // ---------- 테마 ----------
  const KEY = 'jumeoni_theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  function current() {
    const attr = root.getAttribute('data-theme');
    if (attr) return attr;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function paintMeta(mode) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = mode === 'dark' ? '#101219' : '#fbfaf7';
  }

  function apply(mode) {
    root.setAttribute('data-theme', mode);
    localStorage.setItem(KEY, mode);
    paintMeta(mode);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = mode === 'dark' ? '☾' : '☀';
      btn.title = mode === 'dark' ? '밝은 모드로' : '밤 모드로';
    }
    document.dispatchEvent(new CustomEvent('jumeoni:theme', { detail: { mode } }));
  }

  function mountToggle() {
    if (document.getElementById('theme-toggle')) return;
    const btn = document.createElement('div');
    btn.id = 'theme-toggle';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', '밝기 바꾸기');
    btn.onclick = () => apply(current() === 'dark' ? 'light' : 'dark');
    document.body.appendChild(btn);
    apply(current());
  }

  // ---------- 움직임 ----------
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 목록의 자식마다 순번을 매겨 차례로 등장시킨다
  const STAGGER = ['.doors', '#shelf', '#ongoing', '#mail-list', '#thread', '#book-picks',
                   '#list-given', '#list-drawer', '#list-map', '#list-likes',
                   '#list-blocked', '#list-journeys', '.rules'];

  function stagger(el) {
    if (!el || REDUCED) return;
    el.classList.add('stagger');
    [...el.children].forEach((c, i) => c.style.setProperty('--i', Math.min(i, 12)));
  }

  function staggerAll(scope = document) {
    STAGGER.forEach(sel => scope.querySelectorAll(sel).forEach(stagger));
  }

  // 숨어 있던 화면이 나타나면 올라오는 느낌을 준다
  function enter(el) {
    if (REDUCED) return;
    el.classList.remove('view-enter');
    void el.offsetWidth;          // 애니메이션 재시작
    el.classList.add('view-enter');
    staggerAll(el);
  }

  function watch() {
    const views = document.querySelectorAll('[id^="view-"], section[id]');
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const el = m.target;
          if (el.matches('[id^="view-"]') && !el.classList.contains('hidden')) enter(el);
        }
        if (m.type === 'childList' && m.addedNodes.length) {
          const t = m.target;
          if (t.nodeType === 1 && STAGGER.some(s => t.matches?.(s))) stagger(t);
        }
      }
    });
    views.forEach(v => mo.observe(v, { attributes: true, attributeFilter: ['class'] }));
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function boot() {
    mountToggle();
    staggerAll();
    watch();
    // 첫 화면도 부드럽게
    const shown = [...document.querySelectorAll('[id^="view-"]')].find(v => !v.classList.contains('hidden'));
    if (shown) enter(shown);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
