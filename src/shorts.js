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
    const cards = [];
    for (const item of items.slice(0, 30)) {
      let url; try { url = new URL(item.url); } catch { continue; }
      if (url.protocol !== 'https:' || !['youtube.com','www.youtube.com','youtu.be','www.instagram.com','instagram.com','www.tiktok.com','tiktok.com'].includes(url.hostname)) continue;
      const match = url.hostname.includes('youtube.com') && (url.pathname.match(/^\/shorts\/([\w-]{11})/) || (url.pathname === '/watch' && [null,url.searchParams.get('v')]));
      const candidate = match?.[1] || (url.hostname === 'youtu.be' ? url.pathname.slice(1) : null);
      const id = /^[\w-]{11}$/.test(candidate || '') ? candidate : null;
      const card=document.createElement('article'); card.className='shorts-card';
      const select=document.createElement('button'); select.type='button'; select.className='shorts-select'; select.setAttribute('aria-label', (item.title || '숏폼 영상') + ' 선택');
      if (id) {const img=document.createElement('img');img.src=`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;img.alt='';img.loading='lazy';select.append(img);} else {const fallback=document.createElement('span');fallback.textContent='▶';select.append(fallback);}
      card.append(select);track.append(card);cards.push({card,select,id,url,title:item.title || '숏폼 영상'});
    }
    if (!cards.length) return;
    section.hidden = false;
    let active=-1, visible=false, frame=null;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    function stop(){if(frame){frame.remove();frame=null;}cards.forEach(x=>x.card.querySelector('.shorts-sound')?.remove());}
    function render(){
      stop();cards.forEach((x,i)=>{x.card.classList.toggle('is-active',i===active);x.select.setAttribute('aria-current',i===active?'true':'false');});
      const item=cards[active];if(!item || !visible || !item.id || reduced.matches)return;
      frame=document.createElement('iframe');frame.title=item.title;
      frame.src=`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&mute=1&loop=1&playlist=${item.id}&playsinline=1&controls=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
      frame.allow='autoplay; encrypted-media; picture-in-picture';item.card.append(frame);
      const sound=document.createElement('button');sound.type='button';sound.className='shorts-sound';sound.textContent='🔇 소리 켜기';sound.setAttribute('aria-label','영상 소리 켜기');let muted=true;
      sound.addEventListener('click',()=>{muted=!muted;frame?.contentWindow?.postMessage(JSON.stringify({event:'command',func:muted?'mute':'unMute',args:[]}), 'https://www.youtube-nocookie.com');sound.textContent=muted?'🔇 소리 켜기':'🔊 소리 끄기';sound.setAttribute('aria-label',muted?'영상 소리 켜기':'영상 소리 끄기');});item.card.append(sound);
    }
    function choose(index,scroll=true){index=Math.max(0,Math.min(cards.length-1,index));if(index!==active){active=index;render();}if(scroll)track.scrollTo({left:cards[index].card.offsetLeft - track.offsetLeft - (track.clientWidth-cards[index].card.offsetWidth)/2,behavior:reduced.matches?'instant':'smooth'});}
    cards.forEach((item,i)=>item.select.addEventListener('click',()=>{if(i===active && !item.id)window.open(item.url.href,'_blank','noopener,noreferrer');else choose(i);}));
    section.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('click',()=>choose(active+(button.dataset.direction==='next'?1:-1))));
    let timer;track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(()=>{const middle=track.getBoundingClientRect().left+track.clientWidth/2;let nearest=0,distance=Infinity;cards.forEach((item,i)=>{const r=item.card.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-middle);if(d<distance){distance=d;nearest=i;}});choose(nearest,false);},120)},{passive:true});
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting && !document.hidden;render();},{threshold:.2});observer.observe(section);
    document.addEventListener('visibilitychange',()=>{visible=!document.hidden && section.getBoundingClientRect().top < innerHeight && section.getBoundingClientRect().bottom > 0;render();});
    reduced.addEventListener('change',render);choose(Math.floor(cards.length/2),false);requestAnimationFrame(()=>choose(active));
  } catch (error) { applyEditable({}); console.warn('숏폼을 불러오지 못했습니다.', error.code || 'unavailable'); }
}
