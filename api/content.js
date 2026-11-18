import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import crypto from 'node:crypto';

export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 try {
  const account=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  if (!account.private_key || !account.project_id || !process.env.ADMIN_PIN) return res.status(503).json({error:'관리자 설정이 완료되지 않았습니다.'});
  const app=getApps()[0] || initializeApp({credential:cert(account)}), db=getFirestore(app), ref=db.doc('site/content');
  if(req.method==='GET'){const d=await ref.get();return res.status(200).json(d.exists?d.data():{});}
  if(req.method!=='POST')return res.status(405).end();
  const origin=req.headers.origin;if(!origin || new URL(origin).host!==req.headers.host) return res.status(403).json({error:'요청이 거부되었습니다.'});
  const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').split(',')[0].trim();
  const key=crypto.createHmac('sha256',account.private_key).update(ip).digest('hex');const limit=db.doc('admin_attempts/'+key);
  const pin=String(req.body?.pin||'');
  const valid=await db.runTransaction(async t=>{const snap=await t.get(limit), now=Date.now(), data=snap.data()||{};if(data.until>now && data.count>=5)return false;const count=data.until>now?data.count:0;const ok=pin.length===4 && pin===process.env.ADMIN_PIN;t.set(limit,{count:ok?0:count+1,until:now+15*60*1000,updated:FieldValue.serverTimestamp()});return ok;});
  if(!valid)return res.status(401).json({error:'PIN이 올바르지 않거나 시도 횟수를 초과했습니다. 15분 후 다시 시도해 주세요.'});
  if(req.body.action==='login')return res.status(200).json({ok:true});
  const {shorts,copy,copyNodes}=req.body;if(!Array.isArray(shorts)||shorts.length>30||!copy||typeof copy!=='object')return res.status(400).json({error:'입력 내용을 확인해 주세요.'});
  const clean=[];for(const item of shorts){let url;try{url=new URL(item.url)}catch{return res.status(400).json({error:'영상 링크를 확인해 주세요.'})}if(url.protocol!=='https:'||!['youtube.com','www.youtube.com','youtu.be','www.instagram.com','instagram.com','www.tiktok.com','tiktok.com'].includes(url.hostname))return res.status(400).json({error:'YouTube, Instagram, TikTok 링크만 사용할 수 있습니다.'});clean.push({url:url.href,title:String(item.title||'').slice(0,100)});}
  const texts={};for(const k of ['hero','heroDescription','storyTitle','storyBody','shortsTitle']){if(typeof copy[k]==='string')texts[k]=copy[k].slice(0,500)}
  const nodeTexts={};if(copyNodes && typeof copyNodes==='object' && !Array.isArray(copyNodes)){const entries=Object.entries(copyNodes);if(entries.length>500)return res.status(400).json({error:'문구 수가 너무 많습니다.'});for(const [key,value] of entries){if(/^(home|brand)_\d{1,3}$/.test(key) && typeof value==='string')nodeTexts[key]=value.slice(0,500);}}
  await ref.set({shorts:clean,copy:texts,copyNodes:nodeTexts},{merge:true});return res.status(200).json({ok:true});
 }catch(e){console.error('content API error',e.message);return res.status(500).json({error:'저장소 연결에 실패했습니다.'});}
}
