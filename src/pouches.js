import './pouches.css';
// Keep supplied packaging artwork intact. Add originals using the product IDs below.
const assets = import.meta.glob('./assets/pouches/*.{png,jpg,jpeg,webp}', {
  eager: true, query: '?url', import: 'default',
});
const products = new Set(['gondre', 'siraegi', 'chwi', 'yuchae', 'gift']);
export function applyPouchArtwork() {
  for (const [path, url] of Object.entries(assets)) {
    const id = path.split('/').pop().replace(/\.[^.]+$/, '');
    if (!products.has(id)) continue;
    const card = document.querySelector(`[data-product="${id}"]`);
    const image = card?.querySelector('[data-image]');
    if (!image) continue;
    image.addEventListener('load', () => {
      image.hidden = false;
      card.classList.add('has-pouch-artwork');
      card.querySelectorAll('.package,.art-label').forEach(el => el.hidden = true);
    }, {once: true});
    image.addEventListener('error', () => {
      image.hidden = true;
      card.classList.remove('has-pouch-artwork');
      card.querySelectorAll('.package,.art-label').forEach(el => el.hidden = false);
    }, {once: true});
    image.alt = card.getAttribute('aria-label').replace(' 상세 보기', '') + (id === 'gift' ? ' 제품 이미지' : ' 새 파우치 디자인');
    image.loading = 'eager';
    image.decoding = 'async';
    // Local approved artwork takes priority over older Firebase product photos.
    image.removeAttribute('data-image');
    image.src = url;
  }
}
