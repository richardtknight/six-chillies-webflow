import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling with GSAP integration
 * @returns {Lenis} The Lenis instance
 */
export function initLenis() {
  let lenis;

  requestAnimationFrame(() => {
    lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    });
    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ({ progress }) => {
      const progressEl = document.getElementById('progress');
      if (progressEl) gsap.set(progressEl, { scaleX: progress });
    });
  });

  return lenis;
}
