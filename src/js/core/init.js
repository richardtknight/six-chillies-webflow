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
  document.body.classList.add('animations-ready');

  // Setup video frame if exists
  const videoFrame = document.querySelector('.video-frame');
  if (videoFrame) {
    videoFrame.style.width = '100vw';
    videoFrame.style.height = '100vh';
  }

  // Destroy existing Webflow instance if present
  if (window.Webflow && window.Webflow.destroy) {
    window.Webflow.destroy();
  }

  document.dispatchEvent(new Event('app:ready'));
}
