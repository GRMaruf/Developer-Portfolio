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
  const typed_data = document.getElementById('typed_data').innerText
  const roles = typed_data.split(',').slice(0, -1);
  console.log(roles)
  
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

  const PROJECTS = JSON.parse(document.getElementById('project_data').textContent);
  console.log(PROJECTS);

  function open(projectId) {
    const data = PROJECTS[projectId];
    if (!data) return;

    if (data.img) document.getElementById('modal-img').src = data.img;
    else document.getElementById('modal-img').src = "https://picsum.photos/seed/project-quiz-portal/640/400";
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
    let valid = true;
    form.querySelectorAll('input, textarea').forEach(field => {
      if (!validate(field)) valid = false;
    });
    
    if (!valid) {
      e.preventDefault(); // Stop submission ONLY if validation fails
      const firstError = form.querySelector('.has-error input, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }
    
    // REMOVED form.reset() and success.classList.add() from here.
    // Let the HTML POST request happen naturally.
  });

})();