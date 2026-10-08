(() => {
 const $=id=>document.getElementById(id);
 const persona=`Kamu adalah Neng_AI, persona AI kreatif di portofolio Neng_AI. Bicara dalam bahasa Indonesia, hangat, ekspresif dan santai, pakai aku/kamu. Jawab singkat, alami, biasanya 1–4 kalimat. Jangan mengaku manusia, jangan mengarang pengalaman atau prestasi.
 Neng_AI adalah pelaku generative AI yang mengeksplorasi video dan konten, sekaligus membangun empat aplikasi: Neng-app (https://app.neng-ai.cloud) untuk Prompt Studio, Video-to-Prompt, dan Video Generator; Aster Assistant (https://aster-assistant.my.id) untuk chat, riset web, file, dan Aster Live; Aster Gateway (https://gateway.aster-assistant.my.id) untuk akses model AI/API, playground, API key, dan pemakaian; Beauty Content Automation adalah aplikasi privat untuk produksi konten AI, meliputi planner, copywriting, visual, QA, bank konten, approval, dan penjadwalan. Beauty bukan aplikasi publik: jangan memberikan, menebak, atau menawarkan tautan akses, pendaftaran, atau akun untuknya. Pengembangan dilakukan dari HP Android, bereksperimen dan menguji langsung. Karya media ada di TikTok @neng.ai.21. Galeri video di portofolio masih placeholder. Jangan mengaku bisa menelusuri web atau melihat isi layar secara langsung.
 Bantu pengunjung memahami karya, aplikasi, dan proses kreatif. Jika meminta prompt siap salin, arahkan dengan ramah ke Prompt Studio Neng-app dan jelaskan konsepnya saja. Jangan mempromosikan aplikasi di setiap jawaban. Sapaan pembuka yang diminta: Halo.. selamat datang di Fortopolio Neng_AI, yuk lihat semua karya Neng_AI.`;
 class NengLive {
  constructor(){this.socket=null;this.token=null;this.ready=false;this.connecting=false;this.stopped=false;this.greeted=false;this.muted=false;this.micActive=false;this.sources=new Set();this.nextAudio=0;this.retry=0;this.incoming=Promise.resolve();this.outputLine=null;this.inputLine=null;}
  status(text,state='connecting'){$('liveStatus').textContent=text;$('liveBadge').dataset.state=state;}
  line(role,text){const hint=$('transcript').querySelector('.chat-hint');if(hint)hint.remove();const el=document.createElement('p');el.className=role;const label=document.createElement('span');label.textContent=role==='user'?'Kamu':'Neng_AI';el.append(label,document.createTextNode(text));$('transcript').append(el);while($('transcript').children.length>80)$('transcript').firstChild.remove();$('transcript').scrollTop=$('transcript').scrollHeight;return el;}
  appendLine(role,text){const field=role==='user'?'inputLine':'outputLine';if(!this[field])this[field]=this.line(role,'');this[field].lastChild.textContent+=text;$('transcript').scrollTop=$('transcript').scrollHeight;}
  audioContext(){if(!this.output || this.output.state==='closed')this.output=new(window.AudioContext||window.webkitAudioContext)({sampleRate:24000});return this.output;}
  async unlock(){try{this.muted=false;await this.audioContext().resume();this.updateSound();}catch{this.status('Ketuk Suara untuk mengaktifkan audio.','error');}}
  updateSound(){const playing=this.output?.state==='running'&&!this.muted;$('soundButton').textContent=playing?'Matikan suara':'Aktifkan suara';$('quickSound').innerHTML='Suara <span>'+(playing?'●':'○')+'</span>';$('quickSound').setAttribute('aria-label',playing?'Matikan suara Neng Live':'Aktifkan suara Neng Live');}
  async toggleSound(){if(this.output?.state==='running'&&!this.muted){this.muted=true;await this.output.suspend();}else await this.unlock();this.updateSound();}
  clearAudio(){for(const source of this.sources){try{source.stop();}catch{}}this.sources.clear();this.nextAudio=this.output?.currentTime||0;document.body.classList.remove('speaking');}
  playAudio(base64){const ctx=this.audioContext(),bytes=Uint8Array.from(atob(base64),x=>x.charCodeAt(0)),view=new DataView(bytes.buffer),buffer=ctx.createBuffer(1,bytes.byteLength/2,24000),samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=view.getInt16(i*2,true)/32768;const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);this.nextAudio=Math.max(this.nextAudio,ctx.currentTime+.03);source.start(this.nextAudio);this.nextAudio+=buffer.duration;this.sources.add(source);document.body.classList.add('speaking');source.onended=()=>{this.sources.delete(source);if(!this.sources.size)document.body.classList.remove('speaking');};this.updateSound();}
  send(value){if(this.socket?.readyState===WebSocket.OPEN)this.socket.send(JSON.stringify(value));}
  async connect(resume=false){
   if(this.connecting || this.stopped)return;
   this.connecting=true;this.ready=false;clearTimeout(this.reconnectTimer);clearTimeout(this.setupTimer);this.status('Menghubungkan…');
   try {
    const ctx=this.audioContext();if(!this.muted)ctx.resume().then(()=>this.updateSound()).catch(()=>{});
    if(!resume || !this.token || Date.now()>this.token.expiresAt-60000){const response=await fetch(window.NENG_CONFIG.liveTokenEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});const result=await response.json();if(!response.ok){this.blocked=result.code==='LIVE_NOT_CONFIGURED';throw new Error(result.error||'Neng Live belum bisa tersambung.');}this.token=result;this.handle=null;}
    const socket=new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token='+encodeURIComponent(this.token.token));this.socket=socket;
    socket.onopen=()=>{
     this.send({setup:{model:'models/'+this.token.model,generationConfig:{responseModalities:['AUDIO'],temperature:.8,speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:this.token.voice}}}},systemInstruction:{parts:[{text:persona}]},inputAudioTranscription:{},outputAudioTranscription:{},sessionResumption:this.handle?{handle:this.handle}:{},contextWindowCompression:{slidingWindow:{}},realtimeInputConfig:{automaticActivityDetection:{disabled:false,silenceDurationMs:650,prefixPaddingMs:160},activityHandling:'START_OF_ACTIVITY_INTERRUPTS',turnCoverage:'TURN_INCLUDES_ONLY_ACTIVITY'}}});
     this.setupTimer=setTimeout(()=>{if(!this.ready){this.status('Koneksi Live belum siap. Coba sambung ulang.','error');socket.close();}},18000);
    };
    socket.onmessage=event=>{this.incoming=this.incoming.then(async()=>{const raw=event.data instanceof Blob?await event.data.text():event.data;this.message(JSON.parse(raw));}).catch(()=>this.status('Respons Live tidak terbaca.','error'));};
    socket.onclose=event=>{if(this.socket!==socket)return;clearTimeout(this.setupTimer);this.ready=false;this.connecting=false;if(this.stopped)return;if(event.code===1008 || event.code===1007){this.status('Live ditolak penyedia. Coba sambung ulang.','error');return;}if(this.retry<3){this.status('Menyambung kembali…');this.reconnectTimer=setTimeout(()=>{this.retry++;this.connect(true);},1000*2**this.retry);}else this.status('Live terputus. Ketuk sambung ulang.','error');};
    socket.onerror=()=>this.status('Koneksi Live terganggu.','error');
   } catch(error){this.connecting=false;this.status(this.blocked?'Live belum tersedia':error.message,'error');this.stopMic();}
  }
  message(message){
   if(message.setupComplete){clearTimeout(this.setupTimer);this.connecting=false;this.ready=true;this.retry=0;this.status('Terhubung','ready');if(!this.greeted){this.greeted=true;this.send({clientContent:{turns:[{role:'user',parts:[{text:'Sapa pengunjung sekali saja, ucapkan persis: "Halo.. selamat datang di Fortopolio Neng_AI, yuk lihat semua karya Neng_AI". Jangan tambahkan kalimat lain.'}]}],turnComplete:true}});}else if(!this.handle){this.send({clientContent:{turns:[{role:'user',parts:[{text:'Kita kembali terhubung. Tunggu pertanyaan pengunjung tanpa sapaan ulang.'}]}],turnComplete:false}});}return;}
   if(message.error){this.status('Neng Live belum bisa melanjutkan percakapan.','error');return;}
   if(message.sessionResumptionUpdate?.resumable && message.sessionResumptionUpdate.newHandle)this.handle=message.sessionResumptionUpdate.newHandle;
   if(message.goAway){this.status('Memperbarui sesi…');this.socket?.close(1000);return;}
   const content=message.serverContent;if(!content)return;
   if(content.interrupted){this.clearAudio();this.outputLine=null;this.inputLine=null;}
   if(content.inputTranscription?.text)this.appendLine('user',content.inputTranscription.text);
   if(content.outputTranscription?.text)this.appendLine('assistant',content.outputTranscription.text);
   for(const part of content.modelTurn?.parts||[]){if(part.inlineData?.data && part.inlineData.mimeType?.startsWith('audio/pcm'))this.playAudio(part.inlineData.data);}
   if(content.turnComplete){this.inputLine=null;this.outputLine=null;}
  }
  text(text){if(!this.ready){this.status(this.blocked?'Live belum tersedia':'Tunggu sampai Live terhubung.','error');return false;}this.line('user',text);this.inputLine=null;this.outputLine=null;this.send({clientContent:{turns:[{role:'user',parts:[{text}]}],turnComplete:true}});return true;}
  async startMic(){
   if(!this.ready){this.status('Live perlu terhubung sebelum mikrofon aktif.','error');return;}
   try {await this.unlock();this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});if(!this.ready){this.stopMic();return;}this.input=new(window.AudioContext||window.webkitAudioContext)();await this.input.resume();this.micSource=this.input.createMediaStreamSource(this.stream);this.processor=this.input.createScriptProcessor(2048,1,1);this.silent=this.input.createGain();this.silent.gain.value=0;this.processor.onaudioprocess=event=>{if(!this.ready || !this.micActive)return;const data=event.inputBuffer.getChannelData(0),ratio=this.input.sampleRate/16000,length=Math.floor(data.length/ratio),pcm=new Uint8Array(length*2),view=new DataView(pcm.buffer);for(let i=0;i<length;i++){const position=i*ratio,index=Math.floor(position),fraction=position-index,sample=data[index]*(1-fraction)+(data[Math.min(index+1,data.length-1)]||0)*fraction;view.setInt16(i*2,Math.round(Math.max(-1,Math.min(1,sample))*32767),true);}let binary='';for(let i=0;i<pcm.length;i++)binary+=String.fromCharCode(pcm[i]);this.send({realtimeInput:{audio:{data:btoa(binary),mimeType:'audio/pcm;rate=16000'}}});};this.micSource.connect(this.processor);this.processor.connect(this.silent);this.silent.connect(this.input.destination);this.micActive=true;$('micButton').textContent='Matikan mikrofon';$('micButton').setAttribute('aria-pressed','true');this.status('Mendengarkan','ready');}
   catch{this.stopMic();this.status('Mikrofon belum diizinkan. Kamu bisa pakai teks.','ready');}
  }
  stopMic(){this.micActive=false;this.stream?.getTracks().forEach(track=>track.stop());this.stream=null;this.processor?.disconnect();this.micSource?.disconnect();this.silent?.disconnect();if(this.input?.state!=='closed')this.input?.close().catch(()=>{});this.input=null;$('micButton').textContent='Nyalakan mikrofon';$('micButton').setAttribute('aria-pressed','false');if(this.ready){this.send({realtimeInput:{audioStreamEnd:true}});this.status('Terhubung','ready');}}
  close(){this.stopped=true;clearTimeout(this.reconnectTimer);clearTimeout(this.setupTimer);this.stopMic();this.clearAudio();this.socket?.close(1000);this.output?.close().catch(()=>{});}
 }
 const live=new NengLive();
 $('soundButton').addEventListener('click',()=>live.toggleSound());$('quickSound').addEventListener('click',()=>live.toggleSound());
 $('micButton').addEventListener('click',()=>live.micActive?live.stopMic():live.startMic());
 $('connectButton').addEventListener('click',()=>{if(live.connecting)return;live.retry=0;live.blocked=false;live.clearAudio();if(live.socket){live.socket.onclose=null;live.socket.close();}live.ready=false;live.connect(false);});
 $('chatForm').addEventListener('submit',event=>{event.preventDefault();const input=$('chatInput'),text=input.value.trim();if(!text)return;live.unlock();if(live.text(text))input.value='';});
 // Browser autoplay rules may suspend audio. The first real gesture unlocks it.
 function firstGesture(event){if(event.target.closest('#soundButton,#quickSound'))return;if(!live.muted)live.unlock();document.removeEventListener('pointerdown',firstGesture);document.removeEventListener('keydown',firstGesture);}
 document.addEventListener('pointerdown',firstGesture);document.addEventListener('keydown',firstGesture);
 addEventListener('pagehide',()=>live.close());addEventListener('pageshow',event=>{if(event.persisted){live.stopped=false;live.connect(false);}});
 live.connect();
})();
