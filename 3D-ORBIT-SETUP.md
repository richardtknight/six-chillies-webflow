# 3D Floating Orbit - Setup Guide

## HTML Structure in Webflow

Add a container in your hero section with images:

```html
<div class="floating-orbit-container">
  <img src="image1.jpg" alt="" class="orbit-image">
  <img src="image2.jpg" alt="" class="orbit-image">
  <img src="image3.jpg" alt="" class="orbit-image">
  <img src="image4.jpg" alt="" class="orbit-image">
  <img src="image5.jpg" alt="" class="orbit-image">
</div>
```

## CSS in Webflow

Add this to your page or project custom code:

```css
.floating-orbit-container {
  width: 500px;
  height: 500px;
  position: relative;
}

.orbit-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

## JavaScript Initialization

The function is already exported from animations.js.
To initialize it, import and call it in your hero section init:

```javascript
import { init3DFloatingOrbit } from '../utils/animations';

export function initHero(navControl) {
  // ... your existing hero code ...

  // Initialize 3D orbit
  init3DFloatingOrbit('.floating-orbit-container', {
    radiusX: 180,        // Horizontal spread
    radiusY: 120,        // Vertical spread
    radiusZ: 100,        // Depth spread
    rotationSpeed: 0.001, // Slow constant rotation
    mouseInfluence: 100,  // Magnetic pull distance
    hoverScale: 1.4,      // Scale on hover
  });
}
```

## Features

✨ **Continuous 3D elliptical orbit** - Images float in 3D space
🧲 **Magnetic mouse interaction** - Images subtly follow the mouse when nearby
🎯 **Hover effects** - Image scales up and brightens on hover
📐 **Depth perception** - Images closer appear larger and more opaque
🔄 **Smooth animations** - GSAP-powered for premium, buttery-smooth motion

## Configuration Options

All options are optional - defaults provide a good starting point:

- `radiusX`: Horizontal orbit radius in pixels (default: 150)
- `radiusY`: Vertical orbit radius in pixels (default: 100)
- `radiusZ`: Depth orbit radius in pixels (default: 80)
- `rotationSpeed`: Speed of constant rotation in radians per frame (default: 0.0008)
- `mouseInfluence`: Distance in pixels where mouse starts affecting images (default: 80)
- `hoverScale`: Scale multiplier when hovering over an image (default: 1.3)

## Tips

- Use 4-6 images for best effect
- Images should be square or similar aspect ratio
- Larger containers work better (400px+)
- Works great with product shots, team photos, or portfolio pieces
- The effect is subtle and professional - perfect for high-end sites
