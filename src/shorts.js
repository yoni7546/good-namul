import './shorts.css';
import { applyEditable } from './editable.js';
// Only published, explicitly approved links are shown to visitors.
export async function initShorts() {
  const section = document.querySelector('#shorts');
  try {
    const response = await fetch('/api/content');
    if (!response.ok) { applyEditable({}); return; }
    const content = await response.json();
    const copy = content.copy || {};
    const fields = {hero:'.hero h1',heroDescription:'.hero-description',storyTitle:'.story-copy h2',storyBody:'.story-copy p',shortsTitle:'#shorts h2'};
    for (const [key,selector] of Object.entries(fields)) if (typeof copy[key] === 'string' && copy[key]) { const el = document.querySelector(selector); if(el) el.textContent = copy[key]; }
    applyEditable(content);
    if (!section || new URLSearchParams(location.search).has('editor-preview')) return;
    const items = content.shorts;
    if (!Array.isArray(items)) return;
    const track = section.querySelector('.shorts-track');
    for (const item of items.slice(0, 30)) {
      let url;
      try { url = new URL(item.url); } catch { continue; }
      if (url.protocol !== 'https:' || !['youtube.com','www.youtube.com','youtu.be','www.instagram.com','instagram.com','www.tiktok.com','tiktok.com'].includes(url.hostname)) continue;
      const card = document.createElement('article'); card.className = 'shorts-card';
      const match = url.hostname.includes('youtube.com') && (url.pathname.match(/^\/shorts\/([\w-]{11})/) || url.pathname.match(/^\/watch$/) && [null,url.searchParams.get('v')]);
      const candidate = match?.[1] || (url.hostname === 'youtu.be' ? url.pathname.slice(1) : null);
      const id = /^[\w-]{11}$/.test(candidate || '') ? candidate : null;
      if (id) {
        const frame=document.createElement('iframe'); frame.title=String(item.title || '착한 나물 숏폼');
        frame.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&controls=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
        frame.allow='autoplay; encrypted-media; picture-in-picture'; frame.loading='lazy'; card.append(frame);
        const sound=document.createElement('button'); sound.type='button'; sound.className='shorts-sound'; sound.textContent='🔇 소리 켜기'; sound.setAttribute('aria-label','영상 소리 켜기');
        let muted=true; sound.addEventListener('click',()=>{muted=!muted;frame.contentWindow?.postMessage(JSON.stringify({event:'command',func:muted?'mute':'unMute',args:[]}), 'https://www.youtube-nocookie.com');sound.textContent=muted?'🔇 소리 켜기':'🔊 소리 끄기';sound.setAttribute('aria-label',muted?'영상 소리 켜기':'영상 소리 끄기');});card.append(sound);
      } else {const fallback=document.createElement('div');fallback.className='shorts-fallback';fallback.textContent='▶';card.append(fallback);}
      const label = document.createElement('a'); label.href=url.href; label.target='_blank'; label.rel='noopener noreferrer'; label.className='shorts-title'; label.textContent = String(item.title || '착한 나물 숏폼').slice(0, 100) + ' ↗'; card.append(label); track.append(card);
    }
    if (!track.children.length) return;
    section.hidden = false;
    section.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => track.scrollBy({left: (button.dataset.direction === 'next' ? 1 : -1) * track.clientWidth * .75, behavior:'smooth'})));
  } catch (error) { applyEditable({}); console.warn('숏폼을 불러오지 못했습니다.', error.code || 'unavailable'); }
}
