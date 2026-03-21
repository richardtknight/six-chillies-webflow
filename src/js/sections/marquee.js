import gsap from 'gsap';

/**
 * Initializes infinite scrolling marquee animation
 * Creates seamless loop of logos scrolling from right to left
 */
export function initMarquee() {
  const marqueeWraps = document.querySelectorAll('.marquee-wrap');
  if (!marqueeWraps.length) return;

  marqueeWraps.forEach((wrap) => {
    const logos = wrap.querySelectorAll('.marquee-logo');
    if (logos.length < 2) {
      console.warn('Marquee requires at least 2 .marquee-logo elements for seamless loop');
      return;
    }

    // Get the width of one logo set
    const logoWidth = logos[0].offsetWidth;

    // Position the second logo set immediately after the first
    gsap.set(logos[1], { x: 0 });

    // Create infinite loop animation
    // Both logo sets move left at the same speed
    logos.forEach((logo) => {
      gsap.to(logo, {
        x: -logoWidth,
        duration: 20, // Adjust speed here (lower = faster)
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x) => {
            // When a logo moves fully off screen, reset it to the right
            return `${parseFloat(x) % logoWidth}px`;
          },
        },
      });
    });
  });
}
