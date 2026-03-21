/**
 * Brand Constants & Configuration
 * Centralized configuration for colors, timing, and other brand-specific values
 */

// ═══════════════════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════════════════

export const COLORS = {
  // Brand colors
  chiliRed: '#ff3312',
  offWhite: '#f5f0e8',
  chilliBlack: '#111111',
  lightGrey: '#EFEFEF',
  chilliTint: '#FF7466',

  // Background colors
  bg: '#09090a',
  surface: '#0f0f11',
  surfaceHi: '#151518',

  // Border colors
  border: '#1e1e24',
  borderHi: '#2a2a32',

  // Text colors
  text: '#e6e6ec',
  muted: '#44444e',
};

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION TIMING
// ═══════════════════════════════════════════════════════════════════════════

export const TIMING = {
  // Duration (in seconds)
  fast: 0.2,
  medium: 0.4,
  slow: 0.8,
  verySlow: 1.2,

  // Page transitions
  pageTransitionDuration: 0.8,
  pageTransitionDelay: 0.2,

  // Menu animation
  menuOpenDuration: 0.85,
  menuCloseDuration: 0.65,

  // Scroll-based animations
  peelRevealDuration: 0.85,
  peelRevealStagger: 0.13,
  charStaggerDuration: 0.7,
  charStagger: 0.025,
};

// ═══════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const EASING = {
  power2Out: 'power2.out',
  power2In: 'power2.in',
  power2InOut: 'power2.inOut',
  power3Out: 'power3.out',
  power3In: 'power3.in',
  power3InOut: 'power3.inOut',
  power4Out: 'power4.out',
  power4InOut: 'power4.inOut',
  expoOut: 'expo.out',
  backOut: 'back.out(2)',
  sineInOut: 'sine.inOut',
};

// ═══════════════════════════════════════════════════════════════════════════
// LENIS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const LENIS_CONFIG = {
  duration: 0.9,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.2,
  touchMultiplier: 2,
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL TRIGGER DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const SCROLL_TRIGGER = {
  // Start positions
  startTop80: 'top 80%',
  startTop82: 'top 82%',
  startTop85: 'top 85%',
  startTop88: 'top 88%',
  startTopBottom: 'top bottom',
  startTopTop: 'top top',

  // End positions
  endBottomTop: 'bottom top',

  // Scrub values
  scrubSmooth: 0.1,
};

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════

export const HERO = {
  videoStartY: -260,
  videoEndY: 0,
  animationTravelMultiplier: 1.2,
  holdTravelMultiplier: 0.9,
  textExitStart: 0.25,
  textExitEnd: 0.55,
  textSlidePx: -160,
};

// ═══════════════════════════════════════════════════════════════════════════
// HORIZONTAL SCROLL SECTION
// ═══════════════════════════════════════════════════════════════════════════

export const HORIZONTAL_SCROLL = {
  introHoldMultiplier: 0.7,
  introFadeMultiplier: 0.4,
  outroFadeMultiplier: 0.4,
  outroHoldMultiplier: 0.7,
  arcDip: 180,
  maxRotation: 14,
  depthVariations: [0, 18, -12, 22, -8, 16],
};

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK TRANSITION
// ═══════════════════════════════════════════════════════════════════════════

export const BLOCK_TRANSITION = {
  cols: 14,
  rows: 5,
  colorThreshold: 0.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════

export const TESTIMONIALS = {
  speedColumnA: 0.55,
  speedColumnB: 0.4,
  offsetColumnB: 0.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// HAMBURGER MENU
// ═══════════════════════════════════════════════════════════════════════════

export const HAMBURGER = {
  barMoveDistance: 6.5,
  barRotation: 45,
  circleRadiusOpen: '170%',
  circleRadiusClosed: '0%',
  lenisRestartDelay: 700, // ms
};

// ═══════════════════════════════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// ═══════════════════════════════════════════════════════════════════════════
// Z-INDEX LAYERS
// ═══════════════════════════════════════════════════════════════════════════

export const Z_INDEX = {
  base: 1,
  menu: 1000,
  hamburger: 1001,
  cursor: 9999,
};
