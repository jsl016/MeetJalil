/* ============================================================
   script.js — Jalil Lewis Portfolio
   All JavaScript and animations live here.
   Exactly three animation types, as specified:
     1. Scroll-triggered fade-in for sections
     2. Button hover effects (handled in CSS, but enhanced here)
     3. Number counter animation for the $597,000 revenue stat
   ============================================================ */


/* ============================================================
   NAVIGATION — scroll behavior and mobile menu
   This function handles the navbar becoming opaque on scroll
   and the mobile hamburger menu open/close.
   ============================================================ */
(function initNavigation() {

  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Add .scrolled class to navbar after user scrolls 40px
  // This triggers the frosted-glass / opaque background in CSS
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load in case page reloads mid-scroll

  // Hamburger menu: toggle open/closed state
  function toggleMenu() {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close mobile menu when a link is tapped
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

})();


/* ============================================================
   ANIMATION 1 — SCROLL-TRIGGERED FADE-IN
   This watches every element with class="reveal" and adds
   the class "visible" when it enters the viewport.
   The CSS handles the actual fade and slide-up transition.
   ============================================================ */
(function initScrollReveal() {

  const revealElements = document.querySelectorAll('.reveal');

  // Use IntersectionObserver for performant scroll detection
  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Add .visible — CSS transitions take over from here
          entry.target.classList.add('visible');
          // Once revealed, stop watching this element
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.10,     // trigger when 10% of the element is visible
      rootMargin: '0px 0px -40px 0px'  // slight offset so it triggers a bit before the edge
    }
  );

  revealElements.forEach(function(el) {
    observer.observe(el);
  });

})();


/* ============================================================
   ANIMATION 3 — NUMBER COUNTER ($597,000 REVENUE STAT)
   When the revenue stat scrolls into view, it counts up from 0
   to the target number with an easing effect.
   
   TO UPDATE THE TARGET NUMBER: change data-target="597000" in the HTML.
   The prefix (like "$") is read from data-prefix on the element.
   ============================================================ */
(function initCounterAnimation() {

  // Find all elements that should have the counting animation
  // They need a data-target attribute with the number to count to
  const counterElements = document.querySelectorAll('[data-target]');

  // Easing function: starts fast, slows toward the end
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // Format a number with commas: 597000 → "597,000"
  function formatNumber(num) {
    return Math.floor(num).toLocaleString('en-US');
  }

  // Animate a single counter element from 0 to its target
  function animateCounter(element) {
    const target   = parseFloat(element.dataset.target);
    const prefix   = element.dataset.prefix || '$';  // default prefix is "$"
    const duration = 2200;  // animation length in milliseconds
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = eased * target;

      // Update the displayed text
      element.textContent = prefix + formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Snap to exact final value when animation completes
        element.textContent = prefix + formatNumber(target);
      }
    }

    requestAnimationFrame(step);
  }

  // Watch each counter element — start animating when it enters the viewport
  const counterObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          // Only animate once
          counterObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5  // wait until the number is at least half visible
    }
  );

  counterElements.forEach(function(el) {
    counterObserver.observe(el);
  });

})();


/* ============================================================
   SMOOTH SCROLL — anchor links scroll smoothly to sections
   This handles cases where CSS scroll-behavior alone might not
   work perfectly across all browsers.
   ============================================================ */
(function initSmoothScroll() {

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Offset for the fixed navbar height
      const navbarHeight = document.getElementById('navbar').offsetHeight;
      const targetTop    = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 12;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

})();


/* ============================================================
   ACTIVE NAV LINK HIGHLIGHT
   As the user scrolls, this highlights the correct nav link
   based on which section is currently in view.
   ============================================================ */
(function initActiveNav() {

  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function(section) {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

})();
