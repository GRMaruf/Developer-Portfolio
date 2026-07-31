/* ===================================================================
   THEME TOGGLE
   =================================================================== */
(function() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: light)').matches) root.setAttribute('data-theme', 'light');

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ===================================================================
   NAV — mobile toggle, scrolled state, active link, scroll progress
   =================================================================== */
(function() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const links = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    backToTop.classList.toggle('is-visible', y > 600);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (y / docH * 100) + '%';

    // Active section
    const sections = document.querySelectorAll('main section[id]');
    let active = null;
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (y >= top) active = s.id;
    });
    if (active) {
      links.forEach(l => {
        l.classList.toggle('is-active', l.getAttribute('href') === '#' + active);
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ===================================================================
   TYPING EFFECT (hero role)
   =================================================================== */
(function() {
  const el = document.getElementById('typed');
  if (!el) return;
  const roles = [
    'Junior Django Developer',
    'Backend Engineer',
    'Python Enthusiast',
    'REST API Designer',
    'Problem Solver'
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) { el.textContent = roles[0]; return; }

  let roleIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const role = roles[roleIdx];
    if (!deleting) {
      el.textContent = role.slice(0, ++charIdx);
      if (charIdx === role.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = role.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  setTimeout(tick, 600);
})();

/* ===================================================================
   SCROLL REVEAL
   =================================================================== */
(function() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(r => r.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(r => io.observe(r));
})();

/* ===================================================================
   COUNTER ANIMATION
   =================================================================== */
(function() {
  const counters = document.querySelectorAll('[data-counter]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(el) {
    const target = parseInt(el.dataset.counter, 10);
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1500;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(target * eased);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => io.observe(c));
})();

/* ===================================================================
   3D WORD RING — Currently Learning
   =================================================================== */
(function() {
  const ring = document.getElementById('ring');
  const stage = document.getElementById('ring-stage');
  if (!ring) return;

  const WORDS = ['Docker', 'Redis', 'Celery', 'React', 'System Design', 'Kubernetes', 'AWS', 'GraphQL'];
  const all = [...WORDS, ...WORDS];
  const step = 360 / all.length;
  const radius = 200;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  all.forEach((w, i) => {
    const d = document.createElement('div');
    d.className = 'ring-item';
    d.style.transform = `rotateX(${i * step}deg) translateZ(${radius}px) translateY(-50%)`;
    d.innerHTML = `<span>${w}</span>`;
    ring.appendChild(d);
  });

  if (reduceMotion) {
    ring.style.transform = 'rotateX(15deg)';
    return;
  }

  let targetRot = 0, currentRot = 0, velocity = 0, currentVel = 0;
  let lastScrollY = window.scrollY;
  let lastTime = performance.now();

  function updateTarget() {
    const rect = stage.getBoundingClientRect();
    const winH = window.innerHeight;
    // progress: -1 when section is below viewport, 0 when centered, +1 when above
    const progress = (winH / 2 - rect.top - rect.height / 2) / (winH / 2 + rect.height / 2);
    const clamped = Math.max(-1.2, Math.min(1.2, progress));
    targetRot = clamped * 260;

    const now = performance.now();
    const dy = window.scrollY - lastScrollY;
    const dt = Math.max(1, now - lastTime);
    velocity = dy / dt * 0.02;
    lastScrollY = window.scrollY;
    lastTime = now;
  }

  let rafId;
  function tick() {
    currentRot += (targetRot - currentRot) * 0.08;
    currentVel += (velocity - currentVel) * 0.12;
    velocity *= 0.9;
    ring.style.transform = `rotateX(${currentRot}deg)`;
    const blur = Math.min(Math.abs(currentVel) * 1.5, 2.5);
    ring.querySelectorAll('.ring-item span').forEach(s => {
      s.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
    });
    rafId = requestAnimationFrame(tick);
  }

  let inView = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      inView = e.isIntersecting;
      if (inView) {
        updateTarget();
        if (!rafId) tick();
      } else {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    });
  }, { threshold: 0 });
  io.observe(stage);

  window.addEventListener('scroll', () => {
    if (inView) updateTarget();
  }, { passive: true });
})();

/* ===================================================================
   PROJECT MODAL
   =================================================================== */
(function() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const openers = document.querySelectorAll('.js-open-modal, .project-card');

  const PROJECTS = {
    'quiz-portal': {
      title: 'Quiz Portal',
      sub: 'Timed quizzes · Question banks · Leaderboard · Analytics',
      img: 'https://picsum.photos/seed/project-quiz-portal/1200/675',
      overview: 'A Django-based quiz platform built for university tutoring sessions. Supports question banks by topic, randomized question order per attempt, timed sessions, and a per-student analytics view showing weak areas. Includes an admin interface for instructors to author questions with rich-text support and inline LaTeX.',
      features: [
        'Question bank with topic tagging, difficulty levels, and rich-text + LaTeX support',
        'Randomized question order and answer-shuffling per attempt to discourage cheating',
        'Timed sessions with server-side enforcement and graceful timeout handling',
        'Leaderboard with rank, percentile, and per-topic breakdown',
        'Analytics dashboard showing weakest topics per student',
        'JWT authentication with role-based permissions (student vs instructor)'
      ],
      tags: ['Django', 'Django REST Framework', 'PostgreSQL', 'JWT', 'pytest', 'Celery'],
      learned: 'Learned the hard way that "server-side time" and "client-side time" are not the same thing — moved all timing logic to the backend after a student exploited clock skew. Also learned to model attempt state as an explicit state machine rather than a pile of boolean flags.',
      github: 'https://github.com/grmaruf/quiz-portal',
      demo: '#'
    },
    'resume-builder': {
      title: 'Resume Builder',
      sub: 'Multi-template · Live preview · PDF export',
      img: 'https://picsum.photos/seed/project-resume-builder/1200/675',
      overview: 'A resume builder for students who hate fighting with Word. Users fill structured forms per section (education, experience, skills, projects); the app renders a live preview and exports a clean PDF via WeasyPrint. Supports three templates and per-section autosave.',
      features: [
        'Three templates with switchable typography and accent colors',
        'Live preview as you type — no save step required for visual updates',
        'Per-section autosave to localStorage + server sync on blur',
        'PDF export via WeasyPrint with consistent fonts across templates',
        'Drag-and-drop reordering for experience and projects',
        'Public shareable link with optional password protection'
      ],
      tags: ['Django', 'WeasyPrint', 'AJAX', 'SQLite', 'Vanilla JS'],
      learned: 'WeasyPrint is great until you hit a font fallback issue — ended up bundling fonts explicitly. Also: drag-and-drop without a library is doable but you really want to write the state machine on paper first.',
      github: 'https://github.com/grmaruf/resume-builder',
      demo: '#'
    },
    'job-portal': {
      title: 'Job Portal',
      sub: 'Two-sided · Applications · Saved searches · Alerts',
      img: 'https://picsum.photos/seed/project-job-portal/1200/675',
      overview: 'A two-sided job board where employers post openings and candidates apply with tracked status. Includes saved searches that run nightly via Celery, emailing candidates new matches. Designed the schema to support future features (saved candidates, employer branding) without a rewrite.',
      features: [
        'Two role types (employer, candidate) with separate onboarding flows',
        'Job posting with rich-text description, tags, salary range, and location type',
        'Application tracking with status transitions and email notifications',
        'Saved searches with nightly Celery beat job sending digest emails',
        'Full-text search on job title and description via PostgreSQL tsvector',
        'Rate-limited application submission to prevent spam'
      ],
      tags: ['Django', 'DRF', 'PostgreSQL', 'Celery', 'Redis', 'Docker'],
      learned: 'Designing the application state machine upfront would have saved me a migration headache later. Also: full-text search in Postgres is criminally underrated — you can ship a real search feature without Elasticsearch for a long time.',
      github: 'https://github.com/grmaruf/job-portal',
      demo: '#'
    },
    'studyhub': {
      title: 'StudyHub',
      sub: 'Study groups · Shared notes · Spaced repetition',
      img: 'https://picsum.photos/seed/project-studyhub/1200/675',
      overview: 'A platform for small study groups — shared notes, threaded discussions, and a spaced-repetition card system with daily review reminders. Built to scratch my own itch during exam season; now used by ~30 classmates.',
      features: [
        'Group creation with invite codes and role-based membership',
        'Shared Markdown notes with collaborative editing (CRDT-lite via operational transform)',
        'Threaded discussions with nested replies and code formatting',
        'Spaced-repetition card system based on SM-2 algorithm',
        'Daily review reminder emails via Celery',
        'Per-group analytics showing review consistency'
      ],
      tags: ['Django', 'HTMX', 'PostgreSQL', 'Redis', 'Celery'],
      learned: 'HTMX is a delightful middle ground when React feels like overkill — you can build genuinely interactive UIs while keeping the mental model server-first. CRDTs are hard; I ended up with a simplified OT that works for small groups.',
      github: 'https://github.com/grmaruf/studyhub',
      demo: '#'
    },
    'portfolio': {
      title: 'Portfolio Website',
      sub: 'Semantic HTML · Vanilla CSS · Accessible · Fast',
      img: 'https://picsum.photos/seed/project-portfolio-site/1200/675',
      overview: 'This very site. Built with HTML5, vanilla CSS (custom properties + a clear architecture), and a small amount of vanilla JS. Focus on accessibility (semantic HTML, focus states, prefers-reduced-motion), performance (no framework, system fonts fallback, lazy images), and clean code that serves as a portfolio piece in itself.',
      features: [
        'Semantic HTML5 structure with one h1 per page and logical heading hierarchy',
        'CSS architecture split into variables / reset / utilities / animations / components',
        'Dark/light theme toggle with localStorage persistence and prefers-color-scheme fallback',
        'All animations respect prefers-reduced-motion',
        'Lighthouse score 95+ across all categories',
        'JSON-LD structured data for Person schema'
      ],
      tags: ['HTML5', 'CSS3', 'Vanilla JS', 'A11y', 'SEO'],
      learned: 'Building a portfolio in vanilla CSS makes you actually understand the cascade. I also learned that "accessible" is not a checkbox — every interactive element needs a keyboard story, not just an aria-label.',
      github: 'https://github.com/grmaruf/portfolio',
      demo: '#'
    },
    'expense-api': {
      title: 'Expense Tracker API',
      sub: 'Headless · OpenAPI · pytest · CSV export',
      img: 'https://picsum.photos/seed/project-expense-api/1200/675',
      overview: 'A headless (no UI) expense-tracking API designed as a study in clean REST design. Categories, recurring transactions, monthly summaries, CSV export. Fully documented with OpenAPI, 90% test coverage with pytest, and a small CLI client for personal use.',
      features: [
        'Full CRUD for transactions, categories, and accounts',
        'Recurring transaction support with daily/weekly/monthly frequencies',
        'Monthly summary endpoint with category breakdown and trends',
        'CSV export endpoint with streaming response for large datasets',
        'OpenAPI schema auto-generated via drf-spectacular, served at /schema/',
        '90% test coverage with pytest and pytest-django, including edge cases'
      ],
      tags: ['Django', 'DRF', 'OpenAPI', 'pytest', 'PostgreSQL'],
      learned: 'Writing tests first forces you to think about the API from the consumer\'s perspective. drf-spectacular is genuinely better than hand-writing OpenAPI specs. Streaming responses for CSV export is a 10-line change that prevents OOM on large datasets.',
      github: 'https://github.com/grmaruf/expense-api',
      demo: '#'
    }
  };

  function open(projectId) {
    const data = PROJECTS[projectId];
    if (!data) return;
    document.getElementById('modal-img').src = data.img;
    document.getElementById('modal-img').alt = data.title + ' screenshot';
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-sub').textContent = data.sub;
    document.getElementById('modal-overview').textContent = data.overview;

    const featuresEl = document.getElementById('modal-features');
    featuresEl.innerHTML = '';
    data.features.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      featuresEl.appendChild(li);
    });

    const tagsEl = document.getElementById('modal-tags');
    tagsEl.innerHTML = '';
    data.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.textContent = t;
      tagsEl.appendChild(span);
    });

    document.getElementById('modal-learned').textContent = data.learned;
    document.getElementById('modal-github').href = data.github;
    document.getElementById('modal-demo').href = data.demo;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openers.forEach(el => {
    el.addEventListener('click', (e) => {
      // If clicking a link inside the card (other than the details link), let it through
      if (e.target.closest('a') && !e.target.closest('.js-open-modal') && !e.target.closest('.project-card')) return;
      if (e.target.closest('a') && !e.target.closest('.js-open-modal') && e.target.closest('.project-card')) return;
      e.preventDefault();
      const projectId = el.dataset.project || el.dataset.modalProject;
      if (projectId) open(projectId);
    });
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();

/* ===================================================================
   CONTACT FORM VALIDATION
   =================================================================== */
(function() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name (2+ characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 ? '' : 'Subject should be at least 3 characters.',
    message: (v) => v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'
  };

  function validate(field) {
    const fn = validators[field.name];
    if (!fn) return true;
    const err = fn(field.value);
    const group = field.closest('.form-group');
    const errEl = group.querySelector('.form-error');
    if (err) {
      group.classList.add('has-error');
      if (errEl) errEl.textContent = err;
      return false;
    } else {
      group.classList.remove('has-error');
      if (errEl) errEl.textContent = '';
      return true;
    }
  }

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('has-error')) validate(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input, textarea').forEach(field => {
      if (!validate(field)) valid = false;
    });
    if (!valid) {
      const firstError = form.querySelector('.has-error input, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }
    // Simulate successful submit (replace with real endpoint)
    success.classList.add('is-visible');
    form.reset();
    setTimeout(() => success.classList.remove('is-visible'), 6000);
  });
})();