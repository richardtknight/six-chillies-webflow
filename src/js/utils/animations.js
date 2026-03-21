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
    scrollTrigger: { trigger: trigger || selector, start: 'top 85%' },
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
    if (!chars.length) return;

    gsap.set(chars, dataFrom);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: cfg.start,
          toggleActions: 'play none none none',
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
  });
}
