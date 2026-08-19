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

  // ---------- 하단 탭바 ----------
  // 방을 옮기려고 버튼을 찾아 누르고 푸터 링크를 뒤지던 걸 없앤다.
  const TABS = [
    { href: 'post.html',   icon: 'love',   label: '소개팅' },
    { href: 'map.html',    icon: 'pin',    label: '지도' },
    { href: 'si.html',     icon: 'scroll', label: '시' },
    { href: 'chaek.html',  icon: 'books',  label: '책' },
    { href: 'pocket.html', icon: 'pouch',  label: '나' }
  ];

  function here() {
    const f = location.pathname.split('/').pop() || 'index.html';
    return f === '' ? 'index.html' : f;
  }

  function mountTabs() {
    if (document.getElementById('tabbar')) return;
    const cur = here();
    const nav = document.createElement('nav');
    nav.id = 'tabbar';
    nav.innerHTML = TABS.map(t => `
      <a class="tab${t.href === cur ? ' on' : ''}" href="${t.href}">
        ${window.jIcon ? window.jIcon(t.icon, 'ic tab-ic') : ''}
        <span>${t.label}</span>
      </a>`).join('');
    document.body.appendChild(nav);
    document.documentElement.classList.add('has-tabbar');
  }

  // 탭바가 대신하는 안내들은 걷어낸다 — 같은 곳으로 가는 길이 둘일 필요는 없다
  function tidyNav() {
    const cur = here();
    document.querySelectorAll('button[onclick*="location.href="]').forEach(b => {
      const m = b.getAttribute('onclick').match(/location\.href\s*=\s*'([^']+\.html)'/);
      if (m && TABS.some(t => t.href === m[1]) && m[1] !== cur) b.remove();
    });
    document.querySelectorAll('footer').forEach(f => {
      const links = [...f.querySelectorAll('a')].filter(a => /\.html$/.test(a.getAttribute('href') || ''));
      if (!links.length) return;
      links.forEach(a => {
        // 링크 뒤에 남는 ' · ' 같은 찌꺼기까지 함께 지운다
        let sib = a.nextSibling;
        if (sib && sib.nodeType === 3 && /^[\s·]*$/.test(sib.nodeValue)) sib.remove();
        const prev = a.previousSibling;
        if (prev && prev.nodeType === 3 && /^[\s·]*$/.test(prev.nodeValue)) prev.remove();
        a.remove();
      });
      // 링크만 있던 줄의 <br>도 정리
      while (f.lastChild && (f.lastChild.nodeName === 'BR' ||
             (f.lastChild.nodeType === 3 && !f.lastChild.nodeValue.trim()))) f.lastChild.remove();
    });
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
    const views = [...document.querySelectorAll('[id^="view-"]')];
    // 지금 보이는 화면을 기억해 둔다. 등장 클래스를 붙이는 것 자체가
    // 다시 관찰되어 무한히 되풀이되는 걸 막기 위해서다.
    const shown = new WeakSet();
    views.forEach(v => { if (!v.classList.contains('hidden')) shown.add(v); });

    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const el = m.target;
          const visible = !el.classList.contains('hidden');
          const was = shown.has(el);
          if (visible && !was) { shown.add(el); enter(el); }
          else if (!visible && was) shown.delete(el);
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
    mountTabs();
    tidyNav();
    staggerAll();
    watch();
    // 첫 화면도 부드럽게
    const shown = [...document.querySelectorAll('[id^="view-"]')].find(v => !v.classList.contains('hidden'));
    if (shown) enter(shown);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
