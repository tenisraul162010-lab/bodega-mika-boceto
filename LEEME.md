# La Bodega de Mika: web de demostración

Demo privada para enseñar al restaurante. **No está publicada** y `robots.txt` bloquea a Google.

## Verla en el ordenador

En esta carpeta, ejecuta:

```
python -m http.server 5520
```

Después abre http://localhost:5520 en el navegador.
Añade `?revision` a la dirección para ver en amarillo lo que falta por confirmar.

## Cambiar textos, precios y horarios

Las páginas `.html` se generan solas. **No las edites a mano:** edita `_src/datos.mjs` y ejecuta:

```
node _src/build.mjs
```

- **Precios de la carta:** cambia `"Entrecot"` por `["Entrecot", "24,00 €"]`.
- **WhatsApp:** rellena `whatsapp` y aparece el botón.
- **PDF de la carta:** rellena `cartaPdf` y aparece el botón de descarga.
- **Reseñas de Google:** añádelas a `resenas`.
- **Formulario:** rellena `formEndpoint` (por ejemplo, Formspree). Hasta entonces no envía nada y lo dice claramente.
- **Horario:** cuando lo confirmen, cambia `horarioConfirmado` a `true`.
- **Publicar:** pon `demo: false` y el `dominio`. Se generan `sitemap.xml` y un `robots.txt` abierto.

Colores y tipografía: variables al principio de `css/estilos.css`.

## Animaciones

- `js/animaciones.js`: animaciones de scroll con GSAP y ScrollTrigger.
- `js/main.js`: menú, galería, horario, mapa y formulario.

Si el visitante pide reducir el movimiento, la web muestra las mismas fotos y textos sin animaciones.
