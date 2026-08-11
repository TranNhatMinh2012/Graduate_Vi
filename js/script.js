/**
 * script.js — Main Application Logic
 * GSAP + Lenis + ScrollTrigger + SheetJS for wishes
 *
 * Graduation Portfolio: Nguyễn Thị Thanh Vi
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // 1. LOADING SCREEN
  // ═══════════════════════════════════════════════════════════
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  const loadingPercent = document.getElementById('loading-percent');

  let progress = 0;
  let loadingInterval = null;

  function advanceLoading() {
    progress += Math.random() * 8 + 2;
    if (progress > 100) progress = 100;

    if (loadingBarFill) loadingBarFill.style.width = progress + '%';
    if (loadingPercent) loadingPercent.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      clearInterval(loadingInterval);
      setTimeout(revealSite, 400);
    }
  }

  function revealSite() {
    if (!loadingScreen) return;

    // Fade out loading screen
    gsap.to(loadingScreen, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        loadingScreen.style.display = 'none';
        document.body.classList.remove('loading');
        // Trigger hero animations
        initHeroAnimations();
        // Init smooth scroll after reveal
        initLenis();
      }
    });
  }

  // Start loading progress
  if (loadingScreen) {
    document.body.classList.add('loading');
    loadingInterval = setInterval(advanceLoading, 100);
    // Ensure we always finish (in case resources are fast)
    setTimeout(() => {
      if (progress < 100) {
        progress = 100;
        clearInterval(loadingInterval);
        advanceLoading();
      }
    }, 2800);
  } else {
    initLenis();
    initHeroAnimations();
  }

  // ═══════════════════════════════════════════════════════════
  // 2. LENIS SMOOTH SCROLLING
  // ═══════════════════════════════════════════════════════════
  let lenis = null;

  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not loaded, using native scroll');
      initScrollListeners();
      return;
    }

    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect GSAP ScrollTrigger to Lenis
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }

    lenis.on('scroll', onScroll);
    initScrollListeners();
  }

  // ═══════════════════════════════════════════════════════════
  // 3. SCROLL LISTENERS
  // ═══════════════════════════════════════════════════════════
  function initScrollListeners() {
    const scrollBar  = document.getElementById('scroll-progress');
    const navbar     = document.getElementById('navbar');

    function onNativeScroll() {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      const pct      = (scrolled / total) * 100;

      if (scrollBar) scrollBar.style.width = pct + '%';
      if (navbar) {
        navbar.classList.toggle('scrolled', scrolled > 50);
      }
    }

    window.addEventListener('scroll', onNativeScroll, { passive: true });
    onNativeScroll();
  }

  function onScroll(e) {
    const scrolled = e.scroll;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = (scrolled / total) * 100;

    const scrollBar = document.getElementById('scroll-progress');
    const navbar    = document.getElementById('navbar');

    if (scrollBar) scrollBar.style.width = pct + '%';
    if (navbar) navbar.classList.toggle('scrolled', scrolled > 50);
  }

  // ═══════════════════════════════════════════════════════════
  // 4. HERO ANIMATIONS
  // ═══════════════════════════════════════════════════════════
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });

    // Hero right (image): slide from right
    tl.from('.hero-right', {
      x: 80,
      opacity: 0,
      duration: 1.6,
      ease: 'expo.out'
    }, 0);

    // Hero text elements: cascade from left
    const textEls = [
      '.hero-tag',
      '.hero-name',
      '.hero-degree',
      '.hero-class',
      '.hero-verified',
      '.hero-summary',
      '.hero-actions',
      '.scroll-indicator'
    ];

    textEls.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (el) {
        tl.from(el, {
          x: -48,
          opacity: 0,
          duration: 1,
          ease: 'expo.out'
        }, 0.3 + i * 0.1);
      }
    });

    // Hero watermark parallax
    const watermark = document.querySelector('.hero-watermark');
    if (watermark && typeof ScrollTrigger !== 'undefined') {
      gsap.to(watermark, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 5. SCROLL REVEAL (IntersectionObserver)
  // ═══════════════════════════════════════════════════════════
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.scroll-reveal');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    });

    revealEls.forEach(el => observer.observe(el));
  }

  // ═══════════════════════════════════════════════════════════
  // 6. GSAP SCROLL ANIMATIONS
  // ═══════════════════════════════════════════════════════════
  function initGSAPScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ── Section heading reveals ──────────────────────────────
    document.querySelectorAll('[data-gsap-fade]').forEach(el => {
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // ── Summary card ─────────────────────────────────────────
    gsap.from('.summary-card', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#summary',
        start: 'top 75%'
      }
    });

    // ── Summary left column ──────────────────────────────────
    gsap.from('.summary-label-col > *', {
      x: -40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#summary',
        start: 'top 75%'
      }
    });

    // ── Decision paper ────────────────────────────────────────
    gsap.from('.decision-paper', {
      y: 80,
      opacity: 0,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#decision',
        start: 'top 80%'
      }
    });

    // ── Articles stagger ──────────────────────────────────────
    gsap.from('.article', {
      x: -30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '.decision-articles',
        start: 'top 80%'
      }
    });

    // ── Red stamp trigger ─────────────────────────────────────
    const stamp = document.querySelector('.stamp');
    if (stamp) {
      ScrollTrigger.create({
        trigger: stamp,
        start: 'top 80%',
        onEnter: () => {
          stamp.classList.add('bang');
        }
      });
    }

    // ── Grad photos stagger ───────────────────────────────────
    gsap.from('.grad-photo-wrap', {
      y: 80,
      opacity: 0,
      duration: 1.4,
      stagger: 0.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#graduation',
        start: 'top 75%'
      }
    });

    // ── Gallery section header ────────────────────────────────
    gsap.from('.gallery-header > *', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top 80%'
      }
    });

    // ── Closing letter ────────────────────────────────────────
    gsap.from('.closing-letter', {
      y: 60,
      opacity: 0,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#closing',
        start: 'top 75%',
        onEnter: () => initTypewriter()
      }
    });

    gsap.from('.closing-signature', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#closing',
        start: 'top 70%'
      }
    });

    // ── Parallax on graduation photos ─────────────────────────
    document.querySelectorAll('.grad-photo-wrap img').forEach(img => {
      gsap.fromTo(img, {
        yPercent: -4
      }, {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.grad-photo-wrap'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 7. NUMBER COUNTER
  // ═══════════════════════════════════════════════════════════
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const dur    = 2000; // ms
        const start  = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / dur, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = Math.floor(eased * target);
          el.textContent = val + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ═══════════════════════════════════════════════════════════
  // 8. TYPEWRITER ANIMATION
  // ═══════════════════════════════════════════════════════════
  let typewriterDone = false;

  function initTypewriter() {
    if (typewriterDone) return;
    typewriterDone = true;

    const textEl   = document.getElementById('typewriter-text');
    const cursorEl = document.getElementById('typewriter-cursor');
    if (!textEl) return;

    const fullText = textEl.dataset.text || textEl.textContent;
    textEl.textContent = '';

    let i = 0;
    const speed = 28; // ms per char

    function type() {
      if (i < fullText.length) {
        textEl.textContent += fullText[i];
        i++;
        setTimeout(type, speed + Math.random() * 20);
      } else {
        // Typing done — keep cursor blinking
        if (cursorEl) cursorEl.style.display = 'inline-block';
      }
    }

    setTimeout(type, 600);
  }

  // ═══════════════════════════════════════════════════════════
  // 9. FLOATING PARTICLES
  // ═══════════════════════════════════════════════════════════
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = [];
    const COUNT = 60;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.4 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.y < -10 || this.life > this.maxLife) this.reset();
      }
      draw() {
        const a = this.opacity * (1 - this.life / this.maxLife);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${a})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    let rafId;
    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      rafId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 10. MOUSE GLOW
  // ═══════════════════════════════════════════════════════════
  function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    if (!glow || 'ontouchstart' in window) return;

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════════════
  // 11. WISHES — READ XLSX WITH SHEETJS
  // ═══════════════════════════════════════════════════════════
  async function initWishes() {
    const trackEl = document.getElementById('wishes-track');
    if (!trackEl) return;

    // Show loading state
    trackEl.innerHTML = '<div class="wishes-loading">Loading friendship statements…</div>';

    try {
      if (typeof XLSX === 'undefined') {
        throw new Error('SheetJS not loaded');
      }

      const response = await fetch('wishes.xlsx');
      if (!response.ok) throw new Error('Cannot load wishes.xlsx');

      const buffer = await response.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });

      // Collect all wish entries from all sheets
      const wishes = [];

      wb.SheetNames.forEach(sheetName => {
        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: null,
          raw: false
        });

        // Find header row: row[0] = Name col, row[1] = Message col
        let nameCol = 0;
        let msgCol  = 1;

        rows.forEach((row, rowIdx) => {
          if (!row || row.length < 2) return;

          const nameVal = row[nameCol];
          const msgVal  = row[msgCol];

          // Skip header row and empty rows
          if (!nameVal || !msgVal) return;
          const nameStr = String(nameVal).trim();
          const msgStr  = String(msgVal).trim();
          if (!nameStr || !msgStr) return;
          if (nameStr.toUpperCase() === 'TÊN' || nameStr.toUpperCase() === 'TEN') return;
          if (msgStr.length < 10) return; // Skip very short entries

          wishes.push({
            name: nameStr,
            message: msgStr,
            sheet: sheetName
          });
        });
      });

      if (wishes.length === 0) {
        trackEl.innerHTML = '<div class="wishes-error">No messages found in wishes.xlsx</div>';
        return;
      }

      // Render cards
      renderWishCards(trackEl, wishes);
      // Init horizontal drag scroll
      initWishDrag(trackEl);
      // Init auto-scroll
      initWishAutoScroll(trackEl);

    } catch (err) {
      console.error('[Wishes]', err);
      trackEl.innerHTML = `
        <div class="wishes-error">
          <p style="font-family:var(--font-serif);font-style:italic;color:var(--gray-dim);font-size:16px">
            Friendship statements require a local server to load.<br>
            <span style="font-size:12px;letter-spacing:0.1em">Please open via Live Server or http-server.</span>
          </p>
        </div>`;
    }
  }

  function renderWishCards(trackEl, wishes) {
    trackEl.innerHTML = '';

    // Duplicate for seamless loop effect
    const combined = [...wishes, ...wishes];

    combined.forEach((wish, idx) => {
      const card = document.createElement('div');
      card.className = 'wish-card scroll-reveal';
      card.setAttribute('role', 'article');
      card.innerHTML = `
        <span class="wish-stars" aria-label="Five stars">★★★★★</span>
        <p class="wish-message">${escapeHtml(wish.message)}</p>
        <span class="wish-name">${escapeHtml(wish.name)}</span>
        <span class="wish-sheet-badge">${escapeHtml(wish.sheet)}</span>
      `;
      trackEl.appendChild(card);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Drag scroll for wish track ──────────────────────────────
  function initWishDrag(trackEl) {
    let isDown = false;
    let startX;
    let scrollLeft;

    const wrap = trackEl.parentElement;

    wrap.addEventListener('mousedown', (e) => {
      isDown = true;
      wrap.style.cursor = 'grabbing';
      startX = e.pageX - wrap.offsetLeft;
      scrollLeft = wrap.scrollLeft;
    });

    wrap.addEventListener('mouseleave', () => {
      isDown = false;
      wrap.style.cursor = '';
    });

    wrap.addEventListener('mouseup', () => {
      isDown = false;
      wrap.style.cursor = '';
    });

    wrap.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrap.offsetLeft;
      const walk = (x - startX) * 1.5;
      wrap.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX = 0;
    let touchScrollLeft = 0;

    wrap.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = wrap.scrollLeft;
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
      const dx = touchStartX - e.touches[0].pageX;
      wrap.scrollLeft = touchScrollLeft + dx;
    }, { passive: true });
  }

  // ── Auto-scroll animation ───────────────────────────────────
  function initWishAutoScroll(trackEl) {
    const wrap = trackEl.parentElement;
    if (!wrap) return;

    let paused = false;
    let speed = 0.6; // px per frame
    let rafId;

    function scroll() {
      if (!paused) {
        wrap.scrollLeft += speed;
        // Loop: when we've scrolled half the content width (duplicated), reset
        if (wrap.scrollLeft >= trackEl.scrollWidth / 2) {
          wrap.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(scroll);
    }

    rafId = requestAnimationFrame(scroll);

    // Pause on hover/focus
    wrap.addEventListener('mouseenter', () => { paused = true; });
    wrap.addEventListener('mouseleave', () => { paused = false; });
    wrap.addEventListener('focusin',    () => { paused = true; });
    wrap.addEventListener('focusout',   () => { paused = false; });

    // Stop when not visible
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(([entry]) => {
        paused = !entry.isIntersecting;
      });
      obs.observe(wrap);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 12. NAV SMOOTH LINKS
  // ═══════════════════════════════════════════════════════════
  function initNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();

        if (lenis) {
          lenis.scrollTo(target, { offset: -80, duration: 1.8 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 13. INITIALIZE ALL
  // ═══════════════════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    // These run immediately regardless of loading screen
    initParticles();
    initMouseGlow();
    initScrollReveal();
    initCounters();
    initNavLinks();
    initWishes();

    // GSAP animations (after GSAP loads)
    if (typeof gsap !== 'undefined') {
      initGSAPScrollAnimations();
    } else {
      // Retry after small delay for CDN load
      setTimeout(() => {
        if (typeof gsap !== 'undefined') initGSAPScrollAnimations();
      }, 500);
    }
  });

})();
