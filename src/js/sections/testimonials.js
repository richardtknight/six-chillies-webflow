import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes testimonials section with infinite scroll columns
 */
export function initTestimonials() {
  const testimonialsSection = document.getElementById('testimonials');
  const trackA = document.getElementById('track-a');
  const trackB = document.getElementById('track-b');

  if (!testimonialsSection || !trackA || !trackB) return;

  // Infinite scroll ticker
  const SPEED_A = 0.55;
  const SPEED_B = 0.4;
  let yA = 0,
    yB = 0;
  let tPaused = false;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const halfA = trackA.scrollHeight / 2;
      const halfB = trackB.scrollHeight / 2;

      yA = 0;
      yB = -halfB * 0.5;

      gsap.ticker.add(() => {
        if (tPaused) return;

        yA -= SPEED_A;
        if (yA <= -halfA) yA = 0;

        yB += SPEED_B;
        if (yB >= 0) yB = -halfB;

        gsap.set(trackA, { y: yA });
        gsap.set(trackB, { y: yB });
      });
    });
  });

  // Pause on hover
  testimonialsSection.addEventListener('mouseenter', () => {
    tPaused = true;
  });
  testimonialsSection.addEventListener('mouseleave', () => {
    tPaused = false;
  });

  // Pause when off-screen for performance
  ScrollTrigger.create({
    trigger: testimonialsSection,
    start: 'top bottom',
    end: 'bottom top',
    onEnter() {
      tPaused = false;
    },
    onLeave() {
      tPaused = true;
    },
    onEnterBack() {
      tPaused = false;
    },
    onLeaveBack() {
      tPaused = true;
    },
  });

  // Section entry animation
  gsap.set(testimonialsSection, { opacity: 0, y: 40 });
  ScrollTrigger.create({
    trigger: testimonialsSection,
    start: 'top 85%',
    once: true,
    onEnter() {
      gsap.to(testimonialsSection, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
      });
    },
  });
}
