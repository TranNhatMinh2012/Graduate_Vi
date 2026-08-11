// ─── CURSOR ───────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      cursor.style.opacity = '1';
    }
  });

  const render = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    if (cursorRing) {
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });
}

// ─── PARTICLES ────────────────────────────────────
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  const initParticles = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1,
        r: Math.random() * 2,
        a: Math.random(),
        life: Math.random(),
        max: Math.random() * 0.5 + 0.1
      });
    }
  };

  const drawParticles = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.01;
      p.a = Math.sin(p.life) * p.max;
      
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 162, 39, ${Math.max(0, p.a)})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  };

  initParticles();
  drawParticles();
  window.addEventListener('resize', initParticles);
}

// ─── LOADING SCREEN ───────────────────────────────
const loading = document.getElementById('loading');
if (loading) {
  const fill = document.querySelector('.ld-fill');
  const pct = document.querySelector('.ld-pct');
  let progress = 0;
  
  const finishLoading = () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(loading, { opacity: 0, duration: 0.8, onComplete: () => loading.remove() });
    } else {
      loading.remove();
    }
  };
  
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      setTimeout(finishLoading, 400);
    }
    if (fill) fill.style.width = `${progress}%`;
    if (pct) pct.textContent = `${Math.floor(progress)}%`;
  }, 200);
  
  setTimeout(() => {
    clearInterval(loadingInterval);
    if (fill) fill.style.width = '100%';
    if (pct) pct.textContent = '100%';
    finishLoading();
  }, 2800);
}

// ─── NAVBAR ───────────────────────────────────────
const navbar = document.getElementById('navbar');
const scrollBar = document.getElementById('scroll-bar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAs = document.querySelectorAll('.nav-a');

window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  if (scrollBar) {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollBar.style.width = scrolled + "%";
  }
});

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

navAs.forEach(a => {
  a.addEventListener('click', () => {
    if (navLinks) navLinks.classList.remove('open');
  });
});

// ─── ACTIVE NAV LINK ──────────────────────────────
const path = window.location.pathname;
let currentFile = path.substring(path.lastIndexOf('/') + 1);
if (!currentFile || currentFile === '') currentFile = 'index.html';

navAs.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentFile) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ─── SCROLL REVEAL ────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

// ─── STAT COUNTERS ────────────────────────────────
const counters = document.querySelectorAll('[data-target]');
if (counters.length > 0) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
        
        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(easeOutCubic(progress) * target);
          
          entry.target.innerText = current + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            entry.target.innerText = target + suffix;
          }
        };
        
        requestAnimationFrame(updateCount);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => countObserver.observe(counter));
}
