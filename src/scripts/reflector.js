/* Reflector de la portada: un círculo de luz que muestra la segunda imagen (en color) y sigue al cursor.
   Sin puntero (celular) o sin movimiento del mouse, la luz recorre la imagen sola.
   Con "reducir movimiento" queda quieta. */
(function () {
  var hero = document.getElementById('inicio');
  var luz = document.getElementById('reflector');
  if (!hero || !luz) return;
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var x = 0.68, y = 0.52, tx = x, ty = y, rr = 190, trr = 190;
  var ultimoMovimiento = 0, visible = true, corriendo = false;

  function aplicar() {
    luz.style.setProperty('--mx', (x * 100).toFixed(2) + '%');
    luz.style.setProperty('--my', (y * 100).toFixed(2) + '%');
    luz.style.setProperty('--rr', rr.toFixed(1) + 'px');
  }
  aplicar();
  if (reducido) return;

  function bucle(t) {
    if (!visible || document.hidden) { corriendo = false; return; }
    var quieto = t - ultimoMovimiento > 2500;
    if (quieto) { // recorrido propio
      tx = 0.5 + Math.sin(t * 0.00031) * 0.3;
      ty = 0.5 + Math.cos(t * 0.00023) * 0.22;
      trr = 170 + Math.sin(t * 0.0006) * 30;
    }
    x += (tx - x) * 0.08; y += (ty - y) * 0.08; rr += (trr - rr) * 0.08;
    aplicar();
    requestAnimationFrame(bucle);
  }
  function arrancar() { if (!corriendo) { corriendo = true; requestAnimationFrame(bucle); } }

  if (mouse) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      trr = 230;
      ultimoMovimiento = performance.now();
    });
    hero.addEventListener('pointerleave', function () { ultimoMovimiento = 0; });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) arrancar(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', arrancar);
  arrancar();
})();
