// CRITICAL: Set up global GSAP FIRST before any other imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Expose globally immediately
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

console.log('main.js: GSAP setup complete at top of file');
console.log('main.js: gsap.plugins =', gsap.plugins);
console.log('main.js: Plugin keys:', Object.keys(gsap.plugins));
console.log('main.js: Has scrollTrigger?', 'scrollTrigger' in gsap.plugins);

// DEBUG: Verify new code is loading
console.log('=== NEW CODE LOADED at', new Date().toISOString(), '===');
console.log('main.js: Starting execution...');

// Create visible banner to confirm code is loading
const debugBanner = document.createElement('div');
debugBanner.style.cssText =
  'position: fixed; top: 0; left: 0; right: 0; background: red; color: white; padding: 10px; text-align: center; z-index: 999999; font-size: 16px; font-weight: bold;';
debugBanner.textContent = `NEW CODE LOADED: ${new Date().toLocaleTimeString()}`;
document.body?.appendChild(debugBanner);
setTimeout(() => debugBanner?.remove(), 5000); // Remove after 5 seconds

import { onReady } from './core/dom';
import { initApp } from './core/init';

import { initLenis } from './features/lenis';
import { initGSAP } from './features/gsap';
import { initPageTransitions } from './features/pageTransitions';

import { initHamburger } from './components/hamburger';
import { initCursor } from './components/cursor';
import { initNav } from './components/nav';
import { initCardStack } from './components/cardStack';

import { initHero } from './sections/hero';
import { initHorizontalScroll } from './sections/horizontalScroll';
import { initBlockTransition } from './sections/blockTransition';
import { initTestimonials } from './sections/testimonials';
import { initContentReveals } from './sections/contentReveals';
import { initMarquee } from './sections/marquee';

/**
 * Main application entry point
 * Initializes all features, components, and sections
 */
window.Webflow ||= [];
window.Webflow.push(() => {
  onReady(() => {
    // Core initialization
    initApp();
    initGSAP();

    // Initialize Lenis smooth scroll
    const lenis = initLenis();

    // Page transitions
    initPageTransitions();

    // Components
    const navControl = initNav();
    initHamburger(lenis);
    initCursor();

    // Sections
    initHero(navControl);
    initHorizontalScroll();
    initBlockTransition();
    initTestimonials();
    initContentReveals();
    initMarquee();

    // Optional: Card Stack (call only if you have .card-stack elements)
    initCardStack('.card-stack', { swipeThreshold: 100 });
  });
});
