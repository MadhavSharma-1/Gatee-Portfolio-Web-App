/* ═══════════════════════════════════════════════════
   PORTFOLIO — script.js
   ═══════════════════════════════════════════════════ */

/* ── Theme Toggle ────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

/* ── Mobile Menu ─────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Active Nav Link on Scroll ───────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observerNav.observe(s));

/* ── Scroll-Reveal Animation ─────────────────────── */
const revealEls = document.querySelectorAll(
  '.skill-card, .achievement-card, .timeline-card, .brand-card, ' +
  '.about-grid, .contact-grid, .stat-item'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observerReveal = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observerReveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observerReveal.observe(el));

/* ── Counter Animation (Stats) ───────────────────── */
const counters = document.querySelectorAll('.stat-number');

const observerCounter = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target) || target === 0) return;

    const duration  = 1800;
    const step      = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);

    observerCounter.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => observerCounter.observe(c));

/* ── Navbar shadow on scroll ─────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 4px 30px rgba(0,0,0,0.15)'
    : 'none';
}, { passive: true });

/* ── Footer Year ─────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Contact Form (Formspree) ────────────────────── */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    formNote.textContent = '';
    formNote.className = 'form-note';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        formNote.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formNote.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      formNote.textContent = '✗ Something went wrong. Please email me directly.';
      formNote.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  });
}
