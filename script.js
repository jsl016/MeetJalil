/* ============================================================
   JALIL LEWIS PORTFOLIO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

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

  /* ── SCROLL REVEAL ──────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.timeline-item, .role-card, .comm-card, .community-story').forEach(el => {
    revealObs.observe(el);
  });

  /* ── SKILL BARS ─────────────────────────────────────── */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
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

});
