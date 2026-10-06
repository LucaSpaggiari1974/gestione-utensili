/* Image-source fallback for the catalog. It never replaces a local image. */
(function () {
  const sourceFile = 'image-sources.json';
  let sources = {};

  function familyFromCode(value) {
    const code = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const families = Object.keys(sources).sort((a, b) => b.length - a.length);
    return families.find((family) => code.startsWith(family)) || null;
  }

  async function loadImageSources() {
    try {
      const response = await fetch(sourceFile, { cache: 'no-store' });
      if (!response.ok) throw new Error('image sources unavailable');
      const data = await response.json();
      sources = data.families || {};
      return sources;
    } catch (error) {
      console.warn('Unable to load image sources', error);
      return {};
    }
  }

  function sourceForItem(item) {
    const code = item && (item.code || item.iso || item.name || item.designation || item.id);
    const family = familyFromCode(code);
    return family ? { family, url: sources[family] } : null;
  }

  function attachSourceLink(container, item) {
    const source = sourceForItem(item);
    if (!container || !source || container.querySelector('[data-image-source]')) return;
    const link = document.createElement('a');
    link.dataset.imageSource = 'true';
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `Fonte catalogo ${source.family} (immagine rappresentativa)`;
    link.style.display = 'block';
    link.style.marginTop = '6px';
    link.style.fontSize = '12px';
    container.appendChild(link);
  }

  window.insertImageFallback = { loadImageSources, sourceForItem, attachSourceLink };
  loadImageSources();
})();