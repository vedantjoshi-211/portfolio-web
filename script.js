// ===== LOADER =====
(function () {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  let prog = 0;
  const tick = setInterval(() => {
    prog += Math.random() * 18 + 6;
    if (prog >= 100) {
      prog = 100;
      clearInterval(tick);
      bar.style.width = '100%';
      setTimeout(() => loader.classList.add('done'), 400);
    } else {
      bar.style.width = prog + '%';
    }
  }, 80);
})();



// ===== SCROLL PROGRESS =====
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('menu-overlay');
const mobileClose = document.getElementById('mobileClose');
function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  menuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
}
hamburger.addEventListener('click', () => hamburger.classList.contains('open') ? closeMenu() : openMenu());
mobileClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ===== HERO CANVAS PARTICLES =====
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COLORS = ['#54C5F8', '#29B6F6', '#01FFFF', '#7C3AED', '#A78BFA'];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4 - 0.15;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.life > this.maxLife || this.x < -10 || this.x > W + 10 || this.y < -10) this.reset();
    }
    draw() {
      const fade = Math.sin((this.life / this.maxLife) * Math.PI);
      ctx.globalAlpha = this.alpha * fade;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Grid dots
  const gridDots = [];
  function buildGrid() {
    gridDots.length = 0;
    const step = 60;
    for (let x = 0; x < W; x += step) {
      for (let y = 0; y < H; y += step) {
        gridDots.push({ x, y });
      }
    }
  }
  buildGrid();
  window.addEventListener('resize', buildGrid);

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  let mouseX = W / 2, mouseY = H / 2;
  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid dots
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#54C5F8';
    gridDots.forEach(d => {
      const dist = Math.hypot(d.x - mouseX, d.y - mouseY);
      const glow = Math.max(0, 1 - dist / 200);
      ctx.globalAlpha = 0.06 + glow * 0.18;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 0.8 + glow * 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Connections
    ctx.strokeStyle = '#54C5F8';
    ctx.lineWidth = 0.4;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < 100) {
          ctx.globalAlpha = (1 - d / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => { p.update(); p.draw(); });

    // Mouse glow
    const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 180);
    grd.addColorStop(0, 'rgba(84,197,248,0.07)');
    grd.addColorStop(1, 'rgba(84,197,248,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 180, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== INTERSECTION OBSERVER (REVEAL) =====
const revealEls = document.querySelectorAll('.reveal, .reveal-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => observer.observe(el));

// ===== SKILL BARS =====
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('animated'), 200);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(el => skillObserver.observe(el));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== TYPING EFFECT on hero role =====
(function () {
  const roleDisplay = document.getElementById('role-display');
  if (!roleDisplay) return;
  const words = ['App Developer', 'UI Craftsman', 'Flutter Engineer', 'Mobile Builder', 'Dart Enthusiast'];
  let wIdx = 0, cIdx = 0, del = false;
  function tick() {
    const word = words[wIdx % words.length];
    if (!del) {
      cIdx++;
      roleDisplay.textContent = ' ' + word.slice(0, cIdx);
      if (cIdx === word.length) { del = true; setTimeout(tick, 2000); return; }
    } else {
      cIdx--;
      roleDisplay.textContent = ' ' + word.slice(0, cIdx);
      if (cIdx === 0) { del = false; wIdx++; setTimeout(tick, 400); return; }
    }
    setTimeout(tick, del ? 55 : 85);
  }
  setTimeout(tick, 1800);
})();

// ===== TILT EFFECT on project cards =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => card.style.transition = '', 500);
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ===== MOBILE MENU links close =====
document.querySelectorAll('#mobile-menu nav a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('menu-overlay').classList.remove('open');
    document.body.style.overflow = '';
  });
});
