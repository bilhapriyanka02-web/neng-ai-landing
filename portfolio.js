const $ = id => document.getElementById(id);
const pages = ['home','apps','media','about','chat'];
function showPage(name) {
 if(!pages.includes(name)) name='home';
 pages.forEach(page=>{$(page).hidden=page!==name;});
 document.querySelectorAll('.dock [data-page]').forEach(button=>{const selected=button.dataset.page===name;button.classList.toggle('active',selected);if(selected)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
 if(name!=='media') $('mediaVideo').pause();
 if(location.hash!== '#'+name) history.replaceState(null,'','#'+name);
}
document.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>showPage(button.dataset.page)));
addEventListener('hashchange',()=>showPage(location.hash.slice(1)));
showPage(location.hash.slice(1)||'home');
const apps=[
 {name:'Neng-app',category:'01 / CREATIVE STUDIO',description:'Tempat ide visual mulai dirangkai. Susun prompt, bedah video menjadi prompt, dan buat video baru.',features:['Prompt Studio','Video-to-Prompt','Video Generator'],url:'https://app.neng-ai.cloud/',color:'#e8dae5',mock:'',title:'Dari ide mentah,<br>jadi karya visual.',label:'Neng_AI',tools:['Prompt Studio','Video-to-Prompt','Video Generator']},
 {name:'Aster Assistant',category:'02 / AI ASSISTANT',description:'Ruang untuk berpikir, mencari informasi, dan berkreasi. Percakapan, riset web, file, dan Aster Live dalam satu tempat.',features:['Chat & riset web','File terhubung','Aster Live'],url:'https://aster-assistant.my.id/',color:'#dfdfed',mock:'mock-aster',title:'Apa yang ingin<br>kamu kerjakan?',label:'Aster',tools:['Riset topik','Bekerja dengan file','Live voice']},
 {name:'Aster Gateway',category:'03 / AI API PLATFORM',description:'Akses AI untuk aplikasi yang kamu bangun. Jelajahi model, coba di playground, kelola API key, dan pantau penggunaan.',features:['Model AI & API','Playground','Coin & pemakaian'],url:'https://gateway.aster-assistant.my.id/',color:'#d4dfce',mock:'mock-gateway',title:'Akses AI.<br>Bangun kemungkinan.',label:'✳ Aster Gateway',tools:['Model','API key','Usage']}
];
function selectApp(index){const app=apps[index];$('appCategory').textContent=app.category;$('appName').textContent=app.name;$('appDescription').textContent=app.description;$('appLink').href=app.url;$('appFeatures').replaceChildren(...app.features.map(text=>{const el=document.createElement('span');el.textContent=text;return el;}));$('appVisual').style.background=app.color;$('appVisual').innerHTML='<div class="mock '+app.mock+'"><div class="mock-header"><span>'+app.label+'</span>'+(index===0?'<img src="public/images/panda-head.png" alt="">':'<span>···</span>')+'</div><p class="mock-kicker">YOUR NEXT IDEA STARTS HERE.</p><div class="mock-title">'+app.title+'</div><div class="mock-tools">'+app.tools.map(text=>'<span>'+text+'</span>').join('')+'</div>'+(index===1?'<div class="mock-input">Tanyakan apa saja… <b>↑</b></div>':'')+'</div>';document.querySelectorAll('[data-app]').forEach(button=>{const selected=Number(button.dataset.app)===index;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});}
document.querySelectorAll('[data-app]').forEach(button=>button.addEventListener('click',()=>selectApp(Number(button.dataset.app))));selectApp(0);
let mediaIndex=1;
function selectMedia(delta){$('mediaVideo').pause();$('mediaVideo').removeAttribute('src');$('mediaVideo').load();mediaIndex=(mediaIndex-1+delta+4)%4+1;$('mediaNumber').textContent=String(mediaIndex).padStart(2,'0');$('mediaVideo').hidden=true;$('mediaPlaceholder').hidden=false;$('playMedia').hidden=false;$('mediaMessage').textContent='';}
$('nextMedia').addEventListener('click',()=>selectMedia(1));$('previousMedia').addEventListener('click',()=>selectMedia(-1));
$('playMedia').addEventListener('click',()=>{const video=$('mediaVideo');video.src='public/videos/karya-'+String(mediaIndex).padStart(2,'0')+'.mp4';video.hidden=false;$('mediaPlaceholder').hidden=true;$('playMedia').hidden=true;video.play().catch(()=>{});});
$('mediaVideo').addEventListener('error',()=>{$('mediaVideo').hidden=true;$('mediaPlaceholder').hidden=false;$('playMedia').hidden=false;$('mediaMessage').textContent='Video ini belum tersedia. Karya lainnya bisa kamu lihat di TikTok Neng.';});
let story=0;
const stories=[
 ['Gue mengeksplorasi generative AI lewat video dan konten, sekaligus membangun Neng-app, Aster Assistant, dan Aster Gateway.','Proses pengembangan gue berjalan dari HP Android: mencoba, menguji hasilnya langsung, lalu memperbaiki detailnya.'],
 ['Gue ikut membentuk karakter visual, alur penggunaan, dan fitur setiap produk. Eksperimen jadi bagian dari proses sehari-hari.','Punya ciri khas dan benar-benar bisa digunakan adalah dua hal yang gue jaga—di karya media maupun aplikasi.']
];
$('aboutNext').addEventListener('click',()=>{story=1-story;$('aboutStory').replaceChildren(...stories[story].map(text=>{const el=document.createElement('p');el.textContent=text;return el;}));$('aboutNext').innerHTML=(story?'Kembali ke awal':'Cerita berikutnya')+' <span>→</span>';});
let swipeStart;
$('mediaPlaceholder').addEventListener('touchstart',e=>{swipeStart=e.touches[0].clientX;},{passive:true});
$('mediaPlaceholder').addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-swipeStart;if(Math.abs(delta)>55)selectMedia(delta<0?1:-1);},{passive:true});
