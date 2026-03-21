import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes horizontal scrolling section with card animations
 */
export function initHorizontalScroll() {
  const horizSection = document.getElementById('horizSection');
  const horizTrack = document.getElementById('horizTrack');
  const horizIntro = document.getElementById('horizIntro');
  const horizOutro = document.getElementById('horizOutro');
  const horizDots = document.getElementById('horizDots');
  const CARDS = horizTrack ? horizTrack.querySelectorAll('.hcard') : [];
  const VH = window.innerHeight;

  if (!horizSection) return;

  const INTRO_HOLD = VH * 0.7;
  const INTRO_FADE = VH * 0.4;
  const OUTRO_FADE = VH * 0.4;
  const OUTRO_HOLD = VH * 0.7;

  if (horizDots) {
    CARDS.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = `h-dot${i === 0 ? ' active' : ''}`;
      horizDots.appendChild(d);
    });
  }
  const dots = horizDots ? horizDots.querySelectorAll('.h-dot') : [];

  function getCardScrollDist() {
    return window.innerWidth + (horizTrack ? horizTrack.scrollWidth : 0);
  }

  function getTotalExtra() {
    return INTRO_HOLD + INTRO_FADE + getCardScrollDist() + OUTRO_FADE + OUTRO_HOLD;
  }

  function updateHorizHeight() {
    if (horizSection) horizSection.style.height = `${VH + getTotalExtra()}px`;
  }

  updateHorizHeight();

  window.addEventListener('resize', () => {
    updateHorizHeight();
    ScrollTrigger.refresh();
  });

  ScrollTrigger.create({
    trigger: horizSection,
    start: 'top top',
    end: () => `+=${getTotalExtra()}`,
    scrub: 0.1,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const cardScrollDist = getCardScrollDist();
      const totalExtra = getTotalExtra();
      const scrolled = self.progress * totalExtra;
      const b1 = INTRO_HOLD;
      const b2 = b1 + INTRO_FADE;
      const b3 = b2 + cardScrollDist;
      const b4 = b3 + OUTRO_FADE;

      const introOp = scrolled <= b1 ? 1 : scrolled <= b2 ? 1 - (scrolled - b1) / INTRO_FADE : 0;
      if (horizIntro)
        gsap.set(horizIntro, {
          opacity: introOp,
          pointerEvents: introOp > 0.01 ? 'auto' : 'none',
        });

      const cardProgress =
        scrolled <= b2 ? 0 : scrolled <= b3 ? (scrolled - b2) / cardScrollDist : 1;
      const xStart = window.innerWidth;
      const xEnd = -(horizTrack ? horizTrack.scrollWidth : 0);
      if (horizTrack)
        gsap.set(horizTrack, {
          x: gsap.utils.interpolate(xStart, xEnd, cardProgress),
        });

      const vw = window.innerWidth;
      const arcDip = 180,
        maxRot = 14;
      const depthVar = [0, 18, -12, 22, -8, 16];
      CARDS.forEach((card, i) => {
        const cardW = card.offsetWidth;
        const trackX = gsap.utils.interpolate(xStart, xEnd, cardProgress);
        const screenCX = card.offsetLeft + cardW / 2 + trackX;
        const norm = (screenCX - vw / 2) / (vw / 2);
        const clamped = Math.max(-1.6, Math.min(1.6, norm));
        gsap.set(card, {
          y: arcDip * (clamped * clamped) + (depthVar[i] || 0),
          rotation: maxRot * clamped * 0.7,
          overwrite: 'auto',
        });
      });

      const outroOp = scrolled <= b3 ? 0 : scrolled <= b4 ? (scrolled - b3) / OUTRO_FADE : 1;
      if (horizOutro)
        gsap.set(horizOutro, {
          opacity: outroOp,
          pointerEvents: outroOp > 0.5 ? 'auto' : 'none',
        });

      const activeIdx = Math.round(cardProgress * (CARDS.length - 1));
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    },
  });
}
