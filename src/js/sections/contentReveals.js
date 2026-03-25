import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoLines } from '../utils/textSplit';
import {
  peelReveal,
  eyebrowReveal,
  charStaggerReveal,
  imageZoomReveal,
  fadeSlideReveal,
} from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes all content reveal animations throughout the page
 */
export function initContentReveals() {
  // Split text elements
  splitIntoLines(document.querySelector('#manifesto-big'));
  splitIntoLines(document.querySelector('.t-title'));
  splitIntoLines(document.querySelector('.cta-big'));

  // Character stagger reveal (data-attribute driven) - must be called before other animations
  charStaggerReveal('[data-char-stagger]');

  // Small delay to ensure DOM has settled after text splitting, then refresh ScrollTrigger
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();

    // Call data-attribute driven animations AFTER refresh to ensure proper setup
    fadeSlideReveal('[data-fade-slide]');

    // Image zoom reveal - must be called after refresh
    imageZoomReveal('.zoom-img', null, {
      duration: 1.4,
      ease: 'power3.out',
      start: 'top 80%',
    });

    console.log('ScrollTrigger refreshed. Total triggers:', ScrollTrigger.getAll().length);
  });

  // Logos section
  eyebrowReveal('.logos-section .section-label', '.logos-section');
  gsap.from('.logo-cell', {
    opacity: 0,
    y: 20,
    stagger: { amount: 0.5, from: 'start' },
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#logosGrid',
      start: 'top 82%',
      toggleActions: 'play reverse play reverse',
    },
  });

  // Manifesto section
  eyebrowReveal('.manifesto .section-label', '.manifesto');
  peelReveal('#manifesto-big', '#manifesto-big', {
    stagger: 0.14,
    duration: 1.0,
    start: 'top 78%',
  });
  gsap.from('.manifesto-quote', {
    opacity: 0,
    y: 16,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.manifesto-quote',
      start: 'top 82%',
      toggleActions: 'play reverse play reverse',
    },
  });
  gsap.from('.manifesto-body', {
    opacity: 0,
    y: 14,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.manifesto-right',
      start: 'top 80%',
      toggleActions: 'play reverse play reverse',
    },
  });
  gsap.from('.manifesto-right .btn-primary', {
    opacity: 0,
    y: 12,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.manifesto-right .btn-primary',
      start: 'top 88%',
      toggleActions: 'play reverse play reverse',
    },
  });

  // Testimonials header section
  eyebrowReveal('.t-label', '.t-header');
  peelReveal('.t-title', '.t-header', {
    stagger: 0.15,
    duration: 1.0,
    start: 'top 78%',
  });
  gsap.from('.tcard', {
    opacity: 0,
    y: 30,
    stagger: { amount: 0.4, from: 'start' },
    duration: 0.85,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 80%',
      toggleActions: 'play reverse play reverse',
    },
  });
  gsap.from('.linkedin-comment', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.linkedin-strip',
      start: 'top 88%',
      toggleActions: 'play reverse play reverse',
    },
  });

  // CTA section
  peelReveal('.cta-big', '.cta', {
    stagger: 0.18,
    duration: 1.1,
    start: 'top 72%',
  });
  gsap.from('.cta-sub', {
    opacity: 0,
    y: 16,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cta-sub',
      start: 'top 82%',
      toggleActions: 'play reverse play reverse',
    },
  });
  gsap.from('.cta-btn', {
    opacity: 0,
    y: 12,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cta-btn',
      start: 'top 88%',
      toggleActions: 'play reverse play reverse',
    },
  });
  gsap.utils.toArray('.cta-chili').forEach((el, i) => {
    gsap.to(el, {
      y: -(20 + i * 8),
      duration: 2.8 + i * 0.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.5,
    });
  });
}
