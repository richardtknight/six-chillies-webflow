import { splitIntoChars } from './textSplit';

// Use global GSAP instance set up in main.js
const gsap = window.gsap;

// Characters to use for text scramble effect
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&*';

/**
 * Scrambles text and then reveals it character by character
 * @param {HTMLElement} element - Text element to scramble
 * @param {number} duration - Total duration in milliseconds
 * @returns {Promise} Promise that resolves when animation completes
 */
function scrambleText(element, duration = 600) {
  return new Promise((resolve) => {
    const originalText = element.textContent;
    const textLength = originalText.length;
    let frame = 0;
    const totalFrames = Math.floor(duration / 30); // ~30ms per frame

    const interval = setInterval(() => {
      // Calculate how many characters should be revealed
      const revealedCount = Math.floor((frame / totalFrames) * textLength);

      // Build the new text: revealed chars + scrambled remaining chars
      let newText = '';
      for (let i = 0; i < textLength; i++) {
        if (i < revealedCount) {
          // Character is revealed
          newText += originalText[i];
        } else if (originalText[i] === ' ') {
          // Keep spaces as spaces
          newText += ' ';
        } else {
          // Scramble this character
          newText += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }

      element.textContent = newText;
      frame++;

      if (frame >= totalFrames) {
        element.textContent = originalText; // Ensure final text is exact
        clearInterval(interval);
        resolve();
      }
    }, 30);
  });
}

/**
 * Peel reveal animation for text lines
 * @param {string} selector - CSS selector for elements
 * @param {string} trigger - ScrollTrigger element
 * @param {Object} opts - Animation options
 */
export function peelReveal(selector, trigger, opts = {}) {
  const lines = document.querySelectorAll(`${selector} .clip-inner`);
  if (!lines.length) return;
  gsap.set(lines, {
    display: 'block',
    y: '105%',
    scaleX: 0.78,
    rotation: -2.5,
    transformOrigin: '0% 100%',
    opacity: 0,
  });
  gsap.to(lines, {
    y: '0%',
    scaleX: 1,
    rotation: 0,
    opacity: 1,
    duration: opts.duration || 0.85,
    stagger: opts.stagger || 0.13,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: trigger || selector,
      start: opts.start || 'top 80%',
      toggleActions: 'play reverse play reverse',
    },
  });
}

/**
 * Simple fade-in animation for eyebrow text
 * @param {string} selector - CSS selector
 * @param {string} trigger - ScrollTrigger element
 */
export function eyebrowReveal(selector, trigger) {
  const el = document.querySelector(selector);
  if (!el) return;
  gsap.from(el, {
    opacity: 0,
    y: 10,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: trigger || selector,
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  });
}

/**
 * Zoom reveal animation for images
 * Images start zoomed in and scale down to normal size on scroll
 * Also adds hover effect to zoom in to 120% on hover
 * @param {string} selector - CSS selector for images
 * @param {string} trigger - ScrollTrigger element (optional, defaults to selector)
 * @param {Object} opts - Animation options
 */
export function imageZoomReveal(selector, trigger, opts = {}) {
  const images = document.querySelectorAll(selector);
  if (!images.length) return;

  images.forEach((img) => {
    // Ensure the image wrapper has overflow hidden to prevent zoomed image from extending beyond bounds
    if (img.parentElement) {
      img.parentElement.style.overflow = 'hidden';
    }

    // Track if animation is complete
    img.dataset.scrollComplete = 'false';

    // Create the zoom animation with proper initial state
    gsap.from(img, {
      scale: 1.3,
      duration: opts.duration || 1.2,
      ease: opts.ease || 'power2.out',
      immediateRender: true, // Ensure initial state is set immediately
      scrollTrigger: {
        trigger: trigger || img,
        start: opts.start || 'top 80%',
        toggleActions: 'play reverse play reverse',
      },
      onComplete: () => {
        // Mark as complete when the animation tween finishes
        img.dataset.scrollComplete = 'true';
      },
      onReverseComplete: () => {
        // Mark as incomplete when animation reverses (scrolling back up)
        img.dataset.scrollComplete = 'false';
      },
    });

    // Add hover effect that respects scroll animation
    img.addEventListener('mouseenter', () => {
      // Only zoom in on hover if scroll animation has completed
      if (img.dataset.scrollComplete === 'true') {
        gsap.to(img, {
          scale: 1.2,
          duration: 0.8,
          ease: 'power1.inOut',
        });
      }
    });

    img.addEventListener('mouseleave', () => {
      if (img.dataset.scrollComplete === 'true') {
        gsap.to(img, {
          scale: 1,
          duration: 0.8,
          ease: 'power1.inOut',
        });
      }
    });
  });
}

/**
 * Simple fade-in and slide-up reveal animation
 * Apply to any element with data-fade-slide attribute
 * @param {string} selector - CSS selector for elements
 * @param {Object} options - Animation options
 */
export function fadeSlideReveal(selector, options = {}) {
  const defaults = {
    y: 30, // Distance to slide up from
    duration: 1.2,
    ease: 'power4.out',
    stagger: 0,
    start: 'top 85%',
    delay: 0,
  };
  const cfg = Object.assign({}, defaults, options);
  const elements = document.querySelectorAll(selector);

  if (!elements.length) return;

  elements.forEach((el) => {
    // Read data attributes for per-element customization
    const dataY = parseFloat(el.dataset.fadeSlideY) || cfg.y;
    const dataDuration = parseFloat(el.dataset.fadeSlideDuration) || cfg.duration;
    const dataDelay = parseFloat(el.dataset.fadeSlideDelay) || cfg.delay;
    const dataStart = el.dataset.fadeSlideStart || cfg.start;

    gsap.from(el, {
      opacity: 0,
      y: dataY,
      duration: dataDuration,
      delay: dataDelay,
      ease: cfg.ease,
      scrollTrigger: {
        trigger: el,
        start: dataStart,
        toggleActions: 'play reverse play reverse',
      },
    });
  });
}

/**
 * Character-by-character stagger reveal animation
 * @param {string|HTMLElement} selector - CSS selector or element
 * @param {Object} options - Animation options
 */
export function charStaggerReveal(selector, options = {}) {
  const defaults = {
    stagger: 0.025,
    duration: 0.7,
    ease: 'power3.out',
    from: { y: '110%', opacity: 0 },
    delay: 0,
    start: 'top 85%',
  };
  const cfg = Object.assign({}, defaults, options);
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];

  elements.forEach((el) => {
    if (!el) return;
    const dataStagger = parseFloat(el.dataset.stagger) || cfg.stagger;
    const dataDelay = parseFloat(el.dataset.delay) || cfg.delay;
    let dataFrom = cfg.from;
    try {
      if (el.dataset.from) dataFrom = JSON.parse(el.dataset.from);
    } catch (_e) {
      // Ignore invalid JSON in data-from attribute
    }

    const chars = splitIntoChars(el);
    if (!chars.length) return;

    gsap.set(chars, dataFrom);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: cfg.start,
          toggleActions: 'play reverse play reverse',
        },
      })
      .to(chars, {
        y: 0,
        opacity: 1,
        duration: cfg.duration,
        stagger: dataStagger,
        ease: cfg.ease,
        delay: dataDelay,
      });
  });
}

/**
 * Adds sophisticated hover effects to CTA arrow buttons
 * - Rotates arrow icon by 45 degrees
 * - Scrambles and reveals text
 * - Smooth transitions
 * @param {string} selector - CSS selector for CTA buttons (default: '.cta-arrow')
 */
export function initCtaArrowHover(selector = '.cta-arrow') {
  const buttons = document.querySelectorAll(selector);
  if (!buttons.length) return;

  buttons.forEach((button) => {
    // Find the arrow image and text element within this button
    const arrowImg = button.querySelector('img');
    const textElement = button.querySelector('.text-block-44, [class*="text-block"]');

    if (!arrowImg || !textElement) return;

    // Store original text and measure width
    const originalText = textElement.textContent;
    const originalWidth = textElement.offsetWidth;
    let isHovering = false;
    let scrambleTimeout = null;

    button.addEventListener('mouseenter', () => {
      isHovering = true;

      // Lock the text element width to prevent jitter during scramble
      textElement.style.width = `${originalWidth}px`;
      textElement.style.display = 'inline-block';

      // Rotate arrow 45 degrees clockwise - MUCH faster than text scramble
      gsap.to(arrowImg, {
        rotation: 45,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Slight scale up on the entire button for premium feel
      gsap.to(button, {
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Start text scramble after a tiny delay for stagger effect
      scrambleTimeout = setTimeout(() => {
        if (isHovering) {
          scrambleText(textElement, 500);
        }
      }, 100);
    });

    button.addEventListener('mouseleave', () => {
      isHovering = false;
      clearTimeout(scrambleTimeout);

      // Reset arrow rotation
      gsap.to(arrowImg, {
        rotation: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });

      // Reset button scale
      gsap.to(button, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      });

      // Reset text and width immediately (in case scramble was in progress)
      textElement.textContent = originalText;
      textElement.style.width = '';
      textElement.style.display = '';
    });
  });
}

/**
 * Creates a 3D floating orbit animation for images with mouse interaction
 * Images float in an elliptical 3D space and react to mouse proximity
 * @param {string} containerSelector - Container element selector
 * @param {Object} options - Animation options
 */
export function init3DFloatingOrbit(containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const images = Array.from(container.querySelectorAll('img'));
  if (!images.length) return;

  const config = {
    radiusX: options.radiusX || 150, // Horizontal radius
    radiusY: options.radiusY || 100, // Vertical radius
    radiusZ: options.radiusZ || 80, // Depth radius
    rotationSpeed: options.rotationSpeed || 0.0008, // Radians per frame
    mouseInfluence: options.mouseInfluence || 80, // Pixels of magnetic pull
    hoverScale: options.hoverScale || 1.3, // Scale on hover
    ...options,
  };

  // Set up container for 3D perspective
  container.style.perspective = '1200px';
  container.style.perspectiveOrigin = '50% 50%';
  container.style.position = 'relative';
  container.style.transformStyle = 'preserve-3d';

  // Track state for each image
  const imageStates = images.map((img, index) => {
    const angle = (index / images.length) * Math.PI * 2;

    // Set up image styles
    img.style.position = 'absolute';
    img.style.top = '50%';
    img.style.left = '50%';
    img.style.transformStyle = 'preserve-3d';
    img.style.cursor = 'pointer';
    img.style.transition = 'filter 0.3s ease';

    return {
      img,
      angle,
      baseAngle: angle,
      isHovered: false,
      wasHovered: false,
      mouseOffset: { x: 0, y: 0 },
      // Random offsets for organic movement
      randomOffset1: Math.random() * Math.PI * 2,
      randomOffset2: Math.random() * Math.PI * 2,
      randomOffset3: Math.random() * Math.PI * 2,
      // Random speed multipliers for varied movement
      randomSpeed1: 0.8 + Math.random() * 0.4, // 0.8-1.2x
      randomSpeed2: 0.7 + Math.random() * 0.6, // 0.7-1.3x
      randomSpeed3: 0.9 + Math.random() * 0.3, // 0.9-1.2x
    };
  });

  // Mouse tracking
  let mouseX = 0;
  let mouseY = 0;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left - rect.width / 2;
    mouseY = e.clientY - rect.top - rect.height / 2;
  });

  container.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  // Add hover effects to each image
  imageStates.forEach((state) => {
    state.img.addEventListener('mouseenter', () => {
      state.isHovered = true;
      gsap.to(state.img, {
        scale: config.hoverScale,
        filter: 'brightness(1.2)',
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    state.img.addEventListener('mouseleave', () => {
      state.isHovered = false;
      gsap.to(state.img, {
        scale: 1,
        filter: 'brightness(1)',
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  });

  // Animation loop
  function animate() {
    imageStates.forEach((state) => {
      // Increment angle for constant rotation
      state.angle += config.rotationSpeed;

      // Calculate base elliptical position
      const baseX = Math.cos(state.angle) * config.radiusX;
      const baseY = Math.sin(state.angle) * config.radiusY;
      const baseZ = Math.sin(state.angle * 2) * config.radiusZ;

      // Add organic jitter using random offsets and speed multipliers
      const jitterX =
        Math.sin(state.angle * state.randomSpeed1 + state.randomOffset1) * 10 +
        Math.cos(state.angle * 0.5 * state.randomSpeed2 + state.randomOffset2) * 5;
      const jitterY =
        Math.cos(state.angle * state.randomSpeed2 + state.randomOffset2) * 8 +
        Math.sin(state.angle * 0.7 * state.randomSpeed1 + state.randomOffset1) * 4;
      const jitterZ = Math.sin(state.angle * 1.5 * state.randomSpeed3 + state.randomOffset3) * 6;

      // Calculate distance from mouse
      const dx = mouseX - baseX;
      const dy = mouseY - baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Apply mouse influence (magnetic effect) and jitter
      let finalX = baseX + jitterX;
      let finalY = baseY + jitterY;
      let finalZ = baseZ + jitterZ;

      if (distance < config.mouseInfluence && distance > 0) {
        const influence = (1 - distance / config.mouseInfluence) * 0.3;
        finalX += dx * influence;
        finalY += dy * influence;
      }

      // When hovered, bring to front
      if (state.isHovered) {
        finalZ = config.radiusZ * 1.5;
      }

      // Calculate depth-based scale and opacity for depth perception
      const depthScale = 0.7 + ((finalZ + config.radiusZ) / (config.radiusZ * 2)) * 0.3;
      const opacity = 0.6 + ((finalZ + config.radiusZ) / (config.radiusZ * 2)) * 0.4;

      // Smooth scale transition when hover state changes
      if (state.isHovered !== state.wasHovered) {
        const targetScale = state.isHovered ? config.hoverScale : depthScale;
        const targetOpacity = state.isHovered ? 1 : opacity;

        gsap.to(state.img, {
          scale: targetScale,
          opacity: targetOpacity,
          duration: 0.5,
          ease: 'power2.out',
        });

        state.wasHovered = state.isHovered;
      }

      // Apply position transforms (always immediate for smooth orbit)
      gsap.set(state.img, {
        x: finalX,
        y: finalY,
        z: finalZ,
        rotateY: (finalZ / config.radiusZ) * 15, // Slight rotation based on depth
        zIndex: Math.round(finalZ + 100),
      });
    });

    requestAnimationFrame(animate);
  }

  // Start animation
  animate();

  // Return cleanup function
  return () => {
    imageStates.forEach((state) => {
      state.img.removeEventListener('mouseenter', null);
      state.img.removeEventListener('mouseleave', null);
    });
  };
}
