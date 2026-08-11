document.addEventListener('DOMContentLoaded', () => {
  const stampBtn = document.getElementById('stamp-btn');
  const stampInk = document.getElementById('stamp-ink');
  const approvedOverlay = document.getElementById('approved-overlay');
  const stampHint = document.querySelector('.stamp-hint');
  const paper = document.querySelector('.dec-paper');
  
  if (!stampBtn) return;
  
  let stamped = false;
  
  const doStamp = () => {
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
          stampInk.style.display = 'block';
          gsap.fromTo(stampInk, 
            { scale: 0.2, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }
          );
          
          gsap.to(approvedOverlay, { opacity: 1, duration: 0.3, delay: 0.1 });
          gsap.to(stampBtn, { boxShadow: "0 0 30px rgba(239, 68, 68, 0.8)", duration: 0.3 });
        }
      })
      .to(stampBtn, { y: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" });
  };
  
  stampBtn.addEventListener('click', doStamp);
  
  stampBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      doStamp();
    }
  });
});
