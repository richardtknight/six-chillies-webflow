const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

/**
 * Sticky Timeline section — sticky left sidebar with animated right panels.
 *
 * Expected Webflow HTML structure (add these classes in Webflow):
 *
 *  <section class="sticky-timeline">
 *    <div class="st-left">
 *      <div class="st-left-content">
 *        <!-- Static text/stats — stays visible throughout -->
 *      </div>
 *      <div class="st-progress-track">
 *        <div class="st-progress-bar"></div>
 *      </div>
 *      <div class="st-dots"></div>   <!-- auto-populated by JS -->
 *    </div>
 *    <div class="st-panels">
 *      <!-- Repeat .st-panel for each item -->
 *      <div class="st-panel">
 *        <div class="st-image">
 *          <img src="..." alt="...">
 *        </div>
 *        <div class="st-content">
 *          <h3 class="st-title">Title</h3>
 *          <p class="st-desc">Description</p>
 *        </div>
 *      </div>
 *    </div>
 *  </section>
 *
 * Multiple .sticky-timeline sections on one page are supported.
 */
export function initStickyTimeline() {
  const sections = document.querySelectorAll('.sticky-timeline');
  if (!sections.length) return;

  sections.forEach((section) => {
    const panels = section.querySelectorAll('.st-panel');
    const progressBar = section.querySelector('.st-progress-bar');
    const dotsWrap = section.querySelector('.st-dots');

    if (!panels.length) return;

    // ── Build navigation dots ─────────────────────────────────────────────
    const dots = [];
    if (dotsWrap) {
      panels.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'st-dot';
        dot.setAttribute('aria-label', `Go to item ${i + 1}`);
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function setActiveIdx(idx) {
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    setActiveIdx(0);

    // ── Per-panel content animations ──────────────────────────────────────
    panels.forEach((panel) => {
      const image = panel.querySelector('.st-image');
      const title = panel.querySelector('.st-title');
      const desc = panel.querySelector('.st-desc');

      // Initial hidden state
      if (image) gsap.set(image, { opacity: 0, scale: 0.93, y: 30 });
      if (title) gsap.set(title, { opacity: 0, y: 26 });
      if (desc) gsap.set(desc, { opacity: 0, y: 18 });

      const tl = gsap.timeline({ paused: true });

      if (image) tl.to(image, { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'power3.out' });
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.45');
      if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.4');

      ScrollTrigger.create({
        trigger: panel,
        start: 'top 62%',
        end: 'bottom 38%',
        onEnter: () => tl.play(),
        onLeave: () => tl.pause(0),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.pause(0),
      });
    });

    // ── Master trigger: progress bar + active dot ─────────────────────────
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate(self) {
        if (progressBar)
          gsap.set(progressBar, { scaleY: self.progress, transformOrigin: 'top center' });

        const idx = Math.min(Math.floor(self.progress * panels.length), panels.length - 1);
        setActiveIdx(idx);
      },
    });

    // ── Dot click: jump to panel ──────────────────────────────────────────
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const targetY = section.offsetTop + i * window.innerHeight;
        // Use lenis if available (stored globally), otherwise native smooth scroll
        if (window.lenis) {
          window.lenis.scrollTo(targetY, {
            duration: 0.8,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });

    // ── Snap to nearest panel when scroll settles ─────────────────────────
    let snapTimer;
    let isSnapping = false;

    window.addEventListener(
      'scroll',
      () => {
        if (isSnapping) return;

        const scrollY = window.scrollY;
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + panels.length * window.innerHeight;

        if (scrollY < sectionTop || scrollY > sectionBottom) return;

        clearTimeout(snapTimer);
        snapTimer = setTimeout(() => {
          const relY = window.scrollY - section.offsetTop;
          const idx = Math.max(
            0,
            Math.min(panels.length - 1, Math.round(relY / window.innerHeight))
          );
          const snapY = section.offsetTop + idx * window.innerHeight;

          if (Math.abs(window.scrollY - snapY) > 20) {
            isSnapping = true;
            if (window.lenis) {
              window.lenis.scrollTo(snapY, {
                duration: 0.55,
                easing: (t) => 1 - Math.pow(1 - t, 3),
                onComplete: () => {
                  isSnapping = false;
                },
              });
            } else {
              window.scrollTo({ top: snapY, behavior: 'smooth' });
              setTimeout(() => {
                isSnapping = false;
              }, 700);
            }
          }
        }, 250);
      },
      { passive: true }
    );
  });
}
