import gsap from 'gsap';

/**
 * Initializes page entry and exit transitions
 */
export function initPageTransitions() {
  const transitionEl = document.querySelector('.page-transition');

  if (!transitionEl) {
    console.warn('No .page-transition element found');
    return;
  }

  // Page entry transition
  gsap.set(transitionEl, { clipPath: 'circle(150% at 50% 50%)' });
  gsap.to(transitionEl, {
    clipPath: 'circle(0% at 50% 50%)',
    delay: 0.2,
    duration: 1,
    ease: 'power4.inOut',
  });

  // Page exit transitions
  document.querySelectorAll('a').forEach((link) => {
    const url = link.href;
    if (
      link.hostname !== window.location.hostname ||
      link.target === '_blank' ||
      link.href.includes('#')
    )
      return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.set(transitionEl, { clipPath: 'circle(0% at 50% 50%)' });
      gsap.to(transitionEl, {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () =>
          setTimeout(() => {
            window.location.href = url;
          }, 50),
      });
    });
  });
}
