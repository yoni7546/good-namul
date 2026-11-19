import { initSpicyProducts } from './spicy.js';
const selectors='h1,h2,h3,h4,p,small,em,strong,b,span,time,a,button,.eyebrow,.landscape-label,.brand-five,.number,.simple,.badges span,.footer-bottom b,.history-summary b,.history-summary small,.history-timeline time,.feature-list span,.recipe-steps b,.recipe-steps span,.product-meta strong,.product-meta small,.announcement,.channel-grid small';
export function editableNodes(){
 const page=location.pathname.startsWith('/brand')?'brand':'home';let counter=0;const result=[];
 for(const element of document.querySelectorAll(selectors)){
  if(element.closest('#detail,.shorts-track,.motion-toggle,.package') || element.closest('[aria-hidden="true"]'))continue;
  for(const node of element.childNodes){if(node.nodeType!==Node.TEXT_NODE||!node.textContent.trim())continue;const value=node.textContent.trim();if(!/[가-힣A-Za-z0-9]/.test(value))continue;const section=element.closest('section,footer,.announcement');const title=section?.querySelector('h1,h2,.eyebrow')?.textContent.trim().replace(/\s+/g,' ').slice(0,55) || (section?.tagName==='FOOTER'?'푸터':'상단 안내');result.push({key:`${page}_${counter++}`,node,defaultText:value,section:title});}
 }
 return result;
}
export function applyEditable(content){const nodes=editableNodes();for(const item of nodes){const value=content?.copyNodes?.[item.key];if(typeof value==='string' && value.trim())item.node.textContent=value;}window.copyEditorFields=nodes.map(x=>({key:x.key,section:x.section,defaultText:x.defaultText,currentText:x.node.textContent.trim()}));if(!new URLSearchParams(location.search).has('editor-preview'))initSpicyProducts();}
