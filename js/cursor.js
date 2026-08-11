/**
 * cursor.js — Custom cursor follower
 * Graduation Portfolio: Nguyễn Thị Thanh Vi
 */

(function () {
  'use strict';

  // Skip on touch devices
  if ('ontouchstart' in window) return;

  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId = null;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Move dot cursor immediately
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower loop
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';

    rafId = requestAnimationFrame(animateFollower);
  }

  animateFollower();

  // ── Hover states ───────────────────────────────────────────
  const interactiveEls = 'a, button, [role="button"], .gallery-item, .wish-card, .basis-card, .grad-photo-wrap, .btn';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveEls)) {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      follower.style.width  = '60px';
      follower.style.height = '60px';
      follower.style.borderColor = 'rgba(201,162,39,0.8)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveEls)) {
      cursor.style.width  = '12px';
      cursor.style.height = '12px';
      follower.style.width  = '40px';
      follower.style.height = '40px';
      follower.style.borderColor = 'rgba(201,162,39,0.5)';
    }
  });

  // ── Click pulse ────────────────────────────────────────────
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
    follower.style.transform = 'translate(-50%, -50%) scale(0.85)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  // ── Hide when leaving window ───────────────────────────────
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });

})();
