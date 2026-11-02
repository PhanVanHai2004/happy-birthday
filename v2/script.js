'use strict';
const $ = id => document.getElementById(id);
const chapters = [
  {year:'2004',tag:'ĐIỂM KHỞI ĐẦU',title:'Ngày thế giới<br>có thêm một <em>Huệ.</em>',copy:'05 tháng 11. Một tiếng khóc rất nhỏ, một khởi đầu rất lớn. Từ hôm ấy, thế giới có thêm một điều đáng yêu.',label:'Lời chào đầu tiên',color:'#ebc3d0'},
  {year:'2005–2009',tag:'NHỮNG BƯỚC CHÂN NHỎ',title:'Thế giới rộng bằng<br>một <em>khu vườn.</em>',copy:'Những bước chập chững, những điều đầu tiên, và niềm vui giản đơn như một chiếc diều chạm gió.',label:'Miền thơ bé',color:'#d3dfbf'},
  {year:'2010–2015',tag:'TRANG VỞ ĐẦU TIÊN',title:'Có những ước mơ<br>bắt đầu từ <em>trang giấy.</em>',copy:'Nét chữ, tiếng trống trường, những giờ ra chơi. Từng điều nhỏ lặng lẽ xếp thành một miền ký ức.',label:'Một thời đến lớp',color:'#e4d6b7'},
  {year:'2016–2021',tag:'BẦU TRỜI CỦA RIÊNG MÌNH',title:'Lớn lên, cùng<br>thật nhiều <em>mộng mơ.</em>',copy:'Bắt đầu có những câu hỏi, những điều muốn thử, và một bầu trời đầy những vì sao mang tên hy vọng.',label:'Những năm mộng mơ',color:'#c6b7df'},
  {year:'2022–2025',tag:'NHỮNG CHÂN TRỜI MỚI',title:'Đi xa thêm một chút.<br>Hiểu mình <em>thêm một chút.</em>',copy:'Có ngày rực rỡ, có ngày chậm lại. Mỗi bước chân đều đang đưa cậu đến gần hơn với chính mình.',label:'Chạm những chân trời',color:'#c4d9d8'},
  {year:'2026',tag:'HUỆ CỦA HÔM NAY',title:'Tất cả những ngày ấy,<br>làm nên <em>cậu hôm nay.</em>',copy:'Không cần hoàn hảo. Cậu đã đi một hành trình rất riêng, rất đáng quý. Và một chương mới đang chờ được mở.',label:'Bây giờ, ngay đây',color:'#ebc4b6'}
];
const CHAPTER_SECONDS = 7.6;
let scene='intro', elapsed=0, activeChapter=-1, paused=false, doorTimer=null;
let held=false, holdProgress=0, holdStarted=0, holdBase=0, blown=false, lastTime=performance.now(), sceneTime=0;
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let soundOn=false, audio=null, musicTimer=null, musicIndex=0;
let width=innerWidth,height=innerHeight,dpr=1, particles=[], rockets=[], nextRocket=0;
const canvas=$('universe');
const ctx=canvas.getContext('2d');

// A vector character, drawn locally: no photos or third-party avatar service.
const avatarMarkup=`<svg viewBox="0 0 220 350" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="dress" x2=".5" y2="1"><stop stop-color="#e3a6bd"/><stop offset="1" stop-color="#ae6c96"/></linearGradient></defs><g class="hair-tail"><path d="M63 78Q35 130 54 206l20 20 6-92h70l8 93 24-22q18-78-9-126z" fill="#392c3e"/><path d="M65 130q-20 45-6 78m102-80q20 40 9 75" fill="none" stroke="#594153" stroke-width="5"/></g><g class="leg-left"><path d="M85 244l-2 62q4 10 15 1l9-62" fill="#f2cdbb"/><path d="m82 295-5 20q-2 10 25 6l2-20" fill="#eee3de" stroke="#ccb8bd" stroke-width="2"/><path d="M77 317h25" stroke="#8f6f85" stroke-width="3"/></g><g class="leg-right"><path d="M116 244l6 62q6 9 16 0l-1-63" fill="#f2cdbb"/><path d="m121 299-1 21q25 7 26-2l-8-21" fill="#eee3de" stroke="#ccb8bd" stroke-width="2"/><path d="m121 320 24 1" stroke="#8f6f85" stroke-width="3"/></g><path d="M99 134v18h25v-18" fill="#eac0ad"/><g class="arm-left"><path d="M79 154q-14 8-18 44l3 32q5 11 13 0l1-28 15-35" fill="#f2cdbb" stroke="#d7a394" stroke-width="1"/><path d="m80 151-14 19 15 13 14-20" fill="#cf93ad"/></g><path d="M83 149q26 17 53 0l15 36-5 17 16 51q-49 26-99 0l17-53-7-17z" fill="url(#dress)" stroke="#b77d9c" stroke-width="1.5"/><path d="M96 149q13 19 28 0" fill="none" stroke="#f8d8de" stroke-width="6"/><path d="M84 199q25 9 61 0" fill="none" stroke="#f6c4cf" stroke-width="5"/><path d="m112 200-11 11 12-5 10 7-2-14" fill="#f3c5d1"/><path d="m83 244 5-30m45 31-5-31m-18 35v-31" stroke="#e8b1c6" stroke-width="2" opacity=".6"/><g class="arm-right"><path d="m137 157 18 38 10-16 6 2q5 2 4 8l-13 29q-7 10-13-2l-23-43" fill="#f2cdbb" stroke="#d7a394" stroke-width="1"/><path d="m139 150 15 19-15 13-13-20" fill="#cf93ad"/></g><ellipse cx="109" cy="94" rx="50" ry="52" fill="#f4d0be"/><ellipse cx="58" cy="103" rx="7" ry="11" fill="#e9bba9"/><ellipse cx="160" cy="103" rx="7" ry="11" fill="#e9bba9"/><path d="M57 94q-9-63 54-65 59 0 52 68-20-4-35-31-15 24-60 20l-8 24z" fill="#3f3043"/><path d="M65 67q29-35 66-21" fill="none" stroke="#624658" stroke-width="5" stroke-linecap="round"/><g class="eye-shine"><ellipse cx="89" cy="103" rx="5" ry="7" fill="#483346"/><ellipse cx="131" cy="103" rx="5" ry="7" fill="#483346"/><circle cx="90" cy="101" r="1.7" fill="#fff7ed"/><circle cx="132" cy="101" r="1.7" fill="#fff7ed"/></g><ellipse cx="75" cy="118" rx="8" ry="4" fill="#e9a4ac" opacity=".65"/><ellipse cx="144" cy="118" rx="8" ry="4" fill="#e9a4ac" opacity=".65"/><path d="M102 123q8 8 16 0" fill="none" stroke="#b66c7e" stroke-width="2.5" stroke-linecap="round"/><g transform="translate(150 67) rotate(20)"><path d="M0 0Q-25-24-21 2-19 17 0 6Q26 24 22-2 20-16 0 0" fill="#dba3bd"/><ellipse cx="0" cy="3" rx="5" ry="6" fill="#efd1d7"/></g></svg>`;
document.querySelectorAll('[data-avatar]').forEach((el,index)=>{el.innerHTML=avatarMarkup.replaceAll('id="dress"',`id="dress-${index}"`).replaceAll('url(#dress)',`url(#dress-${index})`);});

const candlePositions=[[145,103],[177,87],[210,81],[243,87],[275,103]];
const candles=candlePositions.map(([x,y],i)=>`<g transform="translate(${x} ${y})"><rect x="-4" y="-37" width="8" height="43" rx="3" fill="${i%2?'#b8c6a9':'#e4adc4'}"/><path d="m-3-27 6-4m-6 17 6-4m-6 17 6-4" stroke="#fff3e2" stroke-width="2"/><path d="M0-37v-7" stroke="#6b5260" stroke-width="1.5"/><g class="candle-flame"><g class="flame-dance" style="animation-delay:-${i*.14}s"><ellipse cy="-53" rx="10" ry="14" fill="#f4bf7e" opacity=".1"/><path d="M0-67C-17-47-7-41 0-44 9-42 14-51 0-67" fill="#edb56e"/><path d="M0-58C-7-48-4-44 0-45 5-44 6-49 0-58" fill="#fff4bd"/></g></g><path class="candle-smoke" d="M0-42q-8-8 0-14t0-13"/></g>`).join('');
$('cake-art').innerHTML=`<svg viewBox="0 0 420 300" role="img" aria-label="Bánh sinh nhật hai tầng với năm ngọn nến đang cháy"><defs><linearGradient id="lower-cake" x2="0" y2="1"><stop stop-color="#cb91ae"/><stop offset="1" stop-color="#925a83"/></linearGradient><linearGradient id="upper-cake" x2="0" y2="1"><stop stop-color="#f0c4d2"/><stop offset="1" stop-color="#c88fae"/></linearGradient></defs><ellipse cx="210" cy="258" rx="158" ry="20" fill="#7d617d" opacity=".3"/><ellipse cx="210" cy="247" rx="151" ry="23" fill="#e4c8c4"/><ellipse cx="210" cy="243" rx="139" ry="17" fill="#cbb0b7"/><path d="M85 168v62c0 35 250 35 250 0v-62" fill="url(#lower-cake)" stroke="#b6809f"/><ellipse cx="210" cy="169" rx="125" ry="32" fill="#eed3d4"/><path d="M85 168v14q6 16 17 2 10 14 19 2 10 14 20 2 10 14 20 2 10 14 20 2 10 14 20 2 10 14 20 0 10 14 20-1 10 14 20-2 10 14 20-2 10 14 20-2 10 10 14-6v-10" fill="#f5ded7"/><path d="M119 109v57c0 28 182 28 182 0v-57" fill="url(#upper-cake)" stroke="#d5a6b9"/><path d="M119 110v17c0 16 14 17 16 2 2-8 12-8 13 2v9c0 16 17 16 18 0 1-10 13-11 14 0v7c0 16 18 16 18 0v-9c0-11 15-11 16 0v6c0 16 18 16 18-1 0-10 15-13 16-2 1 16 17 13 17-2v-10c1-10 12-12 14-1 4 14 22 13 22-3v-15" fill="#fff0db"/><ellipse cx="210" cy="109" rx="91" ry="28" fill="#fff1df"/><ellipse cx="210" cy="109" rx="72" ry="18" fill="none" stroke="#e6c7c1" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>${candles}<path d="M99 227q10 14 20 0 10 14 20 0 10 14 20 0 10 14 20 0 10 14 20 0 10 14 20 0 10 14 20 0 10 14 20 0 10 14 20 0 10 14 20 0 10 14 20 0" fill="none" stroke="#f4d9d9" stroke-width="4"/><text x="210" y="221" fill="#f8dce5" text-anchor="middle" font-family="Georgia" font-size="23" font-style="italic">Huệ</text><g fill="#e6c8a1"><circle cx="140" cy="161" r="2"/><circle cx="164" cy="169" r="2"/><circle cx="187" cy="172" r="2"/><circle cx="211" cy="173" r="2"/><circle cx="236" cy="172" r="2"/><circle cx="260" cy="169" r="2"/><circle cx="282" cy="161" r="2"/></g></svg>`;
for(const container of document.querySelectorAll('.fairy-lights,.finale-lights')){
  for(let i=0;i<25;i++){const bulb=document.createElement('i');bulb.style.cssText=`--x:${i*4.16}%;--y:${30+Math.sin(i/24*Math.PI)*70}%;--delay:-${i*.37}s`;container.append(bulb);}
}
$('timeline-stops').innerHTML=chapters.map((c,i)=>`<button data-chapter="${i}" aria-label="Đến chặng ${i+1}: ${c.label}">${c.year.split('–')[0]}</button>`).join('');
function announce(text){$('scene-announcement').textContent=text;}
function setScene(next){
  if(scene==='door'&&next!=='party')clearTimeout(doorTimer);
  held=false;document.body.classList.remove('blowing','door-opening');
  scene=next;sceneTime=0;document.body.dataset.scene=next;
  document.querySelectorAll('.scene').forEach(el=>el.hidden=el.id!==`${next}-scene`);
  const heading=$(next==='intro'?'intro-heading':next==='journey'?'chapter-heading':next==='door'?'door-heading':next==='party'?'party-heading':'finale-heading');
  heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
  announce(heading.textContent);
  if(next==='finale'){particles=[];rockets=[];nextRocket=.1;[.2,.65,1.1].forEach((delay,i)=>setTimeout(()=>{if(scene==='finale')launchFirework(width*(.2+i*.3),height*(.2+(i%2)*.09));},delay*1000));playChime();}
}
function updateChapter(force=false){
  const index=Math.min(5,Math.floor(elapsed/CHAPTER_SECONDS));
  if(index===activeChapter&&!force)return;
  activeChapter=index;const c=chapters[index];
  $('chapter-index').textContent=String(index+1).padStart(2,'0');$('chapter-year').textContent=c.year;
  $('chapter-tag').textContent=`CHƯƠNG ${String(index+1).padStart(2,'0')} · ${c.tag}`;
  $('chapter-heading').innerHTML=c.title.replaceAll('<br>','<br> ');$('chapter-copy').textContent=c.copy;
  document.querySelectorAll('[data-chapter]').forEach((el,i)=>{el.classList.toggle('active',i===index);if(i===index)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  announce(`${c.year}. ${c.title.replace(/<[^>]*>/g,' ')} ${c.copy}`);playChime();
}
function startJourney(){elapsed=0;activeChapter=-1;paused=false;blown=false;holdProgress=0;document.body.classList.remove('paused','candles-out');$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-pressed','false');$('pause').setAttribute('aria-label','Tạm dừng hành trình');$('open-door').disabled=false;setScene('journey');updateChapter(true);}
$('start').addEventListener('click',startJourney);
$('pause').addEventListener('click',()=>{paused=!paused;document.body.classList.toggle('paused',paused);$('pause').textContent=paused?'▷':'Ⅱ';$('pause').setAttribute('aria-pressed',String(paused));$('pause').setAttribute('aria-label',paused?'Tiếp tục hành trình':'Tạm dừng hành trình');});
$('next-chapter').addEventListener('click',()=>{if(activeChapter>=5)setScene('door');else{elapsed=(activeChapter+1)*CHAPTER_SECONDS;updateChapter();}});
$('timeline-stops').addEventListener('click',e=>{const button=e.target.closest('[data-chapter]');if(button){elapsed=Number(button.dataset.chapter)*CHAPTER_SECONDS;updateChapter();}});
$('skip-journey').addEventListener('click',()=>setScene('door'));
$('open-door').addEventListener('click',()=>{if($('open-door').disabled)return;$('open-door').disabled=true;document.body.classList.add('door-opening');playChime();doorTimer=setTimeout(()=>{if(scene==='door'){holdProgress=0;blown=false;document.body.classList.remove('candles-out');$('cake-art').querySelector('svg').setAttribute('aria-label','Bánh sinh nhật hai tầng với năm ngọn nến đang cháy');updateHoldUI();setScene('party');}},reduced?250:2800);});
$('home-link').addEventListener('click',e=>{e.preventDefault();clearTimeout(doorTimer);setScene('intro');});
$('replay').addEventListener('click',()=>{clearTimeout(doorTimer);startJourney();});
function applyMotion(){document.body.classList.toggle('reduced-motion',reduced);$('motion-toggle').setAttribute('aria-pressed',String(reduced));$('motion-toggle').setAttribute('aria-label',reduced?'Bật chuyển động':'Giảm chuyển động');}
applyMotion();$('motion-toggle').addEventListener('click',()=>{reduced=!reduced;applyMotion();});

// Hold-to-blow, using real elapsed time. Releasing early restores the flames gradually.
const blowButton=$('blow');
function beginHold(){if(scene!=='party'||blown||held)return;holdStarted=performance.now();holdBase=holdProgress;held=true;document.body.classList.add('blowing');}
function endHold(){if(held&&!blown&&scene==='party')holdProgress=Math.min(1,holdBase+(performance.now()-holdStarted)/3200);held=false;document.body.classList.remove('blowing');if(holdProgress>=1&&!blown&&scene==='party')extinguish();}
blowButton.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();blowButton.focus();blowButton.setPointerCapture(e.pointerId);beginHold();});
blowButton.addEventListener('pointerup',endHold);blowButton.addEventListener('pointercancel',endHold);blowButton.addEventListener('lostpointercapture',endHold);
blowButton.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();if(!e.repeat)beginHold();}});
blowButton.addEventListener('keyup',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();endHold();}});
blowButton.addEventListener('blur',endHold);window.addEventListener('blur',endHold);
blowButton.addEventListener('contextmenu',e=>e.preventDefault());
function updateHoldUI(){
  const percent=Math.round(holdProgress*100);
  document.documentElement.style.setProperty('--flame-scale',String(Math.max(.06,1-holdProgress*.94)));
  document.documentElement.style.setProperty('--flame-opacity',String(1-holdProgress*.75));
  $('hold-fill').style.width=`${percent}%`;$('hold-track').style.width=`${percent}%`;
  document.querySelector('.hold-progress').setAttribute('aria-valuenow',String(percent));
  $('hold-time').textContent=held?`${Math.max(0,Math.ceil((1-holdProgress)*3.2))} giây`:'3 giây';
  $('blow-label').textContent=held?(holdProgress>.65?'Sắp tắt rồi…':'Thổi nhẹ, giữ thêm nhé…'):'Giữ để thổi nến';
  document.querySelector('.cake-aura').style.opacity=String(1-holdProgress*.85);
}
function extinguish(){
  blown=true;endHold();document.body.classList.add('candles-out');$('cake-art').querySelector('svg').setAttribute('aria-label','Bánh sinh nhật với những ngọn nến đã tắt');
  setScene('finale');announce('Nến đã tắt. Chúc mừng sinh nhật 22 tuổi, Huệ! Pháo hoa đang sáng lên.');
}
const letter=$('letter-dialog');$('read-letter').addEventListener('click',()=>{letter.showModal();$('close-letter').focus();});
for(const id of ['close-letter','letter-done'])$(id).addEventListener('click',()=>letter.close());
letter.addEventListener('close',()=>$('read-letter').focus());
letter.addEventListener('click',e=>{if(e.target===letter){const r=letter.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)letter.close();}});
$('more-fireworks').addEventListener('click',()=>{for(let i=0;i<4;i++)setTimeout(()=>{if(scene==='finale')launchFirework(width*(.15+i*.23),height*(.14+Math.random()*.22));},i*240);playChime();});

// Original, softly synthesized music. No autoplay, downloads or microphone permission.
const melody=[72,76,79,83,81,79,76,null,69,72,76,79,77,76,72,null,67,71,74,79,83,81,79,null,65,69,72,77,76,74,72,null];
function tone(note,duration=1.6,gain=.035,type='sine'){
  if(!soundOn||!audio||audio.state!=='running')return;
  const osc=audio.createOscillator(),env=audio.createGain(),now=audio.currentTime;
  osc.type=type;osc.frequency.value=440*2**((note-69)/12);env.gain.setValueAtTime(0,now);env.gain.linearRampToValueAtTime(gain,now+.035);env.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(env);env.connect(audio.destination);osc.start();osc.stop(now+duration+.05);osc.onended=()=>{osc.disconnect();env.disconnect();};
}
function playChime(){if(soundOn)[76,79,84].forEach((n,i)=>setTimeout(()=>tone(n,.8,.025),i*120));}
function setSoundUI(){ $('sound-toggle').setAttribute('aria-pressed',String(soundOn));$('sound-label').textContent=soundOn?'Tắt âm thanh':'Bật âm thanh';}
async function stopSound(){soundOn=false;clearInterval(musicTimer);if(audio?.state==='running')await audio.suspend();setSoundUI();}
$('sound-toggle').addEventListener('click',async()=>{
  if(soundOn){await stopSound();return;}
  try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error();audio ||= new Audio();await audio.resume();soundOn=true;setSoundUI();const tick=()=>{const n=melody[musicIndex++%melody.length];if(n!==null)tone(n);};tick();musicTimer=setInterval(tick,580);}catch{soundOn=false;setSoundUI();$('sound-label').textContent='Chưa hỗ trợ âm thanh';}
});
document.addEventListener('visibilitychange',()=>{endHold();if(document.hidden)stopSound();lastTime=performance.now();});

// Illustration helpers, used to paint six little memory dioramas offscreen.
function rounded(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function ellipse(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();}
function line(c,points,color,w=3){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke();}
function star(c,x,y,r,color){c.save();c.translate(x,y);c.beginPath();for(let i=0;i<8;i++){let a=i*Math.PI/4-Math.PI/2,s=i%2?r*.28:r;c.lineTo(Math.cos(a)*s,Math.sin(a)*s);}c.closePath();c.fillStyle=color;c.fill();c.restore();}
function smallPerson(c,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);ellipse(c,0,-51,22,27,'#4d394a');rounded(c,-19,-34,38,59,12,'#bd85a0');line(c,[[-9,22],[-11,53]],'#f0c9b6',10);line(c,[[9,22],[11,53]],'#f0c9b6',10);ellipse(c,0,-50,18,20,'#f0c9b6');c.beginPath();c.moveTo(-20,-53);c.quadraticCurveTo(-18,-84,13,-71);c.quadraticCurveTo(29,-58,19,-47);c.lineTo(9,-62);c.quadraticCurveTo(-2,-49,-20,-53);c.fillStyle='#4d394a';c.fill();ellipse(c,-6,-49,1.8,2.5,'#4d394a');ellipse(c,6,-49,1.8,2.5,'#4d394a');line(c,[[-3,-40],[0,-38],[3,-40]],'#b57586',1.5);line(c,[[-19,-25],[-32,8]],'#f0c9b6',7);line(c,[[19,-25],[32,8]],'#f0c9b6',7);c.restore();}
function makeMemory(index){
  const surface=document.createElement('canvas');surface.width=720;surface.height=490;const c=surface.getContext('2d');
  const colors=['#f0d6dc','#dde4cd','#eadfc6','#cbc2e1','#cedfdd','#ecd2c8'];
  rounded(c,0,0,720,490,18,'#fff1e8');rounded(c,13,13,694,464,10,colors[index]);
  c.save();rounded(c,26,26,668,365,6);c.clip();
  const g=c.createLinearGradient(0,25,0,390);g.addColorStop(0,colors[index]);g.addColorStop(1,['#e9bfca','#c4d1b0','#d5c59f','#9d94c1','#a5c5be','#d2adbd'][index]);c.fillStyle=g;c.fillRect(26,26,668,365);
  // Common tiny stars lend the frames a dreamlike, rather than documentary, feeling.
  for(let j=0;j<16;j++)star(c,50+(j*137)%620,45+(j*71)%245,j%3===0?5:2,'#fff6dc');
  if(index===0){
    ellipse(c,390,354,190,20,'#d3a7b9');line(c,[[252,233],[252,358],[505,358],[505,233]],'#9d738c',9);rounded(c,261,262,236,76,10,'#f9eee6');
    for(let x=278;x<500;x+=28)line(c,[[x,280],[x,350]],'#c996a8',6);
    ellipse(c,370,267,64,32,'#c2b4d5');ellipse(c,369,248,25,25,'#f3cdb7');c.beginPath();c.arc(370,246,22,Math.PI,0);c.fillStyle='#dfabbc';c.fill();line(c,[[356,249],[360,251],[364,249]],'#9c6f80',1.5);line(c,[[376,249],[380,251],[384,249]],'#9c6f80',1.5);
    line(c,[[507,239],[507,108],[419,108]],'#a57d91',5);line(c,[[446,110],[446,148]],'#bd9a99',2);line(c,[[485,110],[485,171]],'#bd9a99',2);star(c,446,163,18,'#e9c28b');star(c,485,187,13,'#eedab1');
    ellipse(c,159,132,43,43,'#fff0d3');ellipse(c,176,118,40,40,colors[index]);rounded(c,115,303,62,40,12,'#dbb9bd');ellipse(c,144,294,23,24,'#e3c6bb');ellipse(c,127,277,9,10,'#e3c6bb');ellipse(c,160,277,9,10,'#e3c6bb');
  }else if(index===1){
    ellipse(c,340,440,470,145,'#aabf91');ellipse(c,100,418,250,100,'#c7d3a9');ellipse(c,600,425,250,115,'#b4c799');ellipse(c,140,109,40,40,'#f7e7b4');
    line(c,[[548,315],[548,196]],'#9b9477',12);ellipse(c,550,171,73,76,'#97af87');ellipse(c,508,200,49,46,'#a4bc8e');ellipse(c,587,207,50,43,'#a4bc8e');
    smallPerson(c,316,303,1.2);line(c,[[352,283],[408,174],[468,128]],'#9b8b8d',2);c.beginPath();c.moveTo(467,74);c.lineTo(500,116);c.lineTo(468,153);c.lineTo(439,112);c.closePath();c.fillStyle='#d99cb7';c.fill();line(c,[[468,79],[468,148]],'#f4d7da',2);line(c,[[440,112],[497,116]],'#f4d7da',2);line(c,[[468,153],[460,174],[472,192]],'#e4bdc9',3);
    for(let j=0;j<12;j++){const x=68+j*49,y=340+(j%3)*13;line(c,[[x,y],[x,y+14]],'#7c9c74',2);ellipse(c,x,y,4,4,j%2?'#efc9cd':'#f8e7b0');}
  }else if(index===2){
    rounded(c,86,68,220,145,8,'#f7edd7','#bdab8a');line(c,[[194,69],[194,212]],'#cdbd9c',5);line(c,[[87,141],[305,141]],'#cdbd9c',5);ellipse(c,122,108,23,23,'#eac784');
    rounded(c,393,60,220,133,6,'#7a9687','#b6aa8e');c.fillStyle='#e7e6cd';c.font='italic 25px Georgia';c.fillText('a little dream',424,115);star(c,553,148,17,'#d5d8b4');
    smallPerson(c,356,260,1.2);rounded(c,220,296,300,18,4,'#ae8c74');line(c,[[244,313],[240,385]],'#997a66',9);line(c,[[497,313],[503,385]],'#997a66',9);
    c.beginPath();c.moveTo(313,280);c.quadraticCurveTo(339,273,362,282);c.quadraticCurveTo(388,271,411,278);c.lineTo(411,299);c.quadraticCurveTo(385,293,362,302);c.quadraticCurveTo(335,294,313,299);c.closePath();c.fillStyle='#fff4dc';c.fill();line(c,[[362,283],[362,300]],'#d8c9aa',1);
    rounded(c,461,266,38,30,3,'#b2bd9b');line(c,[[468,267],[466,239]],'#c68b9a',4);line(c,[[480,267],[483,241]],'#b3976c',4);rounded(c,144,272,56,12,2,'#c48d9a');rounded(c,149,260,49,11,2,'#b3bf9a');
  }else if(index===3){
    rounded(c,390,60,200,236,95,'#484160','#b8a2bd');ellipse(c,535,108,25,25,'#eedcbb');ellipse(c,546,100,24,24,'#484160');for(let j=0;j<12;j++)star(c,410+(j*47)%160,87+(j*31)%150,j%3?2:5,'#eddbb8');
    rounded(c,99,286,211,100,12,'#9c85ac');rounded(c,119,264,55,37,9,'#e4bdc8');smallPerson(c,248,292,1.3);
    line(c,[[320,312],[406,312]],'#dbc5cc',4);rounded(c,350,289,32,21,4,'#d6b3c3');c.beginPath();c.arc(385,298,8,-1.7,1.7);c.strokeStyle='#d6b3c3';c.stroke();
    rounded(c,115,88,82,102,2,'#e5cfce');c.fillStyle='#a3819f';c.font='16px Georgia';c.fillText('dream',132,125);c.fillText('a little',130,150);star(c,155,169,12,'#bb96ae');
  }else if(index===4){
    ellipse(c,110,125,43,43,'#f6e6bd');c.beginPath();c.moveTo(25,240);c.lineTo(175,114);c.lineTo(328,263);c.lineTo(460,146);c.lineTo(695,260);c.lineTo(695,390);c.lineTo(25,390);c.fillStyle='#a4bfb8';c.fill();
    c.beginPath();c.moveTo(25,313);c.quadraticCurveTo(228,190,361,270);c.quadraticCurveTo(490,310,695,253);c.lineTo(695,390);c.lineTo(25,390);c.fillStyle='#86a59d';c.fill();
    c.beginPath();c.moveTo(277,390);c.quadraticCurveTo(470,298,392,252);c.quadraticCurveTo(521,300,397,390);c.fillStyle='#deceb4';c.fill();
    smallPerson(c,343,286,1.35);rounded(c,309,266,27,38,7,'#b28b9d');line(c,[[310,270],[306,241]],'#e2c4b4',3);
    for(let j=0;j<6;j++){let x=70+j*100;line(c,[[x,344],[x+3,305]],'#577f72',3);ellipse(c,x-7,315,11,5,'#6e9280');ellipse(c,x+9,326,11,5,'#6e9280');}
  }else{
    ellipse(c,356,243,158,120,'#e2b8c6');ellipse(c,356,251,123,92,'#edcbd1');for(let j=0;j<10;j++){const a=j/10*Math.PI*2;star(c,356+Math.cos(a)*195,230+Math.sin(a)*132,j%2?7:12,'#fff0ca');}
    smallPerson(c,354,265,1.7);c.fillStyle='#a56c87';c.font='italic 36px Georgia';c.fillText('hello, 22',490,333);line(c,[[100,335],[188,335]],'#c59b9f',2);star(c,143,290,26,'#f3dfbc');
  }
  c.restore();c.fillStyle='#715966';c.font='21px Georgia';c.fillText(chapters[index].label,35,435);c.fillStyle='#a28189';c.font='14px Arial';c.textAlign='right';c.fillText(chapters[index].year,682,435);c.textAlign='left';return surface;
}
const memoryArt=chapters.map((_,i)=>makeMemory(i));
const stars=Array.from({length:220},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.2+.25,phase:Math.random()*7,z:Math.random()*1600}));
function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);}
resize();window.addEventListener('resize',resize);
function drawBackground(t){
  const bg=ctx.createRadialGradient(width*.57,height*.46,0,width*.5,height*.5,Math.max(width,height)*.8);
  if(scene==='finale'){bg.addColorStop(0,'#120d1d');bg.addColorStop(.6,'#06050c');bg.addColorStop(1,'#020205');}
  else if(scene==='party'){bg.addColorStop(0,'#39233d');bg.addColorStop(.55,'#21172b');bg.addColorStop(1,'#100d1a');}
  else{bg.addColorStop(0,'#2b203c');bg.addColorStop(.55,'#191628');bg.addColorStop(1,'#0d0c17');}
  ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
  for(const s of stars){const alpha=reduced?.5:.3+.35*(Math.sin(t*.4+s.phase)+1)/2;ctx.fillStyle=`rgba(233,210,229,${alpha})`;ctx.beginPath();ctx.arc(s.x*width,s.y*height,s.r,0,Math.PI*2);ctx.fill();}
  // Soft nebula clouds: no full-screen flashes.
  const cloud=ctx.createRadialGradient(width*.76,height*.43,0,width*.76,height*.43,width*.43);cloud.addColorStop(0,scene==='finale'?'#8c3d6c13':'#c27da518');cloud.addColorStop(1,'#a977c000');ctx.fillStyle=cloud;ctx.fillRect(0,0,width,height);
}
function drawTunnel(t){
  const mobile=width<701,cx=width*(mobile?.5:.57),cy=height*(mobile?.37:.43),depthMotion=reduced?activeChapter*170:elapsed*65;
  ctx.save();
  for(let i=24;i>=0;i--){let z=((i*110-depthMotion)%2750+2750)%2750+55;let perspective=700/(z+120),rx=width*.49*perspective,ry=height*.49*perspective;
    ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,Math.sin(i*.3)*.018,0,Math.PI*2);ctx.strokeStyle=`rgba(${i%3===0?'225,175,202':'142,126,187'},${Math.min(.28,perspective*.13)})`;ctx.lineWidth=perspective*.8+.3;ctx.stroke();
    if(i%3===0){ctx.beginPath();ctx.ellipse(cx,cy,rx*.994,ry*.994,0,0,Math.PI*2);ctx.strokeStyle='#f4c49c10';ctx.lineWidth=3*perspective;ctx.stroke();}
  }
  // Vanishing-point floor rails.
  for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+i*width*.17,height+50);ctx.strokeStyle='#c294b213';ctx.lineWidth=1;ctx.stroke();}
  for(let i=0;i<50;i++){const s=stars[i],z=((s.z-depthMotion*.5)%1600+1600)%1600+120,k=500/z,x=cx+(s.x-.5)*width*k,y=cy+(s.y-.5)*height*k;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(x-cx)*.012,y+(y-cy)*.012);ctx.strokeStyle='#efccdc55';ctx.lineWidth=.8;ctx.stroke();}
  const fraction=(elapsed%CHAPTER_SECONDS)/CHAPTER_SECONDS;
  const pictureWidth=mobile?Math.min(width*.72,310):Math.min(width*.29,440),pictureHeight=pictureWidth*490/720;
  const fade=paused?1:Math.min(1,fraction*6+.65,(1-fraction)*6+.65);
  const x=mobile?width*.5:width*.785,y=mobile?height*.32:height*.43;
  ctx.save();ctx.translate(x,y);ctx.rotate((mobile?-.035:.055)+Math.sin(t*.3)*.007);const scale=.92+fraction*.1;ctx.scale(scale,scale);ctx.globalAlpha=fade;
  ctx.shadowColor='#d8a5c03b';ctx.shadowBlur=30;ctx.drawImage(memoryArt[Math.max(0,activeChapter)],-pictureWidth/2,-pictureHeight/2,pictureWidth,pictureHeight);ctx.shadowBlur=0;
  ctx.restore();
  // Distant memories give the tunnel depth before they become the current scene.
  if(activeChapter<5&&!mobile){ctx.save();ctx.globalAlpha=.22;let w=pictureWidth*.32;ctx.translate(cx+width*.14,cy-height*.19);ctx.rotate(-.08);ctx.drawImage(memoryArt[activeChapter+1],-w/2,-w*.34,w,w*490/720);ctx.restore();}
  ctx.restore();
}
function drawAmbient(t){
  if(scene==='journey')return;
  for(let i=0;i<18;i++){const s=stars[i],x=s.x*width+Math.sin(t*.12+s.phase)*20,y=(s.y*height-(reduced?0:t*4))%height;ctx.save();ctx.globalAlpha=.08+Math.sin(t*.6+s.phase)*.04;ellipse(ctx,x,y<0?y+height:y,2+s.r*2,2+s.r*2,i%2?'#e8b4cf':'#e9ca9c');ctx.restore();}
  if(scene==='door'){ctx.save();ctx.strokeStyle='#e0bcd018';ctx.lineWidth=1;const floorY=height*.79;for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(width/2,floorY+i*23,70+i*40,5+i*6,0,0,Math.PI*2);ctx.stroke();}ctx.restore();}
}
function launchFirework(x,y){
  if(scene!=='finale')return;
  if(reduced){for(let i=0;i<9;i++)particles.push({x:x+(Math.random()-.5)*110,y:y+(Math.random()-.5)*80,vx:0,vy:0,life:1.8,max:1.8,color:'#e9b8d0',size:2});return;}
  rockets.push({x,y:height+10,targetY:y,vx:(Math.random()-.5)*.7,color:['#efb7cf','#e8ce9b','#b8a5e6','#b4d8c3'][Math.floor(Math.random()*4)],trail:[]});
}
function explode(x,y,color){
  const count=width<700?55:85;
  for(let i=0;i<count;i++){const angle=i/count*Math.PI*2,speed=35+Math.random()*100;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1.6+Math.random()*1,max:2.6,color,size:Math.random()*1.5+.7});}
  if(soundOn)boom();
}
function boom(){if(!audio||!soundOn)return;const count=Math.floor(audio.sampleRate*.18),buffer=audio.createBuffer(1,count,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<count;i++)data[i]=(Math.random()*2-1)*(1-i/count);const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();filter.type='lowpass';filter.frequency.value=220;gain.gain.value=.075;source.buffer=buffer;source.connect(filter);filter.connect(gain);gain.connect(audio.destination);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};}
function drawFireworks(dt){
  nextRocket-=dt;if(nextRocket<=0&&!letter.open){launchFirework(width*(.08+Math.random()*.84),height*(.12+Math.random()*.36));nextRocket=reduced?3.5:1.2+Math.random()*1.2;}
  for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.trail.push({x:r.x,y:r.y});if(r.trail.length>10)r.trail.shift();r.y-=260*dt;r.x+=r.vx*dt*30;ctx.save();ctx.strokeStyle=r.color;ctx.globalAlpha=.6;ctx.lineWidth=1.3;ctx.beginPath();r.trail.forEach((p,j)=>j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore();if(r.y<=r.targetY){explode(r.x,r.y,r.color);rockets.splice(i,1);}}
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue;}if(!reduced){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=28*dt;p.vx*=1-dt*.5;}ctx.save();ctx.globalAlpha=Math.min(1,p.life/.7)*.8;ctx.fillStyle=p.color;ctx.shadowBlur=reduced?0:6;ctx.shadowColor=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();ctx.restore();}
}
let renderFrame;
function frame(now){
  const dt=document.hidden?0:Math.min((now-lastTime)/1000,.05);lastTime=now;sceneTime+=dt;
  if(scene==='journey'&&!paused){elapsed+=dt;if(elapsed>=chapters.length*CHAPTER_SECONDS)setScene('door');else updateChapter();}
  if(scene==='journey')$('timeline-fill').style.width=`${Math.min(100,elapsed/(CHAPTER_SECONDS*6)*100)}%`;
  if(scene==='party'&&!blown){holdProgress=held?Math.min(1,holdBase+(now-holdStarted)/3200):Math.max(0,holdProgress-dt*.45);updateHoldUI();if(holdProgress>=1)extinguish();}
  if(ctx){drawBackground(now/1000);if(scene==='journey')drawTunnel(now/1000);else drawAmbient(now/1000);if(scene==='finale')drawFireworks(dt);}
  renderFrame=requestAnimationFrame(frame);
}
renderFrame=requestAnimationFrame(frame);

