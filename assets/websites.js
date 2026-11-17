// Tabs above each browser frame switch which page of the site is shown. Without this script all pages show, one under another.
(() => {
  for (const list of document.querySelectorAll('[role="tablist"]')) {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const pick = t => {
      for (const x of tabs) { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; }
      const sc = document.getElementById(t.getAttribute('aria-controls')).closest('.screen'); if (sc) sc.scrollTop = 0;
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => pick(t));
      t.addEventListener('keydown', e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; pick(n); n.focus(); });
    });
    pick(tabs[0]);
  }
})();
