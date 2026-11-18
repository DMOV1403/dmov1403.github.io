// Small line drawings on the websites page that answer the pointer (and play by themselves on a phone).
// Without this script the captions under them still read fine.
import { exploded, phone, padlock } from './hairline.js?v=1';
const make = { exploded, phone, padlock };
for (const el of document.querySelectorAll('[data-fig]')) {
  const fn = make[el.dataset.fig]; if (!fn) continue;
  try { fn(el, { theme: 'dark', intensity: 0.6, play: true, label: el.dataset.label }); } catch (_) { el.hidden = true; }
}
