/* ============================================================
   Work With Jahan — landing page JS
   ============================================================ */
(function () {
  'use strict';

  /* ---------- SUN LOGO (Aethon sun, quatrefoil center) ---------- */
  function buildSunLogo() {
    const cx = 100, cy = 100, spikes = 12, inner = 44, longTip = 96, shortTip = 78;
    let rays = '';
    // sharp triangular spikes
    for (let i = 0; i < spikes; i++) {
      const a = (i / spikes) * Math.PI * 2 - Math.PI / 2;
      const tip = i % 2 === 0 ? longTip : shortTip;
      const w = 0.13;
      const x0 = cx + Math.cos(a - w) * inner, y0 = cy + Math.sin(a - w) * inner;
      const x1 = cx + Math.cos(a) * tip, y1 = cy + Math.sin(a) * tip;
      const x2 = cx + Math.cos(a + w) * inner, y2 = cy + Math.sin(a + w) * inner;
      rays += `<polygon points="${x0.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="url(#rayGrad)" stroke="#241203" stroke-width="1.4" stroke-linejoin="round"/>`;
    }
    // wavy flame rays between spikes (cream)
    for (let i = 0; i < spikes; i++) {
      const a = ((i + 0.5) / spikes) * Math.PI * 2 - Math.PI / 2;
      const r1 = inner + 2, r2 = 72;
      const bx = cx + Math.cos(a) * r1, by = cy + Math.sin(a) * r1;
      const ex = cx + Math.cos(a) * r2, ey = cy + Math.sin(a) * r2;
      const perp = a + Math.PI / 2, curl = 14;
      const c1x = bx + Math.cos(perp) * 6 + Math.cos(a) * 22;
      const c1y = by + Math.sin(perp) * 6 + Math.sin(a) * 22;
      const c2x = ex + Math.cos(perp) * curl, c2y = ey + Math.sin(perp) * curl;
      rays += `<path d="M${bx.toFixed(1)},${by.toFixed(1)} C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="url(#flameGrad)" stroke-width="6" stroke-linecap="round"/>`;
    }
    // quatrefoil (four overlapping lobes)
    const pr = 20, off = 20;
    const petals = [[0, -off], [0, off], [-off, 0], [off, 0]]
      .map(function (p) { return `<circle cx="${cx + p[0]}" cy="${cy + p[1]}" r="${pr}" fill="#161210" stroke="#f6e9d6" stroke-width="3"/>`; }).join('');
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Aethon Intelligence sun logo">
      <defs>
        <linearGradient id="rayGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8871e"/><stop offset="1" stop-color="#a8410f"/></linearGradient>
        <linearGradient id="flameGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3cf"/><stop offset="1" stop-color="#e8871e"/></linearGradient>
        <radialGradient id="coreGrad" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#e0742a"/><stop offset="1" stop-color="#b8461a"/></radialGradient>
      </defs>
      ${rays}
      <g>
        <circle cx="100" cy="100" r="44" fill="url(#coreGrad)" stroke="#241203" stroke-width="2.5"/>
        ${petals}
      </g>
    </svg>`;
  }
  const lg = document.getElementById('brandLogo');
  if (lg) lg.innerHTML = buildSunLogo();

  /* ---------- YEAR ---------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- VSL play ---------- */
  (function () {
    const box = document.getElementById('vsl');
    const video = document.getElementById('vslVideo');
    const btn = document.getElementById('vslPlay');
    if (!box || !video) return;
    function start() {
      box.classList.add('playing');
      video.setAttribute('controls', '');
      video.play().catch(function () {});
    }
    if (btn) btn.addEventListener('click', start);
    video.addEventListener('play', function () { box.classList.add('playing'); video.setAttribute('controls', ''); });
  })();

  /* ---------- FAQ accordion ---------- */
  (function () {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      q.addEventListener('click', function () {
        const open = q.getAttribute('aria-expanded') === 'true';
        items.forEach(function (other) {
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').style.maxHeight = '0px';
        });
        if (!open) {
          q.setAttribute('aria-expanded', 'true');
          a.style.maxHeight = (a.firstElementChild.scrollHeight + 4) + 'px';
        }
      });
    });
    window.addEventListener('resize', function () {
      items.forEach(function (item) {
        const q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
        if (q.getAttribute('aria-expanded') === 'true') a.style.maxHeight = (a.firstElementChild.scrollHeight + 4) + 'px';
      });
    });
  })();

})();
