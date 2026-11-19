import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { defaultProducts } from '../lib/product-defaults.js';
import crypto from 'node:crypto';
const validId=id=>typeof id==='string' && /^[a-z0-9-]{1,64}$/.test(id);
function product(item){
 if(!item||!validId(item.id)||typeof item.name!=='string'||!item.name.trim()||item.name.length>100||!['single','gift','spicy','other'].includes(item.category)||!['available','upcoming'].includes(item.status))throw Error('제품 정보를 확인해 주세요.');
 const money=v=>v==null||v===''?null:Number.isSafeInteger(v)&&v>=0&&v<=100000000?v:NaN;
 const regularPrice=money(item.regularPrice),salePrice=money(item.salePrice);
 if(Number.isNaN(regularPrice)||Number.isNaN(salePrice)||(salePrice!==null&&(regularPrice===null||salePrice>regularPrice)))throw Error('정가와 할인가를 확인해 주세요.');
 let url='';if(item.url){let u;try{u=new URL(item.url)}catch{throw Error('구매 링크를 확인해 주세요.')}if(u.protocol!=='https:')throw Error('구매 링크는 https 주소여야 합니다.');url=u.href}
 const image=String(item.image||'');if(image && !/^\/(?:images\/spicy\/[a-z]+\.webp|api\/products\?image=[a-z0-9-]{1,64})$/.test(image))throw Error('제품 사진을 다시 업로드해 주세요.');
 return {id:item.id,name:item.name.trim(),description:String(item.description||'').slice(0,150),category:item.category,status:item.status,regularPrice,salePrice,approximate:!!item.approximate,image,url};
}
export default async function handler(req,res){
 try{const account=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT||'{}');if(!account.private_key||!process.env.ADMIN_PIN)return res.status(503).json({error:'관리자 설정을 확인해 주세요.'});const db=getFirestore(getApps()[0]||initializeApp({credential:cert(account)}));
 if(req.method==='GET'){
  if(req.query.image){if(!validId(req.query.image))return res.status(400).end();const img=await db.doc('product_images/'+req.query.image).get();if(!img.exists)return res.status(404).end();const data=img.data();res.setHeader('Content-Type','image/webp');res.setHeader('Cache-Control','public, max-age=31536000, immutable');return res.status(200).send(Buffer.from(data.base64,'base64'));}
  res.setHeader('Cache-Control','no-store');const snap=await db.doc('site/products').get();return res.status(200).json({products:snap.exists?snap.data().products:defaultProducts,configured:snap.exists});
 }
 res.setHeader('Cache-Control','no-store');if(req.method!=='POST')return res.status(405).end();const origin=req.headers.origin;if(!origin||new URL(origin).host!==req.headers.host)return res.status(403).json({error:'요청이 거부되었습니다.'});
 const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').split(',')[0].trim();const key=crypto.createHmac('sha256',account.private_key).update(ip).digest('hex');const limit=db.doc('admin_attempts/'+key);const pin=String(req.body?.pin||'');
 const valid=await db.runTransaction(async t=>{const snap=await t.get(limit),now=Date.now(),data=snap.data()||{};if(data.until>now&&data.count>=5)return false;const count=data.until>now?data.count:0,ok=pin.length===4&&pin===process.env.ADMIN_PIN;t.set(limit,{count:ok?0:count+1,until:now+15*60*1000,updated:FieldValue.serverTimestamp()});return ok});if(!valid)return res.status(401).json({error:'PIN이 올바르지 않거나 시도 횟수를 초과했습니다.'});
 if(req.body.action==='upload'){const base64=req.body.base64;if(typeof base64!=='string'||base64.length>600000||!/^[A-Za-z0-9+/]*={0,2}$/.test(base64))return res.status(400).json({error:'사진 크기를 확인해 주세요.'});const bytes=Buffer.from(base64,'base64');if(bytes.length<12||bytes.length>450000||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')return res.status(400).json({error:'사진 형식이 올바르지 않습니다.'});const id=crypto.randomUUID();await db.doc('product_images/'+id).set({base64,created:FieldValue.serverTimestamp()});return res.status(200).json({image:'/api/products?image='+id});}
 if(req.body.action==='save'){if(!Array.isArray(req.body.products)||req.body.products.length>50)return res.status(400).json({error:'제품은 최대 50개까지 등록할 수 있습니다.'});let products;try{products=req.body.products.map(product)}catch(e){return res.status(400).json({error:e.message})}if(new Set(products.map(p=>p.id)).size!==products.length)return res.status(400).json({error:'중복된 제품이 있습니다.'});await db.doc('site/products').set({products,updated:FieldValue.serverTimestamp()});return res.status(200).json({ok:true});}
 return res.status(400).json({error:'요청을 확인해 주세요.'});
 }catch(e){console.error('products API error',e.code||'unknown');return res.status(500).json({error:'제품 저장소 연결에 실패했습니다.'})}
}
