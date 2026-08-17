/* ============================================================
   Pablo Prats — Portfolio
   Sin dependencias: reveal al scroll, nav, lightbox y vídeo lite.
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── año del footer ──────────────────────────────────── */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── topbar: aparece al salir del hero ───────────────── */
  const topbar = document.querySelector('.topbar');
  const hero = document.querySelector('.hero');
  const bar = document.getElementById('progress-bar');

  const onScroll = () => {
    const y = window.scrollY;
    topbar.classList.toggle('is-visible', y > (hero ? hero.offsetHeight * 0.65 : 400));

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── menú móvil ──────────────────────────────────────── */
  const toggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.topbar__nav');

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeNav();
  });

  /* ── enlace activo según la sección visible ──────────── */
  const links = Array.from(nav.querySelectorAll('a'));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id)
          );
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ── reveal al scroll ────────────────────────────────── */
  const revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ── vídeo: se carga el iframe solo al pulsar play ───── */
  document.querySelectorAll('.video').forEach((box) => {
    const btn = box.querySelector('.video__play');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const id = box.dataset.yt;
      const frame = document.createElement('iframe');
      frame.src =
        'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.title = 'Vídeo moodboard de Pablo Prats';
      frame.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      box.replaceChildren(frame);
    });
  });

  /* ── lightbox ────────────────────────────────────────── */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-cap');
  const btnClose = lb.querySelector('.lightbox__close');
  const btnPrev = lb.querySelector('.lightbox__nav--prev');
  const btnNext = lb.querySelector('.lightbox__nav--next');

  const shots = Array.from(document.querySelectorAll('.shot img'));
  let index = 0;
  let lastFocus = null;

  const captionOf = (img) => {
    const cap = img.closest('figure')?.querySelector('figcaption');
    return cap ? cap.textContent.trim() : img.alt;
  };

  const show = (i) => {
    index = (i + shots.length) % shots.length;
    const img = shots[index];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = captionOf(img);
  };

  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  };

  const close = () => {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  shots.forEach((img, i) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', () => open(i));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(index - 1));
  btnNext.addEventListener('click', () => show(index + 1));
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox__figure')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
