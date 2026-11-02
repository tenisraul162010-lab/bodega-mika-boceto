// Genera las páginas. Uso: node _src/build.mjs
import { writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { negocio as n, sitio, legal, valoracion, resenas, horario, horarioConfirmado, menus, carta, especialidades, galeria } from "./datos.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const direccion = `${n.calle}, ${n.cp} ${n.ciudad}, ${n.provincia}`;
const abs = (r) => (sitio.dominio ? `${sitio.dominio}/${r}` : r);
const anio = 2026;
const ver = Date.now().toString(36); // para que el navegador no use archivos antiguos tras un cambio

const escena = (foto, alt, primera = false) => `<picture class="escena-foto"><source media="(max-width: 700px)" srcset="img/${foto}-m.webp"><img src="img/${foto}.webp" alt="${alt}" ${primera ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
const foto = (nombre, alt, sizes, ancho = 1200, alto = 800) => `<img src="img/${nombre}.webp" srcset="img/${nombre}-640.webp 640w, img/${nombre}.webp 1200w" sizes="${sizes}" width="${ancho}" height="${alto}" loading="lazy" decoding="async" alt="${alt}">`;

const redondo = (nombre) => `<img class="en-linea" src="img/${nombre}-640.webp" width="240" height="240" loading="lazy" decoding="async" alt="">`;

const wa = n.whatsapp ? `<a class="btn btn-claro" href="https://wa.me/${n.whatsapp}">Escribir por WhatsApp</a>` : "";

const schema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: n.nombre,
  telephone: n.telefonoLink,
  servesCuisine: ["Española", "Comida casera", "Carne a la brasa"],
  acceptsReservations: true,
  address: { "@type": "PostalAddress", streetAddress: n.calle, postalCode: n.cp, addressLocality: n.ciudad, addressRegion: n.provincia, addressCountry: "ES" },
  geo: { "@type": "GeoCoordinates", latitude: n.lat, longitude: n.lng },
  sameAs: [n.instagram, n.tiktok],
  ...(sitio.dominio ? { url: `${sitio.dominio}/`, image: abs("img/og.jpg") } : {}),
  ...(horarioConfirmado
    ? { openingHoursSpecification: horario.filter((h) => h.abre).map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.schema, opens: h.abre.padStart(5, "0"), closes: h.cierra.padStart(5, "0") })) }
    : {}),
};

const cabeza = ({ titulo, desc, ruta = "", inicio = false }) => `<!doctype html>
<html lang="es-ES">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titulo}</title>
<meta name="description" content="${desc}">
${sitio.demo ? '<meta name="robots" content="noindex">\n' : ""}${sitio.dominio ? `<link rel="canonical" href="${sitio.dominio}/${ruta}">\n<meta property="og:url" content="${sitio.dominio}/${ruta}">\n` : ""}<meta property="og:type" content="restaurant">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="${n.nombre}">
<meta property="og:title" content="${titulo}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${abs("img/og.jpg")}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2a1b12">
<link rel="icon" href="img/icono.svg" type="image/svg+xml">
<link rel="preload" href="fonts/young-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${inicio ? '<link rel="preload" as="image" href="img/esc-llamas.webp" media="(max-width: 700px)"><link rel="preload" as="image" href="img/esc-brasas.webp" media="(min-width: 701px)">' : ""}
<link rel="stylesheet" href="css/estilos.css?v=${ver}">
${inicio ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n` : ""}<script>document.documentElement.classList.add("js")</script>
</head>`;

const pref = (inicio) => (inicio ? "" : "index.html");
const enlaces = [["#carta", "Carta"], ["#casa", "La casa"], ["#terraza", "Terraza"], ["#opiniones", "Opiniones"], ["#reservas", "Contacto"]];

const barra = (inicio) => `<a class="saltar" href="${pref(inicio)}#contenido">Saltar al contenido</a>
<header class="barra${inicio ? "" : " solida"}" data-barra>
  <a class="marca" href="${inicio ? "#inicio" : "index.html"}">La Bodega <span>de Mika</span></a>
  <nav class="nav" aria-label="Principal">
    ${enlaces.map(([h, t]) => `<a href="${pref(inicio)}${h}">${t}</a>`).join("\n    ")}
  </nav>
  <a class="barra-tel" href="tel:${n.telefonoLink}">${n.telefono}</a>
  <a class="btn btn-bronce barra-cta" href="${pref(inicio)}#reservas">Reservar mesa</a>
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-movil" data-menu-btn><span class="sr">Abrir menú</span><i></i><i></i></button>
</header>
<div class="menu-movil" id="menu-movil" data-menu hidden>
  <nav aria-label="Móvil">
    ${enlaces.map(([h, t]) => `<a href="${pref(inicio)}${h}">${t}</a>`).join("\n    ")}
  </nav>
  <div class="menu-acciones">
    <a class="btn btn-bronce" href="${pref(inicio)}#reservas">Reservar mesa</a>
    <a class="btn btn-claro" href="tel:${n.telefonoLink}">Llamar al ${n.telefono}</a>
  </div>
  <p>${n.calle}<br>${n.cp} ${n.ciudad}</p>
</div>`;

const pie = (inicio) => `<footer class="pie">
  <div class="pie-col">
    <div>
      <h2 class="pie-t">Dónde estamos</h2>
      <address>${n.calle}<br>${n.cp} ${n.ciudad}, ${n.provincia}</address>
      <a href="${n.comoLlegar}" target="_blank" rel="noopener">Cómo llegar</a>
    </div>
    <div>
      <h2 class="pie-t">Llámanos</h2>
      <a href="tel:${n.telefonoLink}">${n.telefono}</a><br>
      <a href="tel:${n.movilLink}">${n.movil}</a>
    </div>
    <nav aria-label="Pie">
      <h2 class="pie-t">La web</h2>
      <a href="${pref(inicio)}#especialidades">Especialidades</a>
      ${enlaces.map(([h, t]) => `<a href="${pref(inicio)}${h}">${t}</a>`).join("\n      ")}
      <a href="${pref(inicio)}#galeria">Galería</a>
    </nav>
    <div>
      <h2 class="pie-t">Síguenos</h2>
      <a href="${n.instagram}" target="_blank" rel="noopener">Instagram</a><br>
      <a href="${n.tiktok}" target="_blank" rel="noopener">TikTok</a>
    </div>
  </div>
  <p class="pie-nombre" aria-hidden="true">La Bodega de Mika</p>
  <div class="pie-legal">
    <span>© ${anio} ${n.nombre}</span>
    <a href="aviso-legal.html">Aviso legal</a>
    <a href="privacidad.html">Política de privacidad</a>
    <a href="cookies.html">Cookies</a>
    ${sitio.demo ? "<span>Web de demostración. Fotos de platos de muestra, no son de la casa.</span>" : ""}
  </div>
</footer>`;

const precio = (p) => (p ? `<span class="precio">${p}</span>` : `<span class="precio pend" title="Precio pendiente"><span aria-hidden="true">— €</span><span class="sr">Precio pendiente</span></span>`);
const grupo = (g) => `<section class="carta-grupo${g.platos.length > 15 ? " larga" : ""}">
  <h3>${g.titulo}</h3>
  <ul>${g.platos.map((p) => { const [nom, pr] = Array.isArray(p) ? p : [p, ""]; return `<li><span>${nom}</span>${precio(pr)}</li>`; }).join("")}</ul>
</section>`;

const filasHorario = horario.map((h, i) => `<li data-dia="${(i + 1) % 7}"><button type="button" data-dia-btn="${(i + 1) % 7}" aria-pressed="false"><span>${h.dia}</span><span>${h.abre ? `${h.abre} a ${h.cierra}` : "Cerrado"}</span></button></li>`).join("\n          ");

const inicio = `${cabeza({
  titulo: "Restaurante en Arganda del Rey | La Bodega de Mika",
  desc: "Mesón en Arganda del Rey: comida casera, carne a la brasa, raciones, desayunos y menú del día. Terraza y comidas para grupos. Reserva en el 918 71 56 04.",
  inicio: true,
})}
<body>
${barra(true)}
<main id="contenido">
<section class="hero" id="inicio">
  <picture class="hero-foto" data-hero-foto><source media="(max-width: 700px)" srcset="img/esc-llamas.webp"><img src="img/esc-brasas.webp" alt="Carne sobre unas brasas encendidas" fetchpriority="high" decoding="async"></picture>
  <div class="hero-txt">
    <h1 data-letras>Sentir, saborear y brindar.</h1>
    <p class="hero-sub">Mesón y carne a la brasa en Arganda del Rey. Cocina casera, raciones para compartir, menú del día y una terraza para quedarse.</p>
    <div class="acciones">
      <a class="btn btn-bronce btn-gr" href="#reservas">Reservar mesa</a>
      <a class="btn btn-claro btn-gr" href="#carta">Descubrir nuestra carta</a>
    </div>
    <p class="hero-estado" data-estado hidden></p>
  </div>
</section>

<section class="espec" id="especialidades">
  <h2 data-letras>Lo que sale de nuestra cocina</h2>
  <div class="espec-rejilla">
    ${especialidades.map((e, i) => `<article class="espec-item">
      ${escena(e.foto, e.alt)}
      <div class="espec-txt">
        <h3>${e.titulo}</h3>
        <p>${e.texto}</p>
      </div>
    </article>`).join("\n    ")}
  </div>
</section>

<section class="casa" id="casa" data-cortina>
  <p class="declaracion">Brasas, cuchara ${redondo("gal-sarten")} y raciones en el centro de la mesa ${redondo("gal-patatas")}, desde que abre la mañana hasta la última ronda.</p>
  <div class="casa-rejilla">
    <div class="casa-txt">
      <h2 data-letras>Una bodega para quedarse</h2>
      <div class="rv">
        <p>La Bodega de Mika es un mesón del Polígono San Sebastián, en Arganda del Rey. Aquí se viene a desayunar antes de empezar el día, a comer de menú a mediodía y a cenar de raciones o de brasa con quien te apetezca.</p>
        <p>La cocina es casera y las cantidades, de las que se comparten. En la sala, Mika y su equipo están pendientes de cada mesa, tanto si vienes por primera vez como si ya te conocen.</p>
      </div>
      <ul class="casa-lista rv">
        <li>Comidas con amigos y en familia</li>
        <li>Comidas de empresa</li>
        <li>Celebraciones</li>
        <li>Aparcamiento para clientes</li>
      </ul>
    </div>
    <div class="casa-fotos">
      <div class="casa-f1" data-prof="-10">${foto("gal-romero", "Carne con romero y verduras en un plato oscuro", "(max-width: 700px) 86vw, 44vw")}</div>
      <div class="casa-f2" data-prof="14">${foto("gal-plancha", "Carne a la plancha servida en la mesa", "(max-width: 700px) 50vw, 24vw")}</div>
    </div>
  </div>
</section>

<section class="carta" id="carta" data-cortina>
  <div class="carta-cab">
    <h2 data-letras>La carta de la Bodega</h2>
    <p class="carta-aviso rv pend"><strong>Carta provisional.</strong> No es la carta oficial: es una estructura de muestra, sin precios ni disponibilidad confirmados. Para saber qué hay hoy, llámanos.</p>
  </div>
  <div class="mantel">
    <div class="menus">
      ${menus.map((m) => `<div class="menu-dia"><h3>${m.nombre}</h3><p>${m.detalle}</p>${precio(m.precio)}</div>`).join("\n      ")}
    </div>
    <div class="carta-cols">
      ${carta.filter((g) => g.visible).map(grupo).join("\n      ")}
    </div>
    <details class="carta-mas" data-carta-mas>
      <summary><span class="btn btn-osc" data-abrir>Ver la carta completa</span></summary>
      <div class="carta-cols">
        ${carta.filter((g) => !g.visible).map(grupo).join("\n        ")}
      </div>
    </details>
    <p class="mantel-lema">Parar, comer bien y seguir</p>
  </div>
  <div class="acciones carta-acc">
    <a class="btn btn-osc" href="tel:${n.telefonoLink}">Consultar la carta por teléfono</a>
    ${sitio.cartaPdf ? `<a class="btn btn-bronce" href="${sitio.cartaPdf}" download>Descargar la carta en PDF</a>` : ""}
  </div>
</section>

<section class="galeria" id="galeria" data-cortina>
  <h2 data-letras>Para ir abriendo boca</h2>
  <ul class="galeria-rejilla">
    ${galeria.map((g, i) => `<li class="g-${g.tam}">
      <button type="button" class="g-boton" data-foto="${i}" aria-label="Ampliar: ${g.pie}">
        ${g.real
          ? `<img src="img/${g.foto}.webp" width="${g.ancho}" height="${g.alto}" loading="lazy" decoding="async" alt="${g.alt}">`
          : foto(g.foto, g.alt, g.tam === "a" ? "(max-width: 700px) 92vw, 48vw" : "(max-width: 700px) 46vw, 24vw")}
      </button>
    </li>`).join("\n    ")}
  </ul>
</section>
<dialog class="visor" data-visor aria-label="Visor de fotografías">
  <button type="button" class="visor-cerrar" data-visor-cerrar>Cerrar</button>
  <button type="button" class="visor-flecha" data-visor-ant aria-label="Foto anterior"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
  <figure><img data-visor-img src="data:," alt=""><figcaption data-visor-pie></figcaption></figure>
  <button type="button" class="visor-flecha" data-visor-sig aria-label="Foto siguiente"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
</dialog>

<section class="terraza" id="terraza">
  <div class="terraza-foto"><img src="img/fachada.webp" srcset="img/fachada-900.webp 1200w, img/fachada.webp 2600w" sizes="100vw" width="2600" height="1463" loading="lazy" decoding="async" alt="Fachada de La Bodega de Mika con sus carteles, la verja de forja, faroles y jardineras con flores"></div>
  <div class="terraza-txt">
    <h2 data-letras>La sobremesa, mejor fuera</h2>
    <div class="rv">
      <p>Detrás de la verja hay una terraza amplia y protegida del tráfico, con plantas, luces y mesas para alargar la comida o la cena. En los días de calor, los nebulizadores ayudan; y si prefieres estar dentro, el salón tiene aire acondicionado.</p>
      <p>También organizamos comidas para grupos, de empresa y celebraciones. Cuéntanos cuántos sois y buscamos la mejor forma de sentaros.</p>
      <div class="acciones">
        <a class="btn btn-bronce" href="#reservas">Pedir mesa para un grupo</a>
        <a class="btn btn-claro" href="tel:${n.telefonoLink}">Llamar al ${n.telefono}</a>
      </div>
    </div>
  </div>
</section>

<section class="opiniones" id="opiniones" data-cortina>
  <h2 data-letras>Lo que dicen de nosotros</h2>
  <div class="opiniones-rejilla">
    <a class="nota-google rv" href="${n.google}" target="_blank" rel="noopener">
      <svg class="anillo" viewBox="0 0 100 100" aria-hidden="true"><circle class="anillo-pista" cx="50" cy="50" r="47.5" pathLength="100"/><circle class="anillo-valor" cx="50" cy="50" r="47.5" pathLength="100"/></svg>
      <strong>${valoracion.nota}</strong>
      <span>de 5 en Google, con ${valoracion.opiniones} opiniones (${valoracion.fecha})</span>
      <span class="ir">Leer las opiniones</span>
    </a>
    <div class="temas rv">
      <p>En Google se repite lo mismo: raciones abundantes, carne a la brasa, buena terraza y trato cercano.</p>
      ${resenas.length
        ? `<div class="resenas">${resenas.map((r) => `<blockquote><p>${r.texto}</p><footer>${r.autor}, ${r.fecha}. Reseña de Google.</footer></blockquote>`).join("")}</div>`
        : `<p class="hueco pend">Este espacio está preparado para las reseñas verificadas de Google que el restaurante elija mostrar, con su autor y su fecha. No se publica ninguna opinión hasta tenerlas.</p>`}
    </div>
  </div>
</section>

<section class="brindis" id="brindis">
  ${escena("esc-brindis", "Varias personas brindando con copas de vino tinto")}
  <h2 class="brindis-t">
    <span class="brindis-l">Para sentir,</span>
    <span class="brindis-l">saborear</span>
    <span class="brindis-l">y brindar.</span>
  </h2>
  <div class="brindis-fin">
    <p>Te guardamos sitio en la mesa. Dinos cuándo venís y cuántos sois.</p>
    <div class="acciones">
      <a class="btn btn-bronce btn-gr" href="#reservas">Reservar mesa</a>
      <a class="btn btn-claro btn-gr" href="tel:${n.telefonoLink}">Llamar al ${n.telefono}</a>
    </div>
  </div>
</section>

<section class="reservas" id="reservas" data-cortina>
  <div class="reservas-cab">
    <h2 data-letras>Reserva tu mesa</h2>
    <p class="rv">Lo más rápido es llamar. Si lo prefieres, déjanos tu solicitud y te contestamos.</p>
    <div class="acciones rv">
      <a class="btn btn-osc btn-gr" href="tel:${n.telefonoLink}">Llamar al ${n.telefono}</a>
      ${wa}
    </div>
  </div>
  <div class="reservas-rejilla">
    <form class="vale rv" data-form novalidate>
      <h3>Solicitud de reserva</h3>
      <p class="vale-aviso">Esto es una solicitud, no una reserva confirmada. Tu mesa queda reservada solo cuando el restaurante te lo confirme.</p>
      <div class="campos">
        <label class="campo ancho">Nombre<input name="nombre" type="text" autocomplete="name" required></label>
        <label class="campo ancho">Teléfono<input name="telefono" type="tel" autocomplete="tel" inputmode="tel" required></label>
        <label class="campo">Fecha<input name="fecha" type="date" required data-fecha></label>
        <label class="campo">Hora<input name="hora" type="time" required></label>
        <label class="campo ancho">Número de comensales<input name="comensales" type="number" min="1" max="200" inputmode="numeric" required></label>
        <p class="ancho campo-info" data-fecha-info aria-live="polite" hidden></p>
        <label class="campo ancho">Observaciones (opcional)<textarea name="observaciones" rows="3"></textarea></label>
        <label class="trampa" aria-hidden="true">No rellenar<input name="web" type="text" tabindex="-1" autocomplete="off"></label>
        <label class="casilla ancho"><input name="privacidad" type="checkbox" required><span>He leído la <a href="privacidad.html">política de privacidad</a> y acepto que usen mis datos para responder a esta solicitud.</span></label>
      </div>
      <button class="btn btn-osc btn-gr" type="submit" data-enviar>Enviar solicitud</button>
      <div class="form-estado" data-form-estado role="status" hidden></div>
    </form>
    <div class="info">
      <div class="reloj rv">
        <h3>Horario</h3>
        <div class="reloj-cuerpo">
          <svg viewBox="0 0 200 200" class="reloj-svg" role="img" aria-label="Horas de apertura del día elegido, sobre un reloj de 24 horas" data-reloj hidden>
            <circle class="pista" cx="100" cy="100" r="84"/>
            <path class="abierto" data-arco d=""/>
            <circle class="ahora" data-ahora r="7" cx="100" cy="16"/>
            <text class="reloj-dia" x="100" y="94" text-anchor="middle" data-reloj-dia></text>
            <text class="reloj-horas" x="100" y="118" text-anchor="middle" data-reloj-horas></text>
          </svg>
          <ul class="horas">
          ${filasHorario}
          </ul>
        </div>
        ${horarioConfirmado ? "" : `<p class="nota pend">Horario publicado en Google y Apple Maps, pendiente de confirmar por el restaurante.</p>`}
      </div>
      <div class="donde rv">
        <h3>Cómo llegar</h3>
        <address>${n.calle}<br>${n.cp} ${n.ciudad}, ${n.provincia}</address>
        <p><a class="enlace" href="tel:${n.telefonoLink}">${n.telefono}</a> · <a class="enlace" href="tel:${n.movilLink}">${n.movil}</a></p>
        <div class="mapa" data-mapa data-src="${n.mapaEmbed}">
          <img src="img/fachada-900.webp" width="1200" height="675" loading="lazy" decoding="async" alt="">
          <div class="mapa-acc">
            <a class="btn btn-bronce" href="${n.comoLlegar}" target="_blank" rel="noopener">Abrir la ruta</a>
            <button class="btn btn-claro" type="button" data-mapa-btn>Ver el mapa aquí</button>
          </div>
          <p>Al ver el mapa aquí, Google puede guardar cookies.</p>
        </div>
      </div>
    </div>
  </div>
</section>
</main>
${pie(true)}
<div class="accesos" data-accesos>
  <a class="btn btn-claro" href="tel:${n.telefonoLink}">Llamar</a>
  <a class="btn btn-bronce" href="#reservas">Reservar</a>
</div>
<script src="js/config.js?v=${ver}"></script>
<script src="js/main.js?v=${ver}" defer></script>
<script src="js/vendor/gsap.min.js" defer></script>
<script src="js/vendor/ScrollTrigger.min.js" defer></script>
<script src="js/vendor/lenis.min.js" defer></script>
<script src="js/animaciones.js?v=${ver}" defer></script>
</body>
</html>
`;

const hoja = ({ archivo, titulo, cuerpo }) => `${cabeza({ titulo: `${titulo} | ${n.nombre}`, desc: `${titulo} de la web de ${n.nombre}, restaurante en Arganda del Rey.`, ruta: archivo })}
<body>
${barra(false)}
<main id="contenido" class="legal">
  <h1>${titulo}</h1>
  ${cuerpo}
</main>
${pie(false)}
<script src="js/config.js?v=${ver}"></script>
<script src="js/main.js?v=${ver}" defer></script>
</body>
</html>
`;

const P = (t) => `<span class="pend">${t}</span>`;
const titular = `<p>Titular: ${P(legal.titular)}. NIF: ${P(legal.nif)}. Domicilio: ${direccion}. Teléfono: ${n.telefono}. Correo: ${P(legal.email)}.</p>`;

const paginas = {
  "index.html": inicio,
  "aviso-legal.html": hoja({ archivo: "aviso-legal.html", titulo: "Aviso legal", cuerpo: `
  <h2>Quién es el titular</h2>${titular}
  <h2>Uso de la web</h2><p>Esta web informa sobre el restaurante y permite pedir mesa. Los precios, platos y horarios pueden cambiar; ante cualquier duda, confírmalos por teléfono. Una solicitud enviada desde la web no es una reserva hasta que el restaurante la confirme.</p>
  <h2>Propiedad intelectual</h2><p>Los textos, el diseño y las imágenes pertenecen a su titular o se usan con permiso, y no pueden copiarse sin autorización.</p>
  <h2>Créditos de las imágenes</h2><p><span class="pend">Las fotografías de comida y bebida de esta demostración son imágenes de muestra de Unsplash, con su licencia, y no muestran platos del restaurante. La foto de la fachada procede de su ficha pública de Google y necesita permiso de su autor antes de publicar la web.</span></p>` }),
  "privacidad.html": hoja({ archivo: "privacidad.html", titulo: "Política de privacidad", cuerpo: `
  <h2>Responsable</h2>${titular}
  <h2>Qué datos tratamos y para qué</h2><p>Con el formulario recogemos nombre, teléfono, fecha, hora, número de comensales y observaciones. Los usamos solo para responder a tu solicitud de mesa.</p>
  <h2>Base legal</h2><p>Tu consentimiento, que das al marcar la casilla del formulario y puedes retirar cuando quieras.</p>
  <h2>Cuánto tiempo los guardamos</h2><p>El tiempo necesario para gestionar la solicitud. Después se borran, salvo que la ley obligue a conservarlos.</p>
  <h2>Con quién se comparten</h2><p>No los cedemos a terceros, salvo obligación legal. ${P("Si se conecta un servicio externo para recibir el formulario, habrá que indicarlo aquí.")}</p>
  <h2>Tus derechos</h2><p>Puedes pedir acceso, rectificación, supresión, limitación, oposición y portabilidad escribiendo a ${P(legal.email)}. Si crees que no se han respetado, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>` }),
  "cookies.html": hoja({ archivo: "cookies.html", titulo: "Política de cookies", cuerpo: `
  <h2>Cookies de esta web</h2><p>Esta web no instala cookies propias ni de analítica o publicidad.</p>
  <h2>Mapa de Google</h2><p>El mapa solo se carga si pulsas «Ver el mapa aquí». En ese momento, Google puede instalar sus propias cookies. Si no lo pulsas, no se conecta con Google. Más información en policies.google.com/technologies/cookies.</p>` }),
  "404.html": hoja({ archivo: "404.html", titulo: "Esta página no existe", cuerpo: `<p>Puede que el enlace esté mal escrito. Vuelve a la <a class="enlace" href="index.html">portada</a> o llámanos al <a class="enlace" href="tel:${n.telefonoLink}">${n.telefono}</a>.</p>` }),
};

for (const [archivo, html] of Object.entries(paginas)) writeFileSync(join(raiz, archivo), html);

writeFileSync(join(raiz, "js/config.js"), `// Generado por _src/build.mjs. No editar a mano.
window.BM = ${JSON.stringify({ ver, formEndpoint: sitio.formEndpoint, telefono: n.telefono, telefonoLink: n.telefonoLink, horario: horario.map((h) => [h.abre, h.cierra, h.dia]), galeria: galeria.map((g) => ({ src: `img/${g.foto}.webp`, alt: g.alt, pie: g.pie })) })};
`);

writeFileSync(join(raiz, "img/icono.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#2a1b12"/><circle cx="16" cy="16" r="11" fill="none" stroke="#b08a4a" stroke-width="2"/><path d="M11 22V10l5 7 5-7v12" fill="none" stroke="#f4eee2" stroke-width="2.4"/></svg>
`);

const publica = !sitio.demo && sitio.dominio;
writeFileSync(join(raiz, "robots.txt"), publica ? `User-agent: *\nAllow: /\nSitemap: ${sitio.dominio}/sitemap.xml\n` : "# Demostración: no indexar. Al publicar, pon demo en false y añade el dominio en _src/datos.mjs.\nUser-agent: *\nDisallow: /\n");
const mapa = join(raiz, "sitemap.xml");
if (sitio.dominio) {
  writeFileSync(mapa, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", "aviso-legal.html", "privacidad.html", "cookies.html"].map((r) => `  <url><loc>${sitio.dominio}/${r}</loc></url>`).join("\n")}\n</urlset>\n`);
} else if (existsSync(mapa)) rmSync(mapa);

console.log("Web generada.");
