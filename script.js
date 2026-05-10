/* ============================================================
   JALIL LEWIS PORTFOLIO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SCROLL PROGRESS BAR ────────────────────────────── */
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ── MOBILE NAV ─────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      const open = mobileNav.style.display === 'flex';
      mobileNav.style.display = open ? 'none' : 'flex';
    });
    document.addEventListener('click', e => {
      if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        mobileNav.style.display = 'none';
      }
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { mobileNav.style.display = 'none'; });
    });
  }

  /* ── NAV SCROLL SHADOW ──────────────────────────────── */
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 40
        ? '0 2px 20px rgba(44,34,24,0.08)'
        : 'none';
    }, { passive: true });
  }

  /* ── SMOOTH SCROLL ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── SCROLL REVEAL (staggered) ──────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Stagger siblings within same parent
        const siblings = e.target.parentElement
          ? [...e.target.parentElement.querySelectorAll(
              '.timeline-item, .role-card, .comm-card, .community-story, .why-card, .approach-card, .review-card, .counter-card'
            )]
          : [];
        const idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = idx >= 0 ? (idx * 80) + 'ms' : '0ms';
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.timeline-item, .role-card, .comm-card, .community-story, .why-card, .approach-card, .review-card, .counter-card'
  ).forEach(el => { revealObs.observe(el); });

  /* ── SKILL BARS ─────────────────────────────────────── */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, i * 60);
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  const skillSection = document.querySelector('.skills-section');
  if (skillSection) skillObs.observe(skillSection);

  /* ── ANIMATED COUNTERS ──────────────────────────────── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix  || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start    = performance.now();
    function tick(now) {
      const p    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * ease).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  const countersGrid = document.querySelector('.counters-grid');
  if (countersGrid) counterObs.observe(countersGrid);

  /* ── VERTICAL GROWTH CHART ──────────────────────────── */
  const chartObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.vchart-bar-fill').forEach((bar, i) => {
          const targetH = parseFloat(bar.dataset.height);
          setTimeout(() => {
            bar.style.height     = targetH + '%';
            bar.style.transition = 'height 0.9s cubic-bezier(0.22,1,0.36,1)';
          }, i * 100);
        });
        chartObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  const vchartWrap = document.querySelector('.vchart-wrap');
  if (vchartWrap) chartObs.observe(vchartWrap);

  /* ── CONTACT FORM → MAILTO ──────────────────────────── */
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const form    = sendBtn.closest('.contact-form');
      const inputs  = form.querySelectorAll('input[type=text]');
      const name    = inputs[0]?.value.trim() || '';
      const org     = inputs[1]?.value.trim() || '';
      const email   = form.querySelector('input[type=email]')?.value.trim() || '';
      const message = form.querySelector('textarea')?.value.trim() || '';

      if (!message) {
        form.querySelector('textarea').focus();
        return;
      }

      const subject = encodeURIComponent(
        'Opportunity for Jalil Lewis' + (org ? ' — ' + org : '')
      );
      const body = encodeURIComponent(
        (name ? 'Hi Jalil,\n\n' : '') +
        message +
        (name  ? '\n\n— ' + name  : '') +
        (email ? '\n'    + email  : '')
      );

      window.location.href =
        'mailto:Jslx016@gmail.com?subject=' + subject + '&body=' + body;

      sendBtn.textContent = 'Opening email client...';
      sendBtn.classList.add('sent');
      setTimeout(() => {
        sendBtn.textContent = 'Send Message';
        sendBtn.classList.remove('sent');
      }, 3000);
    });
  }

  /* ── HERO ENTRANCE ANIMATION ────────────────────────── */
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroName = document.querySelector('.hero-name');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroSubline = document.querySelector('.hero-subline');
  const heroCtas = document.querySelector('.hero-ctas');
  const heroProgression = document.querySelector('.hero-progression');
  const heroImage = document.querySelector('.hero-image');
  const heroBadge = document.querySelector('.hero-badge');

  const heroEls = [heroEyebrow, heroName, heroTagline, heroSubline, heroCtas, heroProgression].filter(Boolean);
  heroEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)';
  });
  if (heroImage) {
    heroImage.style.opacity = '0';
    heroImage.style.transform = 'translateX(32px)';
    heroImage.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
  }
  if (heroBadge) {
    heroBadge.style.opacity = '0';
    heroBadge.style.transform = 'scale(0.8) translateY(10px)';
    heroBadge.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
  }

  setTimeout(() => {
    heroEls.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 130);
    });
    if (heroImage) {
      setTimeout(() => {
        heroImage.style.opacity = '1';
        heroImage.style.transform = 'translateX(0)';
      }, 300);
    }
    if (heroBadge) {
      setTimeout(() => {
        heroBadge.style.opacity = '1';
        heroBadge.style.transform = 'scale(1) translateY(0)';
      }, 900);
    }
  }, 150);

  /* ── HERO PARALLAX ──────────────────────────────────── */
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroPhoto.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }
    }, { passive: true });
  }

  /* ── PULLQUOTE ANIMATIONS ───────────────────────────── */
  const pullquoteObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const mark = e.target.querySelector('.pullquote-mark');
        const text = e.target.querySelector('.pullquote-text');
        const attr = e.target.querySelector('.pullquote-attr');
        if (mark) {
          mark.style.opacity = '0';
          mark.style.transform = 'scale(0.5)';
          mark.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
          setTimeout(() => { mark.style.opacity = '0.4'; mark.style.transform = 'scale(1)'; }, 100);
        }
        if (text) {
          text.style.opacity = '0';
          text.style.transform = 'translateY(24px)';
          text.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1)';
          setTimeout(() => { text.style.opacity = '1'; text.style.transform = 'translateY(0)'; }, 320);
        }
        if (attr) {
          attr.style.opacity = '0';
          attr.style.transition = 'opacity 0.6s ease';
          setTimeout(() => { attr.style.opacity = '1'; }, 700);
        }
        pullquoteObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.pullquote-wrap').forEach(el => pullquoteObs.observe(el));

  /* ── IMPACT BAR NUMBER ANIMATIONS ──────────────────── */
  function animateImpactNum(el) {
    const text = el.textContent.trim();
    const match = text.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
    if (!match) return;
    const prefix = match[1];
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const target = parseFloat(numStr);
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * ease).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const impactObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.impact-num').forEach((el, i) => {
          setTimeout(() => animateImpactNum(el), i * 150);
        });
        impactObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  const impactBar = document.querySelector('.impact-bar');
  if (impactBar) impactObs.observe(impactBar);

  /* ── GENERAL FADE-UP REVEAL ─────────────────────────── */
  const fadeUpObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        fadeUpObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(
    '.px-card, .spec-tile, .impact-stat, .comm-card, .mentor-person, .about-grid, .section-title'
  ).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 0.7s ease ${(i % 4) * 80}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${(i % 4) * 80}ms`;
    fadeUpObs.observe(el);
  });

  /* ── SMILE SIGN-OFF FLOAT ───────────────────────────── */
  const smileSignoff = document.querySelector('.smile-signoff');
  if (smileSignoff) {
    smileSignoff.style.opacity = '0';
    smileSignoff.style.transform = 'translateY(16px)';
    smileSignoff.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s';
    const smileObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          smileObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    smileObs.observe(smileSignoff);
  }

});
