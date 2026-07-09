# Blog técnico — Edu González

Blog personal de ingeniería sobre **Cloud, Data Engineering, LLMs, Linux y Ciberseguridad**. Bilingüe (ES/EN), estático, optimizado para SEO y experiencias de búsqueda generativas.

> Sitio en producción: <https://edunavata-blog.pages.dev>

---

## Stack

| Capa             | Tecnología                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Framework        | [Astro 6](https://astro.build/) (SSG, islands)                                               |
| Estilos          | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first)                                      |
| Contenido        | MDX + [Content Collections](https://docs.astro.build/en/guides/content-collections/) con Zod |
| Resaltado código | [astro-expressive-code](https://expressive-code.com/)                                        |
| Lenguaje         | TypeScript strict                                                                            |
| Hosting          | [Cloudflare Pages](https://pages.cloudflare.com/)                                            |

Cero JavaScript en cliente por defecto — solo scripts inline mínimos para tema y TOC.

---

## Requisitos

- **Node.js** `22.22.2` (definido en `.nvmrc`; usa `nvm use`)
- **npm** `>= 10.9.0`

Comprueba tu versión:

```bash
node -v && npm -v
```

---

## Quick start

```bash
git clone https://github.com/edunavata/astro-blog.git
cd astro-blog
nvm use            # usa la versión declarada en .nvmrc
cp .env.example .env  # ajusta SITE_URL si despliegas en otro dominio
npm ci             # instala dependencias exactas
npm run dev        # http://localhost:4321
```

---

## Scripts disponibles

| Comando                | Propósito                                                  |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo en `localhost:4321` con HMR         |
| `npm run build`        | Build de producción (`astro check && astro build`)         |
| `npm run preview`      | Sirve el build local antes de desplegar                    |
| `npm run check`        | Pipeline completo: `type-check` + `lint` + `format:check`  |
| `npm run type-check`   | Solo `astro check` (TypeScript + diagnósticos Astro)       |
| `npm run lint`         | ESLint (`--max-warnings 0`)                                |
| `npm run lint:fix`     | ESLint con auto-fix                                        |
| `npm run format`       | Prettier — formatea todo                                   |
| `npm run format:check` | Prettier — verifica sin escribir                           |
| `npm run gen-og`       | Regenera `public/og-default.jpg` desde la config de `SITE` |

---

## Estructura del proyecto

```
astro-blog/
├── .github/workflows/    # CI (type-check + lint + format + build)
├── .husky/               # Pre-commit hook (lint-staged)
├── docs/
│   └── AUTHORING.md      # Workflow detallado para añadir artículos
├── public/               # Estáticos servidos tal cual (robots.txt, llms.txt, favicon, og-default.jpg)
├── scripts/
│   └── gen-og-default.mjs  # Genera la imagen OG por defecto vía Sharp
├── src/
│   ├── assets/           # Imágenes que pasan por el pipeline de Astro
│   ├── components/       # Componentes .astro reutilizables
│   ├── config/
│   │   └── site.ts       # Config central (URL, autor, hreflang, OG, sameAs)
│   ├── content/
│   │   ├── posts/        # Artículos (un subdirectorio por post, bilingüe)
│   │   └── ...
│   ├── content.config.ts # Schemas Zod de las colecciones
│   ├── data/             # Datos estáticos para páginas (about, stack, timeline…)
│   ├── i18n/             # Strings y helpers de localización
│   ├── layouts/
│   │   └── BaseLayout.astro  # Inyecta canonical, hreflang, OG, JSON-LD, theme-color
│   ├── pages/
│   │   ├── 404.astro
│   │   └── [lang]/       # Rutas localizadas (es/en) — home, blog, about, listings, feed.xml
│   └── styles/
│       └── global.css    # Tokens OKLCH, focus styles, reduced-motion, Tailwind v4
├── astro.config.mjs      # i18n nativo, sitemap con hreflang asimétrico, MDX, Vite/Tailwind
├── eslint.config.js      # Flat config v9 + plugin-astro + a11y
├── .prettierrc.json
├── .lintstagedrc.json
└── tsconfig.json         # `astro/strict` + alias `@/*`
```

Para una guía detallada de cómo se generan posts, ver [`docs/AUTHORING.md`](docs/AUTHORING.md).

---

## Configuración

### SEO / branding (`src/config/site.ts`)

Edita este archivo para cambiar dominio, título, autor, redes (`sameAs`), `hreflang` y `ogImage`. Lo demás se inyecta automáticamente desde `BaseLayout`.

### Consistencia de URLs

El blog usa un sistema redundante de tres capas para evitar que Google vea varias URLs como páginas distintas:

| Mecanismo                 | Función                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `trailingSlash: 'always'` | Previene: Astro genera siempre URLs con slash final.                                             |
| Redirect `301`            | Corrige: `public/_redirects` redirige variantes sin slash a la URL canónica en Cloudflare Pages. |
| `<link rel="canonical">`  | Seguro final: `BaseLayout` declara la URL oficial normalizada bajo `SITE_URL`.                   |

El redirect de `www` a dominio apex no se puede versionar completamente en `_redirects` porque Cloudflare Pages no permite redirects por hostname ahí. Configúralo en Cloudflare como Bulk Redirect:

- De: `https://www.<dominio>/*`
- A: `https://<dominio>/:path`
- Código: `301`
- Mantener path y query string.

### Variables de entorno

| Variable   | Uso                                            | Default                            |
| ---------- | ---------------------------------------------- | ---------------------------------- |
| `SITE_URL` | URL base usada por canonical, OG, sitemap, RSS | `https://edunavata-blog.pages.dev` |

Configura en `.env` para desarrollo local, o en el dashboard de Cloudflare Pages en producción.

### i18n

- Locales: `es` (default) y `en`.
- Rutas: `/es/...` y `/en/...` (`/` redirige a `/es/`).
- Slugs **asimétricos** entre idiomas: el mapeo se autoresuelve desde la estructura de carpetas en `astro.config.mjs`.
- `hreflang` y `x-default` se inyectan automáticamente en `<head>` y en el sitemap.

---

## Calidad y CI

- **Pre-commit hook** (husky + lint-staged): formatea y lintea solo los archivos staged en cada commit.
- **CI** (`.github/workflows/ci.yml`): en cada push/PR a `main` corre `npm run check` + `npm run build` sobre Ubuntu con caché de npm y Astro. Falla si hay warnings.
- **Reglas activas**:
  - `eslint-plugin-astro` recommended + `jsx-a11y-recommended` (eventos de teclado, etiquetas accesibles).
  - `@typescript-eslint/recommended` (sin reglas `strict-type-checked` por simplicidad).
  - Prettier con `prettier-plugin-astro` y `prettier-plugin-tailwindcss`.

Si necesitas saltar el hook puntualmente: `git commit --no-verify`. No abuses — la CI te lo recordará.

---

## Deploy

El despliegue lo gestiona **Cloudflare Pages** automáticamente desde la rama `main`:

1. Push a `main` → CI pasa → Cloudflare hace su propio build (`npm run build`).
2. La preview de cada PR queda en una URL `*.pages.dev`.

Variables que necesita Cloudflare Pages:

- `SITE_URL` con la URL absoluta del proyecto.

> El workflow de GitHub Actions **no** despliega — solo verifica. Cloudflare es la fuente de verdad para el deploy.

---

## Añadir un artículo

El proceso completo (frontmatter, slugs, traducciones, imágenes) está documentado en
**[`docs/AUTHORING.md`](docs/AUTHORING.md)** — empieza por su sección
**[Quickstart](docs/AUTHORING.md#quickstart)**.

Resumen rápido:

```bash
mkdir -p src/content/posts/mi-nuevo-articulo
$EDITOR src/content/posts/mi-nuevo-articulo/index.es.md
# opcional: index.en.md, cover.png
npm run dev   # preview en /es/posts/mi-nuevo-articulo/
```

---

## Licencia y autor

Código: MIT. Contenido de los posts: © Edu González — todos los derechos reservados salvo indicación expresa.

- Autor: [Edu González](https://github.com/edunavata)
- Contacto: ver [/es/about](https://edunavata-blog.pages.dev/es/about/) en el sitio
