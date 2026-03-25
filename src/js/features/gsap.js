// Use the global GSAP instances already set up in main.js
// DO NOT import fresh instances here as it will overwrite the registered ones
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

console.log('gsap.js: Using global GSAP instances from main.js');
console.log('gsap.js: gsap.plugins =', gsap.plugins);
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
