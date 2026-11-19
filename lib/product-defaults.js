export const defaultProducts = [
 {id:'gondre',name:'곤드레',description:'정선의 자연을 담은 한 팩',category:'single',status:'available',regularPrice:2400,salePrice:null,approximate:true,image:'',url:''},
 {id:'siraegi',name:'시래기',description:'구수한 나물의 깊은 맛',category:'single',status:'available',regularPrice:2400,salePrice:null,approximate:true,image:'',url:''},
 {id:'chwi',name:'취나물',description:'은은한 향으로 채우는 식탁',category:'single',status:'available',regularPrice:2400,salePrice:null,approximate:true,image:'',url:''},
 {id:'yuchae',name:'유채나물',description:'부드럽게 즐기는 초록 한 끼',category:'single',status:'available',regularPrice:2400,salePrice:null,approximate:true,image:'',url:''},
 {id:'gift',name:'프리미엄 종합 선물세트',description:'소중한 분께 전하는 정선의 정성',category:'gift',status:'available',regularPrice:47900,salePrice:null,approximate:true,image:'',url:''},
 ...[['gondre','곤드레'],['siraegi','시래기'],['chwi','취나물'],['yuchae','유채나물']].map(([id,name])=>({id:'spicy-'+id,name:name+' 매운맛',description:'새롭게 만나는 매운맛',category:'spicy',status:'upcoming',regularPrice:null,salePrice:null,approximate:false,image:'/images/spicy/'+id+'.webp',url:''}))
];
