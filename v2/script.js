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

// During the journey the same girl is seen from behind, walking into the tube.
document.querySelector('.travel-avatar').innerHTML=`<svg viewBox="0 0 220 350" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="back-dress" x2="1" y2="1"><stop stop-color="#e3a5c0"/><stop offset="1" stop-color="#a96791"/></linearGradient></defs><g class="leg-left"><path d="M86 240l-3 65q6 10 16 0l7-65" fill="#ebc5b6"/><path d="m82 298-4 18q-1 9 24 5l1-20" fill="#ede3e1" stroke="#a98ba4" stroke-width="2"/></g><g class="leg-right"><path d="M117 240l5 65q7 9 16-1l-2-65" fill="#ebc5b6"/><path d="m121 300-1 21q26 6 25-4l-8-19" fill="#ede3e1" stroke="#a98ba4" stroke-width="2"/></g><g class="arm-left"><path d="m80 153-13 40-1 36q5 12 13 0l1-30 16-35" fill="#efc9b8"/><path d="m81 150-15 21 17 12 14-24" fill="#cd91ac"/></g><g class="arm-right"><path d="m138 153 15 40 2 37q-5 11-13 0l-2-31-17-35" fill="#efc9b8"/><path d="m137 150 16 21-17 12-14-24" fill="#cd91ac"/></g><path d="M82 147q28-12 55 0l13 37-5 17 18 53q-52 27-102 0l18-54-7-16z" fill="url(#back-dress)" stroke="#af7092" stroke-width="1.5"/><path d="M80 199q31 9 66 0" stroke="#f2c3d6" stroke-width="5" fill="none"/><path d="M111 183v66" stroke="#edb8ce" stroke-width="1.5"/><path d="m111 200-17 10 18-3 15 9-4-17" fill="#f4c5d7"/><path d="M57 91Q46 33 109 29q64-2 56 65l8 80q-18 19-46 10l-7-37-7 39q-40 11-64-13z" fill="#3c2c40" stroke="#76506c" stroke-width="1"/><path d="M72 77q-10 56-4 89m23-116q-6 72-1 116m43-117q17 65 10 119m-32-118 2 105" fill="none" stroke="#61435a" stroke-width="3" opacity=".8"/><g transform="translate(144 71) rotate(13)"><path d="M0 0Q-25-22-21 3-17 17 0 7Q26 24 22-1 19-15 0 0" fill="#e6b0c9"/><ellipse cx="0" cy="4" rx="5" ry="6" fill="#f6d2df"/><path d="m-4 7-7 22 11-9 10 9-4-23" fill="#dba0bf"/></g></svg>`;

// Head turns expose a three-quarter face, with chapter-specific expressions.
const travelerHead=document.createElementNS('http://www.w3.org/2000/svg','g');
travelerHead.id='traveler-head';
travelerHead.innerHTML=`<g class="head-back"><path d="M57 91Q46 33 109 29q64-2 56 65l8 80q-18 19-46 10l-7-37-7 39q-40 11-64-13z" fill="#3c2c40" stroke="#76506c"/><path d="M72 77q-10 56-4 89m23-116q-6 72-1 116m43-117q17 65 10 119m-32-118 2 105" fill="none" stroke="#61435a" stroke-width="3"/><g transform="translate(144 71) rotate(13)"><path d="M0 0Q-25-22-21 3-17 17 0 7Q26 24 22-1 19-15 0 0" fill="#e6b0c9"/><circle cy="4" r="5" fill="#f6d2df"/></g></g><g class="head-looking"><g class="look-direction"><path d="M61 92Q47 32 112 29q62 2 53 67l8 78q-36 22-65 8l-4-43-17 39-33-10z" fill="#3c2c40" stroke="#80516d"/><path d="M88 61q-32 3-33 39l-8 12 9 6q6 25 30 26 27-5 32-38l-2-30z" fill="#f4cdbb" stroke="#d5a599" stroke-width="1"/><path d="M53 96q-8-51 44-56 31-3 43 31l-17 34-17-36q-17 26-53 27" fill="#463044"/><path d="M120 70q-7 62 7 105l38-4-6-80" fill="#3c2c40"/><path d="M136 77q13 46 9 86" fill="none" stroke="#65405a" stroke-width="3"/><ellipse cx="60" cy="120" rx="7" ry="4" fill="#e99daa" opacity=".7"/><ellipse cx="102" cy="117" rx="7" ry="4" fill="#e99daa" opacity=".6"/><g id="traveler-expression"></g><g transform="translate(147 70) rotate(15)"><path d="M0 0Q-23-23-21 3-17 17 0 7Q25 24 22-1 20-15 0 0" fill="#e6b0c9"/><circle cy="4" r="5" fill="#f6d2df"/><path d="m-3 8-6 17 9-6 10 8-4-20" fill="#dba0bf"/></g></g></g>`;
const travelSvg=document.querySelector('.travel-avatar svg');
// Keep dress, arms and legs; replace only the old rear hair and bow.
while(travelSvg.children.length>8)travelSvg.lastElementChild.remove();
// Remove the original hair and bow even if the SVG structure changes.
[...travelSvg.children].filter(el=>el.tagName==='path'&&el.getAttribute('d')?.startsWith('M57 91')).forEach(el=>el.remove());
travelSvg.append(travelerHead);
const headBack=travelerHead.querySelector('.head-back');
const headLooking=travelerHead.querySelector('.head-looking');
const lookDirection=travelerHead.querySelector('.look-direction');
const thought=document.createElement('span');thought.className='traveler-thought';thought.setAttribute('aria-hidden','true');document.querySelector('.traveler').append(thought);
const reactions=[
  {text:'Bé xíu thế này thôi ♡',mood:'amazed',eyes:'<ellipse cx="69" cy="104" rx="4.5" ry="6"/><ellipse cx="93" cy="100" rx="4.5" ry="6"/>',mouth:'<ellipse cx="76" cy="128" rx="4" ry="5" fill="#b56c84"/>',brows:'M63 91q5-5 10-2m14-5q5-4 11-1'},
  {text:'Vui quá đi! ✦',mood:'joyful',eyes:'<path d="M64 104q5-8 10-1m14-4q5-8 10-1" fill="none" stroke="#51344a" stroke-width="2.7" stroke-linecap="round"/>',mouth:'<path d="M68 124q10 16 22-3" fill="#c1788b" stroke="#a65e77" stroke-width="1.5"/>',brows:'M63 93q6-4 12-1m12-4q6-4 12 0'},
  {text:'Còn bao điều để khám phá…',mood:'curious',eyes:'<ellipse cx="69" cy="103" rx="4" ry="5.5"/><ellipse cx="93" cy="99" rx="4" ry="5.5"/>',mouth:'<path d="M72 127q6-3 12-2" fill="none" stroke="#b56c84" stroke-width="2"/>',brows:'M63 91q5-5 11-1m13-5q6 0 11 3'},
  {text:'Ước mơ lấp lánh thật đấy ✧',mood:'dreamy',eyes:'<ellipse cx="69" cy="102" rx="4.5" ry="6"/><ellipse cx="93" cy="98" rx="4.5" ry="6"/><path d="m68 98 1 4 3 0-3 1-1 3-1-3-2-1 3-1m24-7 1 4 3 0-3 1-1 3-1-3-2-1 3-1" fill="#fff0c1"/>',mouth:'<path d="M69 125q9 8 18-2" fill="none" stroke="#b56c84" stroke-width="2"/>',brows:'M63 91q6-3 11-1m13-5q6-3 12-1'},
  {text:'Mình làm được mà! ♡',mood:'determined',eyes:'<ellipse cx="69" cy="104" rx="4" ry="5"/><ellipse cx="93" cy="100" rx="4" ry="5"/>',mouth:'<path d="M69 126q10 8 20-3" fill="none" stroke="#b56c84" stroke-width="2.5"/>',brows:'M63 93l12 1m12-4 12-4'},
  {text:'Thương những ngày đã qua ♡',mood:'tender',eyes:'<path d="M63 104q6 6 12-2m12-2q6 6 12-2" fill="none" stroke="#51344a" stroke-width="2.5" stroke-linecap="round"/>',mouth:'<path d="M69 125q9 9 18-2" fill="none" stroke="#b56c84" stroke-width="2"/>',brows:'M63 93q6-5 12-1m12-4q6-5 12-1'}
];
let lastReaction=-1;
function animateTravelerLook(progress){
  const phase=Math.max(0,Math.min(1,elapsed/CHAPTER_SECONDS-activeChapter));
  const index=Math.max(0,activeChapter),side=index%2===0?-1:1;
  const gaze=reduced?.85:Math.min(1,(phase+.055)*7,(1-phase)*6+.2);
  if(lastReaction!==index){
    const r=reactions[index];
    $('traveler-expression').innerHTML=`<g fill="#51344a" class="reaction-eyes">${r.eyes}<circle cx="70" cy="101" r="1.2" fill="#fff8ec"/><circle cx="94" cy="97" r="1.2" fill="#fff8ec"/></g><path d="${r.brows}" stroke="#725064" fill="none" stroke-width="1.8" stroke-linecap="round"/>${r.mouth}`;
    thought.textContent=r.text;thought.dataset.mood=r.mood;lastReaction=index;
  }
  headBack.style.opacity=String(1-gaze);
  headLooking.style.opacity=String(gaze);
  lookDirection.setAttribute('transform',side<0?'':'translate(220 0) scale(-1 1)');
  travelerHead.setAttribute('transform',`translate(${side*gaze*3} ${-gaze*5}) rotate(${-side*gaze*10} 110 145)`);
  thought.style.opacity=String(Math.max(0,(gaze-.35)*1.55));
  thought.style.translate=`${side*(width<701?50:65)}px ${-gaze*5}px`;
  document.querySelector('.traveler').dataset.expression=reactions[index].mood;
  document.querySelector('.travel-avatar').style.rotate=`${side*gaze*1.5}deg`;
}

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
  if(next==='finale'){particles=[];rockets=[];confetti=[];confettiClock=0;launchConfetti();nextRocket=.1;[.2,.65,1.1].forEach((delay,i)=>setTimeout(()=>{if(scene==='finale')launchFirework(width*(.2+i*.3),height*(.2+(i%2)*.09));},delay*1000));playChime();}
}
function updateChapter(force=false){
  const index=Math.min(5,Math.floor((elapsed+1e-7)/CHAPTER_SECONDS));
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
$('more-fireworks').addEventListener('click',()=>{launchConfetti();for(let i=0;i<4;i++)setTimeout(()=>{if(scene==='finale')launchFirework(width*(.15+i*.23),height*(.14+Math.random()*.22));},i*240);playChime();});

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
// Pinhole projection inside a finite circular cylinder. Memories stay fixed on
// the walls in world space; the camera and the rear-facing traveler advance.
function tunnelView(){
  const mobile=width<701;
  const progress=Math.min(1,Math.max(0,elapsed/(CHAPTER_SECONDS*6)));
  const view={mobile,progress,camera:progress*4700,cx:width*.5,cy:height*(mobile?.365:.405),focal:mobile?width*1.12:Math.min(width*.7,height*.96),radius:340};
  view.project=(x,y,z)=>{const d=z-view.camera;const k=view.focal/Math.max(35,d);return{x:view.cx+x*k,y:view.cy+y*k,k,d};};
  return view;
}
function texturedTriangle(image,source,destination){
  const [a,b,c]=source,[p,q,r]=destination;
  const det=a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y);
  if(Math.abs(det)<.00001)return;
  const transform=key=>[
    (p[key]*(b.y-c.y)+q[key]*(c.y-a.y)+r[key]*(a.y-b.y))/det,
    (p[key]*(c.x-b.x)+q[key]*(a.x-c.x)+r[key]*(b.x-a.x))/det,
    (p[key]*(b.x*c.y-c.x*b.y)+q[key]*(c.x*a.y-a.x*c.y)+r[key]*(a.x*b.y-b.x*a.y))/det
  ];
  const x=transform('x'),y=transform('y');
  ctx.save();ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineTo(r.x,r.y);ctx.closePath();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(image,0,0);ctx.restore();
}
function drawWallMemory(view,index){
  const centerZ=1100+index*780;
  const relative=centerZ-view.camera;
  if(relative<310||relative>5900)return;
  const side=index%2===0?-1:1;
  const wallX=side*view.radius*.89;
  const depth=590,halfHeight=128,centerY=5;
  // A flat framed picture lies along the side wall, so its nearer edge is
  // larger and farther from the vanishing point than its far edge.
  const zAt=u=>centerZ+(side<0?u-.5:.5-u)*depth;
  const corners=[view.project(wallX,centerY-halfHeight,zAt(0)),view.project(wallX,centerY-halfHeight,zAt(1)),view.project(wallX,centerY+halfHeight,zAt(1)),view.project(wallX,centerY+halfHeight,zAt(0))];
  const opacity=Math.min(1,(relative-310)/120,Math.max(.22,1-(relative-600)/6500));
  ctx.save();ctx.globalAlpha=opacity;
  ctx.beginPath();corners.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle='#f2d8d7';ctx.shadowColor=index===activeChapter?'#e6b6ca88':'#b2a0d333';ctx.shadowBlur=index===activeChapter?20:8;ctx.fill();ctx.shadowBlur=0;
  const image=memoryArt[index],strips=12;
  for(let j=0;j<strips;j++){
    const u0=j/strips,u1=(j+1)/strips;
    const top0=view.project(wallX,centerY-halfHeight,zAt(u0)),top1=view.project(wallX,centerY-halfHeight,zAt(u1));
    const bottom0=view.project(wallX,centerY+halfHeight,zAt(u0)),bottom1=view.project(wallX,centerY+halfHeight,zAt(u1));
    const sx0=u0*image.width,sx1=u1*image.width;
    texturedTriangle(image,[{x:sx0,y:0},{x:sx1,y:0},{x:sx1,y:image.height}],[top0,top1,bottom1]);
    texturedTriangle(image,[{x:sx0,y:0},{x:sx1,y:image.height},{x:sx0,y:image.height}],[top0,bottom1,bottom0]);
  }
  ctx.beginPath();corners.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.strokeStyle=index===activeChapter?'#fff0d6':'#c5a9c6';ctx.lineWidth=index===activeChapter?2:1;ctx.stroke();
  const label=view.project(side*view.radius*.88,centerY+halfHeight+32,centerZ);
  ctx.fillStyle='#ead1cc';ctx.font=`${Math.max(7,Math.min(16,19*label.k))}px Georgia`;ctx.textAlign='center';ctx.fillText(chapters[index].year,label.x,label.y);ctx.restore();
}
function drawTunnel(t){
  const view=tunnelView();
  const {camera,cx,cy,focal,radius,progress,mobile}=view;
  ctx.save();
  // A physical tube: equal X/Y radius, shaded curved walls, circular ribs,
  // longitudinal seams, and a walkway cut across the bottom of the cylinder.
  const far=5500;
  const near=camera+125;
  const slices=56;
  for(let i=0;i<slices;i++){
    const a=i/slices*Math.PI*2,b=(i+1)/slices*Math.PI*2;
    const points=[view.project(Math.cos(a)*radius,Math.sin(a)*radius,near),view.project(Math.cos(b)*radius,Math.sin(b)*radius,near),view.project(Math.cos(b)*radius,Math.sin(b)*radius,far),view.project(Math.cos(a)*radius,Math.sin(a)*radius,far)];
    const light=Math.max(0,Math.sin(a))*.55+(Math.cos(a*2)+1)*.12;
    ctx.beginPath();points.forEach((p,j)=>j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=`rgb(${23+light*10},${20+light*8},${39+light*18})`;ctx.fill();
  }
  // The end is visible from the entrance and grows as Huệ approaches it.
  const end=view.project(0,0,far),reveal=.12+.88*Math.pow(progress,3),endRadius=radius*end.k*reveal;
  const exitGlow=ctx.createRadialGradient(cx,cy,0,cx,cy,endRadius*1.7);
  exitGlow.addColorStop(0,'#f6d5bd45');exitGlow.addColorStop(.45,'#c68ea441');exitGlow.addColorStop(1,'#b88ab400');ctx.fillStyle=exitGlow;ctx.fillRect(cx-endRadius*1.7,cy-endRadius*1.7,endRadius*3.4,endRadius*3.4);
  ctx.beginPath();ctx.arc(cx,cy,endRadius,0,Math.PI*2);ctx.fillStyle='#443345';ctx.fill();ctx.strokeStyle='#edc7b7';ctx.lineWidth=2;ctx.stroke();
  const doorW=radius*.35*end.k*reveal,doorH=radius*.85*end.k*reveal;
  rounded(ctx,cx-doorW/2,cy+radius*.67*end.k*reveal-doorH,doorW,doorH,[doorW/2,doorW/2,0,0],'#b9909644','#eac4b4');
  line(ctx,[[cx,cy+radius*.67*end.k*reveal-doorH],[cx,cy+radius*.67*end.k*reveal]],'#e5b9b7',Math.max(.5,end.k));
  if(progress>.65&&endRadius>35){ctx.fillStyle='#e8c0ae';ctx.textAlign='center';ctx.font=`${Math.max(7,10*end.k)}px Arial`;ctx.fillText('2026',cx,cy-endRadius*.58);}
  // Finite, fixed ribs (no recycled ring animation).
  for(let z=far;z>camera+150;z-=260){
    const ring=view.project(0,0,z),r=radius*ring.k;
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle=`rgba(172,141,187,${Math.min(.43,.13+ring.k*.08)})`;ctx.lineWidth=Math.min(4,ring.k*1.4);ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,r+3*ring.k,0,Math.PI*2);ctx.strokeStyle='#e7c4d01b';ctx.lineWidth=Math.max(.5,ring.k*.5);ctx.stroke();
    for(const angle of [Math.PI*.15,Math.PI*.85,Math.PI*1.15,Math.PI*1.85]){
      const p=view.project(Math.cos(angle)*radius*.98,Math.sin(angle)*radius*.98,z);
      ctx.save();ctx.shadowColor='#efc39e';ctx.shadowBlur=Math.min(12,p.k*5);ellipse(ctx,p.x,p.y,Math.max(.6,2*p.k),Math.max(.6,2*p.k),'#edc0a1');ctx.restore();
    }
  }
  for(let a=0;a<Math.PI*2;a+=Math.PI/8){
    const p=view.project(Math.cos(a)*radius,Math.sin(a)*radius,near),q=view.project(Math.cos(a)*radius,Math.sin(a)*radius,far);
    line(ctx,[[p.x,p.y],[q.x,q.y]],'#b38fad25',1);
  }
  // Walkway converges on the real exit, including center line and fixed steps.
  const floor=radius*.7;
  const runway=[view.project(-radius*.68,floor,near),view.project(radius*.68,floor,near),view.project(radius*.68,floor,far),view.project(-radius*.68,floor,far)];
  ctx.beginPath();runway.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle='#332c4455';ctx.fill();
  for(const x of [-radius*.68,radius*.68]){const p=view.project(x,floor,near),q=view.project(x,floor,far);line(ctx,[[p.x,p.y],[q.x,q.y]],'#e9bfcd70',1.5);}
  for(let z=far;z>camera+150;z-=145){const p=view.project(-radius*.68,floor,z),q=view.project(radius*.68,floor,z);line(ctx,[[p.x,p.y],[q.x,q.y]],'#e7bfda18',Math.max(.5,p.k));}
  // Earlier memories sit near the entrance, recent ones near the exit.
  for(let i=chapters.length-1;i>=0;i--)drawWallMemory(view,i);
  const relative=mobile?550+progress*95:850+progress*130;
  const feet=view.project(0,floor,camera+relative);
  const personHeight=(mobile?210:220)*feet.k;
  const bob=(paused||reduced)?0:Math.sin(elapsed*9)*2;
  const traveler=document.querySelector('.traveler');
  traveler.style.left=`${feet.x}px`;traveler.style.top=`${feet.y-personHeight+bob}px`;traveler.style.width=`${personHeight*220/350}px`;traveler.style.height=`${personHeight}px`;traveler.style.bottom='auto';
  traveler.dataset.distance=String(Math.round(progress*100));
  animateTravelerLook(progress);
  ctx.save();ctx.globalAlpha=.35;ellipse(ctx,feet.x,feet.y+5,personHeight*.24,personHeight*.035,'#e7bad0');ctx.restore();
  // Two glowing footprints follow the moving character, located in world space.
  for(let i=0;i<7;i++){
    const z=camera+relative-90-i*83;if(z<=camera+100)continue;
    const p=view.project((i%2?1:-1)*12,floor+.5,z);
    ctx.save();ctx.globalAlpha=(1-i/7)*.12;ellipse(ctx,p.x,p.y,4*p.k,9*p.k,'#e9bdcf');ctx.restore();
  }
  $('journey-distance').textContent=`${Math.round(progress*100)}%`;
  ctx.restore();
}

function drawAmbient(t){
  if(scene==='journey')return;
  for(let i=0;i<18;i++){const s=stars[i],x=s.x*width+Math.sin(t*.12+s.phase)*20,y=(s.y*height-(reduced?0:t*4))%height;ctx.save();ctx.globalAlpha=.08+Math.sin(t*.6+s.phase)*.04;ellipse(ctx,x,y<0?y+height:y,2+s.r*2,2+s.r*2,i%2?'#e8b4cf':'#e9ca9c');ctx.restore();}
  if(scene==='door'){ctx.save();ctx.strokeStyle='#e0bcd018';ctx.lineWidth=1;const floorY=height*.79;for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(width/2,floorY+i*23,70+i*40,5+i*6,0,0,Math.PI*2);ctx.stroke();}ctx.restore();}
}
const fireworkPalettes=[['#ff55b3','#ffd1ed','#fff4d0'],['#55e7ff','#c1f7ff','#8a9cff'],['#ffd24c','#fff5c4','#ff895b'],['#b889ff','#efc5ff','#ff6bd8'],['#74ffc6','#d4ffe9','#5ed6ff'],['#ff8b53','#ffdc9f','#ff4e88']];
let fireworkCount=0,confetti=[],confettiClock=0;
function launchConfetti(fromTop=false){
  if(reduced)return;
  const count=fromTop?(width<700?22:35):(width<700?120:210);
  const colors=['#ff82ba','#f8d269','#82dbec','#bfa0ff','#a2e3bd','#ffe5cf'];
  for(let i=0;i<count;i++){
    const side=i%2?1:-1;
    confetti.push({x:fromTop?Math.random()*width:(side<0?width*.02:width*.98),y:fromTop?-30:height*.88,vx:fromTop?(Math.random()-.5)*65:-side*(80+Math.random()*Math.min(width*.55,550)),vy:fromTop?40+Math.random()*70:-300-Math.random()*330,size:4+Math.random()*6,rotation:Math.random()*Math.PI*2,spin:(Math.random()-.5)*7,phase:Math.random()*7,color:colors[i%colors.length],life:fromTop?9:7,star:i%9===0});
  }
  if(confetti.length>420)confetti.splice(0,confetti.length-420);
}
function launchFirework(x,y){
  if(scene!=='finale')return;
  const palette=fireworkPalettes[fireworkCount++%fireworkPalettes.length];
  if(reduced){for(let i=0;i<14;i++){const a=i/14*Math.PI*2;particles.push({x:x+Math.cos(a)*60,y:y+Math.sin(a)*60,vx:0,vy:0,life:2.2,max:2.2,color:palette[i%3],size:1.5,trail:[]});}return;}
  const originX=Math.max(0,Math.min(width,x+(Math.random()-.5)*width*.28));
  const flightTime=.7+Math.random()*.3;
  rockets.push({x:originX,y:height+15,targetX:x,targetY:y,vx:(x-originX)/flightTime,vy:(y-height-15)/flightTime,color:palette[0],palette,pattern:['peony','ring','willow','heart'][fireworkCount%4],trail:[]});
}
function explode(x,y,color,palette=[color,'#fff1cb','#ffd1ed'],pattern='peony'){
  const mobile=width<700;
  const radius=Math.min(width,height)*(.33+Math.random()*.14);
  const baseSpeed=radius*.85;
  const layers=pattern==='ring'?3:2;
  const perLayer=mobile?46:88;
  for(let layer=0;layer<layers;layer++){
    for(let i=0;i<perLayer;i++){
      const a=i/perLayer*Math.PI*2+layer*.08;
      let speed=baseSpeed*(layer===0?1:.57),vx,vy,gravity=pattern==='willow'?31:39;
      if(pattern==='heart'&&layer===0){vx=Math.pow(Math.sin(a),3)*speed;vy=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))/16*speed;}
      else{if(pattern!=='ring')speed*=.68+Math.random()*.47;vx=Math.cos(a)*speed;vy=Math.sin(a)*speed;}
      const life=pattern==='willow'?3.8+Math.random()*.8:2.3+Math.random()*1.3;
      particles.push({x,y,vx,vy,life,max:life,color:pattern==='willow'?(layer?'#fff4c5':'#ffd075'):palette[layer%3],size:(mobile?1.1:1.4)+Math.random()*.8,gravity,drag:pattern==='willow'?.27:.48,trail:[],glitter:Math.random()*9});
    }
  }
  // White inner petals make each bloom feel layered and luminous.
  for(let i=0;i<(mobile?16:28);i++){const a=Math.random()*Math.PI*2,v=baseSpeed*.25;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1.5,max:1.5,color:'#fff6df',size:1.1,gravity:18,drag:.6,trail:[],glitter:i});}
  const limit=mobile?1250:2400;if(particles.length>limit)particles.splice(0,particles.length-limit);
  if(soundOn)boom();
}
function drawFireworks(dt){
  if(reduced){confetti=[];rockets=[];}
  nextRocket-=dt;
  if(nextRocket<=0&&!letter.open){
    const count=reduced?1:(width<700?2:3);
    for(let i=0;i<count;i++)launchFirework(width*(.08+(i+Math.random()*.7)/count*.84),height*(.12+Math.random()*.46));
    nextRocket=reduced?3.5:1.25+Math.random()*.7;
  }
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=rockets.length-1;i>=0;i--){
    const r=rockets[i];r.trail.push({x:r.x,y:r.y});if(r.trail.length>13)r.trail.shift();r.x+=r.vx*dt;r.y+=r.vy*dt;
    ctx.strokeStyle=r.color;ctx.lineWidth=1.8;ctx.globalAlpha=.85;ctx.beginPath();r.trail.forEach((p,j)=>j?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
    ctx.fillStyle='#fff6da';ctx.beginPath();ctx.arc(r.x,r.y,2.3,0,Math.PI*2);ctx.fill();
    if(r.y<=r.targetY){explode(r.x,r.y,r.color,r.palette,r.pattern);rockets.splice(i,1);}
  }
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue;}
    if(!reduced){p.trail.push({x:p.x,y:p.y});if(p.trail.length>5)p.trail.shift();p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.gravity||30)*dt;p.vx*=1-dt*(p.drag||.45);p.vy*=1-dt*.12;}
    const fade=Math.min(1,p.life/1.1);const twinkle=p.life<1.2?.65+Math.sin(p.life*24+(p.glitter||0))*.3:1;
    ctx.globalAlpha=fade*twinkle;ctx.strokeStyle=p.color;ctx.fillStyle=p.color;ctx.lineWidth=p.size*.7;
    if(p.trail?.length>1){ctx.beginPath();p.trail.forEach((q,j)=>j?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.lineTo(p.x,p.y);ctx.stroke();}
    ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  confettiClock+=dt;
  if(confettiClock>2.3&&!letter.open){confettiClock=0;launchConfetti(true);}
  for(let i=confetti.length-1;i>=0;i--){
    const p=confetti[i];p.life-=dt;if(p.life<=0||p.y>height+40){confetti.splice(i,1);continue;}
    p.vy+=185*dt;p.vx*=1-dt*.32;p.x+=p.vx*dt+Math.sin(sceneTime*2+p.phase)*11*dt;p.y+=p.vy*dt;p.rotation+=p.spin*dt;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.scale(1,Math.cos(sceneTime*4+p.phase)*.65+.35);ctx.globalAlpha=Math.min(1,p.life);ctx.fillStyle=p.color;
    if(p.star)star(ctx,0,0,p.size*.8,p.color);else ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.6);
    ctx.restore();
  }
}

function boom(){if(!audio||!soundOn)return;const count=Math.floor(audio.sampleRate*.18),buffer=audio.createBuffer(1,count,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<count;i++)data[i]=(Math.random()*2-1)*(1-i/count);const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();filter.type='lowpass';filter.frequency.value=220;gain.gain.value=.075;source.buffer=buffer;source.connect(filter);filter.connect(gain);gain.connect(audio.destination);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};}
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

