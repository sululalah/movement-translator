'use strict';

// ════════════════════════════════════════════════════
//  TAB SWITCHING
// ════════════════════════════════════════════════════
document.querySelectorAll('.nav-tab').forEach(t=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.nav-tab,.page').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('tab-'+t.dataset.tab).classList.add('active');
  });
});

// ════════════════════════════════════════════════════
//  MOVEMENT TRANSLATOR
// ════════════════════════════════════════════════════
(function(){
  const fi=document.getElementById('file-input'),fn=document.getElementById('file-name'),
    ve=document.getElementById('video-el'),zv=document.getElementById('zoom-viewport'),
    zb=document.getElementById('zoom-box'),ss=document.getElementById('speed-slider'),
    sd=document.getElementById('speed-display'),pb=document.getElementById('play-btn'),
    pi=document.getElementById('play-icon'),pu=document.getElementById('pause-icon'),
    fo=document.getElementById('flip-off'),fl=document.getElementById('flip-on'),
    dot=document.getElementById('v-status-dot'),txt=document.getElementById('v-status-text'),
    tw=document.getElementById('timeline-wrap'),tt=document.getElementById('timeline-track'),
    tp=document.getElementById('timeline-progress'),lr=document.getElementById('loop-region'),
    ph=document.getElementById('playhead'),tc=document.getElementById('tl-current'),
    td=document.getElementById('tl-duration'),li=document.getElementById('loop-in'),
    lo=document.getElementById('loop-out'),si=document.getElementById('set-in-btn'),
    so=document.getElementById('set-out-btn'),lb=document.getElementById('loop-btn'),
    lc=document.getElementById('loop-clear-btn'),lg=document.getElementById('loop-badge'),
    zs=document.getElementById('zoom-select-btn'),zr=document.getElementById('zoom-reset-btn'),
    zsl=document.getElementById('zoom-slider'),zd=document.getElementById('zoom-display'),
    zi=document.getElementById('zoom-info');
  let lA=false,lI=0,lO=0,zL=1,zX=0.5,zY=0.5,iF=false,sel=false,ds=null;
  const fmt=s=>isNaN(s)||s<0?'0:00':Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
  const st=(m,a=false)=>{txt.textContent=m;dot.classList.toggle('active',a);};
  const up=p=>{pi.style.display=p?'none':'block';pu.style.display=p?'block':'none';};
  function az(){const vw=zv.clientWidth||1,vh=zv.clientHeight||1,dW=ve.videoWidth||16,dH=ve.videoHeight||9;const vr=dW/dH,pr=vw/vh;let nW,nH;if(vr>pr){nW=vw;nH=vw/vr;}else{nH=vh;nW=vh*vr;}const sW=nW*zL,sH=nH*zL;let ox=Math.min(0,Math.max(vw-sW,vw/2-zX*sW)),oy=Math.min(0,Math.max(vh-sH,vh/2-zY*sH));ve.style.cssText=`width:${sW}px;height:${sH}px;left:${ox}px;top:${oy}px;transform:none`;zd.textContent=zL.toFixed(1)+'×';zi.textContent=zL>1?'focus '+Math.round(zX*100)+'% / '+Math.round(zY*100)+'%':'';}
  fi.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;fn.textContent=f.name.length>28?'…'+f.name.slice(-25):f.name;ve.src=URL.createObjectURL(f);zv.style.display='block';document.getElementById('empty-state').style.display='none';ve.playbackRate=parseFloat(ss.value);st('Loading…');});
  ve.addEventListener('loadedmetadata',()=>{tw.style.display='block';td.textContent=fmt(ve.duration);li.max=lo.max=ve.duration;st(ve.videoWidth+'×'+ve.videoHeight+' · ready',true);az();});
  ve.addEventListener('play',()=>{up(true);st('Playing',true);});
  ve.addEventListener('pause',()=>{up(false);st('Paused',true);});
  ve.addEventListener('ended',()=>{up(false);st('Ended',false);});
  pb.addEventListener('click',()=>{if(!ve.src)return;ve.paused?ve.play():ve.pause();});
  ss.addEventListener('input',function(){const s=parseFloat(this.value);sd.textContent=s.toFixed(2)+'×';ve.playbackRate=s;});
  fo.addEventListener('click',()=>{iF=false;zv.classList.remove('flipped');fo.classList.add('active');fl.classList.remove('active');});
  fl.addEventListener('click',()=>{iF=true;zv.classList.add('flipped');fl.classList.add('active');fo.classList.remove('active');});
  function ut(){if(!ve.duration)return;const p=ve.currentTime/ve.duration;tp.style.width=(p*100)+'%';ph.style.left=(p*100)+'%';tc.textContent=fmt(ve.currentTime);if(lA&&!ve.paused&&(ve.currentTime<lI||ve.currentTime>=lO))ve.currentTime=lI;}
  setInterval(ut,50);
  tt.addEventListener('click',e=>{if(!ve.duration)return;const r=tt.getBoundingClientRect();ve.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*ve.duration;});
  const rl=()=>{if(!ve.duration||!lA){lr.style.display='none';return;}lr.style.left=(lI/ve.duration*100)+'%';lr.style.width=((lO-lI)/ve.duration*100)+'%';lr.style.display='block';};
  si.addEventListener('click',()=>{li.value=ve.currentTime.toFixed(1);});
  so.addEventListener('click',()=>{lo.value=ve.currentTime.toFixed(1);});
  lb.addEventListener('click',()=>{const i=parseFloat(li.value),o=parseFloat(lo.value);if(isNaN(i)||isNaN(o)||i>=o){st('Set valid In < Out times',false);return;}lI=i;lO=o;lA=true;lb.textContent='Looping';lb.classList.add('active');lc.style.display='inline-flex';lg.style.display='inline-block';rl();ve.currentTime=lI;if(ve.paused)ve.play();st('Looping '+fmt(lI)+' → '+fmt(lO),true);});
  lc.addEventListener('click',()=>{lA=false;lb.textContent='Enable Loop';lb.classList.remove('active');lc.style.display='none';lg.style.display='none';lr.style.display='none';st('Loop cleared',false);});
  zsl.addEventListener('input',function(){zL=parseFloat(this.value);az();});
  zr.addEventListener('click',()=>{zL=1;zX=0.5;zY=0.5;zsl.value=1;sel=false;zs.classList.remove('active');zv.classList.remove('selecting');zb.style.display='none';az();});
  zs.addEventListener('click',()=>{sel=!sel;zs.classList.toggle('active',sel);zv.classList.toggle('selecting',sel);if(!sel)zb.style.display='none';});
  zv.addEventListener('mousedown',e=>{if(!sel||!ve.videoWidth)return;e.preventDefault();const r=zv.getBoundingClientRect();ds={x:e.clientX-r.left,y:e.clientY-r.top};zb.style.cssText='display:block;left:'+ds.x+'px;top:'+ds.y+'px;width:0;height:0;';});
  zv.addEventListener('mousemove',e=>{if(!sel||!ds)return;const r=zv.getBoundingClientRect();const cx=e.clientX-r.left,cy=e.clientY-r.top;zb.style.left=Math.min(cx,ds.x)+'px';zb.style.top=Math.min(cy,ds.y)+'px';zb.style.width=Math.abs(cx-ds.x)+'px';zb.style.height=Math.abs(cy-ds.y)+'px';});
  zv.addEventListener('mouseup',e=>{if(!sel||!ds)return;const r=zv.getBoundingClientRect();const cx=e.clientX-r.left,cy=e.clientY-r.top;const x1=Math.min(cx,ds.x),y1=Math.min(cy,ds.y),bw=Math.abs(cx-ds.x),bh=Math.abs(cy-ds.y);if(bw>10&&bh>10){const vw=zv.clientWidth,vh=zv.clientHeight;const rx=(x1+bw/2)/vw;zX=iF?1-rx:rx;zY=(y1+bh/2)/vh;zL=Math.min(Math.round(Math.min(vw/bw,vh/bh,5)*10)/10,5);zsl.value=zL;az();}ds=null;zb.style.display='none';sel=false;zs.classList.remove('active');zv.classList.remove('selecting');});
  zv.addEventListener('mouseleave',()=>{if(ds){ds=null;zb.style.display='none';}});
  window.addEventListener('resize',()=>{if(ve.videoWidth)az();});
})();

// ════════════════════════════════════════════════════
//  MOTION ARTBOARD — ml5 BodyPose
// ════════════════════════════════════════════════════
(function(){
  const AB_TARGET_W=640,AB_CONF_MIN=0.25,AB_IGNORE=2.0;
  const abCanvas=document.getElementById('ab-canvas'),abGhost=document.getElementById('ab-ghost-canvas'),abM2Ov=document.getElementById('ab-m2-cam-overlay'),abPoseOv=document.getElementById('ab-pose-overlay');
  const mCtx=abCanvas.getContext('2d'),gCtx=abGhost.getContext('2d'),m2Ctx=abM2Ov.getContext('2d'),oCtx=abPoseOv.getContext('2d');
  const abScaleC=Object.assign(document.createElement('canvas'),{style:'display:none'});
  const abS2C=Object.assign(document.createElement('canvas'),{style:'display:none'});
  document.body.append(abScaleC,abS2C);
  const abSCtx=abScaleC.getContext('2d'),abS2Ctx=abS2C.getContext('2d');
  const AB_PARTS=[{key:'head',kpNames:['nose'],colorId:'ab-color-head',enableId:'ab-enable-head',hexId:'ab-hex-head'},{key:'leftHand',kpNames:['left_wrist'],colorId:'ab-color-lhand',enableId:'ab-enable-lhand',hexId:'ab-hex-lhand'},{key:'rightHand',kpNames:['right_wrist'],colorId:'ab-color-rhand',enableId:'ab-enable-rhand',hexId:'ab-hex-rhand'},{key:'leftFoot',kpNames:['left_ankle'],colorId:'ab-color-lfoot',enableId:'ab-enable-lfoot',hexId:'ab-hex-lfoot'},{key:'rightFoot',kpNames:['right_ankle'],colorId:'ab-color-rfoot',enableId:'ab-enable-rfoot',hexId:'ab-hex-rfoot'}];
  const abCanvasWrap=document.querySelector('.ab-canvas-wrap');
  const ratioButtons=Array.from(document.querySelectorAll('.ratio-btn'));
  const colorSwatches=Array.from(document.querySelectorAll('.ab-color-swatch'));
  let abAspectRatio='4:3';
  let abBgColor='#fff8f0';
  AB_PARTS.forEach(p=>{const ci=document.getElementById(p.colorId),hi=document.getElementById(p.hexId),ei=document.getElementById(p.enableId);ci.addEventListener('input',()=>{hi.textContent=ci.value.toUpperCase();});ei.addEventListener('change',()=>{if(!ei.checked){abTrails[p.key]=[];abPenDown[p.key]=false;abRest[p.key]=0;}});});
  const getColor=k=>document.getElementById(AB_PARTS.find(p=>p.key===k).colorId).value;
  const isEnabled=k=>document.getElementById(AB_PARTS.find(p=>p.key===k).enableId).checked;
  const abBrushSl=document.getElementById('ab-brush-slider'),abFadeSl=document.getElementById('ab-fade-slider');
  document.getElementById('ab-brush-slider').addEventListener('input',function(){document.getElementById('ab-brush-display').textContent=this.value+'px';});
  document.getElementById('ab-fade-slider').addEventListener('input',function(){document.getElementById('ab-fade-display').textContent=this.value;});
  const abDot=document.getElementById('ab-status-dot'),abTxt=document.getElementById('ab-status-text');
  const abSetSt=(m,a=false)=>{abTxt.textContent=m;abDot.classList.toggle('active',a);};
  const abTrails={},abPenDown={},abRest={};
  AB_PARTS.forEach(p=>{abTrails[p.key]=[];abPenDown[p.key]=false;abRest[p.key]=0;});
  const abResetTrails=()=>AB_PARTS.forEach(p=>{abTrails[p.key]=[];abPenDown[p.key]=false;abRest[p.key]=0;});
  function abHexRgba(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgba(${r},${g},${b},${a.toFixed(3)})`;}
  function abCmPt(p0,p1,p2,p3,t){const t2=t*t,t3=t2*t;return{x:0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),y:0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3)};}
  function abStroke(x0,y0,x1,y1,color,br,spd){for(let i=0;i<4;i++){const sp=br*(0.35+i*0.25),al=Math.min(0.016+spd*0.004,0.12)*(1-i*0.2);const jx=(Math.random()-0.5)*br*0.28,jy=(Math.random()-0.5)*br*0.28;const mx=(x0+x1)/2+jx,my=(y0+y1)/2+jy;const g=mCtx.createRadialGradient(mx,my,0,mx,my,sp*1.3);g.addColorStop(0,abHexRgba(color,al));g.addColorStop(0.5,abHexRgba(color,al*0.5));g.addColorStop(1,abHexRgba(color,0));mCtx.save();mCtx.globalCompositeOperation='multiply';mCtx.strokeStyle=g;mCtx.lineWidth=sp*2;mCtx.lineCap='round';mCtx.lineJoin='round';mCtx.beginPath();mCtx.moveTo(x0,y0);mCtx.lineTo(x1,y1);mCtx.stroke();mCtx.restore();}}
  function abBloom(x,y,color,br,lv){const r=br*(0.5+lv*0.07),a=Math.min(0.007+lv*0.003,0.055);const g=mCtx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,abHexRgba(color,a));g.addColorStop(0.55,abHexRgba(color,a*0.4));g.addColorStop(1,abHexRgba(color,0));mCtx.save();mCtx.globalCompositeOperation='multiply';mCtx.fillStyle=g;mCtx.beginPath();mCtx.arc(x,y,r,0,Math.PI*2);mCtx.fill();mCtx.restore();}
  function abPath(trail,color,br){const n=trail.length;if(n<2)return;if(n===2){abStroke(trail[0].x,trail[0].y,trail[1].x,trail[1].y,color,br,5);return;}const p0=trail[Math.max(0,n-4)],p1=trail[Math.max(0,n-3)],p2=trail[n-2],p3=trail[n-1];const d=Math.hypot(p3.x-p2.x,p3.y-p2.y),steps=Math.max(4,Math.round(d*1.2));let prev=p1;for(let s=1;s<=steps;s++){const pt=abCmPt(p0,p1,p2,p3,s/steps);abStroke(prev.x,prev.y,pt.x,pt.y,color,br,d);prev=pt;}}
  function abFade(){const fv=parseInt(abFadeSl.value);if(fv<=0)return;mCtx.globalAlpha=fv/500;mCtx.globalCompositeOperation='source-over';mCtx.fillStyle=abBgColor;mCtx.fillRect(0,0,abCanvas.width,abCanvas.height);mCtx.globalAlpha=1;mCtx.globalCompositeOperation='source-over';}
  function abPrepFrame(vid,sc,sctx){const vw=vid.videoWidth,vh=vid.videoHeight;if(!vw||!vh)return false;const h=Math.round(vh*(AB_TARGET_W/vw));if(sc.width!==AB_TARGET_W||sc.height!==h){sc.width=AB_TARGET_W;sc.height=h;}sctx.drawImage(vid,0,0,AB_TARGET_W,h);return true;}
  function abPaint(poses,scW,scH,mirror){const cw=abCanvas.width,ch=abCanvas.height,br=parseInt(abBrushSl.value);abFade();if(!poses||!poses.length){AB_PARTS.forEach(p=>{abRest[p.key]=Math.min(abRest[p.key]+0.5,14);});return;}const pose=poses[0];AB_PARTS.forEach(p=>{if(!isEnabled(p.key))return;const color=getColor(p.key);let sx=0,sy=0,n=0;p.kpNames.forEach(kn=>{const kp=pose[kn];if(kp&&kp.confidence>=AB_CONF_MIN){sx+=kp.x;sy+=kp.y;n++;}});if(!n)(pose.keypoints||[]).forEach(kp=>{if(p.kpNames.includes(kp.name)&&kp.confidence>=AB_CONF_MIN){sx+=kp.x;sy+=kp.y;n++;}});if(!n){if(abPenDown[p.key]){abPenDown[p.key]=false;abTrails[p.key]=[];}abRest[p.key]=Math.min(abRest[p.key]+0.5,14);return;}const nx=(sx/n)/scW,ny=(sy/n)/scH;const pos={x:(mirror?1-nx:nx)*cw,y:ny*ch};const trail=abTrails[p.key],last=trail.length?trail[trail.length-1]:null;const mag=last?Math.hypot(pos.x-last.x,pos.y-last.y):999;if(mag<AB_IGNORE){abRest[p.key]=Math.min(abRest[p.key]+1,14);if(abRest[p.key]>3)abBloom(pos.x,pos.y,color,br,abRest[p.key]);if(!abPenDown[p.key]){abPenDown[p.key]=true;trail.push(pos);}return;}abRest[p.key]=0;if(!abPenDown[p.key]){abPenDown[p.key]=true;abTrails[p.key]=[pos];return;}trail.push(pos);if(trail.length>80)trail.shift();abPath(trail,color,br);});}
  const AB_SKEL=[['left_shoulder','right_shoulder'],['left_shoulder','left_elbow'],['left_elbow','left_wrist'],['right_shoulder','right_elbow'],['right_elbow','right_wrist'],['left_shoulder','left_hip'],['right_shoulder','right_hip'],['left_hip','right_hip'],['left_hip','left_knee'],['left_knee','left_ankle'],['right_hip','right_knee'],['right_knee','right_ankle'],['nose','left_shoulder'],['nose','right_shoulder']];
  const AB_KPS=['nose','left_wrist','right_wrist','left_ankle','right_ankle'];
  function abSkeleton(ctx,poses,w,h,scW,scH,mirror){ctx.clearRect(0,0,w,h);if(!poses||!poses.length)return;const pose=poses[0],tx=x=>(mirror?1-x/scW:x/scW)*w,ty=y=>y/scH*h;ctx.strokeStyle='rgba(255,255,255,0.28)';ctx.lineWidth=1.3;AB_SKEL.forEach(([a,b])=>{const ka=pose[a],kb=pose[b];if(!ka||!kb||ka.confidence<0.3||kb.confidence<0.3)return;ctx.beginPath();ctx.moveTo(tx(ka.x),ty(ka.y));ctx.lineTo(tx(kb.x),ty(kb.y));ctx.stroke();});(pose.keypoints||[]).forEach(kp=>{if(kp.confidence<0.3)return;ctx.beginPath();ctx.arc(tx(kp.x),ty(kp.y),2.5,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fill();});AB_KPS.forEach(name=>{const kp=pose[name];if(!kp||kp.confidence<AB_CONF_MIN)return;const pd=AB_PARTS.find(p=>p.kpNames.includes(name));if(pd&&!isEnabled(pd.key))return;ctx.beginPath();ctx.arc(tx(kp.x),ty(kp.y),5,0,Math.PI*2);ctx.fillStyle=pd?getColor(pd.key):'#fff';ctx.fill();});}
  function abResetSurface(){const w=abCanvas.width||abCanvasWrap?.clientWidth||640;const h=abCanvas.height||abCanvasWrap?.clientHeight||480;mCtx.clearRect(0,0,w,h);mCtx.fillStyle=abBgColor;mCtx.fillRect(0,0,w,h);gCtx.clearRect(0,0,abGhost.width,abGhost.height);m2Ctx.clearRect(0,0,abM2Ov.width,abM2Ov.height);oCtx.clearRect(0,0,abPoseOv.width,abPoseOv.height);}
  function abSetAspectRatio(ratio){const [w,h]=ratio.split(':').map(Number);if(!w||!h)return;abAspectRatio=ratio;if(abCanvasWrap)abCanvasWrap.style.aspectRatio=`${w}/${h}`;ratioButtons.forEach(btn=>btn.classList.toggle('active',btn.dataset.ratio===ratio));abResetTrails();abResetSurface();}
  function abSetBackground(color){abBgColor=color.toLowerCase();const bgHex=document.getElementById('ab-bg-hex');if(bgHex)bgHex.textContent=abBgColor.toUpperCase();const bgInput=document.getElementById('ab-bg-color-input');if(bgInput)bgInput.value=abBgColor;if(abCanvasWrap)abCanvasWrap.style.setProperty('--artboard-bg',abBgColor);colorSwatches.forEach(sw=>sw.classList.toggle('active',sw.dataset.color===abBgColor));abResetTrails();abResetSurface();}
  function abResize(){const p=abCanvas.parentElement,w=p.clientWidth,h=p.clientHeight;[abCanvas,abGhost,abM2Ov].forEach(c=>{c.width=w;c.height=h;});const fp=abPoseOv.parentElement;abPoseOv.width=fp.clientWidth;abPoseOv.height=fp.clientHeight;abResetSurface();}
  let abBP=null,abDetecting=false,abRafId=null,abActiveVid=null,abActiveMirror=false;
  async function abInitBP(vid,mirror){if(abRafId){cancelAnimationFrame(abRafId);abRafId=null;}abBP=null;abDetecting=false;abActiveVid=null;abResetTrails();abSetSt('Loading pose model…');abBP=await new Promise(res=>{const bp=ml5.bodyPose('MoveNet',{flipped:false},()=>res(bp));});abActiveVid=vid;abActiveMirror=mirror;abSetSt('Tracking active — move to paint',true);abLoop();}
  function abLoop(){abRafId=requestAnimationFrame(abLoop);if(!abActiveVid||abActiveVid.readyState<2||abDetecting)return;if(abActiveVid.paused&&abActiveVid!==abWebcamEl)return;if(!abPrepFrame(abActiveVid,abScaleC,abSCtx))return;const sw=abScaleC.width,sh=abScaleC.height;abDetecting=true;abBP.detect(abScaleC,(poses,err)=>{abDetecting=false;if(err)return;abSkeleton(oCtx,poses,abPoseOv.width,abPoseOv.height,sw,sh,abActiveMirror);abPaint(poses,sw,sh,abActiveMirror);});}
  const abWebcamEl=document.getElementById('ab-webcam'),abSrcVidEl=document.getElementById('ab-src-video'),abFeedIdle=document.getElementById('ab-feed-idle'),abFeedIdleMsg=document.getElementById('ab-feed-idle-msg'),abVidCtrl=document.getElementById('ab-vid-controls'),abRecOv=document.getElementById('ab-rec-overlay'),abGhostVid=document.getElementById('ab-ghost-video'),abM2VidEl=document.getElementById('ab-m2-vid');
  const abMusicEl=document.getElementById('ab-bg-music');
  const abMusicFileInput=document.getElementById('ab-music-file-input');
  const abMusicFilename=document.getElementById('ab-music-filename');
  const abMusicStatus=document.getElementById('ab-music-status');
  const abMusicPlayBtn=document.getElementById('ab-music-play-btn');
  const abMusicStopBtn=document.getElementById('ab-music-stop-btn');
  let abAudioCtx=null,abAudioDest=null,abAudioSource=null;
  function abSetMusicStatus(msg){if(abMusicStatus)abMusicStatus.textContent=msg;}
  function abEnsureMusicRouting(){
    if(abAudioCtx) return;
    abAudioCtx=new (window.AudioContext||window.webkitAudioContext)();
    abAudioDest=abAudioCtx.createMediaStreamDestination();
    const gain=abAudioCtx.createGain();
    gain.gain.value=1;
    gain.connect(abAudioDest);
    gain.connect(abAudioCtx.destination);
    abAudioSource=abAudioCtx.createMediaElementSource(abMusicEl);
    abAudioSource.connect(gain);
  }
  async function abPlayMusic(){
    if(!abMusicEl||!abMusicEl.src)return;
    abEnsureMusicRouting();
    try{
      await abAudioCtx.resume();
      abMusicEl.loop=true;
      await abMusicEl.play();
      abSetMusicStatus('Music playing');
    }catch(err){
      abSetMusicStatus('Playback blocked by browser');
    }
  }
  if(abMusicFileInput){abMusicFileInput.addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(abMusicFilename)abMusicFilename.textContent=f.name.length>28?'…'+f.name.slice(-25):f.name;const prev=abMusicEl.src;if(prev&&prev.startsWith('blob:'))URL.revokeObjectURL(prev);abMusicEl.src=URL.createObjectURL(f);abMusicEl.load();await abPlayMusic();});}
  if(abMusicPlayBtn){abMusicPlayBtn.addEventListener('click',()=>abPlayMusic());}
  if(abMusicStopBtn){abMusicStopBtn.addEventListener('click',()=>{if(abMusicEl){abMusicEl.pause();abMusicEl.currentTime=0;abSetMusicStatus('Music stopped');}});}
  ratioButtons.forEach(btn=>btn.addEventListener('click',()=>abSetAspectRatio(btn.dataset.ratio)));
  colorSwatches.forEach(sw=>sw.addEventListener('click',()=>abSetBackground(sw.dataset.color)));
  const abBgInput=document.getElementById('ab-bg-color-input');
  if(abBgInput){abBgInput.addEventListener('input',e=>abSetBackground(e.target.value));}
  let abCamStream=null,abSrcMode='cam';
  document.getElementById('ab-src-cam-tab').addEventListener('click',()=>{if(abSrcMode==='cam')return;abSrcMode='cam';document.getElementById('ab-src-cam-tab').classList.add('active');document.getElementById('ab-src-vid-tab').classList.remove('active');document.getElementById('ab-cam-start-btn').style.display='inline-flex';document.getElementById('ab-vid-import-btn').style.display='none';abStopSrcVideo();abFeedIdleMsg.textContent='Start camera to paint';});
  document.getElementById('ab-src-vid-tab').addEventListener('click',()=>{if(abSrcMode==='vid')return;abSrcMode='vid';document.getElementById('ab-src-vid-tab').classList.add('active');document.getElementById('ab-src-cam-tab').classList.remove('active');document.getElementById('ab-vid-import-btn').style.display='inline-flex';document.getElementById('ab-cam-start-btn').style.display='none';abStopCamera();abFeedIdleMsg.textContent='Import a video to analyse';});
  document.getElementById('ab-cam-start-btn').addEventListener('click',async()=>{abSetSt('Requesting camera…');try{abCamStream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'},audio:false});abWebcamEl.srcObject=abCamStream;abWebcamEl.style.display='block';abPoseOv.style.display='block';abFeedIdle.style.display='none';document.getElementById('ab-cam-start-btn').style.display='none';document.getElementById('ab-cam-stop-btn').style.display='inline-flex';abResize();await abInitBP(abWebcamEl,true);}catch(err){abSetSt('Camera error: '+err.message);}});
  document.getElementById('ab-cam-stop-btn').addEventListener('click',()=>{abStopCamera();abFeedIdle.style.display='flex';abSetSt('Camera stopped');});
  function abStopCamera(){if(abRafId){cancelAnimationFrame(abRafId);abRafId=null;}abBP=null;abDetecting=false;abActiveVid=null;if(abCamStream){abCamStream.getTracks().forEach(t=>t.stop());abCamStream=null;}abWebcamEl.srcObject=null;abWebcamEl.style.display='none';abPoseOv.style.display='none';document.getElementById('ab-cam-start-btn').style.display='inline-flex';document.getElementById('ab-cam-stop-btn').style.display='none';abResetTrails();}
  document.getElementById('ab-vid-file-input').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;document.getElementById('ab-sv-filename').textContent=f.name.length>28?'…'+f.name.slice(-25):f.name;abStopSrcVideo();abSrcVidEl.src=URL.createObjectURL(f);abSrcVidEl.style.display='block';abFeedIdle.style.display='none';abPoseOv.style.display='block';abVidCtrl.style.display='flex';abResize();await new Promise(res=>{abSrcVidEl.onloadedmetadata=res;});await abInitBP(abSrcVidEl,false);abSrcVidEl.play();abSetSt('Analysing video',true);});
  document.getElementById('ab-sv-play').addEventListener('click',()=>{abSrcVidEl.paused?abSrcVidEl.play():abSrcVidEl.pause();});
  document.getElementById('ab-sv-speed').addEventListener('input',function(){document.getElementById('ab-sv-speed-disp').textContent=parseFloat(this.value).toFixed(1)+'×';abSrcVidEl.playbackRate=parseFloat(this.value);});
  abSrcVidEl.addEventListener('play',()=>{document.getElementById('ab-sv-play-icon').style.display='none';document.getElementById('ab-sv-pause-icon').style.display='block';});
  abSrcVidEl.addEventListener('pause',()=>{document.getElementById('ab-sv-play-icon').style.display='block';document.getElementById('ab-sv-pause-icon').style.display='none';});
  function abStopSrcVideo(){if(abRafId){cancelAnimationFrame(abRafId);abRafId=null;}abBP=null;abDetecting=false;abActiveVid=null;abSrcVidEl.pause();abSrcVidEl.src='';abSrcVidEl.style.display='none';abPoseOv.style.display='none';abVidCtrl.style.display='none';abResetTrails();}
  document.getElementById('ab-mode1-btn').addEventListener('click',()=>{document.getElementById('ab-mode1-btn').classList.add('active');document.getElementById('ab-mode2-btn').classList.remove('active');document.getElementById('ab-mode1-panel').classList.add('active');document.getElementById('ab-mode2-panel').classList.remove('active');abGhost.style.display='none';abM2Ov.style.display='none';abStopM2Cam();});
  document.getElementById('ab-mode2-btn').addEventListener('click',()=>{document.getElementById('ab-mode2-btn').classList.add('active');document.getElementById('ab-mode1-btn').classList.remove('active');document.getElementById('ab-mode2-panel').classList.add('active');document.getElementById('ab-mode1-panel').classList.remove('active');abGhost.style.display='block';abM2Ov.style.display='block';});
  let abIsRec=false,abMR=null,abRCh=[];
  function abStartRec(){abRCh=[];const canvasStream=abCanvas.captureStream(30);const tracks=[...canvasStream.getVideoTracks()];if(abMusicEl&&abMusicEl.src&&abAudioDest&&abMusicEl.currentTime<abMusicEl.duration&&!abMusicEl.paused){const audioTracks=abAudioDest.stream.getAudioTracks();if(audioTracks.length)tracks.push(...audioTracks);}const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm';abMR=new MediaRecorder(new MediaStream(tracks),{mimeType:mime,videoBitsPerSecond:5000000});abMR.ondataavailable=e=>{if(e.data.size>0)abRCh.push(e.data);};abMR.onstop=()=>{const a=Object.assign(document.createElement('a'),{download:'artboard-'+Date.now()+'.webm',href:URL.createObjectURL(new Blob(abRCh,{type:'video/webm'}))});a.click();};abMR.start();abIsRec=true;abRecOv.classList.add('visible');}
  function abStopRec(){if(abMR&&abMR.state!=='inactive')abMR.stop();abIsRec=false;abRecOv.classList.remove('visible');}
  const m1Rec=document.getElementById('ab-m1-rec-btn');
  if(m1Rec){m1Rec.addEventListener('click',()=>{if(!abIsRec){abStartRec();m1Rec.classList.add('recording');m1Rec.innerHTML='<span class="record-dot"></span>Stop & Save';abSetSt('Recording…',true);}else{abStopRec();m1Rec.classList.remove('recording');m1Rec.innerHTML='<span class="record-dot"></span>Record MP4';abSetSt('Saved',true);}});}
  const abM1ClearBtn=document.getElementById('ab-m1-clear-btn');
  if(abM1ClearBtn){abM1ClearBtn.addEventListener('click',()=>{abResetTrails();abResetSurface();});}
  let abGhostLoaded=false;
  const abM2FileInput=document.getElementById('ab-m2-file-input');
  if(abM2FileInput){abM2FileInput.addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;abGhostVid.src=URL.createObjectURL(f);abGhostVid.onloadedmetadata=()=>{abGhostLoaded=true;abGhost.style.display='block';abSetSt('Ghost loaded',true);};});}
  const m2PlayBtn=document.getElementById('ab-m2-play-ghost');
  if(m2PlayBtn){m2PlayBtn.addEventListener('click',()=>{if(!abGhostLoaded)return;if(abGhostVid.paused){abGhostVid.play();m2PlayBtn.textContent='⏸ Pause Ghost';(function ghostTick(){if(!abGhostVid.paused&&!abGhostVid.ended){gCtx.clearRect(0,0,abGhost.width,abGhost.height);gCtx.drawImage(abGhostVid,0,0,abGhost.width,abGhost.height);requestAnimationFrame(ghostTick);}})();}else{abGhostVid.pause();m2PlayBtn.textContent='▶ Play Ghost';}});}
  let abM2Cam=null,abM2BP=null,abM2Active=false,abM2Raf=null,abM2Det=false;
  const abM2StartBtn=document.getElementById('ab-m2-start-cam-btn');
  const abM2StopBtn=document.getElementById('ab-m2-stop-cam-btn');
  const abM2Status=document.getElementById('ab-m2-cam-status');
  if(abM2StartBtn){abM2StartBtn.addEventListener('click',async()=>{abSetSt('Starting artboard camera…');try{abM2Cam=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'},audio:false});abM2VidEl.srcObject=abM2Cam;await abM2VidEl.play();abM2Active=true;abM2Ov.style.display='block';abM2StartBtn.style.display='none';if(abM2StopBtn)abM2StopBtn.style.display='inline-flex';if(abM2Status)abM2Status.textContent='● Camera live on artboard';abM2BP=await new Promise(res=>{const bp=ml5.bodyPose('MoveNet',{flipped:false},()=>res(bp));});abSetSt('Artboard camera tracking',true);(function m2Loop(){abM2Raf=requestAnimationFrame(m2Loop);if(!abM2VidEl||abM2VidEl.readyState<2||abM2Det)return;if(!abPrepFrame(abM2VidEl,abS2C,abS2Ctx))return;const sw=abS2C.width,sh=abS2C.height;abM2Det=true;abM2BP.detect(abS2C,(poses,err)=>{abM2Det=false;if(err)return;abSkeleton(m2Ctx,poses,abM2Ov.width,abM2Ov.height,sw,sh,true);abPaint(poses,sw,sh,true);});})();}catch(err){abSetSt('Artboard camera error: '+err.message);}});}
  function abStopM2Cam(){abM2Active=false;abM2Det=false;if(abM2Raf){cancelAnimationFrame(abM2Raf);abM2Raf=null;}abM2BP=null;if(abM2Cam){abM2Cam.getTracks().forEach(t=>t.stop());abM2Cam=null;}abM2VidEl.srcObject=null;m2Ctx.clearRect(0,0,abM2Ov.width,abM2Ov.height);abM2Ov.style.display='none';if(abM2StartBtn)abM2StartBtn.style.display='inline-flex';if(abM2StopBtn)abM2StopBtn.style.display='none';if(abM2Status)abM2Status.textContent='';}
  if(abM2StopBtn){abM2StopBtn.addEventListener('click',()=>{abStopM2Cam();abSetSt('Artboard camera stopped');});}
  const m2Rec=document.getElementById('ab-m2-rec-btn');
  if(m2Rec){m2Rec.addEventListener('click',()=>{if(!abIsRec){abStartRec();m2Rec.classList.add('recording');m2Rec.innerHTML='<span class="record-dot"></span>Stop & Save';abSetSt('Recording follow-along…',true);}else{abStopRec();m2Rec.classList.remove('recording');m2Rec.innerHTML='<span class="record-dot"></span>Record MP4';abSetSt('Saved',true);}});}
  const abM2ClearBtn=document.getElementById('ab-m2-clear-btn');
  if(abM2ClearBtn){abM2ClearBtn.addEventListener('click',()=>{abResetTrails();abResetSurface();});}
  abSetAspectRatio('4:3');
  abSetBackground('#fff8f0');
  abResize();
  window.addEventListener('resize',abResize);
})();

// ════════════════════════════════════════════════════
//  LEARNING STUDIO — ml5 BodyPose
// ════════════════════════════════════════════════════
(function(){
  const LS_TARGET_W=480, CONF_MIN=0.25, GREAT_THR=78, GOOD_THR=52, COMBO_REQ=40;
  const KP_NAMES=['nose','left_eye','right_eye','left_ear','right_ear','left_shoulder','right_shoulder','left_elbow','right_elbow','left_wrist','right_wrist','left_hip','right_hip','left_knee','right_knee','left_ankle','right_ankle'];
  const SKEL=[[5,6],[5,7],[7,9],[6,8],[8,10],[5,11],[6,12],[11,12],[11,13],[13,15],[12,14],[14,16],[0,5],[0,6]];

  // Encouraging phrases by score bucket
  const PHRASES=[
    {min:0,  max:10,  text:'ON FIRE!'},
    {min:10, max:20,  text:'You ATE THAT'},
    {min:20, max:30,  text:'Flow state activated'},
    {min:30, max:40,  text:'You killed it'},
    {min:40, max:50,  text:'So much energy!'},
    {min:50, max:60,  text:"Why are you not Idol yet?"},
    {min:60, max:70,  text:"Getting there!"},
    {min:70, max:80,  text:"You're crazy"},
    {min:80, max:90,  text:'Woooo hoooooo!'},
    {min:90, max:101, text:'Impressed, impressed.'},
  ];
  function getPhrase(score){ return (PHRASES.find(p=>score>=p.min&&score<p.max)||PHRASES[PHRASES.length-1]).text; }

  // Body-part challenges
  const CHALLENGES=[
    {id:'larm',  label:'Left Arm',   kpIdxs:[7,9],       doneScore:0, passed:false},
    {id:'rarm',  label:'Right Arm',  kpIdxs:[8,10],      doneScore:0, passed:false},
    {id:'torso', label:'Torso',      kpIdxs:[5,6,11,12], doneScore:0, passed:false},
    {id:'lleg',  label:'Left Leg',   kpIdxs:[13,15],     doneScore:0, passed:false},
    {id:'rleg',  label:'Right Leg',  kpIdxs:[14,16],     doneScore:0, passed:false},
    {id:'full',  label:'Full body',  kpIdxs:[5,6,7,8,9,10,11,12,13,14,15,16], doneScore:0, passed:false},
  ];
  let activeChallengeIdx=0;

  const challengeListEl=document.getElementById('challenge-list');
  CHALLENGES.forEach((ch,i)=>{
    const item=document.createElement('div'); item.className='challenge-item'+(i===0?' active-ch':'');
    item.id='ch-item-'+ch.id;
    item.innerHTML=`<div class="ch-icon" id="ch-icon-${ch.id}">${i+1}</div><span class="ch-label">${ch.label}</span><span class="ch-score" id="ch-score-${ch.id}">—</span>`;
    challengeListEl.appendChild(item);
  });
  function updateChallengeUI(){
    CHALLENGES.forEach((ch,i)=>{
      const item=document.getElementById('ch-item-'+ch.id);
      const icon=document.getElementById('ch-icon-'+ch.id);
      item.className='challenge-item'+(ch.passed?' done-ch':i===activeChallengeIdx?' active-ch':'');
      icon.textContent=ch.passed?'✓':(i+1);
      document.getElementById('ch-score-'+ch.id).textContent=ch.passed?Math.round(ch.doneScore)+'%':'—';
    });
    const msg=activeChallengeIdx>=CHALLENGES.length?'All challenges complete! 🎉':'Challenge '+(activeChallengeIdx+1)+'/'+CHALLENGES.length+': '+CHALLENGES[activeChallengeIdx].label;
    document.getElementById('challenge-progress-msg').textContent=msg;
  }
  updateChallengeUI();
  let chHoldFrames=0;
  const CH_HOLD_FRAMES=60;

  const SCORED_KPS=[{idx:5,name:'L. Shoulder'},{idx:6,name:'R. Shoulder'},{idx:7,name:'L. Elbow'},{idx:8,name:'R. Elbow'},{idx:9,name:'L. Wrist'},{idx:10,name:'R. Wrist'},{idx:11,name:'L. Hip'},{idx:12,name:'R. Hip'},{idx:13,name:'L. Knee'},{idx:14,name:'R. Knee'},{idx:15,name:'L. Ankle'},{idx:16,name:'R. Ankle'}];
  const KP_PARENT=[null,null,null,null,null,11,12,5,6,7,8,null,null,11,12,13,14];

  const refVideo=document.getElementById('ref-video'),refOverlay=document.getElementById('ref-overlay'),refTrack=document.getElementById('ref-track'),refProg=document.getElementById('ref-prog'),refLoopReg=document.getElementById('ref-loop-region'),refPh=document.getElementById('ref-ph'),refCur=document.getElementById('ref-cur'),refDur=document.getElementById('ref-dur'),refIdle=document.getElementById('ref-idle');
  const camVideo=document.getElementById('cam-video'),guideOv=document.getElementById('guide-overlay'),userOv=document.getElementById('user-overlay'),matchFlash=document.getElementById('match-flash'),guideCanvas=document.getElementById('ls-guide-canvas');
  const refScaleC=document.getElementById('ref-scale-c'),camScaleC=document.getElementById('cam-scale-c');
  const rSCtx=refScaleC.getContext('2d'),cSCtx=camScaleC.getContext('2d'),rOCtx=refOverlay.getContext('2d'),gOCtx=guideOv.getContext('2d'),uOCtx=userOv.getContext('2d'),gdCtx=guideCanvas.getContext('2d');
  const scoreRingFill=document.getElementById('score-ring-fill'),scoreNum=document.getElementById('score-num'),scorePctLabel=document.getElementById('score-pct-label'),fbBadge=document.getElementById('fb-badge'),statBest=document.getElementById('stat-best'),statAvg=document.getElementById('stat-avg'),statFrames=document.getElementById('stat-frames'),lsSdot=document.getElementById('ls-sdot'),lsStatus=document.getElementById('ls-status');

  let refPose=null,refDetecting=false,refRafId=null,camPose=null,camDetecting=false,camRafId=null,camStream=null,practiceActive=false,lsLoopIn=null,lsLoopOut=null,currentRefPoses=[],currentCamPoses=[],overlayStyle='skeleton',guideOpacity=0.45;
  let sessionScores=[],sessionCombo=0,sessionBest=0,sessionFrames=0;
  const kpScores={};
  SCORED_KPS.forEach(k=>{kpScores[k.idx]=0;});

  // ── bodySegmentation for silhouette ──────────────────────
  // One shared segmenter instance, lazy-initialised when silhouette mode is first used
  let bodySeg=null, bodySegReady=false, segDetecting=false;
  // Off-screen canvas to receive the segmentation mask
  const segCanvas=document.createElement('canvas'); segCanvas.style.display='none'; document.body.appendChild(segCanvas);
  const segCtx=segCanvas.getContext('2d');
  // Coloured overlay canvas composited on top of user camera for silhouette
  const segOv=document.createElement('canvas'); segOv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:none;';
  document.getElementById('cam-wrap').appendChild(segOv);
  const segOvCtx=segOv.getContext('2d');

  async function ensureBodySeg(){
    if(bodySegReady) return;
    bodySeg=await new Promise(res=>{
      const bs=ml5.bodySegmentation('SelfieSegmentation',{maskType:'person'},()=>{
        bodySegReady=true; res(bs);
      });
    });
  }

  function runSegmentation(videoEl){
    if(!bodySegReady||segDetecting||!videoEl||videoEl.readyState<2) return;
    segDetecting=true;
    bodySeg.detect(videoEl,(results)=>{
      segDetecting=false;
      if(!results||!results.mask) return;
      // Draw mask onto segCanvas
      const vw=videoEl.videoWidth||640,vh=videoEl.videoHeight||480;
      if(segCanvas.width!==vw||segCanvas.height!==vh){ segCanvas.width=vw; segCanvas.height=vh; }
      segCtx.clearRect(0,0,vw,vh);
      // results.mask is an ImageData or an HTMLCanvasElement from ml5
      if(results.mask.canvas){
        segCtx.drawImage(results.mask.canvas,0,0,vw,vh);
      } else if(results.mask instanceof ImageData){
        segCtx.putImageData(results.mask,0,0);
      }
      // Now composite onto segOv at the display size
      const ow=segOv.parentElement.clientWidth, oh=segOv.parentElement.clientHeight;
      if(segOv.width!==ow||segOv.height!==oh){ segOv.width=ow; segOv.height=oh; }
      segOvCtx.clearRect(0,0,ow,oh);
      // Save context, flip horizontally (camera is mirrored)
      segOvCtx.save();
      segOvCtx.scale(-1,1); segOvCtx.translate(-ow,0);
      // Draw mask pixels as a coloured silhouette
      // Use the segCanvas as a clip source — draw it first then use it as mask
      segOvCtx.globalCompositeOperation='source-over';
      segOvCtx.drawImage(segCanvas,0,0,ow,oh);
      // Tint: multiply with fill colour
      segOvCtx.globalCompositeOperation='source-in';
      // Color driven by current score
      const sc=parseFloat(scoreNum.textContent)||0;
      let fillColor;
      if(sc>=GREAT_THR)      fillColor='rgba(74,138,74,0.55)';
      else if(sc>=GOOD_THR)  fillColor='rgba(200,150,42,0.50)';
      else                   fillColor='rgba(200,200,210,0.40)';
      segOvCtx.fillStyle=fillColor;
      segOvCtx.fillRect(0,0,ow,oh);
      segOvCtx.restore();
    });
  }

  const fmt=s=>isNaN(s)||s<0?'0:00':Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
  const setSt=(m,a=false)=>{lsStatus.textContent=m;lsSdot.classList.toggle('on',a);};
  const lerp=(a,b,t)=>a+(b-a)*t;

  function prepFrame(vid,sc,sctx){const vw=vid.videoWidth,vh=vid.videoHeight;if(!vw||!vh)return false;const h=Math.round(vh*(LS_TARGET_W/vw));if(sc.width!==LS_TARGET_W||sc.height!==h){sc.width=LS_TARGET_W;sc.height=h;}sctx.drawImage(vid,0,0,LS_TARGET_W,h);return true;}
  function extractKPs(poses,scW,scH){if(!poses||!poses.length)return null;const pose=poses[0];return KP_NAMES.map(name=>{const kp=pose[name];if(kp&&kp.confidence>=CONF_MIN)return{x:kp.x/scW,y:kp.y/scH,conf:kp.confidence};const k2=(pose.keypoints||[]).find(k=>k.name===name);if(k2&&k2.confidence>=CONF_MIN)return{x:k2.x/scW,y:k2.y/scH,conf:k2.confidence};return null;});}

  function resizeOv(canvas,parent){canvas.width=parent.clientWidth;canvas.height=parent.clientHeight;}
  function lsResizeAll(){const rw=document.getElementById('ref-wrap'),cw=document.getElementById('cam-wrap');resizeOv(refOverlay,rw);[guideOv,userOv].forEach(c=>resizeOv(c,cw));const gs=document.getElementById('guide-strip');guideCanvas.width=gs.clientWidth;guideCanvas.height=gs.clientHeight;}
  window.addEventListener('resize',lsResizeAll);

  function kpPx(kp,cw,ch,mx=false){if(!kp)return null;return{x:(mx?1-kp.x:kp.x)*cw,y:kp.y*ch};}

  function drawHumanSilhouette(ctx,kps,w,h,mirrorX,alpha,color){
    const p=i=>kpPx(kps[i],w,h,mirrorX);
    const nose=p(0),lsh=p(5),rsh=p(6),lhip=p(11),rhip=p(12);
    const lkn=p(13),rkn=p(14),lank=p(15),rank=p(16);
    const lelb=p(7),relb=p(8),lwri=p(9),rwri=p(10);
    if(!lsh||!rsh||!lhip||!rhip) return;
    ctx.save(); ctx.globalAlpha=alpha;
    const bodyColor=color||'rgba(90,122,90,0.4)';
    const strokeC=color?color.replace(/[\d.]+\)$/,'0.8)'):'rgba(90,122,90,0.8)';
    const torsoW=(rsh.x-lsh.x)*0.18;
    ctx.beginPath();
    ctx.moveTo(lsh.x,lsh.y);
    ctx.bezierCurveTo(lsh.x-torsoW,lsh.y+Math.abs(lhip.y-lsh.y)*0.3,lhip.x-torsoW,lhip.y-Math.abs(lhip.y-lsh.y)*0.1,lhip.x,lhip.y);
    ctx.lineTo(rhip.x,rhip.y);
    ctx.bezierCurveTo(rhip.x+torsoW,rhip.y-Math.abs(rhip.y-rsh.y)*0.1,rsh.x+torsoW,rsh.y+Math.abs(rsh.y-rhip.y)*0.3,rsh.x,rsh.y);
    ctx.closePath(); ctx.fillStyle=bodyColor; ctx.fill(); ctx.strokeStyle=strokeC; ctx.lineWidth=2; ctx.stroke();
    if(nose){const headR=Math.abs(lsh.y-nose.y)*0.45;ctx.beginPath();ctx.arc(nose.x,nose.y,headR,0,Math.PI*2);ctx.fillStyle=bodyColor;ctx.fill();ctx.strokeStyle=strokeC;ctx.lineWidth=2;ctx.stroke();}
    [[lsh,lelb,lwri],[rsh,relb,rwri]].forEach(([sh,el,wr])=>{if(!sh||!el)return;const armW=Math.abs(rsh.x-lsh.x)*0.06;ctx.beginPath();ctx.moveTo(sh.x-armW,sh.y);if(wr){ctx.bezierCurveTo(el.x-armW,el.y,el.x-armW,el.y,wr.x,wr.y);ctx.lineTo(wr.x+armW*2,wr.y);ctx.bezierCurveTo(el.x+armW,el.y,el.x+armW,el.y,sh.x+armW,sh.y);}else{ctx.bezierCurveTo(el.x-armW,el.y,el.x+armW,el.y,sh.x+armW,sh.y);}ctx.closePath();ctx.fillStyle=bodyColor;ctx.fill();ctx.strokeStyle=strokeC;ctx.lineWidth=1.5;ctx.stroke();});
    [[lhip,lkn,lank],[rhip,rkn,rank]].forEach(([hip,kn,ank])=>{if(!hip)return;const legW=Math.abs(rhip.x-lhip.x)*0.12;ctx.beginPath();ctx.moveTo(hip.x-legW,hip.y);if(ank){ctx.bezierCurveTo(kn?(kn.x-legW):hip.x-legW,(kn||hip).y,kn?(kn.x-legW):hip.x-legW,(kn||hip).y,ank.x,ank.y);ctx.lineTo(ank.x+legW*2,ank.y);ctx.bezierCurveTo(kn?(kn.x+legW):hip.x+legW,(kn||hip).y,kn?(kn.x+legW):hip.x+legW,(kn||hip).y,hip.x+legW,hip.y);}else if(kn){ctx.bezierCurveTo(kn.x-legW,kn.y,kn.x+legW,kn.y,hip.x+legW,hip.y);}else{ctx.lineTo(hip.x+legW,hip.y+60);ctx.lineTo(hip.x-legW,hip.y+60);}ctx.closePath();ctx.fillStyle=bodyColor;ctx.fill();ctx.strokeStyle=strokeC;ctx.lineWidth=1.5;ctx.stroke();});
    ctx.restore();
  }

  function drawSkeleton(ctx,kps,w,h,mirrorX,opts={}){
    const{lineColor='rgba(255,255,255,0.7)',dotColor='#fff',lineWidth=1.8,dotRadius=4,style='skeleton',alpha=1.0,scoreMap=null}=opts;
    ctx.save(); ctx.globalAlpha=alpha;
    if(style==='silhouette'){
      // If bodySegmentation is active & ready, it draws on segOv canvas separately — just draw skeleton outline on top
      drawHumanSilhouette(ctx,kps,w,h,mirrorX,alpha*0.6,lineColor.replace(/[\d.]+\)$/,'0.35)'));
      // Also draw skeleton lines lightly over the silhouette
      SKEL.forEach(([a,b])=>{const pa=kpPx(kps[a],w,h,mirrorX),pb=kpPx(kps[b],w,h,mirrorX);if(!pa||!pb)return;ctx.strokeStyle=lineColor.replace(/[\d.]+\)$/,'0.5)');ctx.lineWidth=lineWidth*0.7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();});
    } else {
      SKEL.forEach(([a,b])=>{const pa=kpPx(kps[a],w,h,mirrorX),pb=kpPx(kps[b],w,h,mirrorX);if(!pa||!pb)return;const sc=scoreMap?((scoreMap[a]||0)+(scoreMap[b]||0))/2:null;ctx.strokeStyle=sc!==null?scoreColor(sc,0.8):lineColor;ctx.lineWidth=lineWidth;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();});
      kps.forEach((kp,i)=>{const p=kpPx(kp,w,h,mirrorX);if(!p)return;const sc=scoreMap?scoreMap[i]:null;ctx.beginPath();ctx.arc(p.x,p.y,dotRadius,0,Math.PI*2);ctx.fillStyle=sc!==null?scoreColor(sc,1):dotColor;ctx.fill();});
    }
    ctx.restore();
  }

  function scoreColor(sc,alpha=1){if(sc>=GREAT_THR)return`rgba(74,138,74,${alpha})`;if(sc>=GOOD_THR)return`rgba(200,150,42,${alpha})`;return`rgba(138,58,58,${alpha})`;}

  function drawGuideStrip(kps){
    const w=guideCanvas.width,h=guideCanvas.height;
    gdCtx.clearRect(0,0,w,h); if(!kps)return;
    const pts=kps.map(kp=>kp?{x:kp.x,y:kp.y}:null).filter(Boolean); if(!pts.length)return;
    const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
    const x0=Math.min(...xs)-0.05,y0=Math.min(...ys)-0.05,x1=Math.max(...xs)+0.05,y1=Math.max(...ys)+0.05;
    const bw=x1-x0||0.01,bh=y1-y0||0.01,scale=Math.min((w*0.85)/bw,(h*0.85)/bh);
    const ox=(w-(bw*scale))/2-x0*scale,oy=(h-(bh*scale))/2-y0*scale;
    const mapped=kps.map(kp=>kp?{x:kp.x*scale+ox,y:kp.y*scale+oy}:null);
    gdCtx.save(); gdCtx.strokeStyle='rgba(42,37,32,0.7)'; gdCtx.lineWidth=1.5; gdCtx.lineCap='round';
    SKEL.forEach(([a,b])=>{const pa=mapped[a],pb=mapped[b];if(!pa||!pb)return;gdCtx.beginPath();gdCtx.moveTo(pa.x,pa.y);gdCtx.lineTo(pb.x,pb.y);gdCtx.stroke();});
    mapped.forEach(p=>{if(!p)return;gdCtx.beginPath();gdCtx.arc(p.x,p.y,2.5,0,Math.PI*2);gdCtx.fillStyle='#2a2520';gdCtx.fill();});
    gdCtx.restore();
  }

  function getAngle(kps,idx){const par=KP_PARENT[idx];if(par===null||!kps[idx]||!kps[par])return null;return Math.atan2(kps[idx].y-kps[par].y,kps[idx].x-kps[par].x);}
  function kpSim(refKPs,usrKPs,idx){const ra=getAngle(refKPs,idx),ua=getAngle(usrKPs,idx);if(ra===null||ua===null)return null;let diff=Math.abs(ra-ua);if(diff>Math.PI)diff=2*Math.PI-diff;return Math.max(0,100*(1-diff/Math.PI));}
  function computeScore(refKPs,usrKPs){let total=0,n=0;const perKP={};SCORED_KPS.forEach(({idx})=>{const s=kpSim(refKPs,usrKPs,idx);if(s!==null){total+=s;n++;perKP[idx]=s;}});return{overall:n>0?total/n:null,perKP};}

  function updateScoreUI(score,perKP){
    const C=251.3;
    scoreRingFill.style.strokeDashoffset=C*(1-score/100);
    scoreRingFill.style.stroke=scoreColor(score,1);
    scoreNum.textContent=Math.round(score);
    const phrase=getPhrase(score);
    let tier=score>=GREAT_THR?'great':score>=GOOD_THR?'good':'miss';
    fbBadge.className='fb-badge '+tier;
    fbBadge.textContent=phrase;
    scorePctLabel.textContent=score>=GREAT_THR?'great match':score>=GOOD_THR?'good match':'keep going';
    SCORED_KPS.forEach(({idx})=>{const s=perKP[idx]??kpScores[idx];kpScores[idx]=lerp(kpScores[idx],s,0.25);});
    if(score>=GREAT_THR){matchFlash.style.opacity='1';setTimeout(()=>matchFlash.style.opacity='0',120);}
    sessionFrames++;sessionScores.push(score);if(score>sessionBest)sessionBest=score;
    const avg=sessionScores.reduce((a,b)=>a+b,0)/sessionScores.length;
    statBest.textContent=Math.round(sessionBest)+'%';statAvg.textContent=Math.round(avg)+'%';statFrames.textContent=sessionFrames;
    if(practiceActive&&activeChallengeIdx<CHALLENGES.length){
      const ch=CHALLENGES[activeChallengeIdx];
      const chScore=ch.kpIdxs.map(i=>perKP[i]||0).reduce((a,b)=>a+b,0)/ch.kpIdxs.length;
      document.getElementById('ch-score-'+ch.id).textContent=Math.round(chScore)+'%';
      if(chScore>=70){chHoldFrames++;if(chHoldFrames>=CH_HOLD_FRAMES){ch.passed=true;ch.doneScore=chScore;activeChallengeIdx++;chHoldFrames=0;updateChallengeUI();fbBadge.textContent='Challenge complete! 🎉';fbBadge.className='fb-badge great';}}else{chHoldFrames=0;}
    }
  }

  SCORED_KPS.forEach(({idx})=>{kpScores[idx]=0;});

  document.getElementById('ref-file-in').addEventListener('change',async e=>{
    const f=e.target.files[0];if(!f)return;
    document.getElementById('ref-fname').textContent=f.name.length>26?'…'+f.name.slice(-23):f.name;
    refVideo.src=URL.createObjectURL(f);refIdle.style.display='none';refVideo.style.display='block';refOverlay.style.display='block';
    await new Promise(res=>{refVideo.onloadedmetadata=res;});
    refDur.textContent=fmt(refVideo.duration);
    document.getElementById('ls-loop-in').max=refVideo.duration;document.getElementById('ls-loop-out').max=refVideo.duration;
    setSt('Video loaded — select a segment',true);lsResizeAll();await initRefPose();
  });
  refTrack.addEventListener('click',e=>{if(!refVideo.duration)return;const r=refTrack.getBoundingClientRect();refVideo.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*refVideo.duration;});
  document.getElementById('ref-play-btn').addEventListener('click',()=>{refVideo.paused?refVideo.play():refVideo.pause();});
  refVideo.addEventListener('play',()=>{document.getElementById('ref-pi').style.display='none';document.getElementById('ref-pau').style.display='block';});
  refVideo.addEventListener('pause',()=>{document.getElementById('ref-pi').style.display='block';document.getElementById('ref-pau').style.display='none';});
  document.getElementById('ref-speed').addEventListener('input',function(){document.getElementById('ref-speed-val').textContent=parseFloat(this.value).toFixed(2)+'×';refVideo.playbackRate=parseFloat(this.value);});
  function updateRefTimeline(){if(!refVideo.duration)return;const p=refVideo.currentTime/refVideo.duration;refProg.style.width=(p*100)+'%';refPh.style.left=(p*100)+'%';refCur.textContent=fmt(refVideo.currentTime);if(lsLoopIn!==null&&lsLoopOut!==null&&practiceActive){if(refVideo.currentTime>=lsLoopOut||refVideo.currentTime<lsLoopIn)refVideo.currentTime=lsLoopIn;}}
  setInterval(updateRefTimeline,60);
  document.getElementById('ls-set-in-btn').addEventListener('click',()=>{document.getElementById('ls-loop-in').value=refVideo.currentTime.toFixed(1);checkLsLoop();});
  document.getElementById('ls-set-out-btn').addEventListener('click',()=>{document.getElementById('ls-loop-out').value=refVideo.currentTime.toFixed(1);checkLsLoop();});
  ['ls-loop-in','ls-loop-out'].forEach(id=>{document.getElementById(id).addEventListener('input',checkLsLoop);});
  function checkLsLoop(){const i=parseFloat(document.getElementById('ls-loop-in').value),o=parseFloat(document.getElementById('ls-loop-out').value);const ok=!isNaN(i)&&!isNaN(o)&&i<o;document.getElementById('ls-loop-btn').disabled=!ok;if(ok){document.getElementById('ls-segment-info').textContent=`Segment: ${fmt(i)} → ${fmt(o)} · ${(o-i).toFixed(1)}s`;lsLoopIn=i;lsLoopOut=o;refLoopReg.style.left=(i/refVideo.duration*100)+'%';refLoopReg.style.width=((o-i)/refVideo.duration*100)+'%';refLoopReg.style.display='block';}}
  document.getElementById('ls-loop-btn').addEventListener('click',()=>{if(lsLoopIn===null||lsLoopOut===null)return;refVideo.currentTime=lsLoopIn;refVideo.play();setSt('Segment active',true);document.getElementById('ls-loop-clear-btn').style.display='inline-flex';document.getElementById('practice-btn').disabled=camStream===null;});
  document.getElementById('ls-loop-clear-btn').addEventListener('click',()=>{lsLoopIn=null;lsLoopOut=null;refLoopReg.style.display='none';document.getElementById('ls-segment-info').textContent='';document.getElementById('ls-loop-clear-btn').style.display='none';document.getElementById('ls-loop-btn').disabled=true;document.getElementById('ls-loop-in').value='';document.getElementById('ls-loop-out').value='';});

  async function initRefPose(){if(refRafId){cancelAnimationFrame(refRafId);refRafId=null;}refPose=null;refDetecting=false;setSt('Loading pose model…');refPose=await new Promise(res=>{const bp=ml5.bodyPose('MoveNet',{flipped:false},()=>res(bp));});setSt('Reference pose ready',true);refLoop();}
  function refLoop(){refRafId=requestAnimationFrame(refLoop);if(!refVideo||refVideo.readyState<2||refDetecting||refVideo.paused)return;if(!prepFrame(refVideo,refScaleC,rSCtx))return;const sw=refScaleC.width,sh=refScaleC.height;refDetecting=true;refPose.detect(refScaleC,(poses,err)=>{refDetecting=false;if(err)return;currentRefPoses=poses;const w=refOverlay.width,h=refOverlay.height;rOCtx.clearRect(0,0,w,h);const kps=extractKPs(poses,sw,sh);if(kps)drawSkeleton(rOCtx,kps,w,h,false,{lineColor:'rgba(200,150,42,0.7)',dotColor:'#c8962a',alpha:0.85,style:overlayStyle});drawGuideStrip(kps);if(practiceActive&&kps&&currentCamPoses.length){const camKPs=extractKPs(currentCamPoses,camScaleC.width,camScaleC.height);if(camKPs){const{overall,perKP}=computeScore(kps,camKPs);if(overall!==null)updateScoreUI(overall,perKP);}}});}

  document.getElementById('cam-start-btn').addEventListener('click',async()=>{setSt('Requesting camera…');try{camStream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'},audio:false});camVideo.srcObject=camStream;camVideo.style.display='block';guideOv.style.display='block';userOv.style.display='block';document.getElementById('cam-idle').style.display='none';document.getElementById('cam-start-btn').style.display='none';document.getElementById('cam-stop-btn').style.display='inline-flex';document.getElementById('practice-btn').disabled=(lsLoopIn===null);lsResizeAll();await initCamPose();setSt('Camera ready',true);}catch(err){setSt('Camera error: '+err.message);}});
  document.getElementById('cam-stop-btn').addEventListener('click',()=>{stopCam();setSt('Camera stopped');});
  function stopCam(){if(camRafId){cancelAnimationFrame(camRafId);camRafId=null;}camPose=null;camDetecting=false;if(camStream){camStream.getTracks().forEach(t=>t.stop());camStream=null;}camVideo.srcObject=null;camVideo.style.display='none';guideOv.style.display='none';userOv.style.display='none';segOv.style.display='none';document.getElementById('cam-idle').style.display='flex';document.getElementById('cam-start-btn').style.display='inline-flex';document.getElementById('cam-stop-btn').style.display='none';document.getElementById('practice-btn').disabled=true;practiceActive=false;stopPracticeUI();}
  async function initCamPose(){if(camRafId){cancelAnimationFrame(camRafId);camRafId=null;}camPose=null;camDetecting=false;setSt('Loading camera pose model…');camPose=await new Promise(res=>{const bp=ml5.bodyPose('MoveNet',{flipped:false},()=>res(bp));});setSt('Camera pose ready',true);camLoop();}
  function camLoop(){camRafId=requestAnimationFrame(camLoop);if(!camVideo||camVideo.readyState<2||camDetecting)return;if(!prepFrame(camVideo,camScaleC,cSCtx))return;const sw=camScaleC.width,sh=camScaleC.height;camDetecting=true;camPose.detect(camScaleC,(poses,err)=>{camDetecting=false;if(err)return;currentCamPoses=poses;const w=userOv.width,h=userOv.height;uOCtx.clearRect(0,0,w,h);
    // Run body segmentation for silhouette mode
    if(overlayStyle==='silhouette'){
      segOv.style.display='block';
      ensureBodySeg().then(()=>runSegmentation(camVideo));
    } else {
      segOv.style.display='none';
    }
    if(currentRefPoses.length){const refKPs=extractKPs(currentRefPoses,refScaleC.width,refScaleC.height);if(refKPs){gOCtx.clearRect(0,0,guideOv.width,guideOv.height);drawSkeleton(gOCtx,refKPs,guideOv.width,guideOv.height,true,{lineColor:`rgba(200,150,42,${guideOpacity})`,dotColor:`rgba(200,150,42,${guideOpacity+0.2})`,alpha:1,style:overlayStyle,lineWidth:2.5,dotRadius:5});}}
    const camKPs=extractKPs(poses,sw,sh);if(camKPs){const scMap={};if(practiceActive&&currentRefPoses.length){const refKPs=extractKPs(currentRefPoses,refScaleC.width,refScaleC.height);if(refKPs)SCORED_KPS.forEach(({idx})=>{const s=kpSim(refKPs,camKPs,idx);if(s!==null)scMap[idx]=s;});}
    // In silhouette mode, only draw the skeleton lightly — segOv canvas provides the person mask
    drawSkeleton(uOCtx,camKPs,w,h,true,{lineColor:'rgba(255,255,255,0.55)',dotColor:'#fff',alpha:overlayStyle==='silhouette'?0.4:1,style:overlayStyle==='silhouette'?'skeleton':overlayStyle,scoreMap:practiceActive?scMap:null,lineWidth:2,dotRadius:4});}});}

  document.getElementById('practice-btn').addEventListener('click',()=>{if(lsLoopIn===null||lsLoopOut===null){setSt('Select a loop segment first');return;}practiceActive=true;refVideo.currentTime=lsLoopIn;refVideo.play();document.getElementById('practice-btn').style.display='none';document.getElementById('practice-stop-btn').style.display='inline-flex';setSt('Practice active — match the pose!',true);});
  document.getElementById('practice-stop-btn').addEventListener('click',()=>{practiceActive=false;refVideo.pause();stopPracticeUI();setSt('Practice stopped');});
  function stopPracticeUI(){document.getElementById('practice-btn').style.display='inline-flex';document.getElementById('practice-stop-btn').style.display='none';}

  document.querySelectorAll('.ov-chip').forEach(c=>{c.addEventListener('click',()=>{document.querySelectorAll('.ov-chip').forEach(x=>x.classList.remove('active'));c.classList.add('active');overlayStyle=c.dataset.ov;if(overlayStyle!=='silhouette'){segOv.style.display='none';}});});
  document.getElementById('guide-opacity').addEventListener('input',function(){guideOpacity=parseInt(this.value)/100;document.getElementById('guide-opacity-val').textContent=this.value+'%';});

  document.getElementById('reset-stats-btn').addEventListener('click',()=>{sessionScores=[];sessionCombo=0;sessionBest=0;sessionFrames=0;scoreNum.textContent='—';scorePctLabel.textContent='waiting for camera';scoreRingFill.style.strokeDashoffset='251.3';fbBadge.className='fb-badge';fbBadge.textContent='—';statBest.textContent='—';statAvg.textContent='—';statFrames.textContent='0';CHALLENGES.forEach(ch=>{ch.passed=false;ch.doneScore=0;});activeChallengeIdx=0;chHoldFrames=0;updateChallengeUI();});

  lsResizeAll();
})();
