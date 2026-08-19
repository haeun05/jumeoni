/* 주머니 아이콘 — 이모지 대신 손으로 그린 선 아이콘.
   본문 어디에 이모지가 있든(정적·동적 모두) 같은 결의 아이콘으로 바꿔 끼운다. */
(() => {
  'use strict';

  const P = {                                     // 24x24, 선 아이콘
    envelope:  '<path d="M3 7.2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9.6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3.6 7.8 12 13.6l8.4-5.8"/>',
    love:      '<path d="M3 7.2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9.6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 15.4s-3.1-2-3.1-4a1.8 1.8 0 0 1 3.1-1.2A1.8 1.8 0 0 1 15.1 11c0 2-3.1 4-3.1 4z"/>',
    mailbox:   '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6H4z"/><path d="M8 16v5"/><path d="M7.5 10h4"/>',
    postcard:  '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M14 9.5h4M14 13h3"/><path d="M6.5 15.5c1-2.6 3-2.6 4 0"/><circle cx="8.5" cy="10.5" r="1.4"/>',
    inbox:     '<path d="M4 13.5 6 5.6A1.6 1.6 0 0 1 7.6 4.4h8.8A1.6 1.6 0 0 1 18 5.6l2 7.9"/><path d="M4 13.5h4l1.2 2.4h5.6L16 13.5h4v4.3a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 17.8z"/>',
    scroll:    '<path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8.6 8.4h6.8M8.6 12h6.8M8.6 15.6h4"/>',
    book:      '<path d="M4.6 5.4A1.6 1.6 0 0 1 6.2 3.8H19v16.4H6.2a1.6 1.6 0 0 1-1.6-1.6z"/><path d="M8.4 3.8v16.4"/>',
    books:     '<rect x="4" y="6" width="4.4" height="14" rx="1"/><rect x="9.6" y="4" width="4.4" height="16" rx="1"/><path d="M16.2 7.4l3.6.9-2.6 10.4-3.6-.9z"/>',
    openbook:  '<path d="M12 7.2C10.4 5.8 8.2 5.2 5 5.4v12.4c3.2-.2 5.4.4 7 1.8 1.6-1.4 3.8-2 7-1.8V5.4c-3.2-.2-5.4.4-7 1.8z"/><path d="M12 7.2v11.4"/>',
    pin:       '<path d="M12 20.6s6.6-5.9 6.6-10.4a6.6 6.6 0 1 0-13.2 0C5.4 14.7 12 20.6 12 20.6z"/><circle cx="12" cy="10" r="2.4"/>',
    pouch:     '<path d="M5.6 9.4c0-2 1.4-3.2 3-3.7a12 12 0 0 1 6.8 0c1.6.5 3 1.7 3 3.7v4.4c0 3.8-2.9 6.4-6.4 6.4S5.6 17.6 5.6 13.8z"/><path d="M5.8 10.4c4 1.6 8.4 1.6 12.4 0"/><path d="M9.4 5.9V9M14.6 5.9V9"/>',
    pen:       '<path d="M4 19.6l1-3.6L15.3 5.7a1.8 1.8 0 0 1 2.6 0l1.4 1.4a1.8 1.8 0 0 1 0 2.6L9 20l-5 -.4z"/><path d="M14.2 6.9l2.9 2.9"/>',
    note:      '<path d="M5 4.8h9.4L19 9.4v9.8a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6V6.4A1.6 1.6 0 0 1 5 4.8z"/><path d="M14 4.8v4.8h5"/><path d="M7.4 13h8M7.4 16.4h5"/>',
    clip:      '<path d="M18.6 11.2 12 17.8a4 4 0 0 1-5.7-5.7l7.4-7.4a2.7 2.7 0 0 1 3.8 3.8l-7.3 7.3a1.3 1.3 0 0 1-1.9-1.9l6.6-6.6"/>',
    flag:      '<path d="M6 21V4.6"/><path d="M6 5.2h10.6l-1.9 3.4 1.9 3.4H6z"/>',
    lock:      '<rect x="4.8" y="10.4" width="14.4" height="9.4" rx="2.2"/><path d="M8.2 10.4V8a3.8 3.8 0 0 1 7.6 0v2.4"/>',
    dove:      '<path d="M20.4 4.6c-6.6-.4-12 3.4-13.4 9.6l-2.6 5.6 5.8-2.2c6.2-1.2 10.2-6.2 10.2-13z"/><path d="M8 14.4c2.8-1.4 5-3.6 6.4-6.4"/>',
    sprout:    '<path d="M12 20.4v-6.6"/><path d="M12 13.8C12 10.6 9.6 8.2 6.4 8.2c0 3.2 2.4 5.6 5.6 5.6z"/><path d="M12 13.8c0-3.6 2.6-6.2 6.2-6.2 0 3.6-2.6 6.2-6.2 6.2z"/>',
    search:    '<circle cx="10.8" cy="10.8" r="6.2"/><path d="M15.4 15.4 20 20"/>',
    keyboard:  '<rect x="3" y="6.4" width="18" height="11.2" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M17 10h.01M7 13.4h.01M9.6 13.4h6.8"/>',
    dice:      '<rect x="4.4" y="4.4" width="15.2" height="15.2" rx="3.2"/><path d="M9 9h.01M15 9h.01M12 12h.01M9 15h.01M15 15h.01"/>',
    star:      '<path d="M12 4.2l2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 10l5.4-.8z"/>',
    home:      '<path d="M4.4 10.4 12 4.2l7.6 6.2v8.2a1.6 1.6 0 0 1-1.6 1.6H6a1.6 1.6 0 0 1-1.6-1.6z"/><path d="M9.6 20.2v-6h4.8v6"/>'
  };

  // 어떤 이모지를 어떤 아이콘으로 바꿀지
  const MAP = {
    '💌': 'love', '✉️': 'envelope', '✉': 'envelope', '📮': 'mailbox', '📪': 'inbox',
    '📬': 'postcard', '📜': 'scroll', '📚': 'books', '📗': 'book', '📖': 'openbook',
    '🗺️': 'pin', '🗺': 'pin', '📍': 'pin', '🧺': 'pouch', '✍️': 'pen', '✍': 'pen',
    '📝': 'note', '📎': 'clip', '🚩': 'flag', '🔒': 'lock', '🕊️': 'dove', '🕊': 'dove',
    '🌱': 'sprout', '🔍': 'search', '⌨️': 'keyboard', '⌨': 'keyboard', '⚄': 'dice', '⭐': 'star'
  };

  function svg(name, cls = 'ic') {
    const d = P[name];
    if (!d) return '';
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  }
  window.jIcon = svg;

  const EMOJI = new RegExp('(' + Object.keys(MAP)
    .sort((a, b) => b.length - a.length)
    .map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');

  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SVG', 'CODE']);

  function swap(root) {
    if (!root || root.nodeType !== 1) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !EMOJI.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        EMOJI.lastIndex = 0;
        let p = n.parentElement;
        while (p) {
          if (SKIP.has(p.tagName) || p.classList?.contains('poem-text') ||
              p.classList?.contains('letter-body') || p.classList?.contains('bubble')) {
            return NodeFilter.FILTER_REJECT;   // 사람이 쓴 글은 건드리지 않는다
          }
          p = p.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const hits = [];
    while (walker.nextNode()) hits.push(walker.currentNode);
    hits.forEach(node => {
      const html = node.nodeValue.replace(EMOJI, m => svg(MAP[m]));
      if (html === node.nodeValue) return;
      const span = document.createElement('span');
      span.className = 'ic-wrap';
      span.innerHTML = html;
      node.parentNode.replaceChild(span, node);
    });
  }

  window.jSwapIcons = swap;

  function boot() {
    swap(document.body);
    new MutationObserver(ms => {
      for (const m of ms) m.addedNodes.forEach(n => { if (n.nodeType === 1) swap(n); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
