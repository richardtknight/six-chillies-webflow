// CRITICAL: Set up global GSAP FIRST before any other imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Expose globally immediately
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

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
import { initStickyTimeline } from './sections/stickyTimeline';

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
    initStickyTimeline();

    // Optional: Card Stack (call only if you have .card-stack elements)
    initCardStack('.card-stack', { swipeThreshold: 100 });
  });
});
