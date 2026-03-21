/**
 * Splits text content into lines wrapped in clip containers
 * @param {HTMLElement} el - The element to split
 */
export function splitIntoLines(el) {
  if (!el) return;
  const segments = [];
  let current = [];

  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
      if (current.length) segments.push(current);
      current = [];
    } else {
      current.push(node.cloneNode(true));
    }
  });
  if (current.length) segments.push(current);

  if (segments.length <= 1) {
    const wrap = document.createElement('span');
    wrap.className = 'clip-wrap';
    const inner = document.createElement('span');
    inner.className = 'clip-inner';
    Array.from(el.childNodes).forEach((n) => inner.appendChild(n.cloneNode(true)));
    wrap.appendChild(inner);
    el.innerHTML = '';
    el.appendChild(wrap);
    return;
  }

  el.innerHTML = '';
  segments.forEach((nodes) => {
    const wrap = document.createElement('span');
    wrap.className = 'clip-wrap';
    const inner = document.createElement('span');
    inner.className = 'clip-inner';
    nodes.forEach((n) => inner.appendChild(n));
    wrap.appendChild(inner);
    el.appendChild(wrap);
  });
}

/**
 * Splits text content into individual characters with animation wrappers
 * @param {HTMLElement} element - The element to split
 * @returns {Array} Array of inner character elements
 */
export function splitIntoChars(element) {
  if (!element) return [];
  const spans = [];

  function processText(text, container) {
    const tokens = text.split(/( +)/);
    tokens.forEach((token) => {
      if (!token.length) return;

      if (/^ +$/.test(token)) {
        const space = document.createElement('span');
        space.className = 'char-space';
        container.appendChild(space);
        return;
      }

      const wordWrap = document.createElement('span');
      wordWrap.className = 'char-word';

      for (const ch of token) {
        const outer = document.createElement('span');
        outer.className = 'char';
        const inner = document.createElement('span');
        inner.className = 'char-inner';
        inner.textContent = ch;
        outer.appendChild(inner);
        wordWrap.appendChild(outer);
        spans.push(inner);
      }

      container.appendChild(wordWrap);
    });
  }

  function walkNodes(sourceNode, targetParent) {
    Array.from(sourceNode.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        processText(node.textContent, targetParent);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') {
          targetParent.appendChild(node.cloneNode(false));
        } else {
          const clone = node.cloneNode(false);
          targetParent.appendChild(clone);
          walkNodes(node, clone);
        }
      }
    });
  }

  const fragment = document.createDocumentFragment();
  Array.from(element.childNodes).forEach((n) => fragment.appendChild(n.cloneNode(true)));
  element.innerHTML = '';
  walkNodes(fragment, element);

  return spans;
}
