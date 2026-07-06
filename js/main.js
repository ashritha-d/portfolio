/* ============================================================
   Portfolio — Main JavaScript
   Premium AI Full Stack Developer Portfolio
   ============================================================ */

'use strict';

/* ─── Hero entrance animation ──────────────────────────────── */
document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), i * 120);
});

/* ─── Custom Cursor ─────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .project-card, .skill-card, .tech-bubble').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ─── Scroll Progress ───────────────────────────────────────── */
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ─── Navbar ─────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── Hamburger / Mobile Menu ────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.classList.toggle('menu-open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

/* ─── Theme Toggle ──────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ─── Particle Canvas ────────────────────────────────────────── */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.size  = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.25 + 0.05;
    this.color = Math.random() > 0.5 ? '37, 99, 235' : '124, 58, 237';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const alpha = (1 - dist / 130) * 0.06;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animateParticles);
}

function initParticles() {
  resizeCanvas();
  particles = Array.from({ length: 80 }, () => new Particle());
  if (animFrame) cancelAnimationFrame(animFrame);
  animateParticles();
}

window.addEventListener('resize', debounce(initParticles, 200));
initParticles();

/* ─── Counter Animations ────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

/* ─── Intersection Observer ─────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Counter observer */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => counterObserver.observe(el));

/* Skill bars observer */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('animated');
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(el => skillObserver.observe(el));

/* ─── Skills Tabs ────────────────────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const tab = document.getElementById('tab-' + btn.dataset.tab);
    if (tab) {
      tab.classList.add('active');
      tab.querySelectorAll('.skill-card').forEach(card => {
        setTimeout(() => card.classList.add('animated'), 100);
      });
    }
  });
});

// Animate visible skills on load
setTimeout(() => {
  document.querySelectorAll('#tab-frontend .skill-card').forEach(c => c.classList.add('animated'));
}, 300);

/* ─── Project Filtering ──────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('filtered-out');
        card.style.opacity    = '1';
        card.style.transform  = '';
        card.style.pointerEvents = '';
      } else {
        card.classList.add('filtered-out');
        card.style.opacity    = '0';
        card.style.transform  = 'scale(0.9)';
        card.style.pointerEvents = 'none';
      }
    });
  });
});

/* ─── Testimonial Carousel ───────────────────────────────────── */
const track  = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

let currentSlide   = 0;
let slidesPerView  = window.innerWidth <= 768 ? 1 : 2;
const totalCards   = document.querySelectorAll('.testimonial-card').length;
const maxSlide     = totalCards - slidesPerView;

// Build dots
for (let i = 0; i <= maxSlide; i++) {
  const dot = document.createElement('div');
  dot.classList.add('carousel-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

function goToSlide(n) {
  currentSlide = Math.max(0, Math.min(n, maxSlide));
  const cardW  = track.querySelector('.testimonial-card').offsetWidth + 24;
  track.style.transform = `translateX(-${currentSlide * cardW}px)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Auto-slide
let carouselTimer = setInterval(() => goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1), 4500);
document.querySelector('.testimonial-carousel').addEventListener('mouseenter', () => clearInterval(carouselTimer));
document.querySelector('.testimonial-carousel').addEventListener('mouseleave', () => {
  carouselTimer = setInterval(() => goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1), 4500);
});

window.addEventListener('resize', debounce(() => {
  slidesPerView = window.innerWidth <= 768 ? 1 : 2;
  goToSlide(0);
}, 200));

/* ─── Contact Form ───────────────────────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled  = true;

  setTimeout(() => {
    form.style.display = 'none';
    formSuccess.classList.add('show');
  }, 1800);
});

/* ─── Back to Top ────────────────────────────────────────────── */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Active Nav Link ────────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => navObserver.observe(s));

/* Add active nav style */
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active { color: var(--blue) !important; }`;
document.head.appendChild(navStyle);

/* ─── Smooth anchor scrolling with offset ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Stagger animations for grid items ─────────────────────── */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const children = entry.target.querySelectorAll(
      '.project-card, .service-card, .cert-card, .strength-card, .blog-card, .tech-bubble'
    );
    children.forEach((child, i) => {
      child.style.opacity   = '0';
      child.style.transform = 'translateY(30px)';
      setTimeout(() => {
        child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        child.style.opacity    = '1';
        child.style.transform  = 'translateY(0)';
      }, i * 80);
    });
    staggerObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.projects-grid, .services-grid, .certs-grid, .blog-grid, .tech-grid').forEach(el => {
  staggerObserver.observe(el);
});

/* ─── Parallax on hero glows ────────────────────────────────── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelectorAll('.hero-glow').forEach((glow, i) => {
    const factor = (i + 1) * 0.4;
    glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ─── Typed text effect in code window ──────────────────────── */
const codeBlock = document.querySelector('.code-content code');
if (codeBlock) {
  const original = codeBlock.innerHTML;
  codeBlock.innerHTML = '';
  let i = 0;
  const chars = original.split('');

  setTimeout(() => {
    function typeNext() {
      if (i >= chars.length) return;
      if (chars[i] === '<') {
        let tag = '';
        while (i < chars.length && chars[i] !== '>') { tag += chars[i]; i++; }
        tag += '>'; i++;
        codeBlock.innerHTML += tag;
        typeNext();
        return;
      }
      codeBlock.innerHTML += chars[i];
      i++;
      setTimeout(typeNext, Math.random() * 18 + 7);
    }
    typeNext();
  }, 2400);
}

/* ─── Debounce utility ───────────────────────────────────────── */
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/* ─── Keyboard navigation ────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});

/* ─── Stats in hero — also run on first visible ─────────────── */
const heroSection = document.getElementById('home');
if (heroSection) {
  const heroObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(animateCounter);
      heroObs.disconnect();
    }
  }, { threshold: 0.5 });
  heroObs.observe(heroSection);
}

/* ─── Canvas resize on window resize ────────────────────────── */
const heroEl = document.querySelector('.hero');
const heroResizeObs = new ResizeObserver(debounce(() => {
  resizeCanvas();
}, 200));
if (heroEl) heroResizeObs.observe(heroEl);
