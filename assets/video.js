// Motion on the video page (https://motion.dev, bundled copy). Everything here is extra: without this script,
// or for visitors who prefer less motion, the page shows complete and still.
import { animate, inView, stagger, scroll, hover, press } from './motion.js?v=1';

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reels = [...document.querySelectorAll('.reel')];

if (!calm) {
  // 1) the reels rise into place one after another as the row comes into view
  const row = document.querySelector('.reels5');
  if (row) {
    reels.forEach(r => { r.style.opacity = '0'; });
    inView(row, () => { animate(reels, { opacity: [0, 1], y: [46, 0], rotate: [-2.5, 0] }, { delay: stagger(0.09), type: 'spring', stiffness: 120, damping: 16 }); }, { amount: 0.15 });
    setTimeout(() => reels.forEach(r => { if (r.style.opacity === '0') r.style.opacity = ''; }), 6000); // never leave them hidden
  }
  // 2) each step of "how I make one" slides in from the side as it is reached
  for (const li of document.querySelectorAll('.steps li')) {
    li.style.opacity = '0';
    inView(li, () => { animate(li, { opacity: [0, 1], x: [-28, 0] }, { type: 'spring', stiffness: 140, damping: 20 }); }, { amount: 0.4 });
    setTimeout(() => { if (li.style.opacity === '0') li.style.opacity = ''; }, 9000);
  }
  // 3) a thin line across the top fills as the page is read
  const bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true'); document.body.append(bar);
  scroll(animate(bar, { scaleX: [0, 1] }, { ease: 'linear' }));
  // 4) the night strip under the heading drifts a little slower than the page
  const horizon = document.querySelector('.horizon canvas');
  if (horizon) scroll(animate(horizon, { y: [0, 60] }, { ease: 'linear' }), { target: horizon.parentElement, offset: ['start start', 'end start'] });
}

// 5) with a mouse, a reel lifts on a spring and plays a silent preview; the others step back
for (const r of reels) {
  const frame = r.querySelector('.frame'), v = r.querySelector('video');
  hover(r, () => {
    if (!calm) { animate(frame, { y: -10, scale: 1.03 }, { type: 'spring', stiffness: 260, damping: 18 }); reels.forEach(o => { if (o !== r) animate(o, { opacity: 0.55 }, { duration: 0.25 }); }); }
    if (v.paused && !v.dataset.played) { v.muted = true; v.dataset.preview = '1'; v.play().catch(() => {}); }
    return () => {
      if (!calm) { animate(frame, { y: 0, scale: 1 }, { type: 'spring', stiffness: 260, damping: 22 }); reels.forEach(o => animate(o, { opacity: 1 }, { duration: 0.25 })); }
      if (v.dataset.preview) { delete v.dataset.preview; v.pause(); v.currentTime = 0; v.muted = false; v.load(); }
    };
  });
  // pressing play for real: sound on, no more previews for this one, and the others stop
  v.addEventListener('play', () => { if (!v.dataset.preview) { v.dataset.played = '1'; for (const o of reels) { const ov = o.querySelector('video'); if (ov !== v && !ov.paused) ov.pause(); } } });
  v.addEventListener('volumechange', () => { if (v.dataset.preview && !v.muted) { delete v.dataset.preview; v.dataset.played = '1'; } });
  if (!calm) press(frame, () => { animate(frame, { scale: 0.98 }, { duration: 0.12 }); return () => { animate(frame, { scale: 1 }, { type: 'spring', stiffness: 300, damping: 20 }); }; });
}
