const videoCacheVersion=Date.now();
// Keep uploads with the same filename fresh across page visits, while reusing
// each downloaded image when navigating within the current visit.
const freshImageUrl=path=>path;
document.querySelectorAll('img[data-refresh-image]').forEach(image=>{
 image.src=freshImageUrl(image.dataset.refreshImage);
});
const $ = id => document.getElementById(id);
const pages = ['home','apps','media','about','chat'];
function showPage(name) {
 if(!pages.includes(name)) name='home';
 pages.forEach(page=>{
  const section=$(page);
  const entering=page===name && section.hidden;
  section.hidden=page!==name;
  if(entering){
   section.classList.remove('page-reveal');
   void section.offsetWidth;
   section.classList.add('page-reveal');
  }
 });
 document.querySelectorAll('.dock [data-page]').forEach(button=>{const selected=button.dataset.page===name;button.classList.toggle('active',selected);if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
 if(name!=='media') $('mediaVideo').pause();
 else if(typeof mediaVideo!=='undefined' && mediaVideo.src)mediaVideo.play().catch(()=>{$('playMedia').hidden=false;});
 if(location.hash!== '#'+name) history.replaceState(null,'','#'+name);
}
document.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>showPage(button.dataset.page)));
addEventListener('hashchange',()=>showPage(location.hash.slice(1)));
showPage(location.hash.slice(1)||'home');
const apps=[
 {name:'Neng-app',image:'public/images/neng-app.jpg',category:'01 / CREATIVE STUDIO',description:'Tempat ide visual mulai dirangkai. Susun prompt, bedah video menjadi prompt, dan buat video baru.',features:['Prompt Studio','Video-to-Prompt','Video Generator'],url:'https://app.neng-ai.cloud/',color:'#ad654e',mock:'',title:'Dari ide mentah,<br>jadi karya visual.',label:'Neng_AI',tools:['Prompt Studio','Video-to-Prompt','Video Generator']},
 {name:'Aster Assistant',image:'public/images/aster-assistant.jpg',category:'02 / AI ASSISTANT',description:'Ruang untuk berpikir, mencari informasi, dan berkreasi. Percakapan, riset web, file, dan Aster Live dalam satu tempat.',features:['Chat & riset web','File terhubung','Aster Live'],url:'https://aster-assistant.my.id/',color:'#466d89',mock:'mock-aster',title:'Apa yang ingin<br>kamu kerjakan?',label:'Aster',tools:['Riset topik','Bekerja dengan file','Live voice']},
 {name:'Aster Gateway',image:'public/images/aster-gateway.jpg',category:'03 / AI API PLATFORM',description:'Akses AI untuk aplikasi yang kamu bangun. Jelajahi model, coba di playground, kelola API key, dan pantau penggunaan.',features:['Model AI & API','Playground','Coin & pemakaian'],url:'https://gateway.aster-assistant.my.id/',color:'#6e8756',mock:'mock-gateway',title:'Akses AI.<br>Bangun kemungkinan.',label:'✳ Aster Gateway',tools:['Model','API key','Usage']},
 {name:'Beauty Content Automation',image:'public/images/beauty-content-automation.jpg',category:'04 / CONTENT PRODUCTION · PRIVAT',description:'Produksi konten AI dari perencanaan, copywriting, visual, dan QA, hingga bank konten, approval, dan penjadwalan.',features:['Produksi konten AI','Bank & approval','Penjadwalan'],private:true,color:'#753549',mock:'mock-beauty',title:'Satu alur.<br>Dari ide ke konten.',label:'Beauty Content Automation',tools:['Planner','Visual & QA','Bank konten']}
];
let previewRequest=0;
function loadAppScreenshot(app){
 const request=++previewRequest,visual=$('appVisual'),note=document.querySelector('.preview-note');
 visual.classList.remove('has-screenshot');visual.setAttribute('aria-hidden','true');
 note.textContent='Ilustrasi antarmuka';
 const screenshot=new Image();screenshot.alt='Screenshot '+app.name;screenshot.decoding='async';
 screenshot.onload=()=>{
  if(request!==previewRequest)return;
  const link=document.createElement('a');link.href=screenshot.src;link.target='_blank';link.rel='noopener noreferrer';link.className='app-screenshot-link';link.setAttribute('aria-label','Buka screenshot '+app.name+' ukuran penuh');link.append(screenshot);
  visual.replaceChildren(link);visual.classList.add('has-screenshot');visual.removeAttribute('aria-hidden');
  note.textContent='Screenshot aplikasi · Ketuk gambar untuk ukuran penuh';
 };
 screenshot.onerror=()=>{};
 screenshot.src=freshImageUrl(app.image);
}
function selectApp(index){const app=apps[index];$('appCategory').textContent=app.category;$('appName').textContent=app.name;$('appDescription').textContent=app.description;$('appLink').hidden=!app.url;$('appPrivate').hidden=!!app.url;if(app.url)$('appLink').href=app.url;else $('appLink').removeAttribute('href');$('appFeatures').replaceChildren(...app.features.map(text=>{const el=document.createElement('span');el.textContent=text;return el;}));$('appVisual').style.background=app.color;$('appVisual').innerHTML='<div class="mock '+app.mock+'"><div class="mock-header"><span>'+app.label+'</span>'+(index===0?'<img src="public/images/panda-head.png" alt="">':'<span>···</span>')+'</div><p class="mock-kicker">YOUR NEXT IDEA STARTS HERE.</p><div class="mock-title">'+app.title+'</div><div class="mock-tools">'+app.tools.map(text=>'<span>'+text+'</span>').join('')+'</div>'+(index===1?'<div class="mock-input">Tanyakan apa saja… <b>↑</b></div>':'')+'</div>';loadAppScreenshot(app);document.querySelectorAll('[data-app]').forEach(button=>{const selected=Number(button.dataset.app)===index;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});}
document.querySelectorAll('[data-app]').forEach(button=>button.addEventListener('click',()=>selectApp(Number(button.dataset.app))));
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{selectApp(Number(button.dataset.project));showPage('apps');}));selectApp(0);
let mediaIndex=1;
const mediaVideo=$('mediaVideo');
mediaVideo.muted=true;mediaVideo.loop=true;mediaVideo.playsInline=true;mediaVideo.preload='auto';
function selectMedia(delta){$('mediaVideo').pause();mediaIndex=(mediaIndex-1+delta+4)%4+1;$('mediaNumber').textContent=String(mediaIndex).padStart(2,'0');$('filmIndex').textContent=String(mediaIndex).padStart(2,'0');$('mediaVideo').hidden=true;$('mediaPlaceholder').hidden=false;$('playMedia').hidden=false;$('mediaMessage').textContent='';$('mediaPlaceholder').dataset.variant=String(mediaIndex);document.querySelectorAll('[data-media]').forEach(button=>{const selected=Number(button.dataset.media)===mediaIndex;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
 const videoPath='public/videos/karya-'+String(mediaIndex).padStart(2,'0')+'.mp4?v='+videoCacheVersion;
 if(mediaVideo.getAttribute('src')!==videoPath)mediaVideo.src=videoPath;
 mediaVideo.hidden=false;$('mediaPlaceholder').hidden=true;$('playMedia').hidden=true;
 if(!$('media').hidden)mediaVideo.play().catch(()=>{$('playMedia').hidden=false;});
}
$('mediaPlaceholder').dataset.variant='1';
selectMedia(0);
document.querySelectorAll('[data-media]').forEach(button=>button.addEventListener('click',()=>selectMedia(Number(button.dataset.media)-mediaIndex)));
$('nextMedia').addEventListener('click',()=>selectMedia(1));$('previousMedia').addEventListener('click',()=>selectMedia(-1));
$('playMedia').addEventListener('click',()=>{const video=$('mediaVideo');video.src='public/videos/karya-'+String(mediaIndex).padStart(2,'0')+'.mp4';video.hidden=false;$('mediaPlaceholder').hidden=true;$('playMedia').hidden=true;video.muted=false;video.controls=true;video.play().catch(()=>{});});
$('mediaVideo').addEventListener('error',()=>{$('mediaVideo').hidden=true;$('mediaPlaceholder').hidden=false;$('playMedia').hidden=false;$('mediaMessage').textContent='Video ini belum tersedia. Karya lainnya bisa kamu lihat di TikTok Neng.';});
let story=0;
const stories=[
 ['Gue mengeksplorasi generative AI lewat video dan konten, sekaligus membangun Neng-app, Aster Assistant, Aster Gateway, dan Beauty Content Automation.','Proses pengembangan gue berjalan dari HP Android: mencoba, menguji hasilnya langsung, lalu memperbaiki detailnya.'],
 ['Gue ikut membentuk karakter visual, alur penggunaan, dan fitur setiap produk. Eksperimen jadi bagian dari proses sehari-hari.','Punya ciri khas dan benar-benar bisa digunakan adalah dua hal yang gue jaga—di karya media maupun aplikasi.']
];
$('aboutNext').addEventListener('click',()=>{story=1-story;$('aboutStory').replaceChildren(...stories[story].map(text=>{const el=document.createElement('p');el.textContent=text;return el;}));$('aboutNext').innerHTML=(story?'Kembali ke awal':'Cerita berikutnya')+' <span>→</span>';});
let swipeStart;
$('mediaPlaceholder').addEventListener('touchstart',e=>{swipeStart=e.touches[0].clientX;},{passive:true});
$('mediaPlaceholder').addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-swipeStart;if(Math.abs(delta)>55)selectMedia(delta<0?1:-1);},{passive:true});
