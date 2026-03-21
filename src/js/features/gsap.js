import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes GSAP with plugins and global settings
 */
export function initGSAP() {
  // Set initial page transition state
  gsap.set('.page-transition', { y: '0%' });

  // Refresh ScrollTrigger after fonts load
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
}
