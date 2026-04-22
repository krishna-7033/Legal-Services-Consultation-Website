const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
const form = document.getElementById('consultForm');
const submitBtn = document.getElementById('submitBtn');
const successBox = document.getElementById('formSuccess');
const waBtn = document.getElementById('waBtn');

const LAWYER_PHONE = '7033169536';

function closeMenu() {
  if (!navToggle || !mainNav) return;
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
}

function toggleMenu() {
  if (!navToggle || !mainNav) return;
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 860) closeMenu();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
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

    if (!valid) return;

    const waText = encodeURIComponent(
      `*Consultation Request*\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `${email ? `Email: ${email}\n` : ''}` +
      `${message ? `\nMessage:\n${message}` : ''}`,
    );

    const waLink = `https://wa.me/${LAWYER_PHONE}?text=${waText}`;

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
}
