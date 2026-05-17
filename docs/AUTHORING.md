# Workflow para añadir un artículo

Guía paso a paso para publicar un post bilingüe en el blog. Asume que ya tienes el repo clonado y `npm ci` ejecutado.

> **Audiencia:** yo del futuro y cualquier colaborador. No requiere recordar convenciones — todo lo que necesitas está aquí.

---

## 1. Crea la carpeta del post

Cada post vive en su propio subdirectorio dentro de `src/content/posts/`. El **nombre de la carpeta** es libre (suele coincidir con el slug en español), pero debe ser único:

```bash
mkdir -p src/content/posts/mi-nuevo-articulo
cd src/content/posts/mi-nuevo-articulo
```

Estructura típica:

```
src/content/posts/mi-nuevo-articulo/
├── index.es.md        # versión en español (obligatoria si lang=es)
├── index.en.md        # versión en inglés (opcional)
└── cover.png          # imagen de portada (opcional)
```

> **Importante:** los archivos **deben** llamarse `index.<lang>.md`. El sistema usa el nombre del fichero para detectar el idioma.

---

## 2. Crea los archivos por idioma

Puedes publicar **solo en español** (es el `defaultLocale`) o en ambos idiomas. La versión inglesa no es obligatoria — pero si publicas en inglés, debe vivir en la misma carpeta.

### Frontmatter mínimo

```yaml
---
title: 'Mi nuevo artículo'
date: 2026-05-17
slug: 'mi-nuevo-articulo'
description: 'Un resumen claro de 50–160 caracteres que aparecerá en SERP y meta tags.'
lang: 'es'
---
```

### Frontmatter completo (con todos los campos)

```yaml
---
title: 'Cómo configuré Cloudflare R2 como backend de Loki'
date: 2026-05-17
updatedDate: 2026-05-20 # opcional, si actualizas tras publicar
draft: false # true = no aparece en producción
slug: 'cloudflare-r2-loki-backend'
description: 'Pasos prácticos para enchufar R2 como almacenamiento objeto de Grafana Loki sin pasar por S3.'
summary: 'Tutorial corto sobre cómo usar R2 con Loki para ahorrar en egress.' # opcional
tags: ['loki', 'cloudflare', 'observability']
categories: ['cloud-infra'] # ver catálogo abajo
cover:
  image: './cover.png' # ruta relativa al .md
  alt: 'Diagrama de arquitectura de Loki con R2 como backend.'
lang: 'es'
author: 'Edu González' # opcional, default 'Edu González'
---
```

### Reglas de cada campo

| Campo         | Tipo                      | Obligatorio | Notas                                                                      |
| ------------- | ------------------------- | :---------: | -------------------------------------------------------------------------- |
| `title`       | string                    |      ✓      | Sin sufijos de marca — el layout añade el suffix automáticamente.          |
| `date`        | ISO date                  |      ✓      | Fecha de publicación.                                                      |
| `updatedDate` | ISO date                  |             | Solo si has hecho un update significativo tras publicar.                   |
| `slug`        | string (kebab-case)       |      ✓      | URL final: `/<lang>/posts/<slug>/`. Puede ser distinto en ES y EN.         |
| `description` | string                    |      ✓      | **Validación Zod: 50–160 caracteres.** Aparece en SERP y meta description. |
| `summary`     | string                    |             | Resumen interno opcional para listados (si difiere de `description`).      |
| `draft`       | boolean (default `false`) |             | `true` excluye del build de producción.                                    |
| `lang`        | `'es'` o `'en'`           |      ✓      | Debe coincidir con el sufijo del archivo (`.es.md` → `lang: 'es'`).        |
| `tags`        | array de strings          |             | Granulares. Default `[]`. Página de tag con `noindex` (ver más abajo).     |
| `categories`  | array de strings          |             | Del catálogo cerrado. Default `[]`. Una categoría primaria recomendado.    |
| `cover`       | objeto `{image, alt}`     |             | Si se omite, se usa `og-default.jpg` como imagen OG.                       |
| `author`      | string                    |             | Default `'Edu González'`. Solo cambiar si colabora alguien más.            |

El schema completo vive en [`src/content.config.ts`](../src/content.config.ts).

---

## 3. Convención de slug bilingüe

El slug es **independiente entre idiomas**. Puedes tener:

```
src/content/posts/cloudflare-r2-loki-backend/
├── index.es.md   → slug: 'cloudflare-r2-backend-loki'
└── index.en.md   → slug: 'using-cloudflare-r2-as-loki-backend'
```

El mapeo se autoresuelve a partir de la **carpeta común**. El sistema genera `hreflang` alternates automáticamente para que Google sepa que son traducciones la una de la otra. La lógica está en `astro.config.mjs` → `buildPostTranslationMap`.

**Reglas prácticas:**

- Usa kebab-case (`cloudflare-r2-loki-backend`, no `CloudflareR2LokiBackend`).
- Mantén el slug corto pero descriptivo (3–6 palabras).
- Evita stopwords innecesarias en inglés (`the`, `a`, `using` solo si aporta).
- No cambies el slug tras publicar — rompes URLs. Si tienes que cambiarlo, añade un redirect manualmente.

---

## 4. Catálogo de categorías

Usa una de estas (en kebab-case):

| Categoría          | Cuándo usar                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `data-engineering` | Pipelines, ETL/ELT, warehouses, modelado, dbt, Airflow.            |
| `cloud-infra`      | AWS/GCP/Azure/Cloudflare, IaC, Kubernetes, networking.             |
| `llms`             | Modelos, RAG, fine-tuning, agents, prompt engineering, AI tooling. |
| `linux`            | Sysadmin, shell, kernel, performance, distros, automatización.     |
| `seguridad`        | Pentesting, hardening, criptografía, OPSEC, incidentes.            |

Reglas:

- **Una categoría primaria** por post (la primera del array).
- Puedes añadir una secundaria si el contenido cruza dominios.
- En caso de empate, gana la que mejor representa el tema principal según el título.

> Las **tags** son granulares y libres, pero las páginas de tag (`/<lang>/tags/<tag>/`) sirven solo navegación: tienen política `noindex` para evitar índices delgados en SERP.

---

## 5. Imágenes

### Cover (portada)

- Colócala dentro de la carpeta del post (`./cover.png`, `./cover.jpg`, etc.).
- Referénciala con path relativo en el frontmatter:

  ```yaml
  cover:
    image: './cover.png'
    alt: 'Descripción clara del contenido visual.'
  ```

- Astro genera **automáticamente** una versión optimizada en JPG 1200×630 para la imagen OG/Twitter card de ese post.

### Imágenes inline (dentro del cuerpo)

```markdown
![Texto alt obligatorio](./diagrama.png)
```

Si pones la imagen junto al `.md`, Astro la procesa con su pipeline. Para SVGs o assets compartidos entre posts, usa `src/assets/`.

**Reglas:**

- **`alt` obligatorio** — sin excepciones. Si la imagen es puramente decorativa, usa `alt=""`.
- Si subes una imagen grande (>500 KB), considera generar la versión optimizada manualmente antes de commitearla.

---

## 6. Markdown y MDX

Por defecto el blog usa **Markdown estándar** (`.md`). Si necesitas componentes Astro/JSX dentro del post (callouts, mini-demos, gráficos), renombra a `.mdx`:

```
index.es.md  →  index.es.mdx
```

Y puedes importar componentes:

```mdx
---
title: 'Demo con componente'
...
---

import Callout from '@/components/Callout.astro';

<Callout type="warning">Cuidado con esto.</Callout>
```

### Resaltado de código

Usa code fences estándar con el lenguaje:

````markdown
```typescript
const x: number = 42;
```
````

`astro-expressive-code` añade automáticamente: numeración, copia al portapapeles y modo claro/oscuro.

---

## 7. Draft → Publish

- `draft: true` → el post **no aparece** en el build de producción (ni en sitemap, ni en RSS, ni en home).
- `draft: false` → publicado.

Para previews privadas, mantén `draft: true` y úsalo en `npm run dev` (donde sí se muestran).

---

## 8. Preview local

```bash
npm run dev
```

Abre:

- ES: `http://localhost:4321/es/posts/<tu-slug>/`
- EN: `http://localhost:4321/en/posts/<tu-slug>/` (si has creado `index.en.md`)
- Listados: `/es/blog/`, `/es/categories/`, `/es/tags/`
- Feeds: `/es/feed.xml`, `/en/feed.xml`

### Verificaciones automáticas en cada commit

El pre-commit hook ejecuta:

1. ESLint (con auto-fix) sobre `.astro`, `.ts`, `.js`.
2. Prettier sobre `.json`, `.css`, `.md` (excepto `src/content/`).

> Los posts en `src/content/**/*.md` están excluidos de Prettier para preservar formato intencional. Si quieres formatear uno manualmente: `npx prettier --write src/content/posts/<carpeta>/<archivo>.md`.

Si quieres validar todo el repo antes de commitear:

```bash
npm run check
```

---

## 9. Checklist antes de commitear

- [ ] `title` claro y atractivo.
- [ ] `description` entre 50–160 caracteres (Zod fallará si no).
- [ ] `slug` en kebab-case, único, descriptivo.
- [ ] `date` correcta (ISO `YYYY-MM-DD`).
- [ ] `lang` coincide con el sufijo del archivo.
- [ ] Al menos **una categoría** del catálogo.
- [ ] Tags relevantes (sin duplicar la categoría).
- [ ] `cover.alt` obligatorio si hay `cover`.
- [ ] Todas las imágenes inline tienen `alt`.
- [ ] `draft: false` (o `true` deliberadamente).
- [ ] `npm run build` pasa localmente.
- [ ] Has revisado la preview en `/es/posts/<slug>/`.

---

## 10. Ejemplo mínimo completo

```yaml
---
title: 'Por qué uso Astro para el blog'
date: 2026-05-17
slug: 'por-que-astro'
description: 'Explico por qué migré de Hugo a Astro y qué he ganado en DX, performance y SEO.'
tags: ['astro', 'blogging']
categories: ['cloud-infra']
lang: 'es'
---

Texto del artículo en Markdown estándar.

## Sección

Contenido.
```

Eso es todo — guarda, ejecuta `npm run dev`, y debería aparecer en `/es/posts/por-que-astro/`.

---

## Referencia rápida

| Archivo                                                           | Propósito                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------- |
| [`src/content.config.ts`](../src/content.config.ts)               | Schema Zod — fuente de verdad de los campos válidos. |
| [`astro.config.mjs`](../astro.config.mjs)                         | Lógica de traducciones y hreflang asimétrico.        |
| [`src/config/site.ts`](../src/config/site.ts)                     | Branding, dominio, autor, sameAs.                    |
| [`src/i18n/ui.ts`](../src/i18n/ui.ts)                             | Strings de UI por idioma.                            |
| [`src/layouts/BaseLayout.astro`](../src/layouts/BaseLayout.astro) | Meta tags, canonical, hreflang, JSON-LD inyectados.  |
