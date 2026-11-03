// A real uploaded URL is required; keep the illustration until then.
export function initBackgroundVideos(url){
 if(!url||!(url.startsWith('/')||url.startsWith('https://')))return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.landscape').forEach(container=>{
  const video=document.createElement('video');
  video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.poster='/images/mountains.svg';video.setAttribute('aria-label','산지 풍경 연출 영상');video.src=url;
  const button=document.createElement('button');button.className='video-toggle';button.type='button';button.hidden=true;
  let localPaused=false,visible=false,ready=false;
  const globallyPaused=()=>document.body.classList.contains('motion-paused');
  const sync=()=>{if(ready&&visible&&!document.hidden&&!localPaused&&!globallyPaused()&&!reduced.matches){video.play().catch(()=>{button.textContent='영상 재생';});}else video.pause();};
  video.addEventListener('play',()=>{button.textContent='Ⅱ 영상 멈춤';button.setAttribute('aria-label','배경 영상 일시 정지')});
  video.addEventListener('pause',()=>{button.textContent='▶ 영상 재생';button.setAttribute('aria-label','배경 영상 재생')});
  button.onclick=()=>{localPaused=!video.paused;if(localPaused)video.pause();else video.play().catch(()=>{});};
  video.addEventListener('loadeddata',()=>{ready=true;container.classList.add('has-video');button.hidden=false;button.textContent='▶ 영상 재생';const note=container.querySelector('.illustration-note');if(note)note.textContent='AI 생성 산지 연출 영상';sync();},{once:true});
  video.addEventListener('error',()=>{ready=false;video.remove();button.remove();container.classList.remove('has-video');});
  container.append(video,button);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.05}).observe(container);
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
 });
}
