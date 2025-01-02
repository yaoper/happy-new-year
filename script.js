const countdownElement = document.getElementById('countdown');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

// 计算距离2026年元旦的时间
function getTimeUntil2026() {
  const now = new Date();
  const newYear2026 = new Date('2026-01-01T00:00:00');
  const diff = newYear2026 - now;

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
}

let fireworksInterval;
let fireworksTimer;

function updateCountdown() {
  const t = getTimeUntil2026();
  
  if (t.total <= 0) {
    clearInterval(interval);
    countdownElement.innerHTML = '<div class="countdown-title">2026新年快乐！</div>';
    startFireworks();
    fireworksTimer = setTimeout(() => {
      stopFireworks();
    }, 30000);
    return;
  }

  // 当倒计时进入最后30秒时的特殊处理
  if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds <= 30) {
    if (t.seconds <= 10) {
      // 最后10秒显示倒计时数字
      countdownElement.innerHTML = `<div class="countdown-time final-countdown">${t.seconds}</div>`;
      if (t.seconds === 10) {
        startFireworks();
      }
    } else {
      // 10-30秒显示00:00:xx格式
      countdownElement.innerHTML = `
        <div class="countdown-title">倒计时</div>
        <div class="countdown-time">00:00:${String(t.seconds).padStart(2, '0')}</div>
      `;
    }
  } else {
    // 正常显示天数和时间
    countdownElement.innerHTML = `
      <div class="countdown-title">距离2026年还有</div>
      <div class="countdown-time">${t.days}天</div>
      <div class="countdown-time">${String(t.hours).padStart(2, '0')}:${String(t.minutes).padStart(2, '0')}:${String(t.seconds).padStart(2, '0')}</div>
    `;
  }
}

// 设置canvas尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 烟花相关变量
const fireworks = [];
const particles = [];

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.sx = (Math.random() - 0.5) * 2;
    this.sy = -(Math.random() * 3 + 2);
    this.size = Math.random() * 2 + 1;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      this.sy += 0.02;
      this.x += this.sx;
      this.y += this.sy;
      
      if (this.sy >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 5 + 2;
    this.friction = 0.95;
    this.gravity = 0.2;
    this.size = Math.random() * 2 + 1;
    this.alpha = 1;
  }

  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function startFireworks() {
  fireworksInterval = setInterval(() => {
    fireworks.push(new Firework());
  }, 200);
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.exploded) {
      fireworks.splice(index, 1);
    }
  });

  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

function stopFireworks() {
  clearInterval(fireworksInterval);
}

const interval = setInterval(updateCountdown, 1000);
animate();
