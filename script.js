(() => {
  const root = document.documentElement;
  const nav = document.querySelector('.nav');
  const meter = document.querySelector('.scroll-meter');
  const cursor = document.querySelector('.custom-cursor');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const tourImage = document.querySelector('.tour-photo');
  const tourIndex = document.querySelector('.photo-index');
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    meter.style.transform = `scaleX(${progress})`;
    nav.classList.toggle('nav-scrolled', window.scrollY > 48);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? 'CLOSE −' : 'MENU +';
  });
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('nav-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'MENU +';
  }));

  const chapters = [...document.querySelectorAll('[data-chapter]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number(entry.target.dataset.chapter);
        chapters.forEach((chapter) => chapter.classList.toggle('tour-step-active', chapter === entry.target));
        tourImage.style.backgroundImage = `url('${entry.target.dataset.image}')`;
        tourIndex.textContent = `0${index + 1} / 04`;
      });
    }, { rootMargin: '-38% 0px -38% 0px' });
    chapters.forEach((chapter) => observer.observe(chapter));
  }

  document.querySelectorAll('[data-plan]').forEach((plan) => {
    plan.addEventListener('click', () => {
      const wasOpen = plan.classList.contains('plan-open');
      document.querySelectorAll('[data-plan]').forEach((other) => {
        other.classList.remove('plan-open');
        other.setAttribute('aria-expanded', 'false');
        other.querySelector('.plan-mark').textContent = '↗';
      });
      if (!wasOpen) {
        plan.classList.add('plan-open');
        plan.setAttribute('aria-expanded', 'true');
        plan.querySelector('.plan-mark').textContent = '−';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lightboxImage.removeAttribute('src');
  };
  document.querySelectorAll('[data-image][data-label]').forEach((image) => {
    image.addEventListener('click', () => {
      lightboxImage.src = image.dataset.image;
      lightboxImage.alt = image.dataset.label;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('button').focus();
    });
  });
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.closest('.lightbox-close')) closeLightbox();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', (event) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    }, { passive: true });
    document.querySelectorAll('[data-cursor]').forEach((element) => {
      element.addEventListener('pointerenter', () => {
        cursor.textContent = element.dataset.cursor;
        cursor.classList.add('cursor-active');
      });
      element.addEventListener('pointerleave', () => {
        cursor.textContent = '';
        cursor.classList.remove('cursor-active');
      });
    });
  }

  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * 10;
      root.style.setProperty('--hero-x', `${x}px`);
      root.style.setProperty('--hero-y', `${y}px`);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      root.style.setProperty('--hero-x', '0px');
      root.style.setProperty('--hero-y', '0px');
    });
  }

  document.querySelector('#contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const subject = encodeURIComponent('Enquiry for Fitness Courtyard');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:hello@fitnesscourtyard.in?subject=${subject}&body=${body}`;
  });
})();
