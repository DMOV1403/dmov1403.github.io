// Portfolio behaviour: case files open in a dialog (one step back on Esc, a tap outside, or the phone's Back button),
// pieces of work draw themselves in sand dots before the real image shows, and the path is drawn as a night route.
// Without this script everything still reads: the case files sit in the page and the links jump to them.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // ---------- case files in a dialog ----------
  const viewer = document.getElementById('viewer');
  const slot = viewer && viewer.querySelector('.slot');
  let open = null, home = null, pushed = false, popping = false;

  function show(id, fromHash) {
    const art = document.getElementById(id);
    if (!viewer || !art || !art.classList.contains('casefile')) return false;
    if (open) put();
    home = { parent: art.parentNode, next: art.nextSibling };
    slot.append(art); open = art;
    const h = art.querySelector('h3'); if (h) viewer.setAttribute('aria-labelledby', h.id);
    if (!fromHash) { history.pushState({ case: id }, '', '#' + id); pushed = true; } else pushed = false;
    viewer.showModal(); viewer.scrollTop = 0;
    return true;
  }
  function put() { // send the case file back to its place in the page
    if (!open) return;
    for (const v of open.querySelectorAll('video')) v.pause();
    home.parent.insertBefore(open, home.next); open = null;
  }
  // tidy up after the dialog shuts, however it shut; safe to run twice
  function closed() {
    if (!open) return;
    const was = open; put();
    if (popping) { popping = false; }
    else if (pushed) { pushed = false; history.back(); } // one step back, as if the visitor pressed Back
    else if (location.hash === '#' + was.id) history.replaceState(null, '', location.pathname + location.search); // arrived by a direct link
    const opener = document.querySelector('[data-case="' + was.id + '"]'); if (opener) opener.focus({ preventScroll: true });
  }
  const shut = () => { if (viewer.open) viewer.close(); closed(); };
  if (viewer) {
    viewer.addEventListener('close', closed); // Esc, a tap outside, the phone's back gesture
    viewer.querySelector('.x').addEventListener('click', shut);
    // tap outside to close, where the browser can't do it by itself yet (closedby is not everywhere)
    if (!('closedBy' in HTMLDialogElement.prototype)) viewer.addEventListener('click', e => {
      if (e.target !== viewer) return;
      const r = viewer.getBoundingClientRect();
      if (r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right) return;
      shut();
    });
    addEventListener('popstate', () => { if (open) { popping = true; pushed = false; shut(); } else fromHash(); });
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[data-case]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      if (show(a.dataset.case)) e.preventDefault();
    });
  }
  const fromHash = () => { const id = location.hash.slice(1); if (id.startsWith('case-')) show(id, true); };
  fromHash();

  // ---------- pieces draw themselves in dots, then the photo shows ----------
  const pieces = [...document.querySelectorAll('.piece .pic')].filter(p => p.querySelector('img'));
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); dots(en.target); } }), { rootMargin: '0px 0px -12% 0px' });
    for (const p of pieces) { p.classList.add('dotting'); io.observe(p); }
    // never leave a photo hidden: whatever happens, show everything after a while
    setTimeout(() => pieces.forEach(p => { p.classList.remove('dotting'); }), 9000);
  }
  function dots(pic) {
    const img = pic.querySelector('img');
    const go = () => {
      try {
        const W = img.clientWidth, H = img.clientHeight; if (!W || !H) throw 0;
        const c = document.createElement('canvas'), dpr = Math.min(2, devicePixelRatio || 1);
        c.width = W * dpr; c.height = H * dpr; c.setAttribute('aria-hidden', 'true'); pic.append(c);
        const g = c.getContext('2d'); g.scale(dpr, dpr);
        // sample the photo on a coarse grid
        const step = Math.max(3, Math.round(W / 70)), cols = Math.ceil(W / step), rows = Math.ceil(H / step);
        const s = document.createElement('canvas'); s.width = cols; s.height = rows;
        const sg = s.getContext('2d'); sg.drawImage(img, 0, 0, cols, rows);
        const px = sg.getImageData(0, 0, cols, rows).data, list = [];
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4, lum = (px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11) / 255;
          list.push([x * step + Math.random() * step * .6, y * step + Math.random() * step * .6, `rgb(${px[i]},${px[i + 1]},${px[i + 2]})`, .8 + lum * step * .55]);
        }
        for (let i = list.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [list[i], list[j]] = [list[j], list[i]]; }
        const T = 900, t0 = performance.now(); let done = 0;
        const frame = now => {
          const k = Math.min(1, (now - t0) / T), n = Math.floor(list.length * (1 - Math.pow(1 - k, 2)));
          for (; done < n; done++) { const d = list[done]; g.fillStyle = d[2]; g.beginPath(); g.arc(d[0], d[1], d[3] / 2, 0, 6.283); g.fill(); }
          if (k < 1) requestAnimationFrame(frame);
          else { pic.classList.remove('dotting'); pic.classList.add('dotted'); setTimeout(() => c.remove(), 900); }
        };
        requestAnimationFrame(frame);
      } catch (_) { pic.classList.remove('dotting'); }
    };
    if (img.complete && img.naturalWidth) go(); else { img.addEventListener('load', go, { once: true }); img.addEventListener('error', () => pic.classList.remove('dotting'), { once: true }); }
  }

  // ---------- the path: a stippled route from Egypt up to Sohar, each job a point that lights when reached ----------
  const route = document.querySelector('.route');
  if (route) {
    const c = route.querySelector('canvas'), g = c.getContext('2d'), items = [...route.querySelectorAll('.path > li')], lit = new Set();
    const draw = () => {
      const W = c.clientWidth, H = route.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
      c.style.height = H + 'px'; c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const top = route.getBoundingClientRect().top;
      const pts = items.map(li => li.getBoundingClientRect().top - top + 18);
      const xAt = y => W / 2 + Math.sin(y / 90) * W * .28;
      // the route itself, dotted sand
      for (let y = pts[0]; y < pts[pts.length - 1]; y += 5) { g.fillStyle = 'rgba(216,207,189,.55)'; g.fillRect(xAt(y) - .8, y, 1.6, 1.6); }
      pts.forEach((y, i) => {
        const on = lit.has(i) || reduce.matches, x = xAt(y);
        if (on) { const glow = g.createRadialGradient(x, y, 0, x, y, 14); glow.addColorStop(0, 'rgba(232,199,122,.55)'); glow.addColorStop(1, 'rgba(232,199,122,0)'); g.fillStyle = glow; g.fillRect(x - 14, y - 14, 28, 28); }
        g.fillStyle = on ? '#E8C77A' : 'rgba(216,207,189,.7)'; g.beginPath(); g.arc(x, y, on ? 4.5 : 3, 0, 6.283); g.fill();
      });
    };
    if ('IntersectionObserver' in window && !reduce.matches) {
      const io = new IntersectionObserver(es => { let ch = false; es.forEach(en => { if (en.isIntersecting) { lit.add(items.indexOf(en.target)); io.unobserve(en.target); ch = true; } }); if (ch) draw(); }, { rootMargin: '0px 0px -25% 0px' });
      items.forEach(li => io.observe(li));
    }
    draw();
    let t = 0; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 150); });
    document.fonts && document.fonts.ready.then(draw);
  }
})();
