import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitIntoLines } from '../utils/textSplit';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes hero section with scroll-based animations
 * @param {Object} navControl - Navigation control object
 */
export function initHero(navControl) {
  const heroOuter = document.getElementById('heroOuter');
  const heroTop = document.querySelector('.hero-top');
  const vf = document.getElementById('videoFrame');
  const headline = document.getElementById('headline');

  if (headline) splitIntoLines(headline);

  if (!vf) return;

  // Set video frame to fixed positioning for scroll animation
  vf.style.position = 'fixed';
  vf.style.width = '100vw';
  vf.style.height = '100vh';

  // Calculate starting position
  // At 0.15 scale, video is 15% of viewport width
  // Want right edge at 50%, so center should be at 50% - 7.5% = 42.5%
  const startScale = 0.15;
  const startLeft = 82;
  const startTop = 37;

  // End position - centered in viewport for full screen
  const endLeft = 50;
  const endTop = 50;

  gsap.set(vf, {
    left: startLeft,
    top: startTop,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    scale: startScale,
    rotation: -4,
    borderRadius: 36,
    boxShadow: '0 20px 50px rgba(0,0,0,.35)',
    opacity: 0,
  });

  gsap.set('#headline .clip-inner', {
    display: 'block',
    y: '105%',
    scaleX: 0.78,
    rotation: -2.5,
    transformOrigin: '0% 100%',
    opacity: 0,
  });

  gsap
    .timeline({ defaults: { ease: 'power4.out' }, delay: 0.2 })
    .to('#eyebrow', { opacity: 1, duration: 0.5 })
    .to(
      '#headline .clip-inner',
      {
        y: '0%',
        scaleX: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.13,
        ease: 'back.out(2)',
      },
      '-=.2'
    )
    .from('#heroSub', { opacity: 0, y: 14, duration: 0.8 }, '-=.5')
    .from('#heroActions', { opacity: 0, y: 12, duration: 0.6 }, '-=.5')
    .to(vf, { opacity: 1, duration: 0.6 }, '-=.8');

  const ANIM_TRAVEL = window.innerHeight * 1.2;
  const HOLD_TRAVEL = window.innerHeight * 0.9;
  const TOTAL_TRAVEL = ANIM_TRAVEL + HOLD_TRAVEL;
  const TEXT_EXIT_START = 0.25;
  const TEXT_EXIT_END = 0.55;
  const TEXT_SLIDE_PX = -160;

  if (heroOuter) {
    heroOuter.style.height = `${window.innerHeight + TOTAL_TRAVEL}px`;

    ScrollTrigger.create({
      trigger: heroOuter,
      start: 'top top',
      end: () => `+=${TOTAL_TRAVEL}`,
      scrub: 0.1,
      onEnter() {
        vf.style.willChange = 'transform, border-radius, box-shadow';
      },
      onLeave() {
        vf.style.willChange = 'auto';
      },
      onUpdate(self) {
        const rawScrolled = self.progress * TOTAL_TRAVEL;
        const animProgress = Math.min(1, rawScrolled / ANIM_TRAVEL);

        // Update nav lock state
        if (navControl) {
          if (animProgress >= 0.05 && navControl.navLocked) {
            navControl.setNavLocked(false);
          } else if (animProgress < 0.05 && !navControl.navLocked) {
            navControl.setNavLocked(true);
          }
        }

        const p = animProgress;
        const ep = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

        gsap.set(vf, {
          scale: gsap.utils.interpolate(0.15, 1, ep),
          left: `${gsap.utils.interpolate(startLeft, endLeft, ep)}%`,
          top: `${gsap.utils.interpolate(startTop, endTop, ep)}%`,
          xPercent: -50,
          yPercent: -50,
          rotation: gsap.utils.interpolate(-4, 0, ep),
          borderRadius: gsap.utils.interpolate(36, 0, ep),
          boxShadow: `0 ${gsap.utils.interpolate(20, 0, ep)}px ${gsap.utils.interpolate(50, 0, ep)}px rgba(0,0,0,${gsap.utils.interpolate(0.35, 0, ep)})`,
        });

        // if (heroTop) {
        //   const textProgress = Math.max(
        //     0,
        //     Math.min(1, (ep - TEXT_EXIT_START) / (TEXT_EXIT_END - TEXT_EXIT_START))
        //   );
        //   gsap.set(heroTop, {
        //     y: TEXT_SLIDE_PX * textProgress,
        //     // opacity: 1 - textProgress,
        //     // filter: `blur(${textProgress * 12}px)`,
        //   });
        // }
      },
    });

    window.addEventListener('resize', () => {
      heroOuter.style.height = `${window.innerHeight + TOTAL_TRAVEL}px`;

      // Recalculate video frame size and position on resize
      vf.style.width = '100vw';
      vf.style.height = '100vh';

      ScrollTrigger.refresh();
    });
  }
}
