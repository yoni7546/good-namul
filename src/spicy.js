import './spicy.css';

export function initSpicyProducts(){
  const grid=document.querySelector('#products .product-grid');
  const filters=document.querySelector('#products .filters');
  if(!grid || !filters || grid.querySelector('.spicy-product'))return;
  const varieties=[['gondre','곤드레'],['siraegi','시래기'],['chwi','취나물'],['yuchae','유채나물']];
  const current=filters.querySelector('[aria-pressed="true"]')?.dataset.filter || 'all';
  for(const [id,name] of varieties){
    const card=document.createElement('article');card.className='product spicy-product';card.dataset.category='spicy';card.hidden=current!=='all' && current!=='spicy';
    const art=document.createElement('div');art.className='product-art spicy-art';
    const image=document.createElement('img');image.src=`/images/spicy/${id}.webp`;image.alt=`${name} 매운맛 출시 예정 패키지`;image.loading='lazy';
    const badge=document.createElement('span');badge.className='spicy-badge';badge.textContent='출시 준비 중';art.append(image,badge);
    const meta=document.createElement('div');meta.className='product-meta';const small=document.createElement('small');small.textContent='새롭게 만나는 매운맛';const title=document.createElement('h3');title.textContent=`${name} 매운맛`;const status=document.createElement('p');status.className='spicy-status';status.textContent='출시 준비 중';meta.append(small,title,status);card.append(art,meta);grid.append(card);
  }
  const button=document.createElement('button');button.type='button';button.dataset.filter='spicy';button.setAttribute('aria-pressed','false');button.textContent='매운맛 출시 예정';
  button.addEventListener('click',()=>{filters.querySelectorAll('[data-filter]').forEach(x=>{const selected=x===button;x.classList.toggle('active',selected);x.setAttribute('aria-pressed',String(selected));});grid.querySelectorAll('.product').forEach(p=>p.hidden=p.dataset.category!=='spicy');});
  filters.append(button);
}
