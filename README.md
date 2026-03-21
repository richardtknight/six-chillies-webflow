# Webflow External Assets Starter

A simple, scalable workflow for managing custom CSS and JavaScript for Webflow projects using a local dev environment, GitHub, and jsDelivr CDN.

---

## 🚀 Overview

This setup allows you to:

- Write modular, maintainable JS and CSS locally
- Bundle and optimise assets for production
- Version and store code in GitHub
- Serve assets globally via CDN (jsDelivr)
- Keep Webflow clean and focused on structure/content

---

## 🧱 Project Structure

```
webflow-starter/
├── src/
│   ├── js/
│   │   ├── core/
│   │   ├── features/
│   │   └── main.js
│   ├── css/
│   │   ├── base.css
│   │   └── animations.css
│
├── dist/              # Production output (generated)
├── package.json
├── vite.config.js
└── README.md
```

### Key Concepts

- `src/` → Your development code (modular, readable)
- `dist/` → Compiled production assets (used by Webflow)
- Webflow → Loads only files from `dist/`

---

## ⚙️ Setup

### 1. Install dependencies

```
yarn install
```

---

## 💻 Development Workflow

### 1. Write your code

Add or modify files inside:

```
src/js/
src/css/
```

Example:

- Add animations in `features/gsap.js`
- Add styles in `css/animations.css`

---

### 2. Build production files

```
yarn run build
```

This generates:

```
dist/bundle.js
dist/styles.css
```

These are the only files Webflow will use.

---

## 🔧 Code Quality & Automation

This project uses **ESLint**, **Prettier**, and **Husky** for automated code quality.

### Pre-commit Hook

Every commit automatically runs:

1. **🔍 Lint**: ESLint checks and auto-fixes code issues
2. **🎨 Format**: Prettier formats all JS and CSS files
3. **🔨 Build**: Vite builds production files to `dist/`
4. **✅ Stage**: Processed files are automatically added to commit

### Manual Commands

```bash
# Linting
yarn lint           # Check for code issues
yarn lint:fix       # Fix issues automatically

# Formatting
yarn format         # Format all files
yarn format:check   # Check formatting only

# Building
yarn build          # Build production files
```

### Benefits

- Never commit unformatted or problematic code
- `dist/` files always match `src/` changes
- Consistent code style across the team
- Catch errors early before they reach production

---

## 📦 GitHub Workflow

### Development Commits

```bash
git add .
git commit -m "feat: add new animation"  # Pre-commit hook runs automatically
git push
```

**Note**: Commits take a few seconds longer due to automatic linting, formatting, and building.

---

## 🚀 Release Workflow

Automated release commands that handle versioning, building, tagging, and pushing.

### Commands

```bash
# Patch release (1.0.0 → 1.0.1) - Bug fixes
yarn release:patch

# Minor release (1.0.0 → 1.1.0) - New features, backwards compatible
yarn release:minor

# Major release (1.0.0 → 2.0.0) - Breaking changes
yarn release:major
```

### What happens automatically:

1. ✅ **Pre-check**: Runs linting, format check, and build
2. 📝 **Version bump**: Updates `package.json` version
3. 🏷️ **Tag**: Creates git tag (e.g., `v1.0.1`)
4. 💾 **Commit**: Commits version change with message
5. 🚀 **Push**: Pushes code and tags to GitHub

### Example Release

```bash
# Make your changes
git add .
git commit -m "feat: add testimonials carousel"
git push

# When ready to release
yarn release:minor
# → Bumps to 1.1.0, tags, and pushes
```

### Using Releases in Webflow

After release, update your Webflow project settings to use the new versioned URL:

```html
<script src="https://cdn.jsdelivr.net/gh/USERNAME/six-chillies-webflow@v1.1.0/dist/bundle.js"></script>
```

---

## 🌍 Using jsDelivr (CDN)

jsDelivr serves your GitHub files via a global CDN.

### File format:

```
https://cdn.jsdelivr.net/gh/USERNAME/REPO@VERSION/PATH
```

---

### Example (Production)

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/YOURUSER/webflow-starter@1.0.0/dist/styles.css"
/>

<script src="https://cdn.jsdelivr.net/gh/YOURUSER/webflow-starter@1.0.0/dist/bundle.js"></script>
```

---

### Example (Development)

```html
@main
```

⚠️ Use `@main` only for testing — never for production.

---

## 🧩 Webflow Integration

### Add to Project Settings

#### In `<head>`:

```html
<link rel="stylesheet" href="CDN_URL/styles.css" />
```

#### Before `</body>`:

```html
<script src="CDN_URL/bundle.js"></script>
```

---

## 🔁 Recommended Workflow

### Development cycle:

1. Edit code in `src/`
2. Run build
3. Test using `@main`
4. Iterate until stable

---

### Production release:

1. Run build
2. Commit changes
3. Tag version (`1.0.0`, `1.1.0`, etc.)
4. Update Webflow to use versioned CDN URL

---

## ⚠️ Important Notes

- Your GitHub repo must be **public**
- Never include secrets (API keys, tokens, etc.)
- Only commit production-ready code to `dist/`
- Use versioning to avoid breaking live sites

---

## 💡 Tips

### Cache busting (if needed)

```
bundle.js?v=1.0.1
```

---

### Page-specific scripts

Use body attributes in Webflow:

```html
<body data-page="home"></body>
```

```js
if (document.body.dataset.page === 'home') {
  // run homepage logic
}
```

---

### Debug mode

```js
const DEBUG = true;
if (DEBUG) console.log('Running...');
```

---

## 🔥 Future Improvements

- Add GSAP ScrollTrigger
- Build reusable animation presets
- Introduce component-based animations
- Convert into a reusable system across projects

---

## 🧠 Philosophy

- Webflow handles layout and CMS
- This repo handles behaviour and animation
- Keep them loosely coupled for maximum flexibility

---

## ✅ Summary

This workflow gives you:

- Clean separation of concerns
- Version-controlled frontend logic
- Fast global delivery via CDN
- Reusability across multiple projects
