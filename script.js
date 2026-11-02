'use strict';

const dialog = document.getElementById('birthday-dialog');
const content = document.getElementById('dialog-content');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let returnFocus = null;
let candlesOut = false;
let giftOpened = false;
let toastTimeout;

function showDialog(markup, opener) {
  returnFocus = opener || document.activeElement;
  content.innerHTML = markup;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
  dialog.querySelector('.close-dialog').focus();
}
function closeDialog() { dialog.close(); }
dialog.querySelector('.close-dialog').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  returnFocus?.focus({preventScroll:true});
});
function toast(text) {
  const el = document.getElementById('toast');
  clearTimeout(toastTimeout);
  el.textContent = text;
  el.classList.add('visible');
  toastTimeout = setTimeout(() => el.classList.remove('visible'), 4000);
}

const letterMarkup = `<div class="dialog-eyebrow">MỘT LÁ THƯ NHỎ · GỬI HUỆ</div><span class="dialog-icon" aria-hidden="true">♡</span><h2 id="dialog-title" class="dialog-title">Chúc mừng sinh nhật,<br>cô gái tháng Mười Một.</h2><div class="dialog-copy"><p>Huệ à,</p><p>Chúc cậu tuổi 22 có thật nhiều ngày thức dậy với một điều để mong chờ, một người để sẻ chia và một lý do thật nhỏ để mỉm cười.</p><p>Mong những cố gắng âm thầm của cậu sẽ được đền đáp. Mong những điều làm cậu bận lòng sẽ nhẹ đi. Và mong cậu luôn nhớ: cậu xứng đáng được yêu thương, ngay cả vào những ngày cậu thấy mình chưa đủ tốt.</p><p>Cứ lớn lên theo nhịp của riêng mình nhé. Không cần hoàn hảo, chỉ cần hạnh phúc và luôn là Huệ.</p><p>Chúc mọi điều dịu dàng nhất sẽ tìm đến cậu. ♡</p></div><button class="button primary" data-action="wish">Đến lúc ước một điều <span>✧</span></button>`;

function showLetter(opener) { showDialog(letterMarkup, opener); }
function showGift(opener) {
  if (giftOpened) { showLetter(opener); return; }
  showDialog(`<div class="dialog-eyebrow">CÓ MỘT MÓN QUÀ ĐANG ĐỢI</div><h2 id="dialog-title" class="dialog-title">Huệ ơi,<br>món này là của cậu.</h2><p class="dialog-copy">Không cần đoán đâu. Cứ mở ra nhé!</p><button class="present-large" data-action="unwrap" aria-label="Mở hộp quà"><span class="small-gift" aria-hidden="true"><span class="gift-bow">୨୧</span><span class="gift-box"></span></span></button><button class="button primary" data-action="unwrap">Mở quà thôi <span>♡</span></button><p class="dialog-footnote">Được gói bằng một chút dễ thương và rất nhiều lời chúc.</p>`, opener);
}
function showWish(opener) {
  showDialog(`<div class="dialog-eyebrow">MỘT ĐIỀU ƯỚC CHO TUỔI MỚI</div><h2 id="dialog-title" class="dialog-title">${candlesOut ? 'Ước thêm một điều nhé.' : 'Nhắm mắt một chút nhé.'}</h2><span class="mini-cake" aria-hidden="true">🎂</span><p class="dialog-copy">Hít một hơi, nghĩ đến điều cậu thật sự mong muốn.<br>Rồi gửi điều ước ấy đến một năm mới thật xinh.</p><label class="wish-field" for="wish-text">Viết điều ước, hoặc giữ riêng trong lòng (không bắt buộc)</label><textarea id="wish-text" class="wish-input" maxlength="300" placeholder="Tuổi mới, mình mong…"></textarea><p class="dialog-footnote">Điều ước chỉ ở trên trang này, không được gửi đi hay lưu lại.</p><button class="button primary" data-action="blow">${candlesOut ? 'Gửi thêm một điều ước' : 'Ước xong rồi, thổi nến thôi'} <span>✧</span></button>`, opener);
}
const luckyMessages = [
  'Một điều cậu đang mong, biết đâu sắp đến thật gần. ♡',
  'Hôm nay, cho phép mình nhận thật nhiều yêu thương nhé.',
  'Mong cậu gặp những người khiến mình được là chính mình.',
  'Một buổi chiều bình yên, một món ngon, một tin nhắn vui. Đều dành cho cậu.',
  'Cậu không cần rực rỡ mỗi ngày để vẫn là một người rất đáng quý.',
  'Mong năm nay cậu có thêm một chuyến đi thật đẹp và thật nhiều lần cười nghiêng ngả.',
  'Những bước nhỏ vẫn đưa cậu đến những điều lớn lao. Cứ tin mình nhé.',
  'Một chiếc ôm thật ấm, gửi đến cô gái tháng Mười Một. ♡'
];
let lastLucky = -1;
function showLucky(opener) {
  let next;
  do { next = Math.floor(Math.random() * luckyMessages.length); } while (next === lastLucky);
  lastLucky = next;
  showDialog(`<div class="dialog-eyebrow">MỘT CHÚT MAY MẮN VỪA GHÉ QUA</div><span class="dialog-icon" aria-hidden="true">✧</span><h2 id="dialog-title" class="dialog-title">Niềm vui của Huệ hôm nay</h2><p class="lucky-message">${luckyMessages[next]}</p><button class="button primary" data-action="lucky">Thêm một lời nhắn nữa <span>↻</span></button><p class="dialog-footnote">Một lời chúc nho nhỏ, không phải lời tiên đoán đâu nha.</p>`, opener);
}
document.getElementById('open-gift').addEventListener('click', event => showGift(event.currentTarget));
document.getElementById('open-letter').addEventListener('click', event => showLetter(event.currentTarget));
document.getElementById('open-wish').addEventListener('click', event => showWish(event.currentTarget));
document.getElementById('open-lucky').addEventListener('click', event => showLucky(event.currentTarget));
content.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  const opener = returnFocus;
  if (action === 'unwrap') { giftOpened = true; showLetter(opener); playChime(); }
  if (action === 'wish') showWish(opener);
  if (action === 'lucky') { showLucky(opener); playChime(); }
  if (action === 'blow') {
    candlesOut = true;
    document.body.classList.add('candles-out');
    content.querySelector('textarea').value = '';
    closeDialog();
    burstConfetti();
    playChime();
    toast('Nến đã tắt. Mong điều ước của Huệ sẽ thành hiện thực! ♡');
  }
});
document.getElementById('celebrate-again').addEventListener('click', () => {
  burstConfetti();
  playChime();
  toast('Chúc mừng sinh nhật Huệ! Một tuổi mới thật xinh nhé ♡');
});

// Birthday milestone: 5 November 2026, midnight in Viet Nam (UTC+7).
// After that date, the page keeps its birthday greeting instead of a negative timer.
const birthdayStart = Date.parse('2026-11-05T00:00:00+07:00');
let countdownInterval;
function updateCountdown() {
  const remaining = birthdayStart - Date.now();
  const numbers = document.getElementById('countdown-numbers');
  if (remaining <= 0) {
    document.querySelector('.countdown-label').textContent = 'MỘT TUỔI MỚI, THẬT NHIỀU YÊU THƯƠNG';
    numbers.innerHTML = '<span class="birthday-now">Happy 22nd birthday, Huệ! ♡</span>';
    if (countdownInterval) clearInterval(countdownInterval);
    return;
  }
  const total = Math.floor(remaining / 1000);
  const units = [[Math.floor(total / 86400), 'ngày'], [Math.floor(total / 3600) % 24, 'giờ'], [Math.floor(total / 60) % 60, 'phút'], [total % 60, 'giây']];
  numbers.innerHTML = units.map(([value, label]) => `<div class="countdown-unit"><strong>${String(value).padStart(2, '0')}</strong><span>${label}</span></div>`).join('');
}
updateCountdown();
if (Date.now() < birthdayStart) countdownInterval = setInterval(updateCountdown, 1000);

// Small self-composed music loop; sound starts only after an explicit button press.
let audioContext;
let musicTimer;
let musicOn = false;
let noteIndex = 0;
const melody = [72,76,79,76,74,77,81,77,72,76,79,83,81,79,76,null,69,72,76,72,71,74,77,74,67,71,74,79,76,74,72,null];
function tone(midi, duration, volume = .06) {
  if (!audioContext || audioContext.state !== 'running') return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
  const now = audioContext.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + .02);
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + .05);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
function stopMusic() {
  clearInterval(musicTimer);
  musicOn = false;
  document.getElementById('sound-toggle').setAttribute('aria-pressed', 'false');
  document.getElementById('sound-toggle').setAttribute('aria-label', 'Bật nhạc nhẹ');
  document.getElementById('sound-label').textContent = 'Bật nhạc';
}
document.getElementById('sound-toggle').addEventListener('click', async () => {
  if (musicOn) { stopMusic(); return; }
  try {
    const AudioConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioConstructor) throw new Error('unsupported');
    audioContext ||= new AudioConstructor();
    await audioContext.resume();
    musicOn = true;
    document.getElementById('sound-toggle').setAttribute('aria-pressed', 'true');
    document.getElementById('sound-toggle').setAttribute('aria-label', 'Tắt nhạc nhẹ');
    document.getElementById('sound-label').textContent = 'Tắt nhạc';
    const tick = () => { const note = melody[noteIndex++ % melody.length]; if (note !== null) tone(note, 1.15, .035); };
    tick();
    musicTimer = setInterval(tick, 430);
  } catch { stopMusic(); toast('Trình duyệt này chưa phát được nhạc. Mình vẫn mở quà bình thường nhé!'); }
});
function playChime() {
  if (!musicOn) return;
  [76,79,84].forEach((note, index) => setTimeout(() => tone(note, .75, .045), index * 120));
}
document.addEventListener('visibilitychange', () => { if (document.hidden && musicOn) stopMusic(); });

const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let particles = [];
let confettiFrame = null;
let lastFrame = 0;
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(innerWidth * dpr);
  canvas.height = Math.round(innerHeight * dpr);
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
function burstConfetti() {
  if (reducedMotion.matches || !ctx) return;
  const colors = ['#c97f98','#e7bd8e','#a7b68b','#edd2da','#ba9cba'];
  const amount = innerWidth < 600 ? 90 : 150;
  for (let i = 0; i < amount; i++) particles.push({x:innerWidth / 2,y:innerHeight * .4,vx:(Math.random() - .5) * 11,vy:-Math.random() * 10 - 3,size:Math.random() * 6 + 4,rotation:Math.random() * Math.PI,spin:(Math.random() - .5) * .13,color:colors[i % colors.length],life:0});
  if (!confettiFrame) { lastFrame = performance.now(); confettiFrame = requestAnimationFrame(animateConfetti); }
}
function animateConfetti(time) {
  const step = Math.min((time - lastFrame) / 16.67, 2);
  lastFrame = time;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles = particles.filter(p => p.y < innerHeight + 30 && p.life < 300);
  for (const p of particles) {
    p.vy += .105 * step;
    p.x += p.vx * step;
    p.y += p.vy * step;
    p.rotation += p.spin * step;
    p.life += step;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.min(1, (300 - p.life) / 45);
    ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .55); ctx.restore();
  }
  if (particles.length) confettiFrame = requestAnimationFrame(animateConfetti);
  else { confettiFrame = null; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}
