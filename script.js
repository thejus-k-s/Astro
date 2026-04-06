// CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
function animRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) *.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.nav-join').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='54px';ring.style.height='54px';ring.style.borderColor='rgba(0,245,255,0.8)'; });
  el.addEventListener('mouseleave', () => { ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='rgba(0,245,255,0.4)'; });
});

// CANVAS STARFIELD + NEBULA
const canvas = document.getElementById('cosmos');
const ctx = canvas.getContext('2d');
let W, H, stars = [], nebulas = [], shooters = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildStars();
}

function buildStars() {
  stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.2 + 0.05,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.9 ? '#a855f7' : Math.random() > 0.8 ? '#0070ff' : '#fff'
    });
  }
  nebulas = [];
  for (let i = 0; i < 5; i++) {
    nebulas.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 200 + 80,
      color: ['rgba(0,112,255,0.025)', 'rgba(168,85,247,0.02)', 'rgba(0,245,255,0.02)'][Math.floor(Math.random() * 3)]
    });
  }
}

function spawnShooter() {
  if (Math.random() < 0.003) {
    const x = Math.random() * W;
    shooters.push({ x, y: Math.random() * H * 0.5, vx: 4 + Math.random() * 6, vy: 2 + Math.random() * 3, len: 80 + Math.random() * 80, alpha: 1 });
  }
}

let t = 0;
function draw() {
  ctx.clearRect(0, 0, W, H);
  // nebula blobs
  nebulas.forEach(n => {
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    g.addColorStop(0, n.color); g.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
  });
  // stars
  t += 0.012;
  stars.forEach(s => {
    const alpha = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.color; ctx.globalAlpha = alpha; ctx.fill();
  });
  ctx.globalAlpha = 1;
  // shooters
  spawnShooter();
  shooters = shooters.filter(s => s.alpha > 0);
  shooters.forEach(s => {
    const grad = ctx.createLinearGradient(s.x - s.len, s.y - s.len * 0.5, s.x, s.y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, `rgba(0,245,255,${s.alpha * 0.9})`);
    ctx.beginPath();
    ctx.moveTo(s.x - s.len, s.y - s.len * 0.5);
    ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
    ctx.globalAlpha = s.alpha; ctx.stroke(); ctx.globalAlpha = 1;
    s.x += s.vx; s.y += s.vy; s.alpha -= 0.018;
  });
  requestAnimationFrame(draw);
}
window.addEventListener('resize', resize);
resize(); draw();

// COUNTER ANIMATION
function countUp(el, target) {
  let cur = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(timer); }
    el.textContent = Math.floor(cur) + (target > 10 ? '+' : '');
  }, 24);
}

// INTERSECTION OBSERVER FOR REVEALS + COUNTERS
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // counter
      e.target.querySelectorAll('[data-target]').forEach(el => {
        countUp(el, parseInt(el.dataset.target));
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('[data-target]').forEach(el => {
  const parentReveal = el.closest('.reveal') || el;
  if (!el.closest('.reveal')) io.observe(el);
});

// Hero metrics counter on load
setTimeout(() => {
  document.querySelectorAll('#hero [data-target]').forEach(el => {
    countUp(el, parseInt(el.dataset.target));
  });
}, 1200);

// TICKER
const strip = document.querySelector('.highlight-strip');
if(strip) {
  const items = strip.innerHTML;
  strip.innerHTML = items + items;
  let pos = 0;
  function tick() { pos -= 0.5; if(Math.abs(pos) > strip.scrollWidth / 2) pos = 0; strip.style.transform = `translateX(${pos}px)`; requestAnimationFrame(tick); }
  tick();
}

// NAV ACTIVE STATE
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop - 80;
    const bot = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if(link) { if(y >= top && y < bot) link.style.color='var(--neon-cyan)'; else link.style.color=''; }
  });
});
