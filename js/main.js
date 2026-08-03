/* ============================================================
   Work With Jahan — landing page JS
   ============================================================ */
(function () {
  'use strict';

  /* ---------- SUN LOGO (faithful recreation of the Aethon sun) ----------
     Used only as a fallback when assets/logo.png is not present. */
  function buildSunLogo() {
    const cx = 100, cy = 100, N = 8, inner = 46, tip = 98;
    let s = '';
    // 8 sharp cream spikes (cardinal + diagonal)
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2, w = 0.055;
      const x0 = cx + Math.cos(a - w) * inner, y0 = cy + Math.sin(a - w) * inner;
      const x1 = cx + Math.cos(a) * tip, y1 = cy + Math.sin(a) * tip;
      const x2 = cx + Math.cos(a + w) * inner, y2 = cy + Math.sin(a + w) * inner;
      s += `<polygon points="${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="#f4e2cd" stroke="#17110a" stroke-width="1.3" stroke-linejoin="round"/>`;
    }
    // 8 wavy orange flames between the spikes
    for (let i = 0; i < N; i++) {
      const a = ((i + 0.5) / N) * Math.PI * 2 - Math.PI / 2;
      const r1 = inner + 2, r2 = 78;
      const bx = cx + Math.cos(a) * r1, by = cy + Math.sin(a) * r1;
      const ex = cx + Math.cos(a) * r2, ey = cy + Math.sin(a) * r2;
      const perp = a + Math.PI / 2, curl = 16;
      const c1x = bx + Math.cos(perp) * 8 + Math.cos(a) * 24, c1y = by + Math.sin(perp) * 8 + Math.sin(a) * 24;
      const c2x = ex + Math.cos(perp) * curl, c2y = ey + Math.sin(perp) * curl;
      s += `<path d="M${bx.toFixed(1)},${by.toFixed(1)} C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="#cf5a1e" stroke-width="6.5" stroke-linecap="round"/>`;
    }
    // gothic quatrefoil (4 ogee lobes) — black fill, cream outline, on burnt-orange disc
    const lobe = 'M100,100 C82,93 82,72 100,59 C118,72 118,93 100,100 Z';
    const petals = [0, 90, 180, 270].map(function (d) {
      return `<path d="${lobe}" transform="rotate(${d} 100 100)" fill="#0d0906" stroke="#f4e2cd" stroke-width="3.4" stroke-linejoin="round"/>`;
    }).join('');
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Aethon Intelligence sun logo">
      ${s}
      <circle cx="100" cy="100" r="45" fill="#c8551f" stroke="#17110a" stroke-width="2.6"/>
      ${petals}
    </svg>`;
  }

  // Prefer the real logo file (assets/logo.png). Fall back to the SVG if it is missing.
  (function () {
    const box = document.getElementById('brandLogo');
    const img = document.getElementById('logoImg');
    if (!box) return;
    function useSvg() { box.innerHTML = buildSunLogo(); }
    if (img) {
      img.addEventListener('error', useSvg);
      if (img.complete && img.naturalWidth === 0) useSvg();
    } else { useSvg(); }
  })();

  /* ---------- YEAR ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- VSL play ---------- */
  (function () {
    const box = document.getElementById('vsl');
    const video = document.getElementById('vslVideo');
    const btn = document.getElementById('vslPlay');
    if (!box || !video) return;
    function start() { box.classList.add('playing'); video.setAttribute('controls', ''); video.play().catch(function () {}); }
    if (btn) btn.addEventListener('click', start);
    video.addEventListener('play', function () { box.classList.add('playing'); video.setAttribute('controls', ''); });
  })();

  /* ---------- FAQ accordion ---------- */
  (function () {
    const items = document.querySelectorAll('.faq-item');
    function openItem(item) {
      const a = item.querySelector('.faq-a');
      item.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
      a.style.maxHeight = (a.firstElementChild.scrollHeight + 4) + 'px';
    }
    function closeItem(item) {
      item.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      item.querySelector('.faq-a').style.maxHeight = '0px';
    }
    items.forEach(function (item) {
      item.querySelector('.faq-q').addEventListener('click', function () {
        const open = item.querySelector('.faq-q').getAttribute('aria-expanded') === 'true';
        items.forEach(closeItem);
        if (!open) openItem(item);
      });
    });
    window.addEventListener('resize', function () {
      items.forEach(function (item) { if (item.querySelector('.faq-q').getAttribute('aria-expanded') === 'true') openItem(item); });
    });
  })();

})();
