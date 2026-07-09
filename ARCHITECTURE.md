# Arquitectura del Proyecto

## 1. ¿Qué es este proyecto?

Este proyecto es un blog técnico estático enfocado en ingeniería (Cloud, Data Engineering, LLMs, Linux, Ciberseguridad). Está construido con Astro 6.0+ y diseñado para ser un Static Site Generator (SSG) puro, sin servidor backend, sin base de datos propia y sin frameworks de cliente pesados (como React, Vue o Svelte). El objetivo es ofrecer un rendimiento extremo, alta puntuación SEO y una experiencia de lectura sin distracciones.

El sitio es completamente bilingüe (Español/Inglés) con un sistema de internacionalización (i18n) basado en rutas (`/es/` y `/en/`). Se despliega de forma estática en Cloudflare Pages. Toda la interactividad necesaria en el cliente se maneja mediante Vanilla JavaScript ligero utilizando la arquitectura de "Islands" de Astro de forma conservadora.

## 2. Mapa de directorios anotado

El código fuente principal vive bajo el directorio `src/`. Aquí se explica qué hace cada pieza clave (omitiendo lo evidente):

- `src/assets/`: Imágenes locales optimizadas y fuentes descargadas (si aplica).
- `src/components/`: Componentes UI reutilizables (estrictamente `.astro` sin JS en cliente salvo excepciones marcadas).
- `src/config/`: Configuración hardcodeada, especialmente `taxonomy.ts` que es la fuente única de verdad para categorías y tags.
- `src/content/`: Contenido en Markdown/MDX. Aquí viven los posts y las colecciones de datos.
- `src/data/`: Datos estáticos estructurados (ej. información para la página About).
- `src/i18n/`: Textos de UI traducidos (`ui.ts`) y utilidades para parsear idiomas desde URLs.
- `src/layouts/`: Contenedores principales (solo existe `BaseLayout.astro`).
- `src/pages/`: Enrutamiento basado en archivos. Contiene los endpoints dinámicos (rutas `[lang]`) y endpoints de API/RSS.
- `src/styles/`: Archivos CSS globales, donde `global.css` incluye toda la configuración de Tailwind CSS v4 (`@theme`).
- `src/utils/`: Funciones puras de ayuda (formateo de fechas, lectura de tiempo, validaciones).
- `src/content.config.ts`: Esquemas de validación Zod para las colecciones de contenido.

## 3. Arquitectura: cómo se conectan las piezas

La arquitectura sigue un flujo de datos unidireccional y estático desde los archivos Markdown hasta el HTML renderizado.

```text
Markdown (src/content/posts/)
  │
  ├──► Content Collection (src/content.config.ts + Zod)
  │    (Valida frontmatter contra taxonomy.ts)
  │
  ├──► getCollection() en páginas de src/pages/[lang]/
  │    (Filtra por idioma, ordena por fecha, pagina)
  │
  ├──► Inyección en componentes (Tarjetas, Metadata)
  │
  ├──► BaseLayout.astro (wrapper universal)
  │    (Inyecta SEO, Schema JSON-LD, hreflang, fuentes)
  │
  └──► HTML estático en dist/ (Generado en Build Time)
       (Pagefind indexa este HTML para la búsqueda)
```

**Puntos clave:**

- **Taxonomía:** La colección valida categorías/tags en tiempo de compilación. Un tag no registrado en `taxonomy.ts` rompe el build.
- **i18n:** El idioma se deriva siempre del path (`[lang]`). Los posts se asocian a un idioma por el sufijo del archivo (`.es.md` / `.en.md`).
- **Búsqueda:** Pagefind se ejecuta _después_ del build sobre la carpeta `dist/`, generando un índice estático consumible desde el cliente.

## 4. Sistema de Layouts (1 sola capa)

El proyecto utiliza un patrón de capa única: `BaseLayout.astro` es el **único layout** del sitio. No hay composición compleja ni layouts anidados.

- **Qué recibe como props:** Título de la página, descripción, imagen OpenGraph, tipo de artículo para Schema.org, e idioma.
- **Qué inyecta en el `<head>`:** Meta tags SEO completos, JSON-LD estructurado, etiquetas `hreflang` para el i18n, precarga de fuentes, y la declaración del tema (dark/light mode).
- **Qué renderiza en el `<body>`:** La estructura base: `Navbar`, el `<slot />` principal (donde va el contenido de la página), `Footer`, y el contenedor del `SearchModal`.

Mantener un solo layout garantiza que la estructura SEO, el control de View Transitions y el wrapping general nunca se desincronicen entre distintas secciones.

## 5. Topología de rutas

| Ruta                    | Archivo                        | Genera                    |
| ----------------------- | ------------------------------ | ------------------------- |
| `/{lang}/`              | `[lang]/index.astro`           | 2 paths (es, en)          |
| `/{lang}/blog/`         | `[lang]/blog.astro`            | 2 paths                   |
| `/{lang}/posts/{slug}/` | `[lang]/posts/[...slug].astro` | 1 por post                |
| `/{lang}/{category}/`   | `[lang]/[category].astro`      | N por categoría con posts |
| `/{lang}/tags/{tag}/`   | `[lang]/tags/[tag].astro`      | N por tag con posts       |
| `/{lang}/about/`        | `[lang]/about.astro`           | 2 paths                   |
| `/og/{lang}-{slug}.png` | `og/[slug].png.ts`             | OG images dinámicas       |
| `/{lang}/rss.xml`       | `[lang]/rss.xml.ts`            | Feed RSS                  |
| `/robots.txt`           | `robots.txt.ts`                | Generado                  |

## 6. Content Collections: el ciclo de vida de un post

- **Ubicación:** Los archivos viven en directorios por slug: `src/content/posts/{slug}/index.{es,en}.md`.
- **Traducciones:** El sistema espera pares de archivos (ej. `index.es.md` e `index.en.md`) bajo el mismo directorio `{slug}`. Así se vinculan conceptualmente las traducciones.
- **Esquema Frontmatter:** Definido en `src/content.config.ts`. Establece campos obligatorios (título, descripción, fecha, categoría, tags) y opcionales (imagen hero, estado draft).
- **Validación:** Zod asegura que los datos sean correctos en build time. Si usas una categoría inventada, el build falla gracias a la importación de `taxonomy.ts` como lista restrictiva.
- **Taxonomy como fuente de verdad:** Cualquier tag o categoría nueva debe registrarse primero en `src/config/taxonomy.ts` antes de usarse en un post.

## 7. Sistema de diseño (tokens CSS)

- **Configuración:** Todo el diseño se gobierna desde `src/styles/global.css` en el bloque `@theme` de Tailwind v4. No hay `tailwind.config.js`.
- **Dark Mode:** Controlado por el atributo `data-theme` en el `<html>`. Hace fallback a la preferencia del sistema (`prefers-color-scheme`) si no hay valor guardado.
- **Tematización Dinámica:** Los colores de acento cambian según la categoría del post. Esto se logra inyectando `data-category` en el `<html>` y redefiniendo la variable CSS `--color-accent` a nivel de raíz.
- **Color OKLCH:** Usamos el espacio de color OKLCH (no HSL ni RGB) por su uniformidad perceptual, asegurando contrastes accesibles y gradientes predecibles en modo claro y oscuro.
- **Fuentes:** Utiliza Astro Fonts API para cargar Geist (UI), Source Serif 4 (Lectura) y JetBrains Mono (Código), evitando saltos de layout (CLS).

## 8. JavaScript en el cliente (qué hay y por qué)

El proyecto busca tener cero JS inicial. Todo lo listado abajo es progresivamente mejorado o cargado bajo demanda.

| Feature                 | Dónde               | Por qué no es un componente React                              |
| ----------------------- | ------------------- | -------------------------------------------------------------- |
| Dark mode toggle        | `ThemeToggle.astro` | Script inline minúsculo, manipula `localStorage` y `classList` |
| Búsqueda                | `SearchModal.astro` | Instancia Pagefind UI (lazy-loaded). No requiere bundle pesado |
| Menú móvil              | `Navbar.astro`      | Simple toggle de clase CSS (Vanilla JS)                        |
| ToC sync + progress bar | `[...slug].astro`   | IntersectionObserver / listener de scroll                      |
| Tag filter en /blog     | `blog.astro`        | Lógica de esconder/mostrar nodos en el DOM                     |

_Patrón común:_ Se utiliza el evento `astro:page-load` y manejadores `AbortController` para que los event listeners se inicialicen y destruyan correctamente durante las navegaciones de _View Transitions_.

## 9. Guía "¿Dónde toco si quiero…?"

- **Añadir un post nuevo:** `src/content/posts/{slug}/index.{es|en}.md`
- **Cambiar el color de una categoría:** `src/styles/global.css` (busca el atributo `data-category`)
- **Añadir un tag nuevo:** `src/config/taxonomy.ts` (array `TAGS`). El build validará este nuevo valor automáticamente.
- **Añadir una categoría nueva:** `src/config/taxonomy.ts` + crear ruta `[lang]/[category].astro` si no es dinámica.
- **Modificar la navegación:** `src/components/Navbar.astro`
- **Cambiar textos UI en ES/EN:** `src/i18n/ui.ts`
- **Añadir un campo al frontmatter:** `src/content.config.ts` (schema Zod) + `BaseLayout.astro` si afecta SEO.
- **Cambiar el OG por defecto:** `public/og-default.jpg` (reemplazar, mismo nombre).
- **Editar la página About:** `src/data/about.ts` + `src/data/timeline.ts` / `src/stack.ts`
- **Modificar el footer / navbar:** `src/components/Footer.astro` / `src/components/Navbar.astro`
- **Tocar SEO estructurado (JSON-LD):** `src/layouts/BaseLayout.astro`
- **Cambiar fuentes:** `astro.config.mjs` (bloque `experimental.fonts`)

## 10. Decisiones de arquitectura (por qué, no qué)

- **Por qué un solo layout en vez de varios (BaseLayout universal):** Evita la fragmentación. Garantiza que toda página, sea de error, post o listado, tenga las mismas meta tags, declaración de idioma, dark mode temprano y estructura base, previniendo errores de SEO o de View Transitions desincronizadas.
- **Por qué cero React / cero client:\*:** Todo estático, JS vanilla para UX. Para un blog donde el contenido es rey, pagar el costo de hidratación de un framework completo es innecesario. Vanilla JS cubre interacciones de manera más eficiente.
- **Por qué slugs asimétricos ES/EN y cómo los resuelve el site:** Se asume que el post traducido comparte el slug base como directorio identificador (`{slug}/index.es.md`), simplificando el mapeo de `hreflang` manual sin requerir base de datos ni consultas complejas.
- **Por qué noindex en tags/ai-generated con < 5 posts:** Previene diluir el crawl budget y la autoridad SEO de Google en listados vacíos o "thin content".
- **Por qué OKLCH en lugar de HSL para los tokens de color:** OKLCH respeta la luminancia percibida. Esto permite variar el "hue" (tono) para categorías manteniendo matemáticamente el mismo nivel de contraste contra fondos, sin ajustes manuales.
