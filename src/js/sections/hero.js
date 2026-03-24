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
  const heroTopRight = document.querySelector('.hero-top-right');
  const eyebrow = document.getElementById('eyebrow');
  const vf = document.getElementById('videoFrame');
  const headline = document.getElementById('heading');

  // if (headline) splitIntoLines(headline);

  if (!vf) return;

  // Set video frame to fixed positioning for scroll animation
  vf.style.position = 'absolute';
  vf.style.overflow = 'hidden';

  // Ensure video element inside fills the frame
  const video = vf.querySelector('video, .hero-video');
  if (video) {
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
  }

  // Responsive calculations based on Webflow breakpoints
  function getResponsiveValues() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Webflow breakpoints
    const isDesktop = vw > 991; // Desktop: 992px and above
    const isTablet = vw <= 991 && vw > 767; // Tablet: 768px - 991px
    const isMobileLandscape = vw <= 767 && vw > 479; // Mobile Landscape: 480px - 767px
    const isMobilePortrait = vw <= 479; // Mobile Portrait: 479px and below

    // Starting dimensions - scale based on Webflow breakpoints
    let startWidth, startTop, textSlide;

    if (isDesktop) {
      // Desktop: smaller video, lower position
      startWidth = Math.min(vw * 0.15, 240); // 15% of viewport (max 240px)
      startTop = vh * 0.25; // 25% from top
      textSlide = -360;
    } else if (isTablet) {
      // Tablet: medium video, centered
      startWidth = vw * 0.35; // 35% of viewport
      startTop = vh * 0.28; // 28% from top
      textSlide = -280;
    } else if (isMobileLandscape) {
      // Mobile Landscape: larger video
      startWidth = vw * 0.5; // 50% of viewport
      startTop = vh * 0.3; // 30% from top
      textSlide = -220;
    } else if (isMobilePortrait) {
      // Mobile Portrait: largest relative size
      startWidth = vw * 0.65; // 65% of viewport
      startTop = vh * 0.32; // 32% from top
      textSlide = -180;
    } else {
      // Fallback for any edge cases
      startWidth = vw * 0.5;
      startTop = vh * 0.3;
      textSlide = -200;
    }

    const startHeight = startWidth * (9 / 16); // Maintain 16:9 aspect ratio

    // Position so right edge is at 50% of screen
    const startLeft = vw * 0.5 - startWidth; // Right edge at 50%
    const startTopCentered = startTop - startHeight / 2; // Center vertically at the calculated position

    // End dimensions and position (full screen)
    const endWidth = vw;
    const endHeight = vh;
    const endLeft = 0;
    const endTop = 0;

    return {
      startWidth,
      startHeight,
      startLeft,
      startTop: startTopCentered,
      endWidth,
      endHeight,
      endLeft,
      endTop,
      textSlide,
    };
  }

  let {
    startWidth,
    startHeight,
    startLeft,
    startTop,
    endWidth,
    endHeight,
    endLeft,
    endTop,
    textSlide,
  } = getResponsiveValues();

  gsap.set(vf, {
    width: startWidth,
    height: startHeight,
    left: startLeft,
    top: startTop,
    rotation: -4,
    borderRadius: 6,
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

        // Animate text elements out before video expands
        const textProgress = Math.max(
          0,
          Math.min(1, (ep - TEXT_EXIT_START) / (TEXT_EXIT_END - TEXT_EXIT_START))
        );

        if (heroTopRight) {
          gsap.set(heroTopRight, {
            y: textSlide * textProgress,
            opacity: 1 - textProgress,
            filter: `blur(${textProgress * 12}px)`,
          });
        }

        if (headline) {
          gsap.set(headline, {
            y: textSlide * textProgress,
            opacity: 1 - textProgress,
            filter: `blur(${textProgress * 12}px)`,
          });
        }

        if (eyebrow) {
          gsap.set(eyebrow, {
            y: textSlide * textProgress,
            opacity: 1 - textProgress,
            filter: `blur(${textProgress * 12}px)`,
          });
        }

        // Animate video frame
        gsap.set(vf, {
          width: gsap.utils.interpolate(startWidth, endWidth, ep),
          height: gsap.utils.interpolate(startHeight, endHeight, ep),
          left: gsap.utils.interpolate(startLeft, endLeft, ep),
          top: gsap.utils.interpolate(startTop, endTop, ep),
          rotation: gsap.utils.interpolate(-4, 0, ep),
          borderRadius: gsap.utils.interpolate(6, 0, ep),
          boxShadow: `0 ${gsap.utils.interpolate(20, 0, ep)}px ${gsap.utils.interpolate(50, 0, ep)}px rgba(0,0,0,${gsap.utils.interpolate(0.35, 0, ep)})`,
          zIndex: Math.round(gsap.utils.interpolate(2, 0, ep)),
        });
      },
    });

    window.addEventListener('resize', () => {
      // Recalculate responsive values on resize
      const newValues = getResponsiveValues();
      startWidth = newValues.startWidth;
      startHeight = newValues.startHeight;
      startLeft = newValues.startLeft;
      startTop = newValues.startTop;
      endWidth = newValues.endWidth;
      endHeight = newValues.endHeight;
      endLeft = newValues.endLeft;
      endTop = newValues.endTop;
      textSlide = newValues.textSlide;

      heroOuter.style.height = `${window.innerHeight + TOTAL_TRAVEL}px`;
      ScrollTrigger.refresh();
    });
  }
}
