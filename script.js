/* ==============================
   LE POINTILLEUX — Script
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== HEADER SCROLL =====
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header.classList.toggle('header--scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  // ===== BURGER MENU =====
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', () => {
    burger.classList.toggle('burger--open');
    nav.classList.toggle('nav--open');
    document.body.style.overflow = nav.classList.contains('nav--open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('burger--open');
      nav.classList.remove('nav--open');
      document.body.style.overflow = '';
    });
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observerOptions = { rootMargin: '-30% 0px -70% 0px' };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ===== PORTFOLIO FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
        if (match) {
          item.style.animation = 'none';
          item.offsetHeight; // reflow
          item.style.animation = '';
        }
      });
    });
  });

  // ===== SCROLL ANIMATIONS =====
  const animElements = document.querySelectorAll(
    '.service-card, .portfolio__item, .client-card, .contact__item'
  );

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animElements.forEach(el => animObserver.observe(el));

  // ===== CONTACT FORM (FormSubmit) =====
  const form = document.getElementById('contactForm');
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // Honeypot : formulaire rempli par un bot -> on ignore silencieusement
    if (data.get('_honey')) return;

    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone') || 'Non renseigné',
      service: data.get('service') || 'Non précisé',
      message: data.get('message'),
      _subject: 'Nouveau message depuis le site Le Pointilleux',
      _template: 'table',
      _captcha: 'false'
    };

    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';

    try {
      const res = await fetch('https://formsubmit.co/ajax/bachirzi@yahoo.fr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);

      btn.textContent = 'Message envoyé !';
      btn.style.background = '#27AE60';
      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    } catch (err) {
      btn.textContent = 'Erreur, réessayez';
      btn.style.background = '#E8453C';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
});
