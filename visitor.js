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
 const timer=setInterval(()=>{if(!document.hidden)refresh();},15000);
 addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();
