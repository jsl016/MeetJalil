/* ============================================================
   JALIL LEWIS PORTFOLIO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* CURSOR */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    document.addEventListener('mousemove', e => {
      dot.style.left  = e.clientX + 'px';
      dot.style.top   = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.6'; });
  }

  /* MOBILE NAV */
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

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* SCROLL REVEAL */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.timeline-item, .role-card, .comm-card, .community-story').forEach(el => revealObs.observe(el));

  /* SKILL BARS */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.pct + '%'; });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const skillSection = document.querySelector('.skills-section');
  if (skillSection) skillObs.observe(skillSection);

  /* COUNTERS */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const prefix   = el.dataset.prefix  || '';
    const suffix   = el.dataset.suffix  || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 2000;
    const start    = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * ease).toFixed(decimals) + suffix;
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

  /* VERTICAL GROWTH CHART */
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

  /* CONTACT FORM */
  const formBtn = document.querySelector('.form-submit');
  if (formBtn) {
    formBtn.addEventListener('click', () => {
      const orig = formBtn.textContent;
      formBtn.textContent = 'Message Sent ✓';
      formBtn.style.background = 'var(--sage-mid)';
      setTimeout(() => { formBtn.textContent = orig; formBtn.style.background = ''; }, 3000);
    });
  }

});
