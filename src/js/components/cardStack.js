import gsap from 'gsap';

/**
 * Initializes swipeable card stack
 * Cards can be swiped left/right with mouse or touch
 * @param {string} containerSelector - Selector for the card stack container
 * @param {Object} options - Configuration options
 */
export function initCardStack(containerSelector = '.card-stack', options = {}) {
  const defaults = {
    swipeThreshold: 100, // Minimum distance to trigger swipe
    rotationMultiplier: 0.1, // Card rotation during drag
    stackSpacing: 8, // Vertical spacing between stacked cards
    stackScale: 0.95, // Scale reduction for cards in stack
    onSwipeLeft: null, // Callback when card swiped left
    onSwipeRight: null, // Callback when card swiped right
    onStackEmpty: null, // Callback when all cards swiped
  };

  const config = { ...defaults, ...options };

  const containers = document.querySelectorAll(containerSelector);
  if (!containers.length) {
    console.warn(`Card stack: No containers found for selector "${containerSelector}"`);
    return;
  }

  containers.forEach((container) => {
    const cards = Array.from(container.querySelectorAll('.card-stack-item'));
    if (cards.length === 0) {
      console.warn('Card stack: No .card-stack-item elements found in container');
      return;
    }

    let currentIndex = 0;

    // Generate random offsets for natural stack appearance
    const cardOffsets = cards.map((_, index) => ({
      rotation: (Math.random() - 0.5) * 8, // -4 to 4 degrees
      x: (Math.random() - 0.5) * 20, // -10 to 10 pixels
      y: Math.random() * 3, // 0 to 3 pixels extra vertical spacing
    }));

    // Position cards in stack
    function positionCards() {
      cards.forEach((card, index) => {
        const offset = index - currentIndex;
        const isActive = index === currentIndex;

        if (offset < 0) {
          // Already swiped cards - hide them
          gsap.set(card, {
            display: 'none',
          });
        } else {
          // Cards in stack with natural variation
          const cardOffset = cardOffsets[index];
          gsap.set(card, {
            display: 'block',
            x: isActive ? 0 : cardOffset.x,
            y: offset * config.stackSpacing + (isActive ? 0 : cardOffset.y),
            rotation: isActive ? 0 : cardOffset.rotation,
            scale: Math.pow(config.stackScale, offset),
            zIndex: cards.length - offset,
            opacity: 1,
            pointerEvents: isActive ? 'auto' : 'none',
          });
        }
      });
    }

    // Animate card out
    function swipeCard(card, direction) {
      const directionMultiplier = direction === 'right' ? 1 : -1;
      const exitX = window.innerWidth * directionMultiplier;
      const exitRotation = directionMultiplier * 20;

      gsap.to(card, {
        x: exitX,
        rotation: exitRotation,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          currentIndex++;

          // Check if stack is empty
          if (currentIndex >= cards.length) {
            if (config.onStackEmpty) config.onStackEmpty();
          } else {
            positionCards();
          }
        },
      });

      // Animate next cards in stack
      cards.forEach((c, index) => {
        if (index > currentIndex && index <= currentIndex + 2) {
          const offset = index - (currentIndex + 1);
          const isNowActive = index === currentIndex + 1;
          const cardOffset = cardOffsets[index];

          gsap.to(c, {
            x: isNowActive ? 0 : cardOffset.x,
            y: offset * config.stackSpacing + (isNowActive ? 0 : cardOffset.y),
            rotation: isNowActive ? 0 : cardOffset.rotation,
            scale: Math.pow(config.stackScale, offset),
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      });

      // Call appropriate callback
      if (direction === 'left' && config.onSwipeLeft) {
        config.onSwipeLeft(card, currentIndex);
      } else if (direction === 'right' && config.onSwipeRight) {
        config.onSwipeRight(card, currentIndex);
      }
    }

    // Initialize cards
    positionCards();

    // Make each card draggable with pointer events
    cards.forEach((card, index) => {
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let currentY = 0;
      let isDragging = false;

      function onPointerDown(e) {
        if (index !== currentIndex) return;

        isDragging = true;
        startX = e.clientX || e.touches?.[0]?.clientX || 0;
        startY = e.clientY || e.touches?.[0]?.clientY || 0;

        card.style.cursor = 'grabbing';
        e.preventDefault();
      }

      function onPointerMove(e) {
        if (!isDragging || index !== currentIndex) return;

        const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
        const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

        currentX = clientX - startX;
        currentY = clientY - startY;

        // Rotate card based on drag
        const rotation = currentX * config.rotationMultiplier;

        // Fade card based on distance
        const dragDistance = Math.abs(currentX);
        const opacity = Math.max(0.3, 1 - dragDistance / 300);

        gsap.set(card, {
          x: currentX,
          y: currentY,
          rotation,
          opacity,
        });

        e.preventDefault();
      }

      function onPointerUp() {
        if (!isDragging || index !== currentIndex) return;

        isDragging = false;
        card.style.cursor = 'grab';

        const dragDistance = Math.abs(currentX);

        // Check if swipe threshold met
        if (dragDistance > config.swipeThreshold) {
          const direction = currentX > 0 ? 'right' : 'left';
          swipeCard(card, direction);
        } else {
          // Return to center
          gsap.to(card, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        }

        currentX = 0;
        currentY = 0;
      }

      // Mouse events
      card.addEventListener('mousedown', onPointerDown);
      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('mouseup', onPointerUp);

      // Touch events
      card.addEventListener('touchstart', onPointerDown, { passive: false });
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);
    });

    // Add programmatic swipe methods to container
    container.swipeLeft = () => {
      if (currentIndex < cards.length) {
        swipeCard(cards[currentIndex], 'left');
      }
    };

    container.swipeRight = () => {
      if (currentIndex < cards.length) {
        swipeCard(cards[currentIndex], 'right');
      }
    };

    container.reset = () => {
      currentIndex = 0;
      positionCards();
    };

    container.getCurrentCard = () => {
      return cards[currentIndex] || null;
    };

    container.getCardsRemaining = () => {
      return cards.length - currentIndex;
    };
  });
}
