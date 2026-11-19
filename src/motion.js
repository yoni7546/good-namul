export function initMotion(){
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.createElement('button');toggle.className='motion-toggle';toggle.type='button';
 const landscapes=[...document.querySelectorAll('.landscape-photo')];
 let paused=reduced.matches;
 const headline=document.querySelector('.hero .five-second strong');
 const headlineNumber=headline?.firstChild?.nodeType===Node.TEXT_NODE?headline.firstChild:null;
 const editorPreview=new URLSearchParams(location.search).has('editor-preview');
 let headlineTimer=null;
 function syncHeadline(){
  clearTimeout(headlineTimer);headlineTimer=null;
  if(!headlineNumber || editorPreview)return;
  if(paused){headlineNumber.textContent='5';return;}
  let value=1;
  function tick(){if(paused)return;headlineNumber.textContent=String(value);const delay=value===5?20000:1000;value=value===5?1:value+1;headlineTimer=setTimeout(tick,delay);}
  tick();
 }
 function sync(){syncHeadline();document.body.classList.toggle('motion-paused',paused);toggle.textContent=paused?'▶ 모션 재생':'Ⅱ 모션 멈춤';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'모션 재생':'모션 일시 정지');requestAnimationFrame(updateLandscape);}
 toggle.addEventListener('click',()=>{paused=!paused;sync()});reduced.addEventListener('change',e=>{paused=e.matches;sync()});document.body.append(toggle);sync();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.story-copy,.landscape,.section-heading,.promise-grid article,.features>div,.product,.recipe-copy,.recipe-photo,.awards .section>div,.buy h2,.channel-grid>*').forEach((el,i)=>{el.style.setProperty('--delay',`${i%3*70}ms`);el.classList.add('reveal');observer.observe(el)});
 function updateLandscape(){for(const el of landscapes){const r=el.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));el.style.setProperty('--scenery-scale',paused?'1':String(1.08+p*.24));el.style.setProperty('--scenery-y',paused?'0%':`${(p-.5)*8}%`);}}
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let scheduled=false;const update=()=>{const distance=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${distance>0?scrollY/distance:0})`;document.querySelector('header').classList.toggle('scrolled',scrollY>30);updateLandscape();scheduled=false};
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
 // Count only the number in the main 5-second badge, once on entry.
 const badge=document.querySelector('.hero .altitude b');
 const number=badge && [...badge.childNodes].find(node=>node.nodeType===Node.TEXT_NODE && node.textContent.trim()==='5');
 if(number && !paused && !new URLSearchParams(location.search).has('editor-preview')){
  number.textContent='1';
  for(let value=2;value<=5;value++)setTimeout(()=>{number.textContent=paused?'5':String(value)},(value-1)*350);
 }
 if(matchMedia('(hover: hover) and (pointer: fine)').matches){document.querySelectorAll('.product-art').forEach(card=>{card.addEventListener('pointermove',e=>{if(paused||reduced.matches)return;const r=card.getBoundingClientRect();card.style.transform=`perspective(900px) rotateX(${-(e.clientY-r.top-r.height/2)/45}deg) rotateY(${(e.clientX-r.left-r.width/2)/45}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='');});}
}
