/* ═══════════════════════════════════════
   CHALÉ — GSAP Scroll Animations
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // --- Fade-up elements ---
  const fadeEls = document.querySelectorAll('.anim-fade');

  fadeEls.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });

  // --- Stagger menu cards ---
  const menuCards = document.querySelectorAll('.menu-category');
  if (menuCards.length) {
    gsap.fromTo(menuCards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#menu',
          start: 'top 70%',
          once: true,
        },
      }
    );
  }

  // --- Stagger event cards ---
  const eventCards = document.querySelectorAll('.event-card');
  if (eventCards.length) {
    gsap.fromTo(eventCards,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#events',
          start: 'top 70%',
          once: true,
        },
      }
    );
  }

  // --- Hero parallax on scroll ---
  const heroOverlay = document.querySelector('.hero-overlay');
  if (heroOverlay) {
    gsap.to(heroOverlay, {
      y: -80,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // --- Hero canvas parallax ---
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    gsap.to(heroCanvas, {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // --- Section titles character animation ---
  document.querySelectorAll('.section-title').forEach(title => {
    gsap.fromTo(title,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          once: true,
        },
      }
    );
  });

  // --- 3D Tilt on menu cards ---
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  });

  // --- Scroll hint disappear ---
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    gsap.to(scrollHint, {
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: '10% top',
        end: '30% top',
        scrub: true,
      },
    });
  }
})();
