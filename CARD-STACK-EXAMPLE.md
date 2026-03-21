# Card Stack Component

A swipeable card stack component built with GSAP. Cards can be swiped left or right with smooth animations.

## HTML Structure

```html
<div class="card-stack-container">
  <!-- Card Stack -->
  <div class="card-stack">
    <div class="card-stack-item">
      <img src="image1.jpg" alt="Card 1">
      <h3>Card Title 1</h3>
      <p>Card description goes here...</p>
    </div>
    <div class="card-stack-item">
      <img src="image2.jpg" alt="Card 2">
      <h3>Card Title 2</h3>
      <p>Card description goes here...</p>
    </div>
    <div class="card-stack-item">
      <img src="image3.jpg" alt="Card 3">
      <h3>Card Title 3</h3>
      <p>Card description goes here...</p>
    </div>
  </div>

  <!-- Optional: Action Buttons -->
  <div class="card-stack-actions">
    <button class="card-stack-btn btn-dislike" onclick="document.querySelector('.card-stack').swipeLeft()">
      ✕
    </button>
    <button class="card-stack-btn btn-like" onclick="document.querySelector('.card-stack').swipeRight()">
      ♥
    </button>
  </div>

  <!-- Optional: Counter -->
  <div class="card-stack-counter">
    <span id="cards-remaining">3</span> cards remaining
  </div>

  <!-- Optional: Empty State -->
  <div class="card-stack-empty">
    <h4>All done!</h4>
    <p>You've reviewed all cards</p>
    <button class="card-stack-reset" onclick="document.querySelector('.card-stack').reset()">
      Start Over
    </button>
  </div>
</div>
```

## JavaScript Initialization

### Basic Usage

```javascript
import { initCardStack } from './components/cardStack';

// Initialize with defaults
initCardStack('.card-stack');
```

### Advanced Usage with Options

```javascript
import { initCardStack } from './components/cardStack';

initCardStack('.card-stack', {
  swipeThreshold: 120,        // Distance before triggering swipe (default: 100)
  rotationMultiplier: 0.15,   // Card rotation intensity (default: 0.1)
  stackSpacing: 10,           // Spacing between stacked cards (default: 8)
  stackScale: 0.92,           // Scale reduction for stacked cards (default: 0.95)

  // Callbacks
  onSwipeLeft: (card, index) => {
    console.log('Swiped left:', card, 'Index:', index);
    updateCounter();
  },
  onSwipeRight: (card, index) => {
    console.log('Swiped right:', card, 'Index:', index);
    updateCounter();
  },
  onStackEmpty: () => {
    console.log('All cards swiped!');
    document.querySelector('.card-stack-empty').classList.add('visible');
  }
});

function updateCounter() {
  const remaining = document.querySelector('.card-stack').getCardsRemaining();
  document.getElementById('cards-remaining').textContent = remaining;
}
```

## API Methods

The card stack container has these programmatic methods:

```javascript
const stack = document.querySelector('.card-stack');

// Swipe current card left
stack.swipeLeft();

// Swipe current card right
stack.swipeRight();

// Reset stack to beginning
stack.reset();

// Get current card element
const currentCard = stack.getCurrentCard();

// Get number of cards remaining
const remaining = stack.getCardsRemaining();
```

## Features

- ✓ Smooth drag and swipe with GSAP animations
- ✓ Mouse and touch support
- ✓ Automatic card stacking with scale and spacing
- ✓ Rotation based on drag distance
- ✓ Opacity fade during drag
- ✓ Swipe threshold configuration
- ✓ Callbacks for swipe events
- ✓ Programmatic swipe controls
- ✓ Stack reset functionality
- ✓ Mobile-friendly touch events

## Customization

### CSS Variables

You can customize colors using CSS variables:

```css
:root {
  --surface: #ffffff;
  --border: #e0e0e0;
  --text: #333333;
  --muted: #666666;
  --chiliRed: #ff3312;
}
```

### Card Content

Cards can contain any HTML content:

```html
<div class="card-stack-item">
  <!-- Custom content here -->
  <div class="custom-header">...</div>
  <div class="custom-body">...</div>
  <div class="custom-footer">...</div>
</div>
```

## Example: E-commerce Product Cards

```html
<div class="card-stack">
  <div class="card-stack-item">
    <img src="product1.jpg" alt="Product">
    <h3>Premium Headphones</h3>
    <p class="price">$299.99</p>
    <p>High-quality wireless headphones with noise cancellation.</p>
  </div>
  <!-- More product cards... -->
</div>
```

## Example: Dating App Style

```html
<div class="card-stack">
  <div class="card-stack-item">
    <img src="profile1.jpg" alt="Profile">
    <h3>Sarah, 28</h3>
    <p>📍 San Francisco</p>
    <p>Loves hiking, coffee, and good books.</p>
  </div>
  <!-- More profile cards... -->
</div>
```

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile: iOS Safari, Chrome for Android
- Requires modern ES6+ support
