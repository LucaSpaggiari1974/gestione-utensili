(() => {
  const isImage = (el) => el instanceof HTMLImageElement && (el.classList.contains('recDraw') || el.classList.contains('modalImg'));
  const next = (img) => {
    const raw = img.dataset.photoCandidates || '[]';
    let candidates = [];
    try { candidates = JSON.parse(decodeURIComponent(raw)); } catch (_) {}
    const index = Number(img.dataset.photoFallbackIndex || 0);
    if (index + 1 < candidates.length) {
      img.dataset.photoFallbackIndex = String(index + 1);
      img.src = candidates[index + 1];
      return;
    }
    img.style.display = 'none';
    const parent = img.closest('.photoWrap, .photoWrap, .insertPreviewFrame');
    if (parent && !parent.querySelector('.photoEmpty')) {
      const empty = document.createElement('div');
      empty.className = 'photoEmpty';
      empty.textContent = 'Foto non raggiungibile. Apri la scheda del produttore.';
      parent.insertBefore(empty, img);
    }
  };
  document.addEventListener('error', (event) => {
    if (isImage(event.target)) next(event.target);
  }, true);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img.recDraw, img.modalImg').forEach((img) => {
      img.addEventListener('error', () => next(img), { once: false });
    });
  });
})();
