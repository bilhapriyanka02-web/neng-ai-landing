(function(){
"use strict";
const endpoint="https://api.github.com/repos/bilhapriyanka02-web/neng-ai-landing/commits/main";
let baseline=new URLSearchParams(location.search).get("sitebuild")||null;
let checking=false;
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
  if(sha!==baseline){
   const url=new URL(location.href);
   url.searchParams.set("sitebuild",sha);
   location.replace(url.toString());
  }
 }catch(_){}
 finally{checking=false;}
}
setTimeout(check,2000);
setInterval(check,10000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)check()});
})();
