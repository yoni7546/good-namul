import './shorts.css';
// Only published, explicitly approved links are shown to visitors.
export async function initShorts() {
  const section = document.querySelector('#shorts');
  if (!section) return;
  try {
    const response = await fetch('/api/content');
    if (!response.ok) return;
    const content = await response.json();
    const copy = content.copy || {};
    const fields = {hero:'.hero h1',heroDescription:'.hero-description',storyTitle:'.story-copy h2',storyBody:'.story-copy p',shortsTitle:'#shorts h2'};
    for (const [key,selector] of Object.entries(fields)) if (typeof copy[key] === 'string' && copy[key]) { const el = document.querySelector(selector); if(el) el.textContent = copy[key]; }
    const items = content.shorts;
    if (!Array.isArray(items)) return;
    const track = section.querySelector('.shorts-track');
    for (const item of items.slice(0, 30)) {
      let url;
      try { url = new URL(item.url); } catch { continue; }
      if (url.protocol !== 'https:' || !['youtube.com','www.youtube.com','youtu.be','www.instagram.com','instagram.com','www.tiktok.com','tiktok.com'].includes(url.hostname)) continue;
      const card = document.createElement('a'); card.className = 'shorts-card';
      card.href = url.href; card.target = '_blank'; card.rel = 'noopener noreferrer';
      const match = url.hostname.includes('youtube.com') && url.pathname.match(/^\/shorts\/([\w-]{11})/);
      const id = match?.[1] || (url.hostname === 'youtu.be' && /^\/[\w-]{11}$/.test(url.pathname) ? url.pathname.slice(1) : null);
      if (id) { const img = document.createElement('img'); img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; img.alt = ''; img.loading = 'lazy'; card.append(img); }
      const label = document.createElement('span'); label.textContent = String(item.title || '착한 나물 숏폼').slice(0, 100) + ' ↗'; card.append(label); track.append(card);
    }
    if (!track.children.length) return;
    section.hidden = false;
    section.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => track.scrollBy({left: (button.dataset.direction === 'next' ? 1 : -1) * track.clientWidth * .75, behavior:'smooth'})));
  } catch (error) { console.warn('숏폼을 불러오지 못했습니다.', error.code || 'unavailable'); }
}
