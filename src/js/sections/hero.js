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
  const heroSticky = document.querySelector('.hero-sticky');

  // if (headline) splitIntoLines(headline);

  if (!vf) return;

  // Set video frame to fixed positioning for scroll animation
  vf.style.position = 'fixed';
  vf.style.overflow = 'hidden';
  vf.style.margin = '0';
  vf.style.padding = '0';
  vf.style.transform = 'none'; // Clear any inherited transforms
  vf.style.inset = 'auto'; // Reset any inset values

  // Ensure video element inside fills the frame
  const video = vf.querySelector('video, .hero-video');
  if (video) {
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
  }

  // Calculate initial heroSticky margin-left
  // When margin is auto and max-width is 1272px, the actual margin is (vw - 1272) / 2
  function getHeroStickyMargin() {
    if (!heroSticky) return 0;
    const computedStyle = window.getComputedStyle(heroSticky);
    const marginLeft = computedStyle.marginLeft;
    // Convert to pixels if it's not already
    return parseFloat(marginLeft) || 0;
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
    let startWidth, startTop, startLeft, textSlide;

    if (isDesktop) {
      // Desktop: smaller video, lower position
      startWidth = 240;
      startTop = 235;
      startLeft = 300;
      textSlide = -500;
    } else if (isTablet) {
      // Tablet: medium video, centered
      startWidth = 190;
      startTop = 260;
      startLeft = 240;
      textSlide = -400;
    } else if (isMobileLandscape) {
      // Mobile Landscape: larger video
      startWidth = 225;
      startTop = 215;
      startLeft = 260;
      textSlide = -350;
    } else if (isMobilePortrait) {
      // Mobile Portrait: largest relative size
      startWidth = 140;
      startTop = 215;
      startLeft = 170;
      textSlide = -300;
    } else {
      // Fallback for any edge cases
      startWidth = 240;
      startTop = 300;
      startLeft = 250;
      textSlide = -350;
    }

    const startHeight = startWidth * (9 / 16); // Maintain 16:9 aspect ratio

    // Position so right edge is at 50% of screen
    //const startLeft = vw * 0.5 - startWidth; // Right edge at 50%
    //const startTopCentered = startTop - startHeight / 2; // Center vertically at the calculated position

    // End dimensions and position (full screen)
    const endWidth = vw;
    const endHeight = vh;
    const endLeft = 0;
    const endTop = 0;

    return {
      startWidth,
      startHeight,
      startLeft,
      startTop,
      //startTop: startTopCentered,
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

  // Store initial heroSticky margin-left value
  let initialHeroStickyMargin = getHeroStickyMargin();

  gsap.set(vf, {
    width: startWidth,
    height: startHeight,
    left: startLeft,
    top: startTop,
    rotation: -4,
    borderRadius: 6,
    boxShadow: '0 20px 50px rgba(0,0,0,.35)',
    opacity: 0,
    zIndex: 1, // Start sandwiched between heading and span (span is z-index: 2)
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
  const VIDEO_ZINDEX_THRESHOLD = 0.35; // When to bring video forward (after text is completely gone)

  if (heroOuter) {
    heroOuter.style.height = `${window.innerHeight + TOTAL_TRAVEL}px`;

    // Separate scroll handler for text animations that responds to page scroll immediately
    const TEXT_FADE_DISTANCE = window.innerHeight * 0.5; // Distance to fully fade text
    function updateTextAnimations() {
      const scrollY = window.scrollY || window.pageYOffset;
      const textProgress = Math.min(1, scrollY / TEXT_FADE_DISTANCE);

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

      // Manage video z-index based on text fade progress
      // Keep video sandwiched until text is completely gone + small buffer
      const Z_CHANGE_THRESHOLD = 1.1; // Change z-index slightly after text fully fades
      if (textProgress < Z_CHANGE_THRESHOLD) {
        gsap.set(vf, { zIndex: 1 }); // Sandwiched
      } else {
        gsap.set(vf, { zIndex: 3 }); // On top
      }
    }

    // Update text on scroll with throttling
    let textTicking = false;
    window.addEventListener('scroll', () => {
      if (!textTicking) {
        window.requestAnimationFrame(() => {
          updateTextAnimations();
          textTicking = false;
        });
        textTicking = true;
      }
    });

    // Initialize text position
    updateTextAnimations();

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

        // Animate heroSticky margin-left from initial value to 0
        if (heroSticky) {
          const marginLeft = gsap.utils.interpolate(initialHeroStickyMargin, 0, ep);
          heroSticky.style.marginLeft = `${marginLeft}px`;
        }

        // Dynamically manage z-index based on scroll progress
        // Keep video sandwiched (z-index: 1) until text has mostly scrolled away
        // Then bring to front (z-index: 3) above span (z-index: 2)
        let videoZIndex;
        if (ep < VIDEO_ZINDEX_THRESHOLD) {
          videoZIndex = 1; // Sandwiched between heading and span
        } else {
          videoZIndex = 3; // On top during animation and when fully expanded
        }

        // Animate video frame
        // When fully expanded (ep >= 0.99), snap to exact final values to avoid gaps
        if (ep >= 0.99) {
          gsap.set(vf, {
            width: '100vw',
            height: '100vh',
            left: '0px',
            top: '0px',
            rotation: 0,
            borderRadius: 0,
            boxShadow: 'none',
            zIndex: videoZIndex,
            x: 0,
            y: 0,
            transform: 'none', // Clear any GSAP transforms
          });
        } else {
          gsap.set(vf, {
            width: gsap.utils.interpolate(startWidth, endWidth, ep),
            height: gsap.utils.interpolate(startHeight, endHeight, ep),
            left: gsap.utils.interpolate(startLeft, endLeft, ep),
            top: gsap.utils.interpolate(startTop, endTop, ep),
            rotation: gsap.utils.interpolate(-4, 0, ep),
            borderRadius: gsap.utils.interpolate(6, 0, ep),
            boxShadow: `0 ${gsap.utils.interpolate(20, 0, ep)}px ${gsap.utils.interpolate(50, 0, ep)}px rgba(0,0,0,${gsap.utils.interpolate(0.35, 0, ep)})`,
            zIndex: videoZIndex,
          });
        }
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

      // Recalculate heroSticky margin
      initialHeroStickyMargin = getHeroStickyMargin();

      heroOuter.style.height = `${window.innerHeight + TOTAL_TRAVEL}px`;
      ScrollTrigger.refresh();
    });
  }
}
