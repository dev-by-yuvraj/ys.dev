// ═══ SINGLE VIDEO BG — swap src on page change ═══
const HOME_VID = 'https://res.cloudinary.com/dao46c5sb/video/upload/Smooth_for_website_202604132144_qp9rvg.mp4?_s=vp-3.7.2';
const LOOP_VID = 'https://res.cloudinary.com/dao46c5sb/video/upload/LOOP_VIDEO_202604132150_zwos8l.mp4?_s=vp-3.7.2';
let currentVidSrc = HOME_VID;

// Preload both videos immediately so they're cached
(function preloadVideos(){
  [HOME_VID, LOOP_VID].forEach(src => {
    const v = document.createElement('video');
    v.preload = 'auto';
    v.muted = true;
    v.src = src;
    v.load();
  });
})();

function switchVideo(src){
  if(src === currentVidSrc) return;
  currentVidSrc = src;
  const vid = document.getElementById('bg-video');
  if(!vid) return;
  vid.style.opacity = '0';
  vid.style.transition = 'opacity 0.4s';
  setTimeout(()=>{
    vid.src = src;
    vid.load();
    vid.play().catch(()=>{});
    vid.style.opacity = '0.7';
  }, 400);
}

// ═══ 3. PARTICLE NETWORK ═══
(function initParticles(){
  const canvas = document.createElement('canvas');
  canvas.style.cssText='position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity 1s;';
  canvas.id = 'particles';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles=[], mouse={x:-999,y:-999};
  const COUNT = 55;

  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  resize(); window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });

  for(let i=0;i<COUNT;i++) particles.push({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*0.4, vy:(Math.random()-.5)*0.4,
    r:Math.random()*1.5+0.5
  });

  function draw(){
    ctx.clearRect(0,0,W,H);
    // connect nearby particles
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(255,255,255,${0.06*(1-dist/120)})`;
          ctx.lineWidth=0.5; ctx.stroke();
        }
      }
      // connect to mouse
      const mdx=particles[i].x-mouse.x, mdy=particles[i].y-mouse.y;
      const mdist=Math.sqrt(mdx*mdx+mdy*mdy);
      if(mdist<160){
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(mouse.x,mouse.y);
        ctx.strokeStyle=`rgba(224,64,251,${0.15*(1-mdist/160)})`;
        ctx.lineWidth=0.7; ctx.stroke();
      }
      // draw dot
      ctx.beginPath();
      ctx.arc(particles[i].x,particles[i].y,particles[i].r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.fill();
      // move
      particles[i].x+=particles[i].vx; particles[i].y+=particles[i].vy;
      if(particles[i].x<0||particles[i].x>W) particles[i].vx*=-1;
      if(particles[i].y<0||particles[i].y>H) particles[i].vy*=-1;
    }
    requestAnimationFrame(draw);
  }
  draw();
  // fade in after boot
  window._showParticles = ()=>{ canvas.style.opacity='1'; };
})();

// ═══ 5. TEXT SCRAMBLE ON HEADINGS ═══
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%&';
function scrambleEl(el){
  if(!el) return;
  const final = el.dataset.text || el.textContent;
  let iter = 0;
  const iv = setInterval(()=>{
    el.textContent = final.split('').map((c,i)=>{
      if(c===' ') return ' ';
      if(i < iter) return final[i];
      return CHARS[Math.floor(Math.random()*CHARS.length)];
    }).join('');
    if(iter >= final.length){ clearInterval(iv); el.textContent=final; }
    iter += 0.5;
  }, 35);
}
function scramblePage(name){
  // scramble all .scramble elements on that page
  const pg = document.getElementById('pg-'+name);
  if(!pg) return;
  pg.querySelectorAll('.scramble').forEach(el=> setTimeout(()=>scrambleEl(el), 200));
  // also scramble contact-tx
  if(name==='contact') setTimeout(runTransmission, 200);
}

// ═══ 6. CURSOR COLOR PER PAGE ═══
function setCursorPage(name){
  document.body.className = 'pg-'+name;
}

// ═══ 9. CARD SHIMMER ON ACTIVE ═══
function shimmerActiveCard(){
  document.querySelectorAll('#srvStage .srv-card.sc-active, #whyStage .why-c.sc-active').forEach(card=>{
    card.classList.remove('shimmer');
    void card.offsetWidth;
    card.classList.add('shimmer');
    setTimeout(()=>card.classList.remove('shimmer'), 800);
  });
}


// ═══ FLOATING HIRE ME ═══
function updateHireFloat(name){
  const btn=document.getElementById('hire-float');
  if(!btn)return;
  btn.style.display=name==='contact'?'none':'flex';
}

// ═══ EASTER EGG — type JARVIS ═══
(function initEasterEgg(){
  const code='JARVIS'; let typed='';
  document.addEventListener('keydown',e=>{
    typed+=e.key.toUpperCase();
    if(typed.length>code.length)typed=typed.slice(-code.length);
    if(typed===code){
      typed='';
      const flash=document.getElementById('jarvis-flash');
      if(flash){flash.classList.add('flash');setTimeout(()=>flash.classList.remove('flash'),300);}
      speak('At your service.');
      const sv=document.createElement('div');
      sv.style.cssText='position:fixed;inset:0;z-index:99996;pointer-events:none;background:linear-gradient(transparent 50%,rgba(224,64,251,0.03) 50%);background-size:100% 4px;opacity:1;transition:opacity 1s;';
      document.body.appendChild(sv);
      setTimeout(()=>{sv.style.opacity='0';setTimeout(()=>sv.remove(),1000);},800);
    }
  });
})();

// ═══ PAGE SWIPE — mobile swipe anywhere to navigate ═══
(function initPageSwipe(){
  let sx=0,sy=0;
  document.addEventListener('touchstart',e=>{
    if(e.target.closest('#srvStage,#whyStage'))return;
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;
  },{passive:true});
  document.addEventListener('touchend',e=>{
    if(e.target.closest('#srvStage,#whyStage'))return;
    const dx=e.changedTouches[0].clientX-sx;
    const dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)<Math.abs(dy)||Math.abs(dx)<50)return;
    const i=pageIds.indexOf(currentPage);
    if(dx<0&&i<pageIds.length-1)goTo(pageIds[i+1],i+1);
    if(dx>0&&i>0)goTo(pageIds[i-1],i-1);
  },{passive:true});
})();

// ═══ TAB TITLE PER PAGE ═══
const pageTitles={
  home:'YS.DEV — Home',services:'YS.DEV — Services',
  why:'YS.DEV — Why Us',about:'YS.DEV — About',
  vibe:'YS.DEV — Vibe Page',contact:'YS.DEV — Hire Me'
};
function setTabTitle(name){ document.title=pageTitles[name]||'YS.DEV — Yuvraj Sharma'; }

// ═══ INACTIVE TAB ═══
document.addEventListener('visibilitychange',()=>{
  document.title=document.hidden?'👋 Come back! — YS.DEV':pageTitles[currentPage]||'YS.DEV';
});

// ═══ CLICK RIPPLE ═══
document.addEventListener('click',e=>{
  const r=document.createElement('div');
  r.className='click-ripple';
  r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';
  r.style.borderColor=['services','vibe'].includes(currentPage)?'rgba(224,64,251,0.7)':'rgba(255,255,255,0.6)';
  document.body.appendChild(r);
  setTimeout(()=>r.remove(),500);
});

// ═══ KEYBOARD HINT ═══
(function(){
  const hint=document.getElementById('kb-hint');
  if(!hint)return;
  setTimeout(()=>{
    hint.style.opacity='1';
    setTimeout(()=>{hint.style.opacity='0';setTimeout(()=>hint.remove(),300);},4000);
  },2500);
})();

// ═══ FLOATING HIRE ME ═══
function showHireBtn(){
  const btn=document.getElementById('hire-float');
  if(btn)btn.style.display='flex';
}

// ═══ CLICK RIPPLE ═══
document.addEventListener('click',e=>{
  const r=document.createElement('div');
  r.className='click-ripple';
  r.style.left=e.clientX+'px';
  r.style.top=e.clientY+'px';
  if(e.target.closest('.hud-btn,.cc-btn,.nav-btn'))
    r.style.borderColor='rgba(224,64,251,0.7)';
  document.body.appendChild(r);
  setTimeout(()=>r.remove(),550);
});

// ═══ TAB TITLE PER PAGE ═══
function setTabTitle(name){ document.title=pageTitles[name]||'YS.DEV — Yuvraj Sharma'; }

// ═══ INACTIVE TAB ═══
document.addEventListener('visibilitychange',()=>{
  if(document.hidden) document.title='👋 Come back! — YS.DEV';
  else setTabTitle(currentPage);
});

// ═══ PAGE SWIPE — mobile anywhere ═══
(function initPageSwipe(){
  let sx=0,sy=0;
  document.addEventListener('touchstart',e=>{
    if(e.target.closest('#srvStage,#whyStage'))return;
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;
  },{passive:true});
  document.addEventListener('touchend',e=>{
    if(e.target.closest('#srvStage,#whyStage'))return;
    const dx=e.changedTouches[0].clientX-sx;
    const dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)<Math.abs(dy)||Math.abs(dx)<60)return;
    const i=pageIds.indexOf(currentPage);
    if(dx<0&&i<pageIds.length-1)goTo(pageIds[i+1],i+1);
    if(dx>0&&i>0)goTo(pageIds[i-1],i-1);
  },{passive:true});
})();

// ═══ EASTER EGG — type JARVIS ═══
(function initEasterEgg(){
  const secret='JARVIS';let typed='';
  document.addEventListener('keydown',e=>{
    typed+=e.key.toUpperCase();
    if(typed.length>secret.length)typed=typed.slice(-secret.length);
    if(typed===secret){
      typed='';
      const flash=document.createElement('div');
      flash.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(224,64,251,0.12);pointer-events:none;';
      document.body.appendChild(flash);
      flash.animate([{opacity:1},{opacity:0}],{duration:500,easing:'ease-out'}).onfinish=()=>flash.remove();
      speak('At your service.');
      const toast=document.getElementById('copy-toast');
      if(toast){
        const orig=toast.textContent;
        toast.textContent='⚡ JARVIS ONLINE — AT YOUR SERVICE';
        toast.classList.add('show');
        setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>{toast.textContent=orig;},300);},3000);
      }
    }
  });
})();

function runBoot(){
  const fill=document.getElementById('boot-progress-fill');
  const pct=document.getElementById('boot-pct');
  const btn=document.getElementById('ovBtn');
  const lines=[{id:'bl1',at:15},{id:'bl2',at:45},{id:'bl3',at:78}];
  let p=0;
  const iv=setInterval(()=>{
    p=Math.min(100,p+Math.random()*3.5+0.5);
    if(fill)fill.style.width=p+'%';
    if(pct)pct.textContent=Math.floor(p)+'%';
    lines.forEach(l=>{ if(p>=l.at){const el=document.getElementById(l.id);if(el)el.style.opacity='1';}});
    if(p>=100){
      clearInterval(iv);
      if(btn)btn.classList.add('ready');
      if(pct)pct.textContent='100% — SYSTEM READY';
    }
  },35);
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', runBoot);
}else{
  runBoot();
}

// ═══ BOOT ═══
function bootSite(){
  const btn=document.getElementById('ovBtn');
  if(!btn||!btn.classList.contains('ready'))return;
  const ov=document.getElementById('overlay');
  ov.style.opacity='0';ov.style.transition='opacity .6s';
  setTimeout(()=>{ov.style.display='none';},600);
  getAC();
  attachSounds();
  initTilt();
  setTimeout(speakIntro,500);
  // play the single global video
  const bgv = document.getElementById('bg-video');
  if(bgv){ bgv.muted=true; bgv.play().catch(()=>{}); }
  setTimeout(typewriterHero,700);
  setTimeout(startGlitch,2500);
  if(window._showParticles) window._showParticles();
  setCursorPage('home');
  setTimeout(shimmerActiveCard,1200);
  setTimeout(showHireBtn,1500);
  setTabTitle('home');
}

// ═══ TYPEWRITER ═══
let twDone=false;
function typewriterHero(){
  if(twDone)return;
  const el=document.getElementById('tw-target');
  if(!el)return;
  twDone=true;
  const text=el.dataset.text||'';
  el.textContent='';el.classList.add('tw-cursor');
  let i=0;
  const iv=setInterval(()=>{
    el.textContent+=text[i++];
    if(i>=text.length){clearInterval(iv);el.classList.remove('tw-cursor');}
  },55);
}

// ═══ PAGE BAR ═══
function animateBar(){
  const bar=document.getElementById('pg-bar');
  bar.style.width='0%';bar.style.opacity='1';
  setTimeout(()=>{bar.style.width='100%';},30);
  setTimeout(()=>{bar.style.opacity='0';bar.style.width='0%';},500);
}

// ═══ CLOCK ═══
function tick(){
  const n=new Date();
  const t=[n.getHours(),n.getMinutes(),n.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');
  const el=document.getElementById('hud-time');
  if(el)el.textContent=t;
}
setInterval(tick,1000);tick();

// ═══ GLITCH LINE ═══
setInterval(()=>{
  const g=document.getElementById('glitch-line');
  if(!g)return;
  g.style.top=Math.random()*100+'%';
  g.style.opacity='0.4';
  g.style.height=Math.random()<0.5?'1px':'2px';
  setTimeout(()=>{g.style.opacity='0';},80+Math.random()*120);
},2200+Math.random()*2000);

// ═══ CURSOR ═══
const cur=document.getElementById('cur'),curR=document.getElementById('curR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function ar(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(ar);})();
document.querySelectorAll('a,button,.dot,.follow-btn,.srv-card,.vibe-row,.cc-btn,.why-card,.srv-dot').forEach(el=>{
  el.addEventListener('mouseenter',()=>{curR.style.transform='translate(-50%,-50%) scale(2)';curR.style.borderColor='var(--c1)';});
  el.addEventListener('mouseleave',()=>{curR.style.transform='translate(-50%,-50%) scale(1)';curR.style.borderColor='rgba(255,255,255,0.6)';});
});

// ═══ FOLLOWER VIDEO ═══
const followerWrap=document.getElementById('followerWrap');
if(followerWrap){
  let fvx=innerWidth/2,fvy=innerHeight/2,ftvx=innerWidth/2,ftvy=innerHeight/2;
  document.addEventListener('mousemove',e=>{ftvx=e.clientX;ftvy=e.clientY;});
  document.addEventListener('touchmove',e=>{ftvx=e.touches[0].clientX;ftvy=e.touches[0].clientY;},{passive:true});
  (function fl(){fvx+=(ftvx-fvx)*0.07;fvy+=(ftvy-fvy)*0.07;if(followerWrap.style.display!=='none')followerWrap.style.transform='translate('+fvx+'px,'+fvy+'px) translate(-50%,-50%)';requestAnimationFrame(fl);})();
}

// ═══ PAGE NAVIGATION ═══
const pageIds=['home','services','why','about','vibe','contact'];
const pageMap={home:'pg-home',services:'pg-services',why:'pg-why',about:'pg-about',vibe:'pg-vibe',contact:'pg-contact'};
let currentPage='home',currentIdx=0,transitioning=false;

function goTo(name,idx){
  if(transitioning||name===currentPage)return;
  transitioning=true;
  sndPage();animateBar();
  // swap video — home gets unique video, all others get loop
  switchVideo(name==='home' ? HOME_VID : LOOP_VID);
  const oldPg=document.getElementById(pageMap[currentPage]);
  const newPg=document.getElementById(pageMap[name]);
  oldPg.classList.remove('active');oldPg.classList.add('flip-out');
  setTimeout(()=>{
    oldPg.classList.remove('flip-out');oldPg.style.display='none';
    newPg.style.display='flex';newPg.classList.add('flip-in');
    newPg.style.opacity='1';newPg.style.pointerEvents='all';
    newPg.querySelectorAll('.animate').forEach(el=>{el.style.animation='none';el.offsetHeight;el.style.animation='';});
  },180);
  setTimeout(()=>{
    newPg.classList.remove('flip-in');newPg.classList.add('active');
    currentPage=name;currentIdx=idx;transitioning=false;
    document.querySelectorAll('.nav-btn').forEach((b,i)=>b.classList.toggle('active',i===idx));
    document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
    document.querySelectorAll('.mob-btn').forEach((b,i)=>b.classList.toggle('active',i===idx));
    const pgNum=document.getElementById('pg-current');
    if(pgNum)pgNum.textContent=String(idx+1).padStart(2,'0');
    // cursor color per page
    setCursorPage(name);
    // scramble headings
    scramblePage(name);
    setTimeout(shimmerActiveCard, 400);
    setTabTitle(name);
    if(name==='vibe')setTimeout(speakVibe,500);
    else window.speechSynthesis&&window.speechSynthesis.cancel();
    if(name==='about')setTimeout(()=>{runScanEffect();initHudRingsCanvas('hudRings');},350);
    if(name==='vibe')setTimeout(()=>initHudRingsCanvas('hudRingsVibe'),350);
    if(name==='contact'){setTimeout(runTransmission,350);setTimeout(()=>initHudRingsCanvas('hudRingsContact'),350);}
  },360);
}

// ═══ MOBILE MENU ═══
function openMobMenu(){ document.getElementById('mobile-menu').classList.add('open'); }
function closeMobMenu(){ document.getElementById('mobile-menu').classList.remove('open'); }
function mobGoTo(name,idx){ closeMobMenu(); setTimeout(()=>goTo(name,idx),200); }

document.addEventListener('keydown',e=>{
  const i=pageIds.indexOf(currentPage);
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){if(i<pageIds.length-1)goTo(pageIds[i+1],i+1);}
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'){if(i>0)goTo(pageIds[i-1],i-1);}
});
let lastW=0;
document.addEventListener('wheel',e=>{
  const now=Date.now();if(now-lastW<900)return;lastW=now;
  const i=pageIds.indexOf(currentPage);
  if(e.deltaY>0&&i<pageIds.length-1)goTo(pageIds[i+1],i+1);
  if(e.deltaY<0&&i>0)goTo(pageIds[i-1],i-1);
});

// ═══ VOICE ═══
function speak(text){
  if(!window.speechSynthesis)return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=1.38;u.pitch=0.75;u.volume=1.0;
  const trySpeak=()=>{
    const vs=window.speechSynthesis.getVoices();
    if(!vs.length)return;
    const maleVoice=
      vs.find(v=>/daniel/i.test(v.name)&&v.lang.startsWith('en'))||
      vs.find(v=>/google uk english male/i.test(v.name))||
      vs.find(v=>/david/i.test(v.name)&&v.lang.startsWith('en'))||
      vs.find(v=>/mark/i.test(v.name)&&v.lang.startsWith('en'))||
      vs.find(v=>/reed|arthur|albert|fred/i.test(v.name))||
      vs.find(v=>v.lang.startsWith('en')&&!/female|zira|samantha|victoria|karen|moira|fiona|tessa|ava|siri/i.test(v.name));
    if(maleVoice){u.voice=maleVoice;}else{return;}
    window.speechSynthesis.speak(u);
  };
  if(window.speechSynthesis.getVoices().length>0)trySpeak();
  else window.speechSynthesis.onvoiceschanged=trySpeak;
}
function speakIntro(){speak('Good day. All systems are online. Welcome to YS Dev.');}
function speakVibe(){speak('The Vibe Page. A personalised digital identity, crafted exclusively for you.');}

// ═══ AUDIO ═══
let ac=null;
function getAC(){if(!ac)ac=new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();return ac;}

// SIMPLE MOUSE CLICK — clean, natural
function sndClick(){
  try{
    const a=getAC(), t=a.currentTime;
    const rate=a.sampleRate;
    const buf=a.createBuffer(1,Math.floor(rate*0.012),rate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)
      d[i]=(Math.random()*2-1)*Math.exp(-i/(rate*0.003))*0.6;
    const src=a.createBufferSource(),g=a.createGain();
    src.buffer=buf;src.connect(g);g.connect(a.destination);
    g.gain.value=0.35;src.start(t);
  }catch(e){}
}

// DIGITAL UI CLICK — clean modern touchscreen tap for main buttons
function sndClickScifi(){
  try{
    const a=getAC(), t=a.currentTime;
    // clean sine tap — like iOS / Material UI
    const o=a.createOscillator(), g=a.createGain();
    o.connect(g); g.connect(a.destination);
    o.type='sine';
    o.frequency.setValueAtTime(900, t);
    o.frequency.exponentialRampToValueAtTime(600, t+0.05);
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.12, t+0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t+0.08);
    o.start(t); o.stop(t+0.09);
    // crisp high tick on top — gives it the digital feel
    const o2=a.createOscillator(), g2=a.createGain();
    o2.connect(g2); g2.connect(a.destination);
    o2.type='sine';
    o2.frequency.setValueAtTime(2400, t);
    o2.frequency.exponentialRampToValueAtTime(1800, t+0.03);
    g2.gain.setValueAtTime(0.05, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t+0.035);
    o2.start(t); o2.stop(t+0.04);
  }catch(e){}
}

function sndHover(){
  try{
    const a=getAC(),t=a.currentTime;
    const o=a.createOscillator(),g=a.createGain();
    o.connect(g);g.connect(a.destination);
    o.type='sine';
    o.frequency.setValueAtTime(2000,t);o.frequency.exponentialRampToValueAtTime(1400,t+0.02);
    g.gain.setValueAtTime(0.018,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.025);
    o.start(t);o.stop(t+0.028);
  }catch(e){}
}

function sndPage(){
  try{
    const a=getAC(),t=a.currentTime,rate=a.sampleRate;
    [400,650,1000,1500,2200,3000].forEach((freq,i)=>{
      const dt=i*0.03,o=a.createOscillator(),g=a.createGain();
      o.connect(g);g.connect(a.destination);
      o.type='sine';o.frequency.setValueAtTime(freq,t+dt);o.frequency.exponentialRampToValueAtTime(freq*1.45,t+dt+0.02);
      g.gain.setValueAtTime(0,t+dt);g.gain.linearRampToValueAtTime(0.08,t+dt+0.004);g.gain.exponentialRampToValueAtTime(0.001,t+dt+0.022);
      o.start(t+dt);o.stop(t+dt+0.025);
    });
    const nb=a.createBuffer(1,Math.floor(rate*0.055),rate),nd=nb.getChannelData(0);
    for(let i=0;i<nd.length;i++){const c=Math.floor(i/(rate*0.004));nd[i]=(c%3!==2)?(Math.random()*2-1)*Math.exp(-i/(rate*0.035))*0.55:0;}
    const ns=a.createBufferSource(),nf=a.createBiquadFilter(),ng=a.createGain();
    ns.buffer=nb;nf.type='bandpass';nf.frequency.value=2400;nf.Q.value=0.9;
    ns.connect(nf);nf.connect(ng);ng.connect(a.destination);
    ng.gain.value=0.65;ns.start(t+0.19);
    const sub=a.createOscillator(),sg=a.createGain();
    sub.connect(sg);sg.connect(a.destination);
    sub.type='sine';sub.frequency.setValueAtTime(160,t+0.26);sub.frequency.exponentialRampToValueAtTime(35,t+0.38);
    sg.gain.setValueAtTime(0,t+0.26);sg.gain.linearRampToValueAtTime(0.28,t+0.272);sg.gain.exponentialRampToValueAtTime(0.001,t+0.4);
    sub.start(t+0.26);sub.stop(t+0.42);
    const op=a.createOscillator(),gp=a.createGain();
    op.connect(gp);gp.connect(a.destination);
    op.type='sine';op.frequency.setValueAtTime(3800,t+0.28);op.frequency.exponentialRampToValueAtTime(2000,t+0.36);
    gp.gain.setValueAtTime(0.07,t+0.28);gp.gain.exponentialRampToValueAtTime(0.001,t+0.38);
    op.start(t+0.28);op.stop(t+0.4);
  }catch(e){}
}

function attachSounds(){
  // SIMPLE click on everything
  document.querySelectorAll('a,button,.dot,.follow-btn,.srv-card,.vibe-row,.cc-btn,.why-card,.srv-dot').forEach(el=>{
    el.addEventListener('mouseenter',sndHover);
    el.addEventListener('click',sndClick);
  });
  // SCI-FI click on main CTA buttons only
  document.querySelectorAll('.hud-btn,.nav-btn,.scroll-ind,.dot').forEach(el=>{
    el.addEventListener('click',sndClickScifi);
  });
  // page transition sound on nav
  document.querySelectorAll('.dot,.nav-btn,.scroll-ind').forEach(el=>{
    el.addEventListener('click',sndPage);
  });
}

// ═══ 3D CARD CAROUSEL ═══
let activeCard=0;
const totalCards=6;
function getCardTransform(rel){
  const abs=Math.abs(rel);
  return{
    tx:rel*230,ry:rel*52,tz:-abs*90,
    scale:Math.max(0.55,1-abs*0.13),
    opacity:abs>1.5?0:abs>0.9?0.45:1
  };
}
function layoutCards(animated){
  const cards=document.querySelectorAll('#srvStage .srv-card');
  const dots=document.querySelectorAll('#srvDots .srv-dot');
  cards.forEach((card,i)=>{
    const rel=i-activeCard;
    const{tx,ry,tz,scale,opacity}=getCardTransform(rel);
    card.style.transition=animated?'transform .55s cubic-bezier(.25,.46,.45,.94),opacity .55s ease,border-color .45s,box-shadow .45s':'none';
    card.style.transform=`translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
    card.style.opacity=opacity;
    card.style.zIndex=10-Math.abs(rel);
    card.classList.toggle('sc-active',i===activeCard);
  });
  dots.forEach((d,i)=>d.classList.toggle('active',i===activeCard));
}
function setCard(idx){
  activeCard=Math.max(0,Math.min(totalCards-1,idx));
  layoutCards(true);sndClick();
}
(function initCarousel(){
  const stage=document.getElementById('srvStage');
  if(!stage)return;
  let startX=0,dragging=false,moved=false;
  stage.addEventListener('mousedown',e=>{startX=e.clientX;dragging=true;moved=false;});
  window.addEventListener('mousemove',e=>{if(dragging&&Math.abs(e.clientX-startX)>5)moved=true;});
  window.addEventListener('mouseup',e=>{
    if(!dragging)return;dragging=false;
    const diff=e.clientX-startX;
    if(Math.abs(diff)>40)setCard(activeCard+(diff<0?1:-1));
  });
  stage.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;moved=false;},{passive:true});
  stage.addEventListener('touchmove',e=>{if(Math.abs(e.touches[0].clientX-startX)>5)moved=true;},{passive:true});
  stage.addEventListener('touchend',e=>{
    const diff=e.changedTouches[0].clientX-startX;
    if(Math.abs(diff)>40)setCard(activeCard+(diff<0?1:-1));
  });
  stage.addEventListener('click',e=>{
    if(moved)return;
    const card=e.target.closest('.srv-card');
    if(card){
      const idx=parseInt(card.dataset.idx);
      if(idx!==activeCard)setCard(idx);
      else goTo('contact',4);
    }
  });
  stage.addEventListener('wheel',e=>{e.stopPropagation();setCard(activeCard+(e.deltaY>0?1:-1));});
  setTimeout(()=>layoutCards(false),50);
})();

// ═══ WHY CAROUSEL ═══
let activeWhyCard=0;
const totalWhyCards=4;
function layoutWhyCards(animated){
  const cards=document.querySelectorAll('.why-c');
  const dots=document.querySelectorAll('#whyDots .srv-dot');
  cards.forEach((card,i)=>{
    const rel=i-activeWhyCard;
    const{tx,ry,tz,scale,opacity}=getCardTransform(rel);
    card.style.transition=animated?'transform .55s cubic-bezier(.25,.46,.45,.94),opacity .55s ease,border-color .45s,box-shadow .45s':'none';
    card.style.transform=`translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
    card.style.opacity=opacity;
    card.style.zIndex=10-Math.abs(rel);
    card.classList.toggle('sc-active',i===activeWhyCard);
  });
  dots.forEach((d,i)=>d.classList.toggle('active',i===activeWhyCard));
}
function setWhyCard(idx){
  activeWhyCard=Math.max(0,Math.min(totalWhyCards-1,idx));
  layoutWhyCards(true);sndClick();
}
(function initWhyCarousel(){
  const stage=document.getElementById('whyStage');
  if(!stage)return;
  let startX=0,dragging=false,moved=false;
  stage.addEventListener('mousedown',e=>{startX=e.clientX;dragging=true;moved=false;});
  window.addEventListener('mousemove',e=>{if(dragging&&Math.abs(e.clientX-startX)>5)moved=true;});
  window.addEventListener('mouseup',e=>{
    if(!dragging)return;dragging=false;
    const diff=e.clientX-startX;
    if(Math.abs(diff)>40)setWhyCard(activeWhyCard+(diff<0?1:-1));
  });
  stage.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;moved=false;},{passive:true});
  stage.addEventListener('touchmove',e=>{if(Math.abs(e.touches[0].clientX-startX)>5)moved=true;},{passive:true});
  stage.addEventListener('touchend',e=>{
    const diff=e.changedTouches[0].clientX-startX;
    if(Math.abs(diff)>40)setWhyCard(activeWhyCard+(diff<0?1:-1));
  });
  stage.addEventListener('click',e=>{
    if(moved)return;
    const card=e.target.closest('.why-c');
    if(card){const idx=parseInt(card.dataset.idx);if(idx!==activeWhyCard)setWhyCard(idx);}
  });
  stage.addEventListener('wheel',e=>{e.stopPropagation();setWhyCard(activeWhyCard+(e.deltaY>0?1:-1));});
  setTimeout(()=>layoutWhyCards(false),50);
})();

// ═══ HUD RINGS — reusable for any canvas ═══
const hudRingsStarted={};
function initHudRingsCanvas(canvasId){
  if(hudRingsStarted[canvasId])return; // don't restart if already running
  hudRingsStarted[canvasId]=true;
  const canvas=document.getElementById(canvasId);
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const W=380,H=380,CX=W/2,CY=H/2;
  let t=0,hmx=CX,hmy=CY;
  document.addEventListener('mousemove',e=>{
    const r=canvas.getBoundingClientRect();
    if(!r.width)return;
    hmx=((e.clientX-r.left)/r.width)*W;
    hmy=((e.clientY-r.top)/r.height)*H;
  });
  const rings=[
    {r:155,speed:0.003,dash:[12,8],alpha:0.18,color:'255,255,255'},
    {r:125,speed:-0.005,dash:[6,12],alpha:0.25,color:'224,64,251'},
    {r:95,speed:0.008,dash:[20,6],alpha:0.20,color:'255,255,255'},
    {r:65,speed:-0.012,dash:[4,16],alpha:0.30,color:'224,64,251'},
  ];
  function draw(){
    ctx.clearRect(0,0,W,H);t+=0.016;
    const ox=(hmx-CX)*0.04,oy=(hmy-CY)*0.04;
    const grd=ctx.createRadialGradient(CX+ox,CY+oy,0,CX+ox,CY+oy,160);
    grd.addColorStop(0,'rgba(224,64,251,0.04)');grd.addColorStop(0.5,'rgba(255,255,255,0.02)');grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grd;ctx.beginPath();ctx.arc(CX+ox,CY+oy,160,0,Math.PI*2);ctx.fill();
    rings.forEach((ring,i)=>{
      ctx.save();ctx.translate(CX+ox*((i+1)*0.3),CY+oy*((i+1)*0.3));ctx.rotate(t*ring.speed*60);
      ctx.beginPath();ctx.arc(0,0,ring.r,0,Math.PI*2);ctx.setLineDash(ring.dash);
      ctx.strokeStyle=`rgba(${ring.color},${ring.alpha})`;ctx.lineWidth=i===1||i===3?1.5:1;ctx.stroke();ctx.setLineDash([]);
      for(let k=0;k<8;k++){const a=(k/8)*Math.PI*2;ctx.beginPath();ctx.moveTo(Math.cos(a)*(ring.r-5),Math.sin(a)*(ring.r-5));ctx.lineTo(Math.cos(a)*(ring.r+5),Math.sin(a)*(ring.r+5));ctx.strokeStyle=`rgba(${ring.color},${ring.alpha*1.5})`;ctx.lineWidth=1;ctx.stroke();}
      ctx.restore();
    });
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{
      ctx.save();ctx.translate(CX+ox,CY+oy);
      ctx.beginPath();ctx.moveTo(sx*38,sy*38);ctx.lineTo(sx*54,sy*38);ctx.lineTo(sx*54,sy*54);
      ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
    });
    const pulse=0.5+0.5*Math.sin(t*3);
    ctx.beginPath();ctx.arc(CX+ox,CY+oy,4+pulse*2,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${0.7+pulse*0.3})`;ctx.fill();
    ctx.beginPath();ctx.arc(CX+ox,CY+oy,12+pulse*4,0,Math.PI*2);ctx.strokeStyle=`rgba(224,64,251,${0.2+pulse*0.15})`;ctx.lineWidth=1;ctx.stroke();
    ctx.save();ctx.translate(CX+ox,CY+oy);
    ctx.font="bold 36px 'Orbitron',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.strokeStyle=`rgba(255,255,255,${0.12+pulse*0.06})`;ctx.lineWidth=1;ctx.strokeText('YS',0,0);
    ctx.fillStyle=`rgba(255,255,255,${0.06+pulse*0.04})`;ctx.fillText('YS',0,0);ctx.restore();
    ctx.save();ctx.translate(CX+ox,CY+oy);ctx.rotate(t*0.8);
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,148,-0.05,0.55);ctx.closePath();
    const sg=ctx.createRadialGradient(0,0,0,0,0,148);
    sg.addColorStop(0,'rgba(224,64,251,0)');sg.addColorStop(0.7,'rgba(224,64,251,0.04)');sg.addColorStop(1,'rgba(224,64,251,0.12)');
    ctx.fillStyle=sg;ctx.fill();ctx.restore();
    [[-0.4,172,'SYS.ACTIVE'],[1.2,172,'TARGET.LOCK'],[2.8,172,'SCAN.MODE']].forEach(([a,d,txt])=>{
      ctx.font="8px 'Share Tech Mono',monospace";ctx.fillStyle=`rgba(255,255,255,${0.15+0.05*Math.sin(t+a)})`;
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,CX+Math.cos(a+t*0.1)*d,CY+Math.sin(a+t*0.1)*d);
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ═══ ABOUT — SCAN EFFECT ═══
function runScanEffect(){
  const wrap=document.getElementById('aboutCard');
  const line=document.getElementById('scanLine');
  const rows=document.querySelectorAll('.scan-row');
  if(!wrap||!line||!rows.length)return;
  rows.forEach(r=>r.classList.remove('revealed'));
  const h=wrap.offsetHeight||200;
  line.style.opacity='1';
  let pos=0,rowIdx=0;
  const rowStep=h/rows.length;
  const iv=setInterval(()=>{
    pos+=2;line.style.top=pos+'px';
    while(rowIdx<rows.length&&pos>(rowIdx+0.5)*rowStep){rows[rowIdx].classList.add('revealed');rowIdx++;}
    if(pos>=h+4){clearInterval(iv);line.style.opacity='0';rows.forEach(r=>r.classList.add('revealed'));}
  },12);
}

// ═══ CONTACT — TRANSMISSION ═══
function runTransmission(){
  const el=document.getElementById('contact-tx');
  if(!el)return;
  const finalText='CONTACT.';
  const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';
  let iteration=0;
  const iv=setInterval(()=>{
    el.textContent=finalText.split('').map((c,i)=>{
      if(c===' ')return ' ';
      if(i<iteration)return finalText[i];
      return chars[Math.floor(Math.random()*chars.length)];
    }).join('');
    if(iteration>=finalText.length){clearInterval(iv);el.textContent=finalText;}
    iteration+=0.4;
  },40);
}

// ═══ CONTACT — RIPPLE ═══
function rippleCard(el){
  el.classList.remove('firing');void el.offsetWidth;el.classList.add('firing');
  setTimeout(()=>el.classList.remove('firing'),500);
}

// ═══ CONTACT — COPY EMAIL ═══
function copyEmail(el){
  const email='ys1181263@gmail.com';
  const doToast=()=>{
    const tag=document.getElementById('email-tag');
    if(tag){tag.textContent='COPIED ✓';tag.style.color='#4eff91';tag.style.borderColor='rgba(78,255,145,0.4)';}
    const toast=document.getElementById('copy-toast');
    if(toast){toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
    setTimeout(()=>{if(tag){tag.textContent='COPY';tag.style.color='';tag.style.borderColor='';}},2500);
  };
  navigator.clipboard?navigator.clipboard.writeText(email).then(doToast).catch(doToast):doToast();
  rippleCard(el);
}

// ═══ 1. GLITCH ═══
function startGlitch(){
  const el=document.getElementById('glitch-h1');
  if(!el)return;
  function doGlitch(){
    if(!twDone){setTimeout(doGlitch,800);return;}
    el.classList.add('glitching');
    setTimeout(()=>el.classList.remove('glitching'),280);
    setTimeout(doGlitch,3500+Math.random()*4000);
  }
  setTimeout(doGlitch,500);
}

// ═══ 3. CURSOR TRAIL ═══
(function initTrail(){
  const DOTS=10,dots=[];
  for(let i=0;i<DOTS;i++){
    const d=document.createElement('div');
    d.className='trail-dot';
    d.style.cssText=`opacity:${(1-i/DOTS)*0.55};width:${5-i*0.3}px;height:${5-i*0.3}px;`;
    document.body.appendChild(d);dots.push({el:d,x:0,y:0});
  }
  let tmx=0,tmy=0;
  document.addEventListener('mousemove',e=>{tmx=e.clientX;tmy=e.clientY;});
  (function loop(){
    let px=tmx,py=tmy;
    dots.forEach((dot,i)=>{
      const ox=dot.x,oy=dot.y;
      dot.x+=(px-dot.x)*(0.35-i*0.025);dot.y+=(py-dot.y)*(0.35-i*0.025);
      dot.el.style.left=dot.x+'px';dot.el.style.top=dot.y+'px';
      px=ox;py=oy;
    });
    requestAnimationFrame(loop);
  })();
})();

// ═══ 4. 3D TILT ═══
function initTilt(){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-(r.left+r.width/2))/(r.width/2);
      const dy=(e.clientY-(r.top+r.height/2))/(r.height/2);
      card.style.transform=`perspective(600px) rotateX(${-dy*8}deg) rotateY(${dx*8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';});
  });
  document.querySelectorAll('#srvStage .srv-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      if(!card.classList.contains('sc-active'))return;
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-(r.left+r.width/2))/(r.width/2);
      const dy=(e.clientY-(r.top+r.height/2))/(r.height/2);
      card.style.filter=`drop-shadow(${dx*-8}px ${dy*-8}px 18px rgba(255,255,255,0.12))`;
    });
    card.addEventListener('mouseleave',()=>{card.style.filter='';});
  });
}
