import gsap from 'gsap';

/**
 * Initializes custom cursor with interactive states
 */
export function initCursor() {
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (!cur || !ring) return;

  document.addEventListener('mousemove', (e) => {
    gsap.to(cur, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.06,
      ease: 'none',
    });
    gsap.to(ring, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.18,
      ease: 'power2.out',
    });
  });

  document.querySelectorAll('a, button, .tcard, .hcard, .logo-cell').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cur, { scale: 3, duration: 0.3 });
      gsap.to(ring, { scale: 0, opacity: 0, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cur, { scale: 1, duration: 0.3 });
      gsap.to(ring, { scale: 1, opacity: 0.55, duration: 0.3 });
    });
  });
}
