// Hero lab helpers. Shared by all four options.
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll progress of a tall section through the viewport, 0 to 1, written as --p.
// One rAF-throttled listener, same pattern as the live #film.
export function scrollProgress(section, onChange) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = section.getBoundingClientRect();
    const run = r.height - innerHeight;
    const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
    section.style.setProperty('--p', p.toFixed(4));
    onChange && onChange(p);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}

// Letters resolve out of noise, left to right. Text stays in the DOM for screen readers.
const GLYPHS = '01<>/\\|=+*#%ΛΞΣΩ∆◊';
export function scramble(el, { delay = 0, speed = 28 } = {}) {
  const finalText = el.dataset.text || el.textContent;
  el.setAttribute('aria-label', finalText);
  if (reduced) { el.textContent = finalText; return; }
  let frame = 0;
  const total = finalText.length;
  el.textContent = '';
  setTimeout(() => {
    const tick = () => {
      frame++;
      const settled = Math.floor(frame / 2);
      let out = '';
      for (let i = 0; i < total; i++) {
        const c = finalText[i];
        if (i < settled || c === ' ') out += c;
        else if (i < settled + 6) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (settled < total) setTimeout(tick, speed);
    };
    tick();
  }, delay);
}

// Smoothed pointer, -1..1 on both axes.
export function pointer() {
  const p = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', e => {
    p.tx = (e.clientX / innerWidth) * 2 - 1;
    p.ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  p.step = (k = 0.06) => { p.x += (p.tx - p.x) * k; p.y += (p.ty - p.y) * k; return p; };
  return p;
}

// Sydney local time for the HUD, ticking.
export function sydneyClock(el) {
  const f = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const t = () => { el.textContent = f.format(new Date()); };
  t(); setInterval(t, 1000);
}
