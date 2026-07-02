// EspressioneDanza — menu mobile, evidenziazione sezione attiva, lightbox galleria
(function () {
  'use strict';

  // Segnala al CSS che JS è attivo (senza JS il menu resta visibile in linea)
  document.documentElement.classList.add('js');

  // --- Menu mobile ---
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Link attivo durante lo scroll ---
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // --- Lightbox galleria ---
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.galleria-griglia a.foto'));
  var lightbox = document.querySelector('.lightbox');
  if (thumbs.length && lightbox) {
    var img = lightbox.querySelector('img');
    var caption = lightbox.querySelector('.lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var current = -1;
    var lastFocus = null;

    function show(i) {
      current = (i + thumbs.length) % thumbs.length;
      var a = thumbs[current];
      var thumbImg = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumbImg ? thumbImg.alt : '';
      caption.textContent = a.getAttribute('data-caption') || '';
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      closeBtn.focus();
    }
    function close() {
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    thumbs.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }
})();
