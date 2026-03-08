(() => {
  "use strict";

  /* ========================================
   *  CONFIG — update these with real values
   * ======================================== */
  const LAWYER_PHONE = "919876543210"; // WhatsApp number (country code, no +)
  const LAWYER_EMAIL = "advocate.jiji@example.com";

  /* ===== DOM refs ===== */
  const topbar = document.getElementById("topbar");
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  const form = document.getElementById("consultForm");
  const submitBtn = document.getElementById("submitBtn");
  const successBox = document.getElementById("formSuccess");
  const waBtn = document.getElementById("waBtn");

  /* ========================================
   *  STICKY NAV — add shadow on scroll
   * ======================================== */
  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      topbar.classList.toggle("scrolled", window.scrollY > 20);
      lastScroll = window.scrollY;
    },
    { passive: true },
  );

  /* ========================================
   *  MOBILE NAV TOGGLE
   * ======================================== */
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });

  // Close mobile nav on link click
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ========================================
   *  SMOOTH SCROLL
   * ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = topbar.offsetHeight + 12;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    });
  });

  /* ========================================
   *  ACTIVE NAV HIGHLIGHT
   * ======================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = mainNav.querySelectorAll("a[href^='#']");
  const observerOptions = { rootMargin: "-30% 0px -60% 0px" };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const active = mainNav.querySelector(`a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }, observerOptions);

  sections.forEach((s) => observer.observe(s));

  /* ========================================
   *  SCROLL-REVEAL ANIMATIONS
   * ======================================== */
  const fadeEls = document.querySelectorAll(
    ".practice-card, .network-card, .sidebar-card, .about-photo-wrap, .about-text, .badge-card",
  );
  fadeEls.forEach((el) => el.classList.add("fade-in"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  fadeEls.forEach((el) => revealObserver.observe(el));

  /* ========================================
   *  FORM HANDLING
   * ======================================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Gather values
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const area = form.area.value;
    const mode = form.mode.value;
    const time = form.time.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    let valid = true;
    [form.name, form.phone, form.email, form.message].forEach((field) => {
      field.classList.remove("invalid");
      if (!field.value.trim()) {
        field.classList.add("invalid");
        valid = false;
      }
    });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.email.classList.add("invalid");
      valid = false;
    }
    if (!valid) return;

    /* --- Email notification (mailto) --- */
    const subject = encodeURIComponent(`New Consultation Request from ${name}`);
    const body = encodeURIComponent(
      `New consultation request received via website:\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Practice Area: ${area || "Not specified"}\n` +
        `Preferred Mode: ${mode || "Not specified"}\n` +
        `Preferred Time: ${time || "Not specified"}\n\n` +
        `Message:\n${message}\n`,
    );
    // Open default mail client with pre-filled message
    window.location.href = `mailto:${LAWYER_EMAIL}?subject=${subject}&body=${body}`;

    /* --- WhatsApp pre-fill --- */
    const waText = encodeURIComponent(
      `*Consultation Request*\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n` +
        `Practice Area: ${area || "N/A"}\n` +
        `Preferred Mode: ${mode || "N/A"}\n` +
        `Preferred Time: ${time || "N/A"}\n\n` +
        `Message:\n${message}`,
    );
    waBtn.href = `https://wa.me/${LAWYER_PHONE}?text=${waText}`;

    /* --- Show success state --- */
    submitBtn.classList.add("hidden");
    form
      .querySelectorAll(".form-row, .form-group, .form-disclaimer")
      .forEach((el) => el.classList.add("hidden"));
    successBox.classList.remove("hidden");
  });

  /* ========================================
   *  REMOVE INVALID STATE ON INPUT
   * ======================================== */
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => field.classList.remove("invalid"));
  });
})();
