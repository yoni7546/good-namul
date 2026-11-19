import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import crypto from 'node:crypto';
const fields=['company','representative','address','businessNumber','mailOrderNumber','email','privacyOfficer','phone','fax','hosting','hours','contactNote','bank','account','accountHolder','privacy','terms','guide','partnership'];
const defaults={company:'고원농산영농조합법인',representative:'윤봉득',privacyOfficer:'윤봉득',phone:'010-4189-4444',businessNumber:'2258111973',address:'강원도 정선군 사북읍 직전로 299 (우: 233905)',mailOrderNumber:'2015-강원정선-7호',email:'gowon7772@hanmail.net'};
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try{const account=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT||'{}');if(!account.private_key||!process.env.ADMIN_PIN)return res.status(503).json({error:'관리자 설정을 확인해 주세요.'});const db=getFirestore(getApps()[0]||initializeApp({credential:cert(account)}));const ref=db.doc('site/footer');
 if(req.method==='GET'){const doc=await ref.get();return res.status(200).json({...defaults,...(doc.exists?doc.data():{})})}
 if(req.method!=='POST')return res.status(405).end();const origin=req.headers.origin;if(!origin||new URL(origin).host!==req.headers.host)return res.status(403).json({error:'요청이 거부되었습니다.'});
 const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').split(',')[0].trim();const key=crypto.createHmac('sha256',account.private_key).update(ip).digest('hex');const limit=db.doc('admin_attempts/'+key);const pin=String(req.body?.pin||'');const valid=await db.runTransaction(async t=>{const snap=await t.get(limit),now=Date.now(),data=snap.data()||{};if(data.until>now&&data.count>=5)return false;const count=data.until>now?data.count:0,ok=pin.length===4&&pin===process.env.ADMIN_PIN;t.set(limit,{count:ok?0:count+1,until:now+15*60*1000,updated:FieldValue.serverTimestamp()});return ok});if(!valid)return res.status(401).json({error:'PIN이 올바르지 않거나 시도 횟수를 초과했습니다.'});
 const incoming=req.body.footer;if(!incoming||typeof incoming!=='object'||Array.isArray(incoming))return res.status(400).json({error:'입력 내용을 확인해 주세요.'});const clean={};for(const k of fields){const v=incoming[k];if(v!==undefined&&typeof v!=='string')return res.status(400).json({error:'입력 내용을 확인해 주세요.'});clean[k]=(v||'').trim().slice(0,['privacy','terms','guide','partnership'].includes(k)?12000:300)}await ref.set(clean);return res.status(200).json({ok:true});
 }catch(e){console.error('footer API error',e.code||'unknown');return res.status(500).json({error:'푸터 정보를 불러오거나 저장하지 못했습니다.'})}
}
