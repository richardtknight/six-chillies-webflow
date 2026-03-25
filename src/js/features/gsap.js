import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Expose GSAP globally to ensure single instance
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

console.log('gsap.js: Setting up global GSAP and ScrollTrigger...');
console.log('gsap.js: Before registerPlugin, gsap.plugins =', gsap.plugins);

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

console.log('gsap.js: After registerPlugin, gsap.plugins =', gsap.plugins);
console.log('gsap.js: Plugin keys:', Object.keys(gsap.plugins));
console.log('gsap.js: Has scrollTrigger?', 'scrollTrigger' in gsap.plugins);

/**
 * Initializes GSAP with plugins and global settings
 */
export function initGSAP() {
  console.log('initGSAP: Starting initialization...');
  console.log('initGSAP: gsap === window.gsap?', gsap === window.gsap);
  console.log(
    'initGSAP: ScrollTrigger === window.ScrollTrigger?',
    ScrollTrigger === window.ScrollTrigger
  );

  // Set initial page transition state
  gsap.set('.page-transition', { y: '0%' });

  // Refresh ScrollTrigger after fonts load
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
}
