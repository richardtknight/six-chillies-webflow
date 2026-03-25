// Use the global GSAP instances already set up in main.js
// DO NOT import fresh instances here as it will overwrite the registered ones
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

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
