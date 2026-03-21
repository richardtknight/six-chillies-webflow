import gsap from 'gsap';

/**
 * Initializes hamburger menu with animated overlay
 * @param {Object} lenis - Lenis smooth scroll instance
 */
export function initHamburger(lenis) {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('menu-overlay');
  const bar1 = document.getElementById('bar-1');
  const bar2 = document.getElementById('bar-2');
  const bar3 = document.getElementById('bar-3');
  const menuHeader = document.getElementById('menu-header');
  const menuDivider = document.getElementById('menu-divider');
  const menuFooter = document.getElementById('menu-footer');
  const accentLine = document.getElementById('accent-line');
  const bgNumber = document.getElementById('bg-number');
  const navItems = document.querySelectorAll('.nav-item');
  const navInners = document.querySelectorAll('.nav-item-inner');

  if (!hamburger || !overlay || !bar1 || !bar2 || !bar3) return;

  let isOpen = false;
  let openTL = null;
  let closeTL = null;

  function getHamburgerOrigin() {
    const rect = hamburger.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return {
      x: cx,
      y: cy,
      xPct: ((cx / window.innerWidth) * 100).toFixed(2),
      yPct: ((cy / window.innerHeight) * 100).toFixed(2),
    };
  }

  function buildOpenTL() {
    const { xPct, yPct } = getHamburgerOrigin();
    gsap.set(overlay, { clipPath: `circle(0% at ${xPct}% ${yPct}%)` });

    const tl = gsap.timeline({ paused: true });

    // Hamburger → X
    tl.to(bar2, { scaleX: 0, opacity: 0, duration: 0.2, ease: 'power3.in' }, 0)
      .to(bar1, { y: 6.5, duration: 0.22, ease: 'power3.inOut' }, 0)
      .to(bar3, { y: -6.5, duration: 0.22, ease: 'power3.inOut' }, 0)
      .to(bar1, { rotation: 45, duration: 0.3, ease: 'expo.out' }, 0.18)
      .to(bar3, { rotation: -45, duration: 0.3, ease: 'expo.out' }, 0.18);

    // Overlay circle burst
    tl.to(
      overlay,
      {
        clipPath: `circle(170% at ${xPct}% ${yPct}%)`,
        duration: 0.85,
        ease: 'power4.inOut',
      },
      0.05
    );

    // Accent line draws down
    if (accentLine)
      tl.to(accentLine, { scaleY: 1, opacity: 1, duration: 0.7, ease: 'expo.out' }, 0.45);

    // Header row fades in
    if (menuHeader) tl.to(menuHeader, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.5);

    // Divider draws in
    if (menuDivider) tl.to(menuDivider, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, 0.52);

    // Nav items rise from clip
    gsap.set(navInners, { y: '110%', opacity: 1 });
    tl.to(
      navInners,
      {
        y: '0%',
        duration: 0.65,
        ease: 'expo.out',
        stagger: { each: 0.07, from: 'start' },
      },
      0.55
    );

    // Footer fades in
    if (menuFooter) tl.to(menuFooter, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.85);

    return tl;
  }

  function buildCloseTL() {
    const { xPct, yPct } = getHamburgerOrigin();

    const tl = gsap.timeline({
      paused: true,
      onComplete() {
        overlay.classList.remove('is-open');
        if (menuHeader) gsap.set(menuHeader, { opacity: 0 });
        if (menuDivider) gsap.set(menuDivider, { scaleX: 0 });
        if (menuFooter) gsap.set(menuFooter, { opacity: 0 });
        if (accentLine) gsap.set(accentLine, { scaleY: 0, opacity: 0 });
      },
    });

    const fadeOuts = [menuFooter, menuHeader].filter(Boolean);
    if (fadeOuts.length) {
      tl.to(fadeOuts, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0);
    }

    const innerEls = [...navInners].filter(Boolean);
    if (innerEls.length) {
      tl.to(
        innerEls,
        {
          y: '110%',
          duration: 0.4,
          ease: 'power4.in',
          stagger: { each: 0.05, from: 'end' },
        },
        0.05
      );
    }

    tl.to(
      overlay,
      {
        clipPath: `circle(0% at ${xPct}% ${yPct}%)`,
        duration: 0.65,
        ease: 'power4.inOut',
      },
      0.1
    );

    tl.to(bar1, { rotation: 0, duration: 0.28, ease: 'power3.inOut' }, 0.15)
      .to(bar3, { rotation: 0, duration: 0.28, ease: 'power3.inOut' }, 0.15)
      .to(bar1, { y: 0, duration: 0.25, ease: 'expo.out' }, 0.35)
      .to(bar3, { y: 0, duration: 0.25, ease: 'expo.out' }, 0.35)
      .to(bar2, { scaleX: 1, opacity: 1, duration: 0.25, ease: 'power3.out' }, 0.4);

    return tl;
  }

  function openMenu() {
    if (isOpen) return;
    isOpen = true;

    if (closeTL) {
      closeTL.kill();
      closeTL = null;
    }

    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('is-open');
    overlay.classList.add('is-open');

    if (lenis) lenis.stop();

    openTL = buildOpenTL();
    openTL.play();
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    if (openTL) {
      openTL.kill();
      openTL = null;
    }

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('is-open');

    closeTL = buildCloseTL();
    closeTL.play();

    setTimeout(() => {
      if (lenis) lenis.start();
    }, 700);
  }

  // Nav item hover — update background number
  navItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const idx = item.dataset.index || '1';

      gsap.to(bgNumber, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.15,
        ease: 'power2.in',
        onComplete() {
          bgNumber.textContent = idx;
          gsap.fromTo(
            bgNumber,
            { y: 20, scale: 1.05 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: 'power3.out',
            }
          );
        },
      });
    });
  });

  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Resize — recompute clip origin
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isOpen) {
        const { xPct, yPct } = getHamburgerOrigin();
        gsap.set(overlay, { clipPath: `circle(0% at ${xPct}% ${yPct}%)` });
      }
    }, 150);
  });
}
