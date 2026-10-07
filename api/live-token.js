// The permanent key stays in Vercel. Browsers receive a one-use Live token only.
const MODEL = 'gemini-3.1-flash-live-preview';
const origins = new Set(['https://neng-ai.cloud','https://www.neng-ai.cloud','https://neng-ai-portfolio.vercel.app']);
const requests = new Map();
export default async function handler(req, res) {
 const origin=req.headers.origin;
 if(origin && origins.has(origin)) {
  res.setHeader('Access-Control-Allow-Origin',origin);
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
 }
 res.setHeader('Cache-Control','no-store');
 if(!origin || !origins.has(origin)) return res.status(403).json({error:'Origin tidak diizinkan.'});
 if(req.method==='OPTIONS') return res.status(204).end();
 if(req.method!=='POST') {res.setHeader('Allow','POST, OPTIONS');return res.status(405).json({error:'Gunakan POST.'});}
 const key=process.env.GEMINI_API_KEY;
 if(!key) return res.status(503).json({error:'Neng Live belum tersedia. Silakan jelajahi karya Neng dulu.',code:'LIVE_NOT_CONFIGURED'});
 // Best-effort per-instance throttle, in addition to Google project quotas.
 const now=Date.now(),ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
 for(const [id,entry] of requests) if(now-entry.start>60000) requests.delete(id);
 const entry=requests.get(ip)||{start:now,count:0};
 if(++entry.count>6) return res.status(429).json({error:'Tunggu sebentar sebelum menyambung ulang.'});
 requests.set(ip,entry);
 try {
  const upstream=await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens',{
   method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},
   body:JSON.stringify({uses:1,expireTime:new Date(now+30*60000).toISOString(),newSessionExpireTime:new Date(now+60000).toISOString(),liveConnectConstraints:{model:'models/'+MODEL}}),
   signal:AbortSignal.timeout(15000)
  });
  const data=await upstream.json();
  if(!upstream.ok || !data.name) {
   console.error('Neng Live token failed',{status:upstream.status,code:data.error?.status});
   return res.status(502).json({error:'Neng Live belum bisa tersambung. Coba lagi sebentar.'});
  }
  return res.status(200).json({token:data.name,model:MODEL,voice:'Sulafat',expiresAt:now+30*60000});
 } catch(error) {
  console.error('Neng Live token request failed',{name:error.name});
  return res.status(502).json({error:'Koneksi Neng Live sedang terganggu. Coba lagi sebentar.'});
 }
}
