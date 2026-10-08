(function(){
"use strict";
const endpoint="https://api.github.com/repos/bilhapriyanka02-web/neng-ai-landing/commits/main";
let baseline=new URLSearchParams(location.search).get("sitebuild")||null;
let pending=null;
let checking=false;
const toast=document.createElement("div");
toast.className="site-update-toast";
toast.hidden=true;
toast.innerHTML='<span>Versi baru Neng AI tersedia ✨</span><button type="button">Perbarui</button>';
document.body.appendChild(toast);
toast.querySelector("button").addEventListener("click",()=>{
 if(!pending)return;
 const url=new URL(location.href);
 url.searchParams.set("sitebuild",pending);
 location.replace(url.toString());
});
async function check(){
 if(checking||document.hidden)return;
 checking=true;
 try{
  const response=await fetch(endpoint,{cache:"no-store",headers:{"Accept":"application/vnd.github+json"}});
  if(!response.ok)return;
  const data=await response.json();
  const sha=typeof data.sha==="string"?data.sha:"";
  if(!sha)return;
  if(!baseline){baseline=sha;return;}
  if(sha!==baseline){pending=sha;toast.hidden=false;}
 }catch(_){}
 finally{checking=false;}
}
setTimeout(check,15000);
setInterval(check,90000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)check()});
window.addEventListener("focus",check);
})();
