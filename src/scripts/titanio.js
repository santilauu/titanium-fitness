/* Efectos de la página. Sin librerías. Sin este archivo la página se ve completa.
   Las animaciones se encienden con la clase .mov (la decide el <head>) y se alternan con el botón "Animaciones". */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var raiz = document.documentElement;
  var mov = raiz.classList.contains('mov');
  var sistema = raiz.classList.contains('sistema-sin-mov');
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var limitar = function (n, a, b) { return Math.min(b, Math.max(a, n)); };
  var REVELAR = '.rev-blur, .semana';

  /* ---------- Botón de animaciones ---------- */
  var btn = $('#mov-btn'), txt = $('#mov-txt');
  if (btn) {
    btn.setAttribute('aria-pressed', mov ? 'true' : 'false');
    txt.textContent = mov ? 'Animaciones: sí' : (sistema ? 'Activar animaciones' : 'Animaciones: no');
    btn.addEventListener('click', function () {
      try { localStorage.setItem('movimiento', mov ? 'no' : 'si'); } catch (e) { /* sin almacenamiento: no se recuerda */ }
      location.reload();
    });
  }

  /* El enlace de la sección activa se resalta en el menú. */
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

  if (!mov) { $$(REVELAR).forEach(function (e) { e.classList.add('visto'); }); return; }

  try {
    /* ---------- Revelados ---------- */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
      $$(REVELAR).forEach(function (e) { io.observe(e); });
    } else {
      $$(REVELAR).forEach(function (e) { e.classList.add('visto'); });
    }

    /* ---------- Números que cuentan ---------- */
    var formato = function (el, n) {
      var dec = Number(el.dataset.dec || 0);
      var s = dec ? n.toFixed(dec).replace('.', ',') : (el.dataset.miles ? Math.round(n).toLocaleString('es-AR') : String(Math.round(n)));
      return (el.dataset.prefijo || '') + s;
    };
    var contar = function (el) {
      var fin = Number(el.dataset.cuenta), t0 = null, dur = 1800;
      el.textContent = formato(el, 0);
      requestAnimationFrame(function paso(t) {
        if (t0 === null) t0 = t;
        var p = limitar((t - t0) / dur, 0, 1);
        el.textContent = formato(el, fin * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)));
        if (p < 1) requestAnimationFrame(paso);
      });
    };
    var numeros = $$('[data-cuenta]');
    numeros.forEach(function (el) { el.textContent = formato(el, 0); });
    if ('IntersectionObserver' in window) {
      var ioN = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { ioN.unobserve(e.target); setTimeout(function () { contar(e.target); }, 200); } });
      }, { threshold: 0.4 });
      numeros.forEach(function (el) { ioN.observe(el); });
    } else { numeros.forEach(contar); }

    /* ---------- Scroll ---------- */
    var barra = $('#barra'), progreso = $('.progreso'), base = $('.lh-base');
    var yAntes = window.scrollY, pendiente = false;
    var alScroll = function () {
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
    };
    window.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; requestAnimationFrame(alScroll); } }, { passive: true });
    alScroll();

    /* ---------- Puntero ---------- */
    if (mouse) {
      var anillo = $('#anillo');
      var ax = 0, ay = 0, px = 0, py = 0, activo = false;
      window.addEventListener('pointermove', function (e) {
        px = e.clientX; py = e.clientY;
        if (!activo && anillo) { activo = true; ax = px; ay = py; anillo.style.opacity = '1'; }
        if (anillo) anillo.classList.toggle('grande', !!(e.target.closest && e.target.closest('a, button, summary')));
      }, { passive: true });
      document.addEventListener('pointerleave', function () { if (anillo) anillo.style.opacity = '0'; activo = false; });
      (function seguir() {
        ax += (px - ax) * 0.18; ay += (py - ay) * 0.18;
        if (anillo) anillo.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
        requestAnimationFrame(seguir);
      })();

      $$('.lh-btn').forEach(function (el) {
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          el.style.transform = 'translate3d(' + ((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1) + 'px,' + ((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1) + 'px,0)';
        });
        el.addEventListener('pointerleave', function () {
          el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), box-shadow .35s';
          el.style.transform = '';
          setTimeout(function () { el.style.transition = ''; }, 620);
        });
      });

      $$('[data-tilt]').forEach(function (fig) {
        fig.addEventListener('pointermove', function (e) {
          var r = fig.getBoundingClientRect();
          fig.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * -22).toFixed(1) + 'px');
          fig.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * -22).toFixed(1) + 'px');
        });
        fig.addEventListener('pointerleave', function () { fig.style.setProperty('--px', '0px'); fig.style.setProperty('--py', '0px'); });
      });
    }
  } catch (e) {
    $$(REVELAR).forEach(function (el) { el.classList.add('visto'); });
  }
})();
