document.addEventListener('DOMContentLoaded', () => {
  const stampBtn = document.getElementById('stamp-btn');
  const stampInk = document.getElementById('stamp-ink');
  const approvedOverlay = document.getElementById('approved-overlay');
  const stampHint = document.querySelector('.stamp-hint');
  const paper = document.querySelector('.dec-paper');
  const unrollBtn = document.getElementById('unroll-decree-btn');

  if (!paper) return;

  // ─── DECREE CLOSED BY DEFAULT ───────────────────
  paper.classList.add('is-closed');
  
  const decHeader = paper.querySelector('.dec-header');
  const decSubject = paper.querySelector('.dec-subject');
  const decArticles = paper.querySelector('.dec-articles');
  const decFooter = paper.querySelector('.dec-footer');
  const ribbonTag = paper.querySelector('.decree-ribbon-tag');

  let isOpen = false;

  const toggleDecree = () => {
    if (typeof gsap === 'undefined') {
      paper.classList.toggle('is-closed');
      paper.classList.toggle('is-open');
      return;
    }

    if (!isOpen) {
      // OPEN DECREE
      isOpen = true;
      paper.classList.remove('is-closed');
      paper.classList.add('is-open');

      if (unrollBtn) {
        unrollBtn.innerHTML = '<span>📜</span> Cuộn Lại Sắc Lệnh / Roll Up';
      }

      // Make inner elements visible for GSAP animation
      if (decHeader) decHeader.style.display = 'block';
      if (decSubject) decSubject.style.display = 'block';
      if (decArticles) decArticles.style.display = 'flex';
      if (decFooter) decFooter.style.display = 'flex';

      const decArts = paper.querySelectorAll('.dec-art');

      const tl = gsap.timeline();
      gsap.set(paper, { maxHeight: '70px', opacity: 0.8 });
      gsap.set([decHeader, decSubject, decArts, decFooter], { opacity: 0, y: 25 });

      tl.to(paper, {
        maxHeight: '2000px',
        opacity: 1,
        duration: 0.9,
        ease: 'power3.inOut'
      })
      .to(ribbonTag, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.5)'
      }, '-=0.3')
      .to(decHeader, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.2')
      .to(decSubject, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.2')
      .to(decArts, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.12,
        ease: 'power2.out'
      }, '-=0.2')
      .to(decFooter, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out(1.2)'
      }, '-=0.1');

    } else {
      // CLOSE DECREE
      isOpen = false;
      if (unrollBtn) {
        unrollBtn.innerHTML = '<span>📜</span> Mở Sắc Lệnh / Unroll Decree';
      }

      const decArts = paper.querySelectorAll('.dec-art');
      const tl = gsap.timeline();

      tl.to([decFooter, decArts, decSubject, decHeader], {
        opacity: 0,
        y: 15,
        duration: 0.25,
        stagger: 0.05
      })
      .to(paper, {
        maxHeight: '70px',
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => {
          paper.classList.remove('is-open');
          paper.classList.add('is-closed');
        }
      });
    }
  };

  // Toggle on unroll button click
  if (unrollBtn) {
    unrollBtn.addEventListener('click', toggleDecree);
  }

  // Toggle on clicking closed paper ribbon tag
  paper.addEventListener('click', (e) => {
    if (paper.classList.contains('is-closed')) {
      toggleDecree();
    }
  });

  // ─── STAMP MINI-GAME ─────────────────────────────
  if (!stampBtn) return;

  let stamped = false;

  const doStamp = (e) => {
    if (e) e.stopPropagation();
    if (stamped) return;
    stamped = true;

    if (stampHint) {
      gsap.to(stampHint, { opacity: 0, duration: 0.3 });
    }

    gsap.to(paper, {
      x: () => gsap.utils.random(-5, 5),
      yoyo: true,
      repeat: 6,
      duration: 0.05,
      ease: "power1.inOut",
      delay: 0.2
    });

    const tl = gsap.timeline();
    tl.to(stampBtn, { y: -30, duration: 0.2, ease: "power2.out" })
      .to(stampBtn, { 
        y: 50, 
        scale: 1.1,
        duration: 0.15, 
        ease: "power2.in",
        onComplete: () => {
          if (stampInk) stampInk.style.display = 'block';
          if (stampInk) {
            gsap.fromTo(stampInk, 
              { scale: 0.2, opacity: 0 }, 
              { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }
            );
          }

          if (approvedOverlay) gsap.to(approvedOverlay, { opacity: 1, duration: 0.3, delay: 0.1 });
          gsap.to(stampBtn, { boxShadow: "0 0 30px rgba(239, 68, 68, 0.8)", duration: 0.3 });
        }
      })
      .to(stampBtn, { y: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" });
  };

  stampBtn.addEventListener('click', doStamp);

  stampBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      doStamp(e);
    }
  });
});
