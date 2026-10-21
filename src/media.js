import {initializeApp} from 'firebase/app';
import {getStorage,ref,getDownloadURL} from 'firebase/storage';
// Firebase Storage의 public/ 아래에 같은 이름의 webp 사진을 업로드하면 자동 교체됩니다.
export async function loadMedia(firebaseConfig){
 const storage=getStorage(initializeApp(firebaseConfig));
 await Promise.allSettled([...document.querySelectorAll('[data-image]')].map(async image=>{
  const url=await getDownloadURL(ref(storage,`public/${image.dataset.image}.webp`));
  await new Promise((resolve,reject)=>{const probe=new Image();probe.onload=resolve;probe.onerror=reject;probe.src=url;});
  image.src=url;image.hidden=false;
  if(image.dataset.image==='hero'||image.dataset.image==='recipe')image.alt='착한나물 나물밥';
  if(image.dataset.image==='story')image.alt='고원농산 정선 산지';
  image.parentElement.querySelectorAll('.package,.art-label,.hero-image-note,.illustration-note').forEach(e=>e.hidden=true);
  if(image.dataset.image==='recipe')image.parentElement.querySelector('span').hidden=true;
 }));
}
