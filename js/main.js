(function () {
  "use strict";
  var BM = window.BM || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  if (/[?&]revision\b/.test(location.search)) document.documentElement.classList.add("revision");

  /* Barra y accesos rápidos */
  var barra = $("[data-barra]");
  var accesos = $("[data-accesos]");
  var hero = $(".hero");
  function alDesplazar() {
    var y = window.scrollY;
    if (barra && !barra.classList.contains("fija-solida")) barra.classList.toggle("solida", !hero || y > 40);
    if (accesos && hero) accesos.classList.toggle("visible", y > hero.offsetHeight * 0.7);
  }
  window.addEventListener("scroll", alDesplazar, { passive: true });
  alDesplazar();

  /* Menú móvil */
  var mBtn = $("[data-menu-btn]");
  var menu = $("[data-menu]");
  function menuAbierto(si) {
    mBtn.setAttribute("aria-expanded", String(si));
    $(".sr", mBtn).textContent = si ? "Cerrar menú" : "Abrir menú";
    document.documentElement.classList.toggle("sin-scroll", si);
    barra.classList.toggle("con-menu", si);
    if (si) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("abierto"); });
    } else {
      menu.classList.remove("abierto");
      menu.hidden = true;
    }
  }
  if (mBtn && menu) {
    mBtn.addEventListener("click", function () { menuAbierto(mBtn.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) menuAbierto(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mBtn.getAttribute("aria-expanded") === "true") { menuAbierto(false); mBtn.focus(); }
    });
    window.matchMedia("(min-width: 981px)").addEventListener("change", function (e) { if (e.matches) menuAbierto(false); });
  }

  /* Entradas al desplazar */
  var sinMov = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var partes = $$(".rv, [data-giro]");
  if (sinMov || !("IntersectionObserver" in window)) {
    partes.forEach(function (p) { p.classList.add("dentro"); });
  } else {
    var ob = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("dentro");
        ob.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    partes.forEach(function (p) {
      var hermanos = Array.prototype.slice.call(p.parentElement.children).filter(function (h) { return h.matches(".rv, [data-giro]"); });
      p.style.transitionDelay = Math.min(hermanos.indexOf(p), 4) * 75 + "ms";
      ob.observe(p);
    });
  }

  /* Carta completa */
  var mas = $("[data-carta-mas]");
  if (mas) mas.addEventListener("toggle", function () {
    $("[data-abrir]", mas).textContent = mas.open ? "Ver menos" : "Ver la carta completa";
  });

  /* Horario. BM.horario va de lunes a domingo; getDay() empieza en domingo. */
  function aMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function delDia(d) { return BM.horario ? BM.horario[(d + 6) % 7] : null; }
  function tramo(d) {
    var h = delDia(d);
    if (!h || !h[0]) return null;
    var a = aMin(h[0]), c = aMin(h[1]);
    return { abre: a, cierra: c <= a ? c + 1440 : c, abreT: h[0], cierraT: h[1] };
  }
  function ahoraMadrid() {
    var p = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { dia: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), min: (+p.hour % 24) * 60 + +p.minute };
  }
  function estadoAhora() {
    var a = ahoraMadrid(), hoy = tramo(a.dia), ayer = tramo((a.dia + 6) % 7);
    if (ayer && a.min + 1440 < ayer.cierra) return { abierto: true, hasta: ayer.cierraT };
    if (hoy && a.min >= hoy.abre && a.min < hoy.cierra) return { abierto: true, hasta: hoy.cierraT };
    if (hoy && a.min < hoy.abre) return { abierto: false, texto: "hoy abre a las " + hoy.abreT };
    for (var i = 1; i < 8; i++) {
      var d = (a.dia + i) % 7, t = tramo(d);
      if (t) return { abierto: false, texto: (i === 1 ? "mañana" : "el " + delDia(d)[2].toLowerCase()) + " abre a las " + t.abreT };
    }
    return { abierto: false, texto: "" };
  }
  var est = $("[data-estado]");
  if (est && BM.horario) {
    var e = estadoAhora();
    est.textContent = e.abierto ? "Abierto ahora, hasta las " + e.hasta : "Ahora cerrado, " + e.texto;
    est.classList.toggle("abierto", e.abierto);
    est.hidden = false;
  }

  var reloj = $("[data-reloj]");
  if (reloj && BM.horario) {
    reloj.removeAttribute("hidden");
    var arco = $("[data-arco]", reloj), pAhora = $("[data-ahora]", reloj);
    var punto = function (min, r) {
      var ang = (min / 1440) * 2 * Math.PI;
      return [100 + r * Math.sin(ang), 100 - r * Math.cos(ang)];
    };
    var elegirDia = function (d) {
      var t = tramo(d), h = delDia(d), a = ahoraMadrid();
      if (t) {
        var i = punto(t.abre, 84), f = punto(t.cierra, 84), largo = t.cierra - t.abre > 720 ? 1 : 0;
        arco.setAttribute("d", "M" + i[0].toFixed(2) + " " + i[1].toFixed(2) + "A84 84 0 " + largo + " 1 " + f[0].toFixed(2) + " " + f[1].toFixed(2));
      } else arco.setAttribute("d", "");
      $("[data-reloj-dia]", reloj).textContent = d === a.dia ? "Hoy" : h[2];
      $("[data-reloj-horas]", reloj).textContent = t ? t.abreT + " a " + t.cierraT : "Cerrado";
      var esHoy = d === a.dia;
      pAhora.style.display = esHoy ? "" : "none";
      if (esHoy) { var q = punto(a.min, 84); pAhora.setAttribute("cx", q[0].toFixed(2)); pAhora.setAttribute("cy", q[1].toFixed(2)); }
      $$("[data-dia-btn]").forEach(function (b) {
        var si = +b.getAttribute("data-dia-btn") === d;
        b.setAttribute("aria-pressed", String(si));
      });
    };
    $$("[data-dia-btn]").forEach(function (b) {
      b.addEventListener("click", function () { elegirDia(+b.getAttribute("data-dia-btn")); });
    });
    elegirDia(ahoraMadrid().dia);
  }

  /* Galería */
  var visor = $("[data-visor]");
  if (visor && BM.galeria) {
    var actual = 0;
    var vImg = $("[data-visor-img]", visor), vPie = $("[data-visor-pie]", visor);
    var mostrar = function (i) {
      actual = (i + BM.galeria.length) % BM.galeria.length;
      var f = BM.galeria[actual];
      vImg.src = f.src; vImg.alt = f.alt; vPie.textContent = f.pie;
    };
    $$("[data-foto]").forEach(function (b) {
      b.addEventListener("click", function () { mostrar(+b.getAttribute("data-foto")); visor.showModal(); });
    });
    $("[data-visor-cerrar]", visor).addEventListener("click", function () { visor.close(); });
    $("[data-visor-ant]", visor).addEventListener("click", function () { mostrar(actual - 1); });
    $("[data-visor-sig]", visor).addEventListener("click", function () { mostrar(actual + 1); });
    visor.addEventListener("click", function (e) { if (e.target === visor) visor.close(); });
    visor.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") mostrar(actual - 1);
      if (e.key === "ArrowRight") mostrar(actual + 1);
    });
    var x0 = null;
    visor.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    visor.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  }

  /* Mapa: se carga solo si se pide */
  var mapa = $("[data-mapa]");
  if (mapa) $("[data-mapa-btn]", mapa).addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.src = mapa.getAttribute("data-src");
    f.title = "Mapa de La Bodega de Mika en Arganda del Rey";
    f.referrerPolicy = "no-referrer-when-downgrade";
    mapa.innerHTML = "";
    mapa.appendChild(f);
    mapa.classList.add("cargado");
  });

  /* Formulario de solicitud */
  var form = $("[data-form]");
  if (!form) return;
  var campoFecha = $("[data-fecha]", form), info = $("[data-fecha-info]", form), estado = $("[data-form-estado]", form), enviar = $("[data-enviar]", form);
  var hoyISO = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
  campoFecha.min = hoyISO;

  campoFecha.addEventListener("change", function () {
    if (!campoFecha.value) { info.hidden = true; return; }
    var d = new Date(campoFecha.value + "T12:00:00").getDay(), t = tramo(d);
    info.textContent = t ? delDia(d)[2] + ": abierto de " + t.abreT + " a " + t.cierraT + " (horario pendiente de confirmar)." : "Los " + delDia(d)[2].toLowerCase() + " aparece cerrado en el horario publicado. Mejor elige otro día o llámanos.";
    info.classList.toggle("alerta", !t);
    info.hidden = false;
  });

  var MENSAJES = {
    nombre: "Escribe tu nombre.",
    telefono: "Escribe un teléfono para poder contestarte.",
    fecha: "Elige una fecha a partir de hoy.",
    hora: "Elige una hora.",
    comensales: "Indica cuántos seréis.",
    privacidad: "Necesitamos que aceptes la política de privacidad.",
  };
  function error(el, msg) {
    var caja = el.closest("label");
    var previo = caja.querySelector(".error");
    if (previo) previo.remove();
    el.removeAttribute("aria-invalid");
    if (!msg) return;
    el.setAttribute("aria-invalid", "true");
    var s = document.createElement("span");
    s.className = "error";
    s.textContent = msg;
    caja.appendChild(s);
  }
  function valido(el) {
    var mal = !el.checkValidity();
    if (el.name === "telefono" && el.value.replace(/\D/g, "").length < 9) mal = true;
    error(el, mal ? MENSAJES[el.name] : "");
    return !mal;
  }
  var obligatorios = Object.keys(MENSAJES).map(function (k) { return form.elements[k]; });
  obligatorios.forEach(function (el) {
    el.addEventListener("change", function () { valido(el); });
  });

  function aviso(html, tipo) {
    estado.innerHTML = html;
    estado.className = "form-estado " + tipo;
    estado.hidden = false;
    estado.scrollIntoView({ block: "nearest", behavior: sinMov ? "auto" : "smooth" });
  }
  var llamar = '<a class="btn btn-osc" href="tel:' + BM.telefonoLink + '">Llamar al ' + BM.telefono + "</a>";

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (form.elements.web.value) return;
    var malos = obligatorios.filter(function (el) { return !valido(el); });
    if (malos.length) { malos[0].focus(); return; }

    if (!BM.formEndpoint) {
      aviso("<strong>Tu solicitud no se ha enviado.</strong><p>Este formulario todavía no está conectado con el restaurante. Para pedir mesa, llámanos:</p>" + llamar, "pendiente");
      return;
    }
    enviar.disabled = true;
    var datos = {};
    ["nombre", "telefono", "fecha", "hora", "comensales", "observaciones"].forEach(function (k) { datos[k] = form.elements[k].value.trim(); });
    fetch(BM.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(datos) })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        info.hidden = true;
        aviso("<strong>Hemos recibido tu solicitud.</strong><p>Todavía no es una reserva: está pendiente de confirmación. El restaurante te contestará al teléfono que nos has dejado.</p>", "ok");
      })
      .catch(function () {
        aviso("<strong>No se ha podido enviar.</strong><p>Inténtalo de nuevo o llámanos:</p>" + llamar, "pendiente");
      })
      .then(function () { enviar.disabled = false; });
  });
})();
