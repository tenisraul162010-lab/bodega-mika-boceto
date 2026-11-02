// Animaciones de la portada con GSAP y ScrollTrigger. Si algo falla, la web sigue siendo legible.
(function () {
  "use strict";
  var raiz = document.documentElement;
  // ?sinmovimiento sirve para revisar la versión sin animaciones
  var reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]sinmovimiento/.test(location.search);
  if (!window.gsap || !window.ScrollTrigger || reducir) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  if (!location.hash && "scrollRestoration" in history) history.scrollRestoration = "manual";
  ScrollTrigger.config({ ignoreMobileResize: true });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var movil = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
  var ratonFino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  raiz.classList.add("con-gsap", "con-escenas");

  /* Scroll fluido solo con ratón; en móvil, el scroll nativo es mejor */
  var lenis = null;
  if (ratonFino && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11, anchors: { offset: -72 } });
    raiz.style.scrollBehavior = "auto";
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    new MutationObserver(function () {
      if (raiz.classList.contains("sin-scroll")) lenis.stop(); else lenis.start();
    }).observe(raiz, { attributes: true, attributeFilter: ["class"] });
    var visor = $("[data-visor]");
    if (visor) new MutationObserver(function () {
      if (visor.open) lenis.stop(); else lenis.start();
    }).observe(visor, { attributes: true, attributeFilter: ["open"] });
  }

  /* Titulares: cada palabra sale de detrás de una máscara */
  function partir(el) {
    var palabras = el.textContent.trim().split(/\s+/);
    el.innerHTML = palabras.map(function (p) {
      return '<span class="pal"><span class="pal-i">' + p + "</span></span>";
    }).join(" ");
    return $$(".pal-i", el);
  }
  $$("[data-letras]").forEach(function (h) {
    var piezas = partir(h);
    if (h.closest(".hero")) {
      gsap.from(piezas, { yPercent: 115, duration: 1.15, stagger: 0.08, ease: "expo.out", delay: 0.15 });
      return;
    }
    gsap.from(piezas, {
      yPercent: 115, duration: 1, stagger: 0.06, ease: "expo.out",
      scrollTrigger: { trigger: h, start: "top 88%", once: true },
    });
  });

  gsap.from(".hero-sub, .hero .acciones, .hero-estado", { y: 26, opacity: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", delay: 0.55 });

  /* Cortinas: cada sección entra con el borde curvo de un plato que se aplana */
  $$("[data-cortina]").forEach(function (s) {
    gsap.fromTo(s, { "--curva": "16vw" }, {
      "--curva": "0vw", ease: "none",
      scrollTrigger: { trigger: s, start: "top bottom", end: "top 25%", scrub: true },
    });
  });

  /* La casa: las dos fotos se mueven a distinta velocidad */
  $$("[data-prof]").forEach(function (f) {
    var d = parseFloat(f.getAttribute("data-prof"));
    gsap.fromTo(f, { yPercent: d }, { yPercent: -d, ease: "none", scrollTrigger: { trigger: ".casa-rejilla", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(f, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "power3.inOut", clearProps: "clipPath", scrollTrigger: { trigger: f, start: "top 85%", once: true } });
  });
  var declaracion = $(".declaracion");
  if (declaracion) {
    // Palabra a palabra, conservando las miniaturas
    Array.prototype.slice.call(declaracion.childNodes).forEach(function (n) {
      if (n.nodeType !== 3 || !n.textContent.trim()) return;
      var f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function (t) {
        if (!t) return;
        if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(" ")); return; }
        var s = document.createElement("span");
        s.className = "dec-pal";
        s.textContent = t;
        f.appendChild(s);
      });
      declaracion.replaceChild(f, n);
    });
    gsap.fromTo($$(".dec-pal, .en-linea", declaracion), { opacity: 0.14 }, {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: declaracion, start: "top 82%", end: "bottom 45%", scrub: 0.5 },
    });
  }

  /* Carta: el mantel se desenrolla y las filas llegan por grupos */
  gsap.fromTo(".mantel", { clipPath: "inset(0 0 100% 0)" }, {
    clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "power3.inOut",
    clearProps: "clipPath",
    scrollTrigger: { trigger: ".mantel", start: "top 82%", once: true },
  });
  $$(".mantel > .carta-cols .carta-grupo, .menu-dia").forEach(function (g) {
    gsap.from(g, { y: 34, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: g, start: "top 90%", once: true } });
  });
  var mas = $("[data-carta-mas]");
  if (mas) mas.addEventListener("toggle", function () {
    ScrollTrigger.refresh();
    if (mas.open) gsap.from($$(".carta-grupo", mas), { y: 24, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" });
  });

  /* Galería: cada foto se descubre con una cortina */
  $$(".galeria-rejilla li").forEach(function (li, i) {
    var img = $("img", li);
    gsap.timeline({ scrollTrigger: { trigger: li, start: "top 90%", once: true } })
      .fromTo(li, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.15, ease: "power3.inOut", delay: (i % 3) * 0.07, clearProps: "clipPath" })
      .from(img, { scale: 1.3, duration: 1.5, ease: "power3.out", clearProps: "transform" }, "<");
  });

  /* Cursor «Ampliar» en la galería */
  if (ratonFino) {
    var ver = document.createElement("div");
    ver.className = "cursor-ver";
    ver.setAttribute("aria-hidden", "true");
    ver.textContent = "Ampliar";
    document.body.appendChild(ver);
    gsap.set(ver, { xPercent: -50, yPercent: -50, scale: 0 });
    var vx = gsap.quickTo(ver, "x", { duration: 0.35, ease: "power3" });
    var vy = gsap.quickTo(ver, "y", { duration: 0.35, ease: "power3" });
    $$(".g-boton").forEach(function (b) {
      b.addEventListener("pointerenter", function () { gsap.to(ver, { scale: 1, duration: 0.3, ease: "back.out(2)" }); });
      b.addEventListener("pointerleave", function () { gsap.to(ver, { scale: 0, duration: 0.2 }); });
      b.addEventListener("pointermove", function (e) { vx(e.clientX); vy(e.clientY); });
      b.addEventListener("click", function () { gsap.set(ver, { scale: 0 }); });
    });
    /* Botones principales con imán */
    $$(".hero .btn, .brindis .btn").forEach(function (b) {
      var mx = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" });
      var my = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" });
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.22);
        my((e.clientY - r.top - r.height / 2) * 0.3);
      });
      b.addEventListener("pointerleave", function () { mx(0); my(0); });
    });
  }

  /* Terraza: la foto se abre desde un círculo hasta ocupar la pantalla */
  var tFoto = $(".terraza-foto");
  if (tFoto) {
    var imgT = $("img", tFoto);
    imgT.loading = "eager";
    gsap.timeline({ scrollTrigger: { trigger: tFoto, start: "top top", end: movil ? "+=90%" : "+=130%", pin: true, scrub: 0.6 } })
      .fromTo(tFoto, { clipPath: "circle(24vmin at 50% 50%)" }, { clipPath: "circle(120vmax at 50% 50%)", ease: "power2.inOut" })
      .fromTo(imgT, { scale: 1.45 }, { scale: 1, ease: "power2.inOut" }, 0);
  }

  /* Opiniones: el anillo se dibuja hasta 4,7 de 5 y la nota cuenta */
  var nota = $(".nota-google");
  if (nota) {
    var cifra = $("strong", nota), final = parseFloat(cifra.textContent.replace(",", ".")), arco = $(".anillo-valor", nota);
    var estado = { v: 0 };
    gsap.to(estado, {
      v: final, duration: 1.8, ease: "power2.out",
      scrollTrigger: { trigger: nota, start: "top 75%", once: true },
      onUpdate: function () {
        cifra.textContent = estado.v.toFixed(1).replace(".", ",");
        if (arco) arco.style.strokeDashoffset = String(100 - (estado.v / 5) * 100);
      },
    });
  }

  /* Pie: el nombre sube letra a letra */
  var nombre = $(".pie-nombre");
  if (nombre) {
    var txt = nombre.textContent;
    nombre.innerHTML = txt.split("").map(function (l) { return '<span class="letra">' + (l === " " ? "&nbsp;" : l) + "</span>"; }).join("");
    gsap.from($$(".letra", nombre), { yPercent: 105, stagger: 0.025, duration: 1, ease: "expo.out", scrollTrigger: { trigger: nombre, start: "top 96%", once: true } });
  }

  /* Portada: la foto se acerca despacio al bajar y responde un poco al ratón */
  var heroFoto = $("[data-hero-foto] img");
  gsap.to(".hero-txt", { y: -120, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 35%", scrub: true } });
  if (heroFoto) {
    gsap.fromTo(heroFoto, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "power2.out" });
    gsap.to("[data-hero-foto]", { scale: 1.12, yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    if (ratonFino) {
      var hx = gsap.quickTo("[data-hero-foto]", "x", { duration: 1.2, ease: "power3" });
      var hy = gsap.quickTo("[data-hero-foto]", "y", { duration: 1.2, ease: "power3" });
      $(".hero").addEventListener("pointermove", function (e) {
        hx((e.clientX / innerWidth - 0.5) * -22);
        hy((e.clientY / innerHeight - 0.5) * -14);
      });
    }
  }

  /* Recorrido: cada especialidad se abre en círculo sobre la anterior */
  var viaje = $(".espec"), items = $$(".espec-item");
  if (viaje && items.length) {
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: viaje, start: "top top", end: "+=" + items.length * (movil ? 75 : 90) + "%", pin: true, scrub: 0.6, anticipatePin: 1 },
    });
    items.forEach(function (it, i) {
      var img = $(".escena-foto img", it), txt = $(".espec-txt", it);
      if (i) {
        gsap.set(it, { clipPath: "circle(0% at 68% 50%)" });
        gsap.set(txt, { autoAlpha: 0, y: 60 });
        tl.to(it, { clipPath: "circle(125% at 68% 50%)", duration: 0.55, ease: "power2.inOut" }, i - 0.6)
          .to(txt, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" }, i - 0.28);
      }
      tl.fromTo(img, { scale: 1.16 }, { scale: 1.02, duration: 1.2 }, Math.max(0, i - 0.6));
    });
    tl.to(".espec > h2", { autoAlpha: 0, duration: 0.2 }, 0.3);
    tl.to({}, { duration: 0.2 });
  }

  /* Brindis: la foto se acerca mientras llega el lema */
  var brindis = $(".brindis");
  if (brindis) {
    var lineas = $$(".brindis-l", brindis), fin = $(".brindis-fin", brindis), fotoB = $(".escena-foto img", brindis);
    gsap.set(lineas, { autoAlpha: 0, y: 60 });
    gsap.set(fin, { autoAlpha: 0, y: 30 });
    gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.12 },
      scrollTrigger: { trigger: brindis, start: "top top", end: movil ? "+=170%" : "+=210%", pin: true, scrub: 0.5, anticipatePin: 1 },
    })
      .fromTo(fotoB, { scale: 1.22 }, { scale: 1, duration: 1, ease: "none" }, 0)
      .to(lineas[0], { autoAlpha: 1, y: 0 }, 0.08)
      .to(lineas[1], { autoAlpha: 1, y: 0 }, 0.3)
      .to(lineas[2], { autoAlpha: 1, y: 0 }, 0.52)
      .to(fin, { autoAlpha: 1, y: 0 }, 0.72);
  }

  // Las zonas fijadas alargan la página: se ordenan por su posición para medirlas bien
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  window.addEventListener("load", function () { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, { once: true });
})();
