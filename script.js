/* ═══════════════════════════════════════════════════
   PORTFOLIO — script.js  (data-driven)
   ═══════════════════════════════════════════════════ */

(function () {

  /* ── 1. Load data from data.json (managed by Decap CMS) ── */
  fetch('data.json', { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(run)
    .catch(err => {
      document.getElementById('app').innerHTML =
        '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;' +
        'font-family:sans-serif;color:#888;text-align:center;padding:2rem;">' +
        '<div><h1 style="font-size:1.5rem;margin-bottom:.5rem;">Couldn’t load content</h1>' +
        '<p>data.json failed to load (' + err.message + ').<br>' +
        'If you opened this file directly, view it on your live site instead.</p></div></div>';
    });

  function run(data) {

  /* ── 2. Google Analytics ───────────────────────── */
  if (data.meta.analyticsId && data.meta.analyticsId !== 'G-XXXXXXXXXX') {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + data.meta.analyticsId;
    document.head.appendChild(s);
    const i = document.createElement('script');
    i.textContent = 'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","' + data.meta.analyticsId + '");';
    document.head.appendChild(i);
  }

  /* ── 3. Document title ─────────────────────────── */
  document.title = data.meta.siteTitle || 'Portfolio';

  /* ── 4. Escape helper ──────────────────────────── */
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ── 5. Render functions ───────────────────────── */

  function renderNav(nav) {
    return `
<nav id="navbar">
  <div class="nav-inner">
    <a href="#hero" class="nav-logo">${esc(nav.brand)}</a>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#skills">Skills</a></li>
      <li><a href="#achievements">Achievements</a></li>
      <li><a href="#experience">Experience</a></li>
      <li><a href="#brands">Brands</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <div class="nav-actions">
      <button id="themeToggle" class="theme-btn" aria-label="Toggle theme">
        <span class="theme-icon sun"><i class="fas fa-sun"></i></span>
        <span class="theme-icon moon"><i class="fas fa-moon"></i></span>
      </button>
      <a href="${esc(nav.cvViewUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        <i class="fas fa-eye"></i> View CV
      </a>
      <a href="${esc(nav.cvDownloadUrl)}" download class="btn btn-primary btn-sm">
        <i class="fas fa-download"></i> Download CV
      </a>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    <ul>
      <li><a href="#about" class="mobile-link">About</a></li>
      <li><a href="#skills" class="mobile-link">Skills</a></li>
      <li><a href="#achievements" class="mobile-link">Achievements</a></li>
      <li><a href="#experience" class="mobile-link">Experience</a></li>
      <li><a href="#brands" class="mobile-link">Brands</a></li>
      <li><a href="#contact" class="mobile-link">Contact</a></li>
    </ul>
    <div class="mobile-cv">
      <a href="${esc(nav.cvViewUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        <i class="fas fa-eye"></i> View CV
      </a>
      <a href="${esc(nav.cvDownloadUrl)}" download class="btn btn-primary btn-sm">
        <i class="fas fa-download"></i> Download CV
      </a>
    </div>
  </div>
</nav>`;
  }

  function renderHero(hero) {
    return `
<section id="hero">
  <div class="hero-bg-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>
  <div class="hero-content">
    <p class="hero-tag"><i class="fas fa-music"></i> ${esc(hero.tag)}</p>
    <h1 class="hero-name">${esc(hero.name)}</h1>
    <p class="hero-title">${esc(hero.title)}</p>
    <p class="hero-subtitle">${esc(hero.subtitle)}</p>
    <div class="hero-cta">
      <a href="${esc(hero.primaryCta.href)}" class="btn btn-primary btn-lg">${esc(hero.primaryCta.text)}</a>
      <a href="${esc(hero.secondaryCta.href)}" class="btn btn-outline btn-lg">${esc(hero.secondaryCta.text)}</a>
    </div>
    <div class="hero-scroll"><span></span></div>
  </div>
</section>`;
  }

  function renderAbout(about) {
    const badgeLines = (about.badge.text || '').split('\n').map(esc).join('<br>');
    const photo = about.photoUrl
      ? `<img src="${esc(about.photoUrl)}" alt="Profile photo" class="about-image">`
      : `<div class="about-image-placeholder"><i class="fas fa-user"></i><p>Add your photo in the admin</p></div>`;
    const highlights = (about.highlights || []).map(h => {
      const inner = h.href ? `<a href="${esc(h.href)}">${esc(h.text)}</a>` : `<span>${esc(h.text)}</span>`;
      return `<div class="highlight-item"><i class="fas ${esc(h.icon)}"></i>${inner}</div>`;
    }).join('');
    const paragraphs = (about.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join('');
    return `
<section id="about" class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Who I Am</span>
      <h2 class="section-title">About Me</h2>
    </div>
    <div class="about-grid">
      <div class="about-image-wrap">
        ${photo}
        <div class="about-image-badge">
          <span class="badge-number">${esc(about.badge.number)}</span>
          <span class="badge-text">${badgeLines}</span>
        </div>
      </div>
      <div class="about-text">
        <h3 class="about-heading">${esc(about.heading)}</h3>
        ${paragraphs}
        <div class="about-highlights">${highlights}</div>
      </div>
    </div>
  </div>
</section>`;
  }

  function renderSkills(skills, skillTags) {
    const cards = (skills || []).map(s => {
      const bullets = (s.bullets || []).map(b => `<li>${esc(b)}</li>`).join('');
      return `<div class="skill-card">
        <div class="skill-card-icon"><i class="fas ${esc(s.icon)}"></i></div>
        <h3>${esc(s.title)}</h3>
        <ul>${bullets}</ul>
      </div>`;
    }).join('');
    const tags = (skillTags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
    return `
<section id="skills" class="section section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-label">What I Do</span>
      <h2 class="section-title">Skills</h2>
    </div>
    <div class="skills-grid">${cards}</div>
    <div class="skills-tags-wrap">
      <h3 class="skills-tags-title">Also proficient in</h3>
      <div class="skills-tags">${tags}</div>
    </div>
  </div>
</section>`;
  }

  function renderAchievements(stats, achievements) {
    const statsHtml = (stats || []).map(s => `
      <div class="stat-item">
        <span class="stat-number" data-target="${esc(String(s.number))}">${esc(String(s.number))}</span>
        <span class="stat-suffix">${esc(s.suffix)}</span>
        <span class="stat-label">${esc(s.label)}</span>
      </div>`).join('');
    const cards = (achievements || []).map(a => `
      <div class="achievement-card">
        <div class="achievement-icon"><i class="fas ${esc(a.icon)}"></i></div>
        <div class="achievement-body">
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.desc)}</p>
          <span class="achievement-tag">${esc(a.tag)}</span>
        </div>
      </div>`).join('');
    return `
<section id="achievements" class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Track Record</span>
      <h2 class="section-title">Key Achievements</h2>
    </div>
    <div class="stats-row">${statsHtml}</div>
    <div class="achievements-grid">${cards}</div>
  </div>
</section>`;
  }

  function renderExperience(experience) {
    const items = (experience || []).map(e => {
      const bullets = (e.bullets || []).map(b => `<li>${esc(b)}</li>`).join('');
      const tags = (e.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
      return `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-header">
            <div>
              <h3 class="timeline-role">${esc(e.role)}</h3>
              <span class="timeline-company">${esc(e.company)}</span>
            </div>
            <span class="timeline-date">${esc(e.period)}</span>
          </div>
          ${e.desc ? `<p class="timeline-desc">${esc(e.desc)}</p>` : ''}
          <ul class="timeline-bullets">${bullets}</ul>
          <div class="timeline-tags">${tags}</div>
        </div>
      </div>`;
    }).join('');
    return `
<section id="experience" class="section section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-label">My Journey</span>
      <h2 class="section-title">Experience</h2>
    </div>
    <div class="timeline">${items}</div>
  </div>
</section>`;
  }

  function renderBrands(brands) {
    const cards = (brands || []).map(b => {
      const bgStyle = b.imageUrl ? ` style="--brand-bg: url('${b.imageUrl}')"` : '';
      return `
      <div class="brand-card"${bgStyle}>
        <div class="brand-overlay">
          <span class="brand-category">${esc(b.category)}</span>
          <h3 class="brand-name">${esc(b.name)}</h3>
          <p class="brand-role">${esc(b.role)}</p>
          <p class="brand-desc">${esc(b.desc)}</p>
          <a href="${esc(b.link)}" class="brand-link" target="_blank" rel="noopener noreferrer">
            Learn More <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>`;
    }).join('');
    return `
<section id="brands" class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Collaborations</span>
      <h2 class="section-title">Brands I've Worked With</h2>
      <p class="section-desc">A selection of labels, artists, and brands I've had the pleasure of partnering with.</p>
    </div>
    <div class="brands-grid">${cards}</div>
  </div>
</section>`;
  }

  function renderContact(contact, nav, meta) {
    return `
<section id="contact" class="section section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Let's Talk</span>
      <h2 class="section-title">Get In Touch</h2>
      <p class="section-desc">Open to new opportunities, collaborations, and conversations about music marketing.</p>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        <div class="contact-item">
          <div class="contact-icon"><i class="fas fa-envelope"></i></div>
          <div><h4>Email</h4><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></div>
        </div>
        <div class="contact-item">
          <div class="contact-icon"><i class="fab fa-linkedin"></i></div>
          <div><h4>LinkedIn</h4>
            <a href="${esc(contact.linkedin)}" target="_blank" rel="noopener noreferrer">
              ${esc(contact.linkedin.replace(/.*linkedin\.com\/in\//, 'linkedin.com/in/').replace(/\/$/, ''))}
            </a>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-icon"><i class="fab fa-instagram"></i></div>
          <div><h4>Instagram</h4>
            <a href="${esc(contact.instagram)}" target="_blank" rel="noopener noreferrer">
              @${esc(contact.instagram.replace(/.*instagram\.com\//, '').replace(/\/$/, ''))}
            </a>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-icon"><i class="fas fa-file-pdf"></i></div>
          <div>
            <h4>CV</h4>
            <div class="cv-buttons">
              <a href="${esc(nav.cvViewUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                <i class="fas fa-eye"></i> View
              </a>
              <a href="${esc(nav.cvDownloadUrl)}" download class="btn btn-primary btn-sm">
                <i class="fas fa-download"></i> Download
              </a>
            </div>
          </div>
        </div>
      </div>
      <form class="contact-form" id="contactForm"
            action="https://formspree.io/f/${esc(meta.formspreeId)}" method="POST">
        <div class="form-group">
          <label for="cf-name">Name</label>
          <input type="text" id="cf-name" name="name" placeholder="Your name" required>
        </div>
        <div class="form-group">
          <label for="cf-email">Email</label>
          <input type="email" id="cf-email" name="email" placeholder="your@email.com" required>
        </div>
        <div class="form-group">
          <label for="cf-subject">Subject</label>
          <input type="text" id="cf-subject" name="subject" placeholder="What's this about?">
        </div>
        <div class="form-group">
          <label for="cf-message">Message</label>
          <textarea id="cf-message" name="message" rows="5" placeholder="Tell me more…" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full" id="cfSubmit">
          <i class="fas fa-paper-plane"></i> Send Message
        </button>
        <p class="form-note" id="cfNote"></p>
      </form>
    </div>
  </div>
</section>`;
  }

  function renderFooter(contact, hero) {
    return `
<footer>
  <div class="footer-inner">
    <p class="footer-name">${esc(hero.name)}</p>
    <p class="footer-tagline">${esc(contact.footerTagline)}</p>
    <div class="footer-social">
      <a href="${esc(contact.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <i class="fab fa-linkedin"></i>
      </a>
      <a href="${esc(contact.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <i class="fab fa-instagram"></i>
      </a>
      <a href="mailto:${esc(contact.email)}" aria-label="Email">
        <i class="fas fa-envelope"></i>
      </a>
    </div>
    <p class="footer-copy">&copy; <span id="year"></span> ${esc(hero.name)}. All rights reserved.</p>
  </div>
</footer>`;
  }

  /* ── 6. Build & inject HTML ────────────────────── */
  document.getElementById('app').innerHTML =
    renderNav(data.nav) +
    '<main>' +
      renderHero(data.hero) +
      renderAbout(data.about) +
      renderSkills(data.skills, data.skillTags) +
      renderAchievements(data.stats, data.achievements) +
      renderExperience(data.experience) +
      renderBrands(data.brands) +
      renderContact(data.contact, data.nav, data.meta) +
    '</main>' +
    renderFooter(data.contact, data.hero);

  /* ── 7. Interactions ───────────────────────────── */

  /* Theme toggle */
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  /* Hamburger */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
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
  }

  /* Active nav on scroll */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => navObs.observe(s));

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(
    '.skill-card, .achievement-card, .timeline-card, .brand-card, .about-grid, .contact-grid, .stat-item'
  );
  revealEls.forEach(el => el.classList.add('reveal'));
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* Counter animation */
  const counters = document.querySelectorAll('.stat-number');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target) || target === 0) return;
      const duration = 1800, step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = Math.floor(current); }
      }, step);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  /* Navbar shadow on scroll */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10 ? '0 4px 30px rgba(0,0,0,0.15)' : 'none';
  }, { passive: true });

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Contact form */
  const form = document.getElementById('contactForm');
  const cfNote = document.getElementById('cfNote');
  const cfSubmit = document.getElementById('cfSubmit');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      cfSubmit.disabled = true;
      cfSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      cfNote.textContent = '';
      cfNote.className = 'form-note';
      try {
        const res = await fetch(form.action, {
          method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          cfNote.textContent = "✓ Message sent! I'll get back to you soon.";
          cfNote.classList.add('success');
          form.reset();
        } else { throw new Error(); }
      } catch {
        cfNote.textContent = '✗ Something went wrong. Please email me directly.';
        cfNote.classList.add('error');
      }
      cfSubmit.disabled = false;
      cfSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    });
  }

  } /* end run(data) */

})();
