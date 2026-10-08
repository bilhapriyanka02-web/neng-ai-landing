(() => {
 const popup=document.getElementById('visitorPopup');
 const count=document.getElementById('visitorCount');
 const caption=document.getElementById('visitorCaption');
 const close=document.getElementById('visitorClose');
 if(!popup || !count || !caption)return;
 close?.addEventListener('click',()=>{popup.hidden=true;});
 let visitorId;
 try{
  visitorId=localStorage.getItem('neng-visitor-id');
  if(!visitorId){visitorId=crypto.randomUUID();localStorage.setItem('neng-visitor-id',visitorId);}
 }catch{visitorId=crypto.randomUUID();}
 async function refresh(first=false){
  try{
   const response=await fetch('https://neng-ai-portfolio.vercel.app/api/visitors',{method:first?'POST':'GET',headers:{'Content-Type':'application/json'},body:first?JSON.stringify({visitorId}):undefined,cache:'no-store'});
   if(!response.ok)throw Error('unavailable');
   const data=await response.json();
   if(!Number.isSafeInteger(data.total))throw Error('invalid');
   count.textContent=new Intl.NumberFormat('id-ID').format(data.total);
   caption.textContent='Total pengunjung portofolio';
  }catch{count.textContent='Statistik belum tersedia';caption.textContent='Coba lagi nanti';}
 }
 refresh(true);
 // Drift between unobtrusive positions, always clear of the top header.
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const move=()=>{
   if(popup.hidden)return;
   const size=popup.getBoundingClientRect().width||122;
   const minY=Math.max(170,innerHeight*.35);
   const maxX=Math.max(12,innerWidth-size-12);
   const maxY=Math.max(minY,innerHeight-size-95);
   popup.style.right='auto';popup.style.bottom='auto';
   popup.style.left=(12+Math.random()*Math.max(0,maxX-12))+'px';
   popup.style.top=(minY+Math.random()*Math.max(0,maxY-minY))+'px';
  };
  setTimeout(move,1400);
  const drift=setInterval(()=>{if(!document.hidden)move()},7500);
  addEventListener('pagehide',()=>clearInterval(drift),{once:true});
 }

 const timer=setInterval(()=>{if(!document.hidden)refresh();},15000);
 addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();
