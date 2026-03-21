# Six Chillies Webflow Project - Claude Context

> **Last Updated**: 2026-03-21
> **Purpose**: Complete project context for AI assistance

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Code Organization](#code-organization)
5. [Brand Configuration](#brand-configuration)
6. [Key Features](#key-features)
7. [Build & Deployment](#build--deployment)
8. [Development Conventions](#development-conventions)
9. [File Reference](#file-reference)
10. [Common Tasks](#common-tasks)

---

## 🎯 Project Overview

**Project Name**: Six Chillies Webflow
**Type**: Custom JavaScript/CSS for Webflow site
**Purpose**: Modular, maintainable external assets for Webflow project

### Key Objectives

- Manage custom animations and interactions outside Webflow
- Use modern ES6 module system for maintainability
- Deploy via GitHub → jsDelivr CDN
- Keep codebase scalable and reusable across projects

### Workflow

1. Develop locally in `src/`
2. Build to `dist/` with Vite
3. Commit to GitHub with version tags
4. Serve via jsDelivr CDN to Webflow site

---

## 🏗️ Architecture

### High-Level Structure

```
src/js/
├── config/          # Configuration & constants
├── core/            # Core initialization & DOM utilities
├── features/        # Feature modules (GSAP, Lenis, transitions)
├── components/      # Reusable UI components (hamburger, cursor, nav)
├── sections/        # Page sections (hero, horizontal scroll, etc.)
└── utils/           # Utility functions (text splitting, animations)
```

### Architecture Principles

1. **Modular Design**: Each file has a single responsibility
2. **Dependency Injection**: Components receive dependencies (e.g., Lenis instance)
3. **Webflow Integration**: Wrapped in `window.Webflow.push()` for compatibility
4. **Progressive Enhancement**: Features gracefully degrade if elements don't exist
5. **Configuration-Driven**: Brand constants centralized in `config/constants.js`

### Initialization Flow

```
main.js
  → window.Webflow.push()
    → onReady()
      → initApp()           # Set body classes, Webflow compatibility
      → initGSAP()          # Register plugins, set page transition state
      → initLenis()         # Smooth scroll with GSAP integration
      → initPageTransitions() # Circle clip-path transitions
      → initNav()           # Navigation show/hide on scroll
      → initHamburger()     # Animated menu with overlay
      → initCursor()        # Custom cursor
      → initHero()          # Hero video frame animation
      → initHorizontalScroll() # Horizontal scrolling cards
      → initBlockTransition() # Block grid transition
      → initTestimonials()  # Infinite scroll testimonials
      → initContentReveals() # All content animations
```

---

## 💻 Tech Stack

### Core Dependencies

- **Vite** (5.0.0): Build tool & dev server
- **GSAP** (3.12.5): Animation library with ScrollTrigger
- **Lenis** (1.0.42): Smooth scrolling library
- **ESLint** (10.1.0): JavaScript linting
- **Prettier** (3.8.1): Code formatting
- **Husky** (9.1.7): Git hooks for pre-commit automation

### GSAP Plugins Used

- `ScrollTrigger`: Scroll-based animations
- Core GSAP for tweening

### Build Configuration

- **Entry Points**:
  - JS: `src/js/main.js`
  - CSS: `src/css/base.css`
- **Output**:
  - JS: `dist/bundle.js` (minified with esbuild)
  - CSS: `dist/styles.css` (minified)

---

## 📁 Code Organization

### Directory Breakdown

#### `src/js/config/`
- `constants.js`: Brand colors, timing, easing, section configs

#### `src/js/core/`
- `init.js`: App initialization, Webflow compatibility
- `dom.js`: DOM ready utility

#### `src/js/features/`
- `gsap.js`: GSAP setup & plugin registration
- `lenis.js`: Smooth scroll with GSAP ticker integration
- `pageTransitions.js`: Page entry/exit animations

#### `src/js/components/`
- `hamburger.js`: Animated hamburger menu with circular reveal
- `cursor.js`: Custom cursor with hover states
- `nav.js`: Navigation show/hide on scroll with lock state

#### `src/js/sections/`
- `hero.js`: Hero video frame with scroll-based scaling
- `horizontalScroll.js`: Horizontal scrolling cards with arc animation
- `blockTransition.js`: Block grid color transition effect
- `testimonials.js`: Infinite scroll testimonial columns
- `contentReveals.js`: All scroll-triggered content animations

#### `src/js/utils/`
- `textSplit.js`: Text splitting into lines/characters for animation
- `animations.js`: Reusable animation functions (peelReveal, charStagger, etc.)

#### `src/css/`
- `base.css`: Base styles, component styles, utility classes
- `animations.css`: Animation-specific styles

---

## 🎨 Brand Configuration

### Location
`src/js/config/constants.js`

### Key Constants

#### Colors
```javascript
COLORS = {
  chiliRed: '#ff3312',
  offWhite: '#f5f0e8',
  chilliBlack: '#111111',
  lightGrey: '#EFEFEF',
  chilliTint: '#FF7466',
  // ... background, border, text colors
}
```

#### Timing
```javascript
TIMING = {
  fast: 0.2,
  medium: 0.4,
  slow: 0.8,
  verySlow: 1.2,
  // ... specific animation durations
}
```

#### Easing
```javascript
EASING = {
  power2Out: 'power2.out',
  power3Out: 'power3.out',
  power4Out: 'power4.out',
  expoOut: 'expo.out',
  backOut: 'back.out(2)',
  // ... more easing functions
}
```

#### Section-Specific Configs
- `HERO`: Video animation values
- `HORIZONTAL_SCROLL`: Card scroll configuration
- `BLOCK_TRANSITION`: Grid dimensions
- `TESTIMONIALS`: Scroll speeds
- `HAMBURGER`: Menu animation values

---

## ✨ Key Features

### 1. Hamburger Menu (`components/hamburger.js`)
- Circular reveal animation from hamburger button position
- Bars transform to X icon
- Menu items slide up with stagger
- Pauses Lenis scroll when open
- Background number changes on nav item hover
- Escape key to close

### 2. Hero Section (`sections/hero.js`)
- Video frame scales from small to fullscreen on scroll
- Text slides out and blurs during scroll
- Navigation locks until scroll threshold
- Responsive height calculation

### 3. Horizontal Scroll (`sections/horizontalScroll.js`)
- Cards scroll horizontally while page scrolls vertically
- Arc animation: cards dip and rotate based on position
- Intro/outro fade sections
- Progress dots indicator
- Depth variations per card

### 4. Custom Cursor (`components/cursor.js`)
- Dot + ring follow mouse
- Scales up on interactive elements
- Ring fades on hover

### 5. Text Animations (`utils/`)
- `splitIntoLines()`: Wraps text lines for peel reveal
- `splitIntoChars()`: Splits into animatable characters
- `peelReveal()`: Lines slide up with scale/rotation
- `charStaggerReveal()`: Character-by-character reveal
- `eyebrowReveal()`: Simple fade-in for labels

### 6. Page Transitions (`features/pageTransitions.js`)
- Circle clip-path reveals page on entry
- Circle expands from center on exit
- Prevents default link behavior for internal links

### 7. Lenis Integration (`features/lenis.js`)
- Smooth scrolling with custom easing
- GSAP ticker integration for performance
- Progress tracking for scroll indicators
- Can be paused/started (e.g., during menu open)

---

## 🚀 Build & Deployment

### Development Commands

```bash
# Development
yarn dev          # Start Vite dev server
yarn build        # Build production files to dist/

# Code Quality
yarn lint         # Lint JS files with ESLint
yarn lint:fix     # Lint and auto-fix issues
yarn format       # Format all JS/CSS with Prettier
yarn format:check # Check formatting without changes

# Releases (see Release Workflow section)
yarn release:patch   # Patch version bump (1.0.0 → 1.0.1)
yarn release:minor   # Minor version bump (1.0.0 → 1.1.0)
yarn release:major   # Major version bump (1.0.0 → 2.0.0)
```

### Build Output

- `dist/bundle.js`: Minified JavaScript (esbuild)
- `dist/styles.css`: Minified CSS

### Pre-commit Automation (Husky)

This project uses **Husky** to automate code quality checks before every commit.

**What runs automatically on commit:**
1. 🔍 **ESLint** lints and auto-fixes JS code issues
2. 🎨 **Prettier** formats all JS/CSS files in `src/`
3. 🔨 **Vite** builds production files to `dist/`
4. ✅ **Git** stages linted, formatted, and built files

**Hook Location**: `.husky/pre-commit`

**ESLint Configuration**: `eslint.config.js` (flat config format)
- ES6+ syntax support
- Browser and Node globals
- Auto-fixes common issues
- Warns on unused variables
- Enforces modern JavaScript practices

**Benefits:**
- Catches errors early before they reach the repo
- No manual lint/format/build step needed
- Ensures `dist/` always matches `src/` changes
- Consistent code style and quality across commits
- Prevents problematic code from being committed

**Note**: Commits will take a few seconds longer due to automatic processing.

### Deployment Workflow

#### Option 1: Automated Release (Recommended)

```bash
# 1. Develop and commit changes
git add .
git commit -m "feat: add new feature"
git push

# 2. When ready to release, use automated release command
yarn release:patch   # For bug fixes (1.0.0 → 1.0.1)
yarn release:minor   # For new features (1.0.0 → 1.1.0)
yarn release:major   # For breaking changes (1.0.0 → 2.0.0)

# 3. Update Webflow with new version URL
```

The release command automatically:
1. ✅ Runs lint, format check, and build
2. 📝 Bumps version in package.json
3. 🏷️ Creates git tag
4. 💾 Commits with release message
5. 🚀 Pushes code and tags to GitHub

#### Option 2: Manual Process

1. **Develop**: Make changes in `src/`
2. **Commit**: `git add . && git commit -m "message"` (pre-commit hook runs)
3. **Push**: `git push`
4. **Test**: Use `@main` branch URL for testing
5. **Tag**: `git tag v1.0.0 && git push origin v1.0.0`
6. **Deploy**: Update Webflow to use versioned jsDelivr URL

### jsDelivr URLs

**Production (tagged version)**:
```html
https://cdn.jsdelivr.net/gh/USERNAME/six-chillies-webflow@1.0.0/dist/bundle.js
https://cdn.jsdelivr.net/gh/USERNAME/six-chillies-webflow@1.0.0/dist/styles.css
```

**Development (main branch)**:
```html
https://cdn.jsdelivr.net/gh/USERNAME/six-chillies-webflow@main/dist/bundle.js
https://cdn.jsdelivr.net/gh/USERNAME/six-chillies-webflow@main/dist/styles.css
```

⚠️ Never use `@main` in production!

---

## 📐 Development Conventions

### Code Style

- **ES6 Modules**: Always use import/export
- **Semicolons**: Required (enforced by Prettier)
- **Quotes**: Single quotes for strings
- **Line Width**: 100 characters max
- **Arrow Functions**: Preferred for anonymous functions

### Naming Conventions

- **Files**: camelCase (`hamburger.js`, `textSplit.js`)
- **Functions**: camelCase, verb prefix (`initHamburger`, `splitIntoLines`)
- **Constants**: SCREAMING_SNAKE_CASE (`COLORS`, `TIMING`)
- **CSS Classes**: kebab-case (`.clip-wrap`, `.nav-item`)

### Function Structure

```javascript
/**
 * Brief description of what the function does
 * @param {Type} paramName - Description
 * @returns {Type} Description
 */
export function functionName(params) {
  // Early return if required elements don't exist
  if (!element) return;

  // Implementation
}
```

### GSAP Usage

- Always register plugins: `gsap.registerPlugin(ScrollTrigger)`
- Use `gsap.set()` for initial states
- Use `gsap.to()` for animations
- Prefer `requestAnimationFrame` before measuring DOM
- Clean up timelines: `timeline.kill()`

### ScrollTrigger Patterns

```javascript
ScrollTrigger.create({
  trigger: element,
  start: 'top 80%',
  end: 'bottom top',
  scrub: 0.1,
  onUpdate(self) {
    // Animation logic using self.progress
  }
});
```

### Element Existence Checks

Always check if elements exist before operating on them:

```javascript
const element = document.getElementById('myElement');
if (!element) return; // Graceful degradation
```

---

## 📂 File Reference

### Critical Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `main.js` | Entry point | None (initialization) |
| `config/constants.js` | Brand config | COLORS, TIMING, EASING, etc. |
| `core/init.js` | App setup | `initApp()` |
| `core/dom.js` | DOM utilities | `onReady()` |
| `features/lenis.js` | Smooth scroll | `initLenis()` |
| `features/gsap.js` | GSAP setup | `initGSAP()` |
| `utils/textSplit.js` | Text splitting | `splitIntoLines()`, `splitIntoChars()` |
| `utils/animations.js` | Animation helpers | `peelReveal()`, `charStaggerReveal()`, etc. |

### HTML Element IDs Used

**Components**:
- `#hamburger` - Menu toggle button
- `#menu-overlay` - Menu overlay container
- `#bar-1`, `#bar-2`, `#bar-3` - Hamburger bars
- `#cursor`, `#cursorRing` - Custom cursor elements
- `#progress` - Scroll progress indicator

**Sections**:
- `#heroOuter` - Hero section container
- `#videoFrame` - Hero video element
- `#headline`, `#eyebrow`, `#heroSub`, `#heroActions` - Hero text elements
- `#horizSection`, `#horizTrack` - Horizontal scroll container
- `#blockTransition`, `#btGrid` - Block transition section
- `#testimonials`, `#track-a`, `#track-b` - Testimonials columns

**Classes**:
- `.page-transition` - Page transition overlay
- `.clip-wrap`, `.clip-inner` - Text animation wrappers
- `.nav-item`, `.nav-item-inner` - Navigation menu items
- `.hcard` - Horizontal scroll cards
- `.tcard` - Testimonial cards
- `.logo-cell` - Logo grid items

---

## 🛠️ Common Tasks

### Adding a New Animation

1. Create function in `utils/animations.js` or section file
2. Import constants from `config/constants.js`
3. Export the function
4. Import and call in appropriate section or `main.js`
5. Use `ScrollTrigger.refresh()` after DOM changes

### Adding a New Section

1. Create `src/js/sections/newSection.js`
2. Import GSAP and utilities
3. Export `initNewSection()` function
4. Check for required elements
5. Import in `main.js` and call in initialization sequence

### Updating Brand Colors

1. Edit `src/js/config/constants.js` → `COLORS` object
2. Update any hardcoded CSS in `src/css/base.css`
3. Rebuild: `yarn build`

### Debugging

- Open browser console (animations log warnings for missing elements)
- Use `ScrollTrigger.getAll()` to see all triggers
- Use `gsap.globalTimeline.getChildren()` to see active animations
- Check `window.Webflow` object is defined

### Linting Code

```bash
yarn lint         # Check for code issues
yarn lint:fix     # Auto-fix issues
```

**Note**: Linting runs automatically on commit via Husky.

**Common ESLint issues:**
- Unused variables (use `_` prefix to ignore: `_unusedVar`)
- Missing `const` instead of `let`
- Console statements (allowed in this project)

### Formatting Code

```bash
yarn format        # Auto-fix all files
yarn format:check  # Check without changes
```

**Note**: Formatting runs automatically on commit via Husky.

### Creating a Release

```bash
# Bug fixes (1.0.0 → 1.0.1)
yarn release:patch

# New features (1.0.0 → 1.1.0)
yarn release:minor

# Breaking changes (1.0.0 → 2.0.0)
yarn release:major
```

This automatically:
1. Runs pre-release checks (lint, format, build)
2. Bumps version in package.json
3. Creates git commit and tag
4. Pushes to GitHub

After release, update Webflow with the new version URL.

### Working with Git Hooks

**Bypass pre-commit hook** (not recommended):
```bash
git commit --no-verify -m "message"
```

**Manually trigger pre-commit hook**:
```bash
./.husky/pre-commit
```

**Edit pre-commit hook**:
Edit `.husky/pre-commit` to modify what runs before commits.

---

## ⚙️ Configuration Files

### Vite Configuration

**File**: `vite.config.js`

```javascript
{
  build: {
    outDir: 'dist',
    minify: 'esbuild',      // Fast minification
    cssMinify: true,         // Minify CSS
    rollupOptions: {
      input: {
        main: 'src/js/main.js',
        styles: 'src/css/base.css'
      },
      output: {
        entryFileNames: 'bundle.js',
        assetFileNames: 'styles.css'
      }
    }
  }
}
```

### ESLint Configuration

**File**: `eslint.config.js` (Flat config format)

```javascript
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      // ... more rules
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.husky/'],
  },
];
```

**Key Features:**
- ES6+ support with modern JavaScript
- Browser and Node.js globals
- Unused variables warnings (prefix with `_` to ignore)
- Console statements allowed for debugging
- Enforces `const` over `let`, no `var`
- Ignores dist/, node_modules/, .husky/

### Prettier Configuration

**File**: `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

---

## 🔍 Git Workflow

### Branch Strategy
- `main`: Primary development branch
- Tags: Production versions (`v1.0.0`, `v1.1.0`, etc.)

### Commit Messages
- Follow conventional commits
- Examples: `feat: add testimonials section`, `fix: cursor hover state`, `chore: update dependencies`

### Version Tagging
```bash
git tag v1.0.0
git push origin v1.0.0
```

Use semantic versioning:
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features, backwards compatible
- **Patch** (1.0.1): Bug fixes

---

## 🚨 Important Notes

### Security
- Repository must be **public** for jsDelivr
- Never commit secrets, API keys, or credentials
- No `.env` files should be committed

### Performance
- All dist files are minified
- Lazy-load heavy sections when possible
- Use `will-change` sparingly (set in CSS)
- Clean up GSAP timelines when not needed

### Browser Support
- Modern browsers (ES6+ support required)
- No IE11 support (uses `??=`, arrow functions, etc.)
- Graceful degradation for missing features

### Webflow Integration
- Code runs inside `window.Webflow.push()` callback
- Waits for Webflow to be ready before initializing
- Can coexist with Webflow interactions
- Destroys existing Webflow instance if present

---

## 📚 External Resources

### GSAP Documentation
- [GSAP Docs](https://greensock.com/docs/)
- [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Easing Visualizer](https://greensock.com/ease-visualizer/)

### Lenis Documentation
- [GitHub](https://github.com/studio-freight/lenis)
- [Demos](https://lenis.studiofreight.com/)

### jsDelivr
- [Documentation](https://www.jsdelivr.com/)
- [GitHub CDN](https://www.jsdelivr.com/?docs=gh)

---

## 📝 Maintenance Notes

### When Adding New Dependencies

1. Install: `yarn add package-name`
2. Import in relevant files
3. Rebuild: `yarn build`
4. Test thoroughly before tagging
5. Update this document if significant

### When Refactoring

1. Ensure all imports/exports are updated
2. Run `yarn format` to maintain code style
3. Test all sections still work
4. Check for console errors
5. Update relevant documentation

### Regular Checks

- [ ] All animations work on scroll
- [ ] Menu opens/closes properly
- [ ] No console errors
- [ ] Cursor behaves correctly
- [ ] Page transitions smooth
- [ ] Build succeeds without warnings
- [ ] Code is formatted consistently

---

## 🎓 Learning Resources for New Developers

### Prerequisites
- JavaScript ES6+ syntax
- Understanding of promises and async/await
- Basic GSAP knowledge
- CSS animations fundamentals

### Recommended Learning Path
1. Understand the build process (Vite)
2. Read through `main.js` initialization flow
3. Study one simple section (e.g., `cursor.js`)
4. Move to complex sections (e.g., `hero.js`)
5. Learn ScrollTrigger progressively
6. Experiment with constants in `config/constants.js`

---

**End of Claude Context Document**

*This document should be updated whenever significant changes are made to the project architecture, conventions, or workflows.*
