// A strip of night under the name: stars, the moon, two dunes and a small ghaf, stippled like the tree on the home page.
// Drawn once (and again on resize). Purely decorative: the canvas is aria-hidden and the page reads fine without it.
(() => {
  const c = document.querySelector('.horizon canvas');
  const g = c && c.getContext && c.getContext('2d');
  if (!g) return;
  const SAND = '216,207,189', SHADES = [`rgba(${SAND},1)`, `rgba(${SAND},.72)`, `rgba(${SAND},.42)`];
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  let lastW = 0;

  function draw() {
    const W = c.clientWidth, H = c.clientHeight; if (!W || !H) return;
    if (W === lastW && c.height) return; lastW = W;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const dot = (x, y, s, sh) => { g.fillStyle = SHADES[sh]; g.fillRect(x, y, s, s); };
    const duneY = (x, k) => H * (k ? 0.9 : 0.8) + Math.sin(x / W * 3.1 + (k ? 1.7 : 0.4)) * H * (k ? 0.05 : 0.045) + Math.sin(x / W * 7.3 + k) * H * 0.018;

    // stars
    const S = rng(77);
    for (let i = 0, n = Math.round(W * H / 3600); i < n; i++) { g.fillStyle = `rgba(${SAND},${0.12 + S() * 0.5})`; g.fillRect(S() * W, S() * H * 0.75, 1, 1); }

    // the moon, a small crescent near the left edge so it never meets the tree
    const M = rng(9), mr = Math.max(7, H * 0.06), mx = W * 0.12, my = H * 0.22;
    for (let i = 0; i < mr * mr * 2.2; i++) {
      const r = Math.sqrt(M()) * mr, th = M() * Math.PI * 2, x = mx + Math.cos(th) * r, y = my + Math.sin(th) * r;
      if (Math.hypot(x - (mx + mr * 0.45), y - (my - mr * 0.2)) < mr * 0.88) continue;
      g.fillStyle = 'rgba(232,199,122,.85)'; g.fillRect(x, y, 1, 1);
    }

    // the ghaf: a twisted trunk into a wide umbrella crown
    const R = rng(1403), narrow = W < 640;
    const bx = W * (narrow ? 0.76 : 0.8), by = duneY(bx, 1) + 1, T = H * (narrow ? 0.7 : 0.78);
    const clumps = [];
    (function branch(x, y, a, len, w, d) {
      const steps = Math.max(4, Math.round(len / 1.3));
      for (let i = 0; i < steps; i++) {
        a += (R() - 0.5) * 0.12; x += Math.cos(a) * len / steps; y += Math.sin(a) * len / steps;
        const ww = Math.max(1, w * (1 - 0.3 * i / steps));
        for (let j = 0; j < Math.ceil(ww * 0.9); j++) { const o = (R() - 0.5) * ww; dot(x - Math.sin(a) * o, y + Math.cos(a) * o, 1, Math.abs(o) > ww * 0.3 ? 0 : 1); }
      }
      if (d >= 4 || len < T * 0.05) { clumps.push([x, y]); return; }
      const kids = d === 0 ? 3 : (R() < 0.55 ? 2 : 3);
      for (let k = 0; k < kids; k++) {
        let na = a + (-0.55 + 1.1 * k / (kids - 1)) + (R() - 0.5) * 0.3;
        na += (na + Math.PI / 2) * 0.3; na = Math.max(-Math.PI + 0.1, Math.min(-0.1, na));
        branch(x, y, na, len * (0.68 + R() * 0.14), w * 0.66, d + 1);
      }
    })(bx, by, -Math.PI / 2, T * 0.34, Math.max(2.5, T * 0.05), 0);
    for (const [cx, cy0] of clumps) {
      const rx = T * (0.1 + R() * 0.06), ry = rx * (0.36 + R() * 0.12), cy = cy0 - ry * 0.3;
      for (let i = 0, n = Math.round(Math.PI * rx * ry * 0.2); i < n; i++) {
        const r = Math.sqrt(R()), th = R() * Math.PI * 2, dx = Math.cos(th) * r * rx, dy = Math.sin(th) * r * ry;
        dot(cx + dx, cy + dy, 1, R() < 0.18 ? 2 : (dy < -ry * 0.2 ? 0 : 1));
      }
    }

    // two dunes, densest on the moonlit crest; the front one covers the tree's foot
    for (const k of [0, 1]) {
      g.fillStyle = k ? 'rgba(31,28,37,.85)' : '#1F1C25';
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W + 8; x += 8) g.lineTo(x, duneY(x, k) - 1);
      g.lineTo(W + 8, H); g.closePath(); g.fill();
      const D = rng(78 + k);
      for (let x = 0; x < W; x += 1.3) {
        const crest = duneY(x, k);
        for (let y = crest; y < H; y += 1.6) {
          const depth = (y - crest) / (H * 0.12), p = (k ? 0.55 : 0.32) * Math.exp(-depth * 3.2) + 0.02;
          if (D() < p) dot(x + D(), y, 1, depth < 0.12 ? (k ? 0 : 1) : depth < 0.5 ? 1 : 2);
        }
      }
    }
  }

  draw();
  let t = 0;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(draw, 150); });
})();
