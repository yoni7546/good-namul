import './footer-info.css';
const defaults={company:'고원농산영농조합법인',representative:'윤봉득',privacyOfficer:'윤봉득',hours:'평일 오전 9시 ~ 오후 6시 · 주말 및 공휴일 휴무',phone:'010-4189-4444',businessNumber:'2258111973',address:'강원도 정선군 사북읍 직전로 299 (우: 233905)',mailOrderNumber:'2015-강원정선-7호',email:'gowon7772@hanmail.net'};
export async function initFooterInfo(){
 const footer=document.querySelector('footer');if(!footer || footer.querySelector('.business-footer'))return;
 let data=defaults;try{const res=await fetch('/api/footer');if(res.ok)data={...defaults,...await res.json()}}catch{}
 const old=footer.querySelector('.footer-bottom');if(old)old.hidden=true;
 const wrap=document.createElement('div');wrap.className='business-footer';
 const links=document.createElement('nav');links.className='footer-info-nav';links.setAttribute('aria-label','회사 안내');
 const dialog=document.createElement('dialog');dialog.className='footer-info-dialog';const close=document.createElement('button');close.type='button';close.textContent='닫기';const heading=document.createElement('h2');const body=document.createElement('p');dialog.append(heading,body,close);close.onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 for(const [key,label] of [['privacy','개인정보처리방침'],['terms','이용약관'],['guide','이용안내'],['partnership','제휴문의']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{heading.textContent=label;body.textContent=data[key]||'안내 내용을 준비 중입니다.';dialog.showModal()};links.append(b)}
 const grid=document.createElement('div');grid.className='footer-info-grid';
 const business=document.createElement('section');business.className='footer-business';const name=document.createElement('h2');const admin=document.createElement('a');admin.href='/admin';admin.textContent=(data.company||defaults.company)+' 사업자정보';name.append(admin);business.append(name);
 function line(pairs){const p=document.createElement('p');for(const [i,[label,key]] of pairs.entries()){if(i)p.append(document.createTextNode('  /  '));const span=document.createElement('span');span.textContent=label+' : '+(data[key]||'등록 전');p.append(span)}return p}
 business.append(line([['대표','representative'],['사업장 소재지','address']]),line([['사업자등록번호','businessNumber'],['통신판매업신고','mailOrderNumber']]),line([['이메일','email'],['개인정보보호책임자','privacyOfficer']]),line([['전화번호','phone']]));
 const copyright=document.createElement('p');copyright.className='footer-copyright';copyright.textContent='© '+new Date().getFullYear()+' 고원농산영농조합법인. All rights reserved.';const insta=document.createElement('a');insta.href='https://www.instagram.com/good_namul/';insta.target='_blank';insta.rel='noopener noreferrer';insta.className='footer-social';insta.textContent='Instagram ↗';business.append(copyright,insta);
 const customer=document.createElement('section');customer.className='footer-customer';const custTitle=document.createElement('h2');custTitle.textContent='고객센터';const phone=document.createElement('p');phone.className='footer-phone';phone.textContent=data.phone||'연락처 등록 전';const hours=document.createElement('p');hours.textContent=data.hours||'운영시간 등록 전';customer.append(custTitle,phone,hours);
 grid.append(business,customer);wrap.append(links,grid,dialog);footer.append(wrap);
}
