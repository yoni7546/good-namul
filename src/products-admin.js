import './products-admin.css';
const artworks=import.meta.glob('./assets/pouches/*.{png,jpg,jpeg,webp}',{eager:true,query:'?url',import:'default'});
const fallback=Object.fromEntries(Object.entries(artworks).map(([path,url])=>[path.split('/').pop().replace(/\.[^.]+$/,''),url]));
const money=n=>new Intl.NumberFormat('ko-KR').format(n);
export async function applyManagedProducts(){
 const grid=document.querySelector('#products .product-grid');if(!grid)return;
 try{
  const response=await fetch('/api/products');if(!response.ok)return;const data=await response.json();if(!data.configured||!Array.isArray(data.products))return;
  const active=document.querySelector('#products .filters [aria-pressed="true"]')?.dataset.filter||'all';const fragment=document.createDocumentFragment();
  for(const item of data.products){
   const card=document.createElement('article');card.className='product managed-product';card.dataset.category=item.category;card.hidden=active!=='all'&&active!==item.category;
   const imageUrl=item.image||fallback[item.id]||'';const art=document.createElement(item.status==='available'?'a':'div');art.className='product-art managed-art';
   if(item.status==='available'){art.href=item.url||'https://naver.me/FpPBRQ6z';art.setAttribute('aria-label',item.name+' 구매하기')}else art.classList.add('is-upcoming');
   if(imageUrl){const img=document.createElement('img');img.src=imageUrl;img.alt=item.name+' 제품 사진';img.loading='lazy';art.append(img)}
   if(item.status==='upcoming'){const badge=document.createElement('span');badge.className='spicy-badge';badge.textContent='출시 준비 중';art.append(badge)}else{const arrow=document.createElement('span');arrow.className='round-arrow';arrow.textContent='↗';art.append(arrow)}
   const meta=document.createElement('div');meta.className='product-meta';const desc=document.createElement('small');desc.textContent=item.description||'';const title=document.createElement('h3');if(item.status==='available'){const link=document.createElement('a');link.href=art.href;link.textContent=item.name;title.append(link)}else title.textContent=item.name;meta.append(desc,title);
   const price=document.createElement('p');price.className='managed-price';
   if(item.status==='upcoming')price.textContent='출시 준비 중';
   else if(item.regularPrice!=null){const sale=item.salePrice;if(sale!=null&&sale<item.regularPrice){const off=document.createElement('span');off.className='managed-discount';off.textContent=Math.round((1-sale/item.regularPrice)*100)+'%';const original=document.createElement('del');original.textContent=money(item.regularPrice)+'원';const amount=document.createElement('strong');amount.textContent=money(sale);const saving=document.createElement('span');saving.className='managed-saving';saving.textContent=money(item.regularPrice-sale)+'원 할인';price.append(off,amount,document.createTextNode('원'),original,saving)}else{const amount=document.createElement('strong');amount.textContent=money(item.regularPrice);price.append(amount,document.createTextNode(item.approximate?'원대':'원'))}}
   else price.textContent='가격 준비 중';
   meta.append(price);card.append(art,meta);fragment.append(card);
  }
  grid.replaceChildren(fragment);const spicy=document.querySelector('[data-filter="spicy"]');if(spicy)spicy.textContent=data.products.some(p=>p.category==='spicy'&&p.status==='available')?'매운맛':'매운맛 출시 예정';
 }catch(error){console.warn('제품 목록을 불러오지 못했습니다.');}
}
