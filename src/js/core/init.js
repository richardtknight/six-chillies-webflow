let initialized = false;

/**
 * Initializes the application
 * Sets up initial state and adds necessary classes
 */
export function initApp() {
  if (initialized) return;
  initialized = true;

  // Add Webflow compatibility
  window.Webflow ||= [];

  // Add body classes
  document.body.classList.add('js');

  // Add animations-ready to html element to show content
  document.documentElement.classList.add('animations-ready');

  // Video frame will be set up by hero.js

  // Destroy existing Webflow instance if present
  if (window.Webflow && window.Webflow.destroy) {
    window.Webflow.destroy();
  }

  document.dispatchEvent(new Event('app:ready'));
}
