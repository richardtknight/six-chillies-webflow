import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoChars } from './textSplit';

gsap.registerPlugin(ScrollTrigger);

/**
 * Peel reveal animation for text lines
 * @param {string} selector - CSS selector for elements
 * @param {string} trigger - ScrollTrigger element
 * @param {Object} opts - Animation options
 */
export function peelReveal(selector, trigger, opts = {}) {
  const lines = document.querySelectorAll(`${selector} .clip-inner`);
  if (!lines.length) return;
  gsap.set(lines, {
    display: 'block',
    y: '105%',
    scaleX: 0.78,
    rotation: -2.5,
    transformOrigin: '0% 100%',
    opacity: 0,
  });
  gsap.to(lines, {
    y: '0%',
    scaleX: 1,
    rotation: 0,
    opacity: 1,
    duration: opts.duration || 0.85,
    stagger: opts.stagger || 0.13,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: trigger || selector,
      start: opts.start || 'top 80%',
      toggleActions: 'play reverse play reverse',
    },
  });
}

/**
 * Simple fade-in animation for eyebrow text
 * @param {string} selector - CSS selector
 * @param {string} trigger - ScrollTrigger element
 */
export function eyebrowReveal(selector, trigger) {
  const el = document.querySelector(selector);
  if (!el) return;
  gsap.from(el, {
    opacity: 0,
    y: 10,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: trigger || selector,
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  });
}

/**
 * Zoom reveal animation for images
 * Images start zoomed in and scale down to normal size on scroll
 * Also adds hover effect to zoom in to 130% on hover
 * @param {string} selector - CSS selector for images
 * @param {string} trigger - ScrollTrigger element (optional, defaults to selector)
 * @param {Object} opts - Animation options
 */
export function imageZoomReveal(selector, trigger, opts = {}) {
  const images = document.querySelectorAll(selector);
  console.log('imageZoomReveal: selector =', selector, ', found', images.length, 'images');
  if (!images.length) return;

  images.forEach((img, index) => {
    console.log(`imageZoomReveal: Processing image ${index + 1}:`, img);
    // Ensure the image wrapper has overflow hidden to prevent zoomed image from extending beyond bounds
    if (img.parentElement) {
      img.parentElement.style.overflow = 'hidden';
    }

    // Track if animation is complete
    img.dataset.scrollComplete = 'false';

    // Create the zoom animation with proper initial state
    const animation = gsap.from(img, {
      scale: 1.3,
      duration: opts.duration || 1.2,
      ease: opts.ease || 'power2.out',
      immediateRender: true, // Ensure initial state is set immediately
      scrollTrigger: {
        trigger: trigger || img,
        start: opts.start || 'top 80%',
        toggleActions: 'play reverse play reverse',
        onUpdate: (self) => {
          // Track if scroll animation is complete
          img.dataset.scrollComplete = self.progress >= 0.99 ? 'true' : 'false';
        },
      },
    });

    console.log('imageZoomReveal: Created animation with ScrollTrigger:', animation.scrollTrigger);

    // Add hover effect that respects scroll animation
    img.addEventListener('mouseenter', () => {
      // Only zoom in on hover if scroll animation has completed
      if (img.dataset.scrollComplete === 'true') {
        gsap.to(img, {
          scale: 1.3,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });

    img.addEventListener('mouseleave', () => {
      if (img.dataset.scrollComplete === 'true') {
        gsap.to(img, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });
  });
}

/**
 * Simple fade-in and slide-up reveal animation
 * Apply to any element with data-fade-slide attribute
 * @param {string} selector - CSS selector for elements
 * @param {Object} options - Animation options
 */
export function fadeSlideReveal(selector, options = {}) {
  const defaults = {
    y: 30, // Distance to slide up from
    duration: 1.2,
    ease: 'power4.out',
    stagger: 0,
    start: 'top 85%',
    delay: 0,
  };
  const cfg = Object.assign({}, defaults, options);
  const elements = document.querySelectorAll(selector);

  console.log('fadeSlideReveal: selector =', selector, ', found', elements.length, 'elements');
  if (!elements.length) return;

  elements.forEach((el, index) => {
    console.log(`fadeSlideReveal: Processing element ${index + 1}:`, el);
    // Read data attributes for per-element customization
    const dataY = parseFloat(el.dataset.fadeSlideY) || cfg.y;
    const dataDuration = parseFloat(el.dataset.fadeSlideDuration) || cfg.duration;
    const dataDelay = parseFloat(el.dataset.fadeSlideDelay) || cfg.delay;
    const dataStart = el.dataset.fadeSlideStart || cfg.start;

    const animation = gsap.from(el, {
      opacity: 0,
      y: dataY,
      duration: dataDuration,
      delay: dataDelay,
      ease: cfg.ease,
      scrollTrigger: {
        trigger: el,
        start: dataStart,
        toggleActions: 'play reverse play reverse',
      },
    });

    console.log('fadeSlideReveal: Created animation with ScrollTrigger:', animation.scrollTrigger);
  });
}

/**
 * Character-by-character stagger reveal animation
 * @param {string|HTMLElement} selector - CSS selector or element
 * @param {Object} options - Animation options
 */
export function charStaggerReveal(selector, options = {}) {
  const defaults = {
    stagger: 0.025,
    duration: 0.7,
    ease: 'power3.out',
    from: { y: '110%', opacity: 0 },
    delay: 0,
    start: 'top 85%',
  };
  const cfg = Object.assign({}, defaults, options);
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];

  console.log('charStaggerReveal: Found', elements.length, 'elements for selector:', selector);

  elements.forEach((el) => {
    if (!el) return;
    const dataStagger = parseFloat(el.dataset.stagger) || cfg.stagger;
    const dataDelay = parseFloat(el.dataset.delay) || cfg.delay;
    let dataFrom = cfg.from;
    try {
      if (el.dataset.from) dataFrom = JSON.parse(el.dataset.from);
    } catch (_e) {
      // Ignore invalid JSON in data-from attribute
    }

    const chars = splitIntoChars(el);
    if (!chars.length) {
      console.warn('charStaggerReveal: No chars created for element:', el);
      return;
    }

    console.log('charStaggerReveal: Created', chars.length, 'chars for element');

    gsap.set(chars, dataFrom);

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: cfg.start,
          toggleActions: 'play reverse play reverse',
        },
      })
      .to(chars, {
        y: 0,
        opacity: 1,
        duration: cfg.duration,
        stagger: dataStagger,
        ease: cfg.ease,
        delay: dataDelay,
      });

    console.log('charStaggerReveal: Animation created with ScrollTrigger:', tl.scrollTrigger);
  });
}
