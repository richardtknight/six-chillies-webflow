import { init3DFloatingOrbit } from '../utils/animations';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

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
  const headlineOverlay = document.getElementById('headingOverlay');
  const heroSticky = document.querySelector('.hero-sticky');
  const heroBg = document.getElementById('heroBg');

  // Initialize 3D floating orbit animation
  init3DFloatingOrbit('.floating-orbit-container', {
    radiusX: 180, // Horizontal spread
    radiusY: 120, // Vertical spread
    radiusZ: 100, // Depth
    rotationSpeed: 0.001, // Speed
    mouseInfluence: 100, // Magnetic distance
    hoverScale: 1.4, // Hover zoom
  });

  // if (headline) splitIntoLines(headline);

  if (!vf) return;

  // Move vf to document.body before applying fixed positioning.
  // CSS transforms, filters, or will-change on ANY ancestor element create a
  // new containing block that scopes position:fixed to that ancestor instead
  // of the viewport — causing the video to scroll with the page ("get left behind").
  // Appending to body ensures position:fixed is always relative to the viewport.
  document.body.prepend(vf);

  // Set video frame to fixed positioning for scroll animation
  vf.style.position = 'fixed';
  vf.style.overflow = 'hidden';
  vf.style.margin = '0';
  vf.style.padding = '0';
  vf.style.transform = 'none'; // Clear any inherited transforms
  vf.style.inset = 'auto'; // Reset any inset values
  vf.style.pointerEvents = 'none'; // Let scroll/click events pass through to the page

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
    const isDesktop = vw > 991;
    const isTablet = vw <= 991 && vw > 767;
    const isMobileLandscape = vw <= 767 && vw > 479;
    const isMobilePortrait = vw <= 479;

    let startWidth, startTop, startLeft, textSlide;

    if (isDesktop) {
      startWidth = 240;
      startTop = vh * 0.28;
      startLeft = vw * 0.208; // ~300px at 1440px, scales with viewport width
      textSlide = -500;
    } else if (isTablet) {
      startWidth = 170;
      startTop = vh * 0.28;
      startLeft = vw * 0.234; // ~180px at 768px
      textSlide = -400;
    } else if (isMobileLandscape) {
      startWidth = 225;
      startTop = vh * 0.31;
      startLeft = vw * 0.34;
      textSlide = -350;
    } else if (isMobilePortrait) {
      startWidth = 140;
      startTop = vh * 0.31;
      startLeft = vw * 0.354;
      textSlide = -300;
    } else {
      startWidth = 240;
      startTop = vh * 0.28;
      startLeft = vw * 0.208;
      textSlide = -350;
    }

    const startHeight = startWidth * (9 / 16);

    return {
      startWidth,
      startHeight,
      startLeft,
      startTop,
      endWidth: vw,
      endHeight: vh,
      endLeft: 0,
      endTop: 0,
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
    zIndex: 0,
  });

  gsap.set('#headline .clip-inner, #headingOverlay .clip-inner', {
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
      '#headline .clip-inner, #headingOverlay .clip-inner',
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
    .to(vf, { opacity: 1, duration: 0.6 }, '-=.3'); // Reduced offset so video appears after headline finishes

  let ANIM_TRAVEL = window.innerHeight * 1.2;
  let HOLD_TRAVEL = window.innerHeight * 0.9;
  let TOTAL_TRAVEL = ANIM_TRAVEL + HOLD_TRAVEL;

  function recalculateTravelValues() {
    ANIM_TRAVEL = window.innerHeight * 1.2;
    HOLD_TRAVEL = window.innerHeight * 0.9;
    TOTAL_TRAVEL = ANIM_TRAVEL + HOLD_TRAVEL;
  }

  if (heroOuter) {
    heroOuter.style.height = `${window.innerHeight + TOTAL_TRAVEL}px`;

    // Separate scroll handler for text animations that responds to page scroll immediately
    const TEXT_FADE_DISTANCE = window.innerHeight * 0.5; // Distance to fully fade text
    const Z_CHANGE_DISTANCE = window.innerHeight * 0.55; // Z-index changes slightly after text fades

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
      if (headlineOverlay) {
        gsap.set(headlineOverlay, {
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

      if (heroBg) {
        gsap.set(heroBg, {
          y: (textSlide / 2) * textProgress, // Subtle parallax effect
          opacity: 0.5 - textProgress * 0.8, // Fade out slightly slower than text
          filter: `blur(${textProgress * 8}px)`, // Less blur than text for a softer effect
        });
      }

      // Manage video z-index based on scroll distance (not capped textProgress)
      // This allows a buffer beyond text fade completion
      if (scrollY < Z_CHANGE_DISTANCE) {
        gsap.set(vf, { zIndex: 0 }); // Sandwiched
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

    function buildOnUpdate() {
      return function onUpdate(self) {
        const rawScrolled = self.progress * TOTAL_TRAVEL;
        const animProgress = Math.min(1, rawScrolled / ANIM_TRAVEL);

        if (navControl) {
          if (animProgress >= 0.05 && navControl.navLocked) {
            navControl.setNavLocked(false);
          } else if (animProgress < 0.05 && !navControl.navLocked) {
            navControl.setNavLocked(true);
          }
        }

        const p = animProgress;
        const ep = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

        if (heroSticky) {
          heroSticky.style.marginLeft = `${gsap.utils.interpolate(initialHeroStickyMargin, 0, ep)}px`;
        }

        if (ep >= 0.99) {
          gsap.set(vf, {
            width: endWidth,
            height: endHeight,
            left: 0,
            top: 0,
            rotation: 0,
            borderRadius: 0,
            boxShadow: 'none',
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
          });
        }
      };
    }

    function buildTrigger() {
      return ScrollTrigger.create({
        trigger: heroOuter,
        start: 'top top',
        end: () => `+=${TOTAL_TRAVEL}`,
        scrub: true,
        onEnter() {
          // Restore fixed positioning in case user scrolled back up from below
          vf.style.position = 'fixed';
          vf.style.willChange = 'width, height, top, left, border-radius';
        },
        onLeave(self) {
          // Switch from fixed to absolute so the video sits at this point in the
          // document and scrolls off naturally when the user continues past the hero.
          // top = self.end ensures the video's top edge is at the viewport top
          // at exactly the scroll position where the trigger ends.
          gsap.set(vf, {
            position: 'absolute',
            top: self.end,
            left: 0,
            width: endWidth,
            height: endHeight,
            rotation: 0,
            borderRadius: 0,
            boxShadow: 'none',
          });
          vf.style.willChange = 'auto';
        },
        onEnterBack() {
          // User scrolled back into the hero — restore fixed so the animation resumes
          vf.style.position = 'fixed';
          vf.style.willChange = 'width, height, top, left, border-radius';
        },
        onLeaveBack() {
          vf.style.willChange = 'auto';
        },
        onUpdate: buildOnUpdate(),
      });
    }

    let heroTrigger = buildTrigger();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        recalculateTravelValues();

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

        initialHeroStickyMargin = getHeroStickyMargin();
        heroOuter.style.height = `${window.innerHeight + TOTAL_TRAVEL}px`;

        // Reset video to starting position — onUpdate may not fire on refresh
        // if scrollY is at/before the trigger boundary, leaving stale inline styles
        gsap.set(vf, {
          position: 'fixed',
          width: startWidth,
          height: startHeight,
          left: startLeft,
          top: startTop,
          rotation: -4,
          borderRadius: 6,
        });

        // Fully rebuild the trigger so it uses fresh values and recalculates positions
        heroTrigger.kill();
        heroTrigger = buildTrigger();

        ScrollTrigger.refresh();
      }, 150);
    });
  }
}
