const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navOverlay = document.getElementById('navOverlay');
const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
const form = document.getElementById('consultForm');
const submitBtn = document.getElementById('submitBtn');
const successBox = document.getElementById('formSuccess');
const waBtn = document.getElementById('waBtn');

const CONSULT_PHONE = '7700806086';

function wrapPageContent() {
  const body = document.body;
  if (!body || body.querySelector('.page-content-shell')) return;

  const shell = document.createElement('div');
  shell.className = 'page-content-shell';

  const nodesToWrap = Array.from(body.children).filter((element) => {
    return (
      !element.classList.contains('topinfo') &&
      !element.classList.contains('topbar') &&
      !element.classList.contains('nav-overlay') &&
      !element.classList.contains('sticky-call-btn') &&
      element.tagName !== 'SCRIPT'
    );
  });

  if (!nodesToWrap.length) return;

  const firstNode = nodesToWrap[0];
  body.insertBefore(shell, firstNode);
  nodesToWrap.forEach((node) => shell.appendChild(node));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wrapPageContent, { once: true });
} else {
  wrapPageContent();
}

function closeMenu() {
  if (!navToggle || !mainNav) return;
  mainNav.classList.remove('open');
  if (navOverlay) navOverlay.classList.remove('open');
  document.body.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
}

function toggleMenu() {
  if (!navToggle || !mainNav) return;
  const isOpen = mainNav.classList.toggle('open');
  if (navOverlay) navOverlay.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

if (navToggle && mainNav) {
  if (!mainNav.querySelector('.nav-close')) {
    const navCloseBtn = document.createElement('button');
    navCloseBtn.type = 'button';
    navCloseBtn.className = 'nav-close';
    navCloseBtn.setAttribute('aria-label', 'Close menu');
    navCloseBtn.textContent = '×';
    navCloseBtn.addEventListener('click', closeMenu);
    mainNav.prepend(navCloseBtn);
  }

  navToggle.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 860) closeMenu();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860) {
      mainNav.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('open');
      document.body.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      closeMenu();
    }
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (form.name?.value || '').trim();
    const phone = (form.phone?.value || '').trim();
    const email = (form.email?.value || '').trim();
    const message = (form.message?.value || '').trim();

    let valid = true;

    [form.name, form.phone].forEach((field) => {
      if (!field) return;
      field.classList.remove('invalid');
      if (!field.value.trim()) {
        field.classList.add('invalid');
        valid = false;
      }
    });

    if (form.email) {
      form.email.classList.remove('invalid');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.email.classList.add('invalid');
        valid = false;
      }
    }

    if (!valid) {
      form.classList.remove('jiggle');
      // Force reflow so repeat invalid submits replay the animation every time.
      void form.offsetWidth;
      form.classList.add('jiggle');
      return;
    }

    const waText = encodeURIComponent(
      `*Consultation Request*\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `${email ? `Email: ${email}\n` : ''}` +
      `${message ? `\nMessage:\n${message}` : ''}`,
    );

    const waLink = `https://wa.me/${CONSULT_PHONE}?text=${waText}`;

    if (waBtn) {
      waBtn.href = waLink;
    }

    if (submitBtn) submitBtn.classList.add('hidden');

    form
      .querySelectorAll('.form-row, .form-group, .form-disclaimer')
      .forEach((el) => el.classList.add('hidden'));

    if (successBox) successBox.classList.remove('hidden');

    window.open(waLink, '_blank', 'noopener,noreferrer');
  });

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('invalid'));
  });

  form.addEventListener('animationend', (e) => {
    if (e.animationName === 'formJiggle') {
      form.classList.remove('jiggle');
    }
  });
}
