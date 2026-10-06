(function () {
  const sourceFile = 'image-sources.json';
  let families = {};

  function familyForText(text) {
    const value = String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    return Object.keys(families).sort((a, b) => b.length - a.length).find((key) => value.includes(key));
  }

  function addSource(node) {
    if (!node || node.querySelector('[data-image-fallback-source]')) return;
    const family = familyForText(node.textContent);
    if (!family || !families[family]) return;
    const link = document.createElement('a');
    link.dataset.imageFallbackSource = 'true';
    link.href = families[family];
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `Fonte catalogo ${family} (immagine rappresentativa)`;
    link.style.display = 'block';
    link.style.marginTop = '6px';
    link.style.fontSize = '12px';
    node.appendChild(link);
  }

  async function init() {
    try {
      const response = await fetch(sourceFile, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      families = data.families || {};
      document.querySelectorAll('article, .card, .product, .item, [data-product], [data-insert]').forEach(addSource);
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          addSource(node);
          node.querySelectorAll?.('article, .card, .product, .item, [data-product], [data-insert]').forEach(addSource);
        }));
      }).observe(document.body, { childList: true, subtree: true });
    } catch (error) {
      console.warn('Image fallback integration unavailable', error);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();