import gsap from 'gsap';

/**
 * Initializes navigation show/hide behavior on scroll
 * @returns {Object} Object with navLocked state and setNavLocked function
 */
export function initNav() {
  const navEl = document.querySelector('nav');
  if (!navEl) return { navLocked: true, setNavLocked: () => {} };

  let lastScrollY = 0;
  let navVisible = true;
  let navLocked = true;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current < 1 || navLocked) {
      if (!navVisible) {
        navVisible = true;
        gsap.to(navEl, {
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true,
        });
      }
    } else if (current > lastScrollY && navVisible) {
      navVisible = false;
      gsap.to(navEl, {
        y: '-110%',
        duration: 0.4,
        ease: 'power2.inOut',
        overwrite: true,
      });
    } else if (current < lastScrollY && !navVisible) {
      navVisible = true;
      gsap.to(navEl, {
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
    }
    lastScrollY = current;
  });

  return {
    get navLocked() {
      return navLocked;
    },
    setNavLocked(value) {
      navLocked = value;
      if (navLocked) {
        gsap.to(navEl, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        });
        navVisible = true;
      }
    },
    navEl,
  };
}
