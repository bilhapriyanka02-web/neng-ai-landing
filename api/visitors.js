const KEY='neng-ai:unique-visitors:v1';
const URL=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL;
const TOKEN=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN;
async function redis(command){
 const response=await fetch(URL,{method:'POST',headers:{Authorization:'Bearer '+TOKEN,'Content-Type':'application/json'},body:JSON.stringify(command),cache:'no-store'});
 if(!response.ok)throw Error('Storage unavailable');
 const data=await response.json();
 if(data.error)throw Error('Storage error');
 return data.result;
}
export default async function handler(req,res){
 const origin=req.headers.origin;
 if(origin==='https://neng-ai.cloud'||origin==='https://www.neng-ai.cloud'){
  res.setHeader('Access-Control-Allow-Origin',origin);
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
 }
 if(req.method==='OPTIONS')return res.status(204).end();
 res.setHeader('Cache-Control','no-store, max-age=0');
 if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
 if(!URL||!TOKEN)return res.status(503).json({error:'Visitor storage not configured'});
 try{
  if(req.method==='POST'){
   const id=req.body?.visitorId;
   if(typeof id!=='string'||! /^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'Invalid visitor'});
   await redis(['SADD',KEY,id]);
  }
  const total=Number(await redis(['SCARD',KEY]));
  return res.status(200).json({total});
 }catch{return res.status(503).json({error:'Visitor statistics unavailable'});}
}
