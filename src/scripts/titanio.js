/* Efectos de la página. Sin librerías. Sin este archivo la página se ve completa. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var REVELAR = '.rev-blur, .semana';

  /* El enlace de la sección activa se resalta en el menú (también con movimiento reducido). */
  var enlaces = $$('.nav-sec');
  if (enlaces.length && 'IntersectionObserver' in window) {
    var ioNav = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        enlaces.forEach(function (a) { a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('#horarios, #plan, #galeria, #llegar').forEach(function (s) { ioNav.observe(s); });
  }

  if (reducido) { $$(REVELAR).forEach(function (e) { e.classList.add('visto'); }); return; }

  try {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
      $$(REVELAR).forEach(function (e) { io.observe(e); });
    } else {
      $$(REVELAR).forEach(function (e) { e.classList.add('visto'); });
    }

    var barra = $('#barra');
    var progreso = $('.progreso');
    var base = $('.lh-base');
    var yAntes = window.scrollY, pendiente = false;
    function alScroll() {
      pendiente = false;
      var y = window.scrollY, vh = window.innerHeight;
      var total = document.documentElement.scrollHeight - vh;
      if (progreso) progreso.style.setProperty('--prog', total > 0 ? (y / total).toFixed(4) : 0);
      if (barra) {
        barra.classList.toggle('fondo-barra', y > 40);
        barra.classList.toggle('oculta', y > yAntes && y > vh * 0.6);
      }
      if (base && y < vh) base.style.translate = '0 ' + (y * 0.25).toFixed(1) + 'px';
      yAntes = y;
    }
    window.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); } }, { passive: true });
    alScroll();
  } catch (e) {
    $$(REVELAR).forEach(function (el) { el.classList.add('visto'); });
  }
})();
