export function initMotion(){
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.createElement('button');toggle.className='motion-toggle';toggle.type='button';
 let paused=reduced.matches;
 function sync(){document.body.classList.toggle('motion-paused',paused);toggle.textContent=paused?'▶ 모션 재생':'Ⅱ 모션 멈춤';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'모션 재생':'모션 일시 정지');}
 toggle.addEventListener('click',()=>{paused=!paused;sync()});reduced.addEventListener('change',e=>{paused=e.matches;sync()});document.body.append(toggle);sync();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll('.story-copy,.landscape,.section-heading,.promise-grid article,.features>div,.product,.recipe-copy,.recipe-photo,.awards .section>div,.buy h2,.channel-grid>*').forEach((el,i)=>{el.style.setProperty('--delay',`${i%3*70}ms`);el.classList.add('reveal');observer.observe(el)});
 const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let scheduled=false;const update=()=>{const distance=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${distance>0?scrollY/distance:0})`;document.querySelector('header').classList.toggle('scrolled',scrollY>30);scheduled=false};
 addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});update();
 if(matchMedia('(hover: hover) and (pointer: fine)').matches){document.querySelectorAll('.product-art').forEach(card=>{card.addEventListener('pointermove',e=>{if(paused||reduced.matches)return;const r=card.getBoundingClientRect();card.style.transform=`perspective(900px) rotateX(${-(e.clientY-r.top-r.height/2)/45}deg) rotateY(${(e.clientX-r.left-r.width/2)/45}deg)`});card.addEventListener('pointerleave',()=>card.style.transform='');});}
}
