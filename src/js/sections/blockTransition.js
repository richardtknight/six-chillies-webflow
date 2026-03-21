import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COLORS } from '../config/constants';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes block grid transition effect
 */
export function initBlockTransition() {
  const btEl = document.getElementById('blockTransition');
  const btGrid = document.getElementById('btGrid');

  if (!btEl || !btGrid) return;

  const COLS = 14,
    ROWS = 5;

  btGrid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  btGrid.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

  const blocks = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const b = document.createElement('div');
      b.className = 'bt-block';
      b.style.width = '100%';
      b.style.height = '100%';
      btGrid.appendChild(b);
      const rowDelay = ((ROWS - 1 - r) / (ROWS - 1)) * 0.22;
      blocks.push({
        el: b,
        start: (c / (COLS - 1)) * 0.32 + rowDelay,
        end: (c / (COLS - 1)) * 0.32 + rowDelay + 0.28,
      });
    }
  }

  ScrollTrigger.create({
    trigger: btEl,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.1,
    onUpdate(self) {
      const p = self.progress;
      blocks.forEach((b) => {
        const lp = Math.max(0, Math.min(1, (p - b.start) / (b.end - b.start)));
        b.el.style.backgroundColor = lp >= 0.5 ? COLORS.chilliBlack : COLORS.offWhite;
      });
    },
  });
}
