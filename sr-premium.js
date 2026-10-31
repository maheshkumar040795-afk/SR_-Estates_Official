/* SR Estates · premium design layer behaviour */
(function () {
  var doc = document.documentElement;
  doc.classList.add('sr-js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    /* scroll progress */
    var bar = document.createElement('div');
    bar.className = 'sr-progress';
    document.body.appendChild(bar);

    /* scroll progress only (menu stays at the top, it does not follow the scroll) */
    function onScroll() {
      var y = window.scrollY;
      var max = doc.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
    var ticking = false;
    addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); }
    }, { passive: true });
    onScroll();

    /* area marquee above the footer */
    var footer = document.querySelector('footer');
    if (footer && !document.querySelector('.sr-marquee')) {
      var areas = ['Mogappair East', 'Mogappair West', 'Nolambur', 'Anna Nagar', 'Anna Nagar West', 'Padi', 'Avadi', 'All Chennai'];
      var items = areas.concat(areas).map(function (a) { return '<span>' + a + '</span>'; }).join('');
      var m = document.createElement('div');
      m.className = 'sr-marquee';
      m.setAttribute('aria-hidden', 'true');
      m.innerHTML = '<div class="sr-marquee-track">' + items + '</div>';
      footer.parentNode.insertBefore(m, footer);
    }

    /* reveal on scroll */
    var sel = ['.sec-head', '.about-section-eyebrow', '.about-section-title', '.about-section-desc', '.areas-served-section',
      '.why-card', '.pkg-card', '.calc-wrap', '.stats-strip', '.search-section', '.ad-banner-wrap', '.contact-card',
      '.person-card', '.terms-card', '.map-wrap', '.footer-inner > *'];
    var els = [];
    sel.forEach(function (s) {
      document.querySelectorAll(s).forEach(function (el) {
        if (el.classList.contains('reveal') || el.closest('.reveal') || el.closest('.sr-rv')) return;
        el.classList.add('sr-rv'); els.push(el);
      });
    });
    // stagger siblings in grids
    els.forEach(function (el) {
      var p = el.parentNode, sibs = Array.prototype.filter.call(p.children, function (c) { return c.classList.contains('sr-rv'); });
      var i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--sr-d', Math.min(i, 5) * 90 + 'ms');
    });
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('sr-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('sr-in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      els.forEach(function (el) { io.observe(el); });
      setTimeout(function () { els.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('sr-in'); }); }, 2500);
    }

    /* count-up for fixed numbers like 22+ / 1200+ */
    var nums = [];
    document.querySelectorAll('.stat-num, .hero-stat-num, .about-stat-num').forEach(function (el) {
      if (el.id || el.children.length) return; // live listing numbers are set by the page
      var mt = el.textContent.trim().match(/^(\d+)(\+?)$/);
      if (mt) nums.push({ el: el, to: +mt[1], suf: mt[2] });
    });
    function run(n) {
      if (reduce) return;
      var t0 = performance.now(), dur = 1600;
      (function step(t) {
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(2, -10 * k);
        n.el.textContent = Math.round(n.to * (k === 1 ? 1 : e)) + n.suf;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }
    if ('IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var n = nums.filter(function (x) { return x.el === e.target; })[0];
          if (n) run(n); io2.unobserve(e.target);
        });
      }, { threshold: 0.4 });
      nums.forEach(function (n) { io2.observe(n.el); });
    }

    if (!fine || reduce) return;

    /* pointer spotlight on cards (delegated, works for cards rendered later) */
    document.addEventListener('pointermove', function (ev) {
      var c = ev.target.closest && ev.target.closest('.property-card, .why-card, .pkg-card');
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      c.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    }, { passive: true });

    /* magnetic buttons */
    document.querySelectorAll('.cinematic-cta, .cinematic-nav-cta, .about-cta-btn, .pkg-cta, .calc-cta, .fab-item').forEach(function (b) {
      var s = b.classList.contains('fab-item') ? 0.25 : 0.18;
      b.addEventListener('pointermove', function (ev) {
        var r = b.getBoundingClientRect();
        var x = ev.clientX - (r.left + r.width / 2), y = ev.clientY - (r.top + r.height / 2);
        b.style.transform = 'translate(' + (x * s).toFixed(1) + 'px,' + (y * s).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  });
})();
