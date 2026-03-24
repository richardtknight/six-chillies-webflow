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

  // Starting dimensions and position
  const startWidth = 240; // Fixed width in pixels
  const startHeight = 135; // 16:9 aspect ratio (240 * 9/16)

  // Position so right edge is at 50% of screen
  const startLeft = window.innerWidth * 0.5 - startWidth; // Right edge at 50%
  const startTop = window.innerHeight * 0.25 - startHeight / 2; // 25% from top, centered vertically

  // End dimensions and position (full screen, centered)
  const endWidth = window.innerWidth;
  const endHeight = window.innerHeight;
  const endLeft = 0;
  const endTop = 0;

  gsap.set(vf, {
    width: startWidth,
    height: startHeight,
    left: startLeft,
    top: startTop,
    rotation: -4,
    borderRadius: 36,
    boxShadow: '0 20px 50px rgba(0,0,0,.35)',
    opacity: 0,
    zIndex: 2,
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
          width: gsap.utils.interpolate(startWidth, endWidth, ep),
          height: gsap.utils.interpolate(startHeight, endHeight, ep),
          left: gsap.utils.interpolate(startLeft, endLeft, ep),
          top: gsap.utils.interpolate(startTop, endTop, ep),
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
      ScrollTrigger.refresh();
    });
  }
}
