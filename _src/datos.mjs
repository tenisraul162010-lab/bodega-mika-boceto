// Datos de la web. Cambia aquí lo que haga falta y ejecuta: node _src/build.mjs
// Lo que está sin confirmar se explica en DATOS.md.

export const negocio = {
  nombre: "La Bodega de Mika",
  calle: "Polígono San Sebastián, Camino de la Carrera Toledana, 9-10, Nave 9",
  cp: "28500",
  ciudad: "Arganda del Rey",
  provincia: "Madrid",
  lat: 40.3042129,
  lng: -3.4538959,
  telefono: "918 71 56 04",
  telefonoLink: "+34918715604",
  movil: "672 136 626", // aparece en el cartel de la fachada
  movilLink: "+34672136626",
  whatsapp: "", // solo si el restaurante lo confirma. Formato: 34600000000. Con dato, aparecen los botones.
  email: "", // pendiente
  instagram: "https://www.instagram.com/labodegademika/",
  tiktok: "https://www.tiktok.com/@la.bodega.de.mika",
  google: "https://www.google.com/maps/place/?q=place_id:ChIJd50fSNw_Qg0RI6EG5Twwgm8",
  comoLlegar: "https://www.google.com/maps/dir/?api=1&destination=40.3042129,-3.4538959&destination_place_id=ChIJd50fSNw_Qg0RI6EG5Twwgm8",
  mapaEmbed: "https://www.google.com/maps?q=40.3042129,-3.4538959&z=16&hl=es&output=embed",
};

export const sitio = {
  demo: true, // true: Google no la indexa. Pásalo a false al publicar.
  dominio: "", // por ejemplo https://www.tudominio.es (sin barra final). Con dato se genera sitemap.xml.
  formEndpoint: "", // URL que recibe las solicitudes (Formspree o similar). Vacío: no se envía nada y se avisa.
  cartaPdf: "", // por ejemplo img/carta.pdf. Con dato aparece el botón de descarga.
};

export const legal = { // pendiente: pedir al restaurante
  titular: "[Razón social pendiente]",
  nif: "[NIF pendiente]",
  email: "[Correo pendiente]",
};

export const valoracion = { nota: "4,7", opiniones: 180, fecha: "noviembre de 2026" };

// Pon aquí solo reseñas reales de Google, con permiso: { texto: "", autor: "", fecha: "" }
export const resenas = [];

// Fuente: Google Maps y Apple Maps (coinciden). Pendiente de confirmar.
// Con horarioConfirmado: true se quita el aviso y se publica en los datos para Google.
export const horarioConfirmado = false;
export const horario = [
  { dia: "Lunes", abre: null, cierra: null, schema: "Monday" },
  { dia: "Martes", abre: "6:00", cierra: "23:00", schema: "Tuesday" },
  { dia: "Miércoles", abre: "6:00", cierra: "23:00", schema: "Wednesday" },
  { dia: "Jueves", abre: "6:00", cierra: "23:00", schema: "Thursday" },
  { dia: "Viernes", abre: "6:00", cierra: "2:00", schema: "Friday" },
  { dia: "Sábado", abre: "8:00", cierra: "2:00", schema: "Saturday" },
  { dia: "Domingo", abre: "8:00", cierra: "23:30", schema: "Sunday" },
];

// CARTA PROVISIONAL. Nombres leídos de la foto de una carta que un cliente publicó en Google.
// Pon el precio como texto en cada plato: ["Entrecot", "24,00 €"]. Sin precio se muestra «— €».
export const menus = [
  { nombre: "Menú del día", detalle: "Primeros, segundos, pan, bebida y postre o café.", precio: "" },
  { nombre: "Menú especial", detalle: "Platos y precio pendientes de confirmar.", precio: "" },
];

export const carta = [
  { titulo: "Nuestra parrilla", visible: true, platos: ["Entrecot", "Solomillo al gusto", "Solomillo con foie", "Chuletón de vaca gallega (1 kg)"] },
  { titulo: "Cazuelas", visible: true, platos: ["Secreto", "Picadillo de matanza", "Morcilla", "Chanquetes a la malagueña"] },
  { titulo: "Por encargo", visible: true, platos: ["Arroz con carabineros", "Arroz con bogavante", "Paletilla lechal", "Cochinillo"] },
  { titulo: "Raciones", visible: true, platos: ["Jamón", "Lomo", "Queso curado", "Tabla de ibéricos", "Gambas al ajillo", "Gambas a la plancha", "Calamares a la andaluza", "Boquerones fritos", "Pulpo a la parrilla", "Zamburiñas", "Patatas alioli", "Patatas bravas", "Patatas mixtas", "Callos madrileños", "Rabo de toro", "Mollejas de cordero", "Alitas fritas", "Morcilla de Burgos", "Torreznos", "Oreja", "Lacón a la gallega", "Croquetas de jamón"] },
  { titulo: "Desayunos", platos: ["Bollería", "Tostada entera", "Media tostada", "Pincho de tortilla"] },
  { titulo: "Sándwiches", platos: ["Mixto", "Mixto con huevo", "Vegetal", "Especial (vegetal y mixto con huevo)"] },
  { titulo: "Montados y bocadillos", platos: ["Tortilla de patatas", "Vegetal", "Bacón", "Panceta", "Chorizo frito", "Lomo", "Pollo a la plancha con mayonesa, lechuga y tomate", "Pepito de ternera", "Morcilla con pimientos verdes", "Jamón serrano", "Queso curado", "Calamares", "Atún"] },
  { titulo: "Ensaladas", platos: ["Mixta", "Rulo de cabra", "César"] },
  { titulo: "Platos combinados", platos: ["Patatas con dos huevos y lomo", "Patatas con dos huevos y ternera", "Patatas con dos huevos y pollo", "Patatas con dos huevos y bacón", "Patatas con ensalada y calamares", "Patatas con ensalada y boquerones fritos"] },
  { titulo: "Hamburguesa Angus", platos: ["Con queso", "Con queso y bacón", "Especial (queso, bacón y huevo)"] },
  { titulo: "Pescados a la plancha", platos: ["Emperador", "Dorada"] },
  { titulo: "Postres", platos: ["Postre casero"] },
];

// Fotos de muestra de Unsplash hasta tener una sesión propia (ver DATOS.md).
export const especialidades = [
  { titulo: "Carnes y parrilla", foto: "esc-carnes", alt: "Carne a la brasa cortada sobre una tabla de madera", texto: "Nuestra seña: carne a la brasa, con el punto que pidas en la mesa." },
  { titulo: "Cocina casera", foto: "esc-guiso", alt: "Guiso de carne en una cazuela oscura", texto: "Cuchara y elaboraciones de siempre, de las que saben a casa." },
  { titulo: "Raciones para compartir", foto: "esc-raciones", alt: "Ración de patatas con salsa en el centro de una mesa", texto: "Para poner en el centro y que nadie se quede con hambre." },
  { titulo: "Desayunos y aperitivos", foto: "esc-desayuno", alt: "Manos partiendo pan en un desayuno con zumo de naranja", texto: "Abrimos temprano, para empezar el día o parar a media mañana." },
  { titulo: "Menú del día", foto: "esc-menu", alt: "Plato de cocina servido en una mesa", texto: "A mediodía, primeros, segundos, pan, bebida y postre o café." },
  { titulo: "Postres", foto: "esc-postre", alt: "Flan casero con caramelo", texto: "Postre casero para terminar sin prisa, con un café delante." },
];

// tam: a (grande), b (mediana), c (ancha). real: true solo para fotos del propio restaurante.
export const galeria = [
  { foto: "gal-sarten", alt: "Carne cortada en una sartén de hierro, vista desde arriba", pie: "Carne a la brasa", tam: "a" },
  { foto: "gal-pinzas", alt: "Pinzas volteando una pieza de carne sobre las brasas", pie: "Sobre las brasas", tam: "b" },
  { foto: "gal-copas", alt: "Copas de vino tinto brindando", pie: "Para brindar", tam: "b" },
  { foto: "terraza-verja", alt: "Entrada a la terraza de La Bodega de Mika, con verja de forja, plantas y sillas de mimbre", pie: "Nuestra terraza", tam: "c", real: true, ancho: 1400, alto: 649 },
  { foto: "gal-chuleton", alt: "Chuletón con espárragos en una fuente", pie: "Carne y verdura", tam: "b" },
  { foto: "gal-patatas", alt: "Carne con patatas asadas", pie: "Con patatas asadas", tam: "b" },
  { foto: "gal-romero", alt: "Carne con romero y verduras en un plato oscuro", pie: "Carne con romero", tam: "b" },
  { foto: "gal-vino", alt: "Dos copas de vino al atardecer", pie: "Al caer la tarde", tam: "b" },
];
