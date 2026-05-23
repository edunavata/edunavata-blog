# Guía de autoría — Blog técnico

Referencia completa para crear y publicar posts. Cubre estructura de archivos,
frontmatter, taxonomía, metodología SEO y flujo de publicación bilingüe.

> **Audiencia:** yo del futuro y cualquier colaborador. No asume memoria de sesiones anteriores.
> La fuente de verdad del schema es `src/content.config.ts` y `src/config/taxonomy.ts`.

---

## Índice

1. [Estructura de archivos](#1-estructura-de-archivos)
2. [Frontmatter — schema completo](#2-frontmatter--schema-completo)
3. [Categorías](#3-categorías)
4. [Tags](#4-tags)
5. [Origins](#5-origins)
6. [Metodología SEO](#6-metodología-seo)
7. [Flujo bilingüe](#7-flujo-bilingüe)
8. [Preview y build local](#8-preview-y-build-local)
9. [Checklist antes de publicar](#9-checklist-antes-de-publicar)

---

## 1. Estructura de archivos

Cada post vive en su propio subdirectorio dentro de `src/content/posts/`. El nombre de la carpeta
es libre pero debe ser único y descriptivo (suele coincidir con el slug ES):

```
src/content/posts/
└── optimizar-spark-produccion/
    ├── index.es.md      ← versión española (lang: "es")
    ├── index.en.md      ← versión inglesa  (lang: "en", opcional)
    └── cover.png        ← imagen de portada (opcional)
```

**Reglas de nomenclatura:**

- Los archivos **deben** llamarse `index.<lang>.md`. El sistema detecta el idioma por el sufijo.
- Publicar solo en español es válido — la versión EN no es obligatoria.
- Si publicas en inglés, ambos archivos deben estar en la **misma carpeta** (para que el
  sistema genere el hreflang automáticamente).

---

## 2. Frontmatter — schema completo

El schema se valida en build time con Zod. Si un campo es inválido, el build falla.

### Todos los campos

```yaml
---
title: 'Título del post' # Obligatorio
date: 2026-06-01 # Obligatorio. ISO: YYYY-MM-DD
slug: 'slug-del-post' # Obligatorio. kebab-case, único
description: 'Descripción SEO de 50–160 chars.' # Obligatorio. Validada por Zod
lang: 'es' # Obligatorio. 'es' | 'en'
category: data-engineering # Obligatorio. Un valor del catálogo
tags: [python, duckdb, sql, tutorial] # Obligatorio. 3–5 valores del catálogo
translationKey: 'optimizar-spark' # Opcional. Vincula ES ↔ EN para hreflang
origins: [ai-generated] # Opcional. Ver sección 5
aiModel: 'Claude Sonnet 4.6' # Opcional. Solo junto a origins: [ai-generated]
draft: false # Opcional. Default false
updatedDate: 2026-06-10 # Opcional. Solo si hay revisión significativa
summary: 'Resumen corto para listados.' # Opcional. Si difiere de description
author: 'Edu González' # Opcional. Default 'Edu González'
cover:
  image: './cover.png' # Opcional. Path relativo al .md
  alt: 'Descripción visual de la portada.' # Obligatorio si hay cover
---
```

### Referencia por campo

| Campo            | Tipo                | ¿Oblig.? | Notas                                                               |
| ---------------- | ------------------- | :------: | ------------------------------------------------------------------- |
| `title`          | string              |    ✓     | Sin sufijo de marca — el layout lo añade automáticamente.           |
| `date`           | ISO date            |    ✓     | Fecha de publicación.                                               |
| `slug`           | kebab-case          |    ✓     | URL final: `/{lang}/posts/{slug}/`. **No cambiar tras publicar.**   |
| `description`    | string 50–160 chars |    ✓     | Aparece en SERP y meta description. Incluye la keyword principal.   |
| `lang`           | `'es'` \| `'en'`    |    ✓     | Debe coincidir con el sufijo del archivo (`.es.md` → `lang: 'es'`). |
| `category`       | enum (ver §3)       |    ✓     | Exactamente 1 valor. No como array.                                 |
| `tags`           | array enum (ver §4) |    ✓     | Entre 3 y 5 valores. Todos del catálogo cerrado.                    |
| `translationKey` | string              |    —     | Mismo valor en ES y EN para vincular traducciones.                  |
| `origins`        | array enum (ver §5) |    —     | Solo añadir si aplica. Su ausencia = escrito por el autor.          |
| `aiModel`        | string              |    —     | Modelo usado. Solo junto a `origins: [ai-generated]`.               |
| `draft`          | boolean             |    —     | `true` = excluido de producción, visible en dev.                    |
| `updatedDate`    | ISO date            |    —     | Solo para revisiones significativas de contenido.                   |
| `summary`        | string              |    —     | Texto corto para previews cuando difiere de `description`.          |
| `author`         | string              |    —     | Cambiar solo si colabora alguien externo.                           |
| `cover.image`    | path relativo       |    —     | El build genera la imagen OG optimizada automáticamente.            |
| `cover.alt`      | string              |   ✓\*    | Obligatorio si hay `cover`.                                         |

---

## 3. Categorías

Vocabulario cerrado de 5 valores. **Exactamente una categoría por post**, nunca como array.

### Catálogo

| Slug               | URL (ES / EN)                                     | Scope temático                                                                             |
| ------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `data-engineering` | `/es/data-engineering/` · `/en/data-engineering/` | Pipelines, Spark, dbt, Airflow, Kafka, Flink, formatos de archivo, data quality, lakehouse |
| `cloud`            | `/es/cloud/` · `/en/cloud/`                       | AWS, GCP, Azure, Terraform, Docker, Kubernetes, IaC, serverless, networking                |
| `linux`            | `/es/linux/` · `/en/linux/`                       | Bash, shell scripting, CLI tools, sysadmin, performance, monitoring, systemd               |
| `llms`             | `/es/llms/` · `/en/llms/`                         | LLMs aplicados, RAG, fine-tuning, embeddings, prompt engineering, MLOps, APIs de modelos   |
| `carrera`          | `/es/carrera/` · `/en/career/`                    | Aprendizaje técnico, productividad, open source, entrevistas, herramientas del ingeniero   |

> **Nota sobre URLs:** La categoría `carrera` usa slug localizado — `/en/career/` en inglés.
> Las demás categorías son términos técnicos neutros, iguales en ambos idiomas.

### Reglas de categorías

- **1 categoría por post** — sin excepción. Si el contenido encaja en dos, asigna la principal
  y enlaza internamente desde posts de la otra.
- La categoría nunca se repite como tag del mismo post (redundante).
- Las páginas de categoría están **indexadas** (`index, follow`) — aportan autoridad temática.
- No crear subcategorías hasta tener >50 posts en una categoría.

### Árbol de decisión

```
¿El tema central es un pipeline, almacén de datos o herramienta de datos?  → data-engineering
¿El tema central es infraestructura cloud, IaC o contenedores?             → cloud
¿El tema central es el sistema operativo, shell o herramientas de sistema? → linux
¿El tema central es un modelo de lenguaje o su aplicación?                 → llms
¿El tema central es carrera, metodología o herramientas del ingeniero?     → carrera
```

---

## 4. Tags

Vocabulario controlado de 50 valores. Entre **3 y 5 tags por post**, todos del catálogo.
Las tags granularizan el contenido — complementan la categoría, nunca la repiten.

### Catálogo completo

**Data Engineering (15)**

```
apache-spark  dbt            airflow         kafka          flink
python        sql            data-pipelines  streaming      batch-processing
data-quality  lakehouse      delta-lake      iceberg        duckdb
```

**Cloud (10)**

```
aws           gcp            azure           terraform      docker
kubernetes    iac            serverless      cloud-storage  networking
```

**Linux (8)**

```
bash          shell-scripting  vim           git            linux-tools
performance   monitoring       systemd
```

**LLMs (9)**

```
llm           rag            fine-tuning     langchain      prompt-engineering
embeddings    ollama         openai-api      mlops
```

**Carrera (5)**

```
learning      productivity   open-source     interviews     tools
```

**Transversales (4)**

```
tutorial      reference      best-practices  debugging
```

### Reglas de tags

1. **3–5 tags por post.** El build falla con menos de 3 o más de 5.
2. **Solo del catálogo.** No inventar tags — el build falla si el valor no existe en taxonomy.ts.
3. **Sin repetir la categoría.** Si el post es `category: data-engineering`, no añadir tags que
   sean sinónimos de la categoría.
4. **Tags transversales solo como complemento.** `tutorial`, `reference`, `best-practices`,
   `debugging` siempre acompañados de ≥1 tag de tecnología concreta.
5. **Para añadir un tag nuevo:** editar `src/config/taxonomy.ts` y justificar que el tag puede
   acumular ≥5 posts futuros.

### Cómo elegir los tags correctos

**Paso 1:** Identifica las 2–3 tecnologías concretas del post (herramientas, lenguajes, servicios).

**Paso 2:** Añade 1 tag de tipo del contenido si aplica: `tutorial`, `reference`, `best-practices`.

**Paso 3:** Añade `debugging` solo si el post resuelve un problema o traza un error específico.

**Ejemplos correctos:**

```yaml
# Post sobre optimizar jobs de Spark con Python
tags: [apache-spark, python, performance, best-practices]

# Tutorial de RAG con LangChain
tags: [rag, langchain, llm, tutorial]

# Referencia de comandos de dbt
tags: [dbt, sql, reference]

# Post sobre DuckDB para analítica local
tags: [duckdb, python, sql, data-pipelines]

# Guía de preparación de entrevistas técnicas
tags: [interviews, learning, tutorial]
```

**Ejemplos incorrectos:**

```yaml
# ✗ Solo 2 tags
tags: [python, tutorial]

# ✗ Repite la categoría (data-engineering es la categoría, no un tag válido)
tags: [data-engineering, python, dbt]

# ✗ Tag no existe en el catálogo
tags: [spark-streaming, python, kafka]

# ✗ Transversal sin tecnología concreta
tags: [tutorial, reference, best-practices]
```

---

## 5. Origins

Campo opcional que describe **cómo fue producido** el post, no su tema. Es ortogonal a
`category` y `tags` — un post con `origins: [ai-generated]` sigue teniendo categoría y tags
independientes y completos.

### Valores

| Valor          | Definición                                                       |
| -------------- | ---------------------------------------------------------------- |
| `ai-generated` | Redactado íntegramente por IA, revisado y validado por el autor. |

### Cuándo usar `ai-generated`

**Válido:**

- Referencias técnicas: glosarios, cheatsheets, tablas de configuración.
- Tutoriales paso a paso sobre tecnologías bien documentadas.
- Contenido de apoyo diseñado para ser enlazado desde otros posts.

**No válido:**

- Posts de opinión o análisis personal.
- Experiencias propias, casos reales del autor.
- Cualquier contenido donde la perspectiva del autor sea el valor principal.

### Frontmatter con origins

```yaml
origins: [ai-generated]
aiModel: 'Claude Sonnet 4.6' # Documenta el modelo específico usado
```

El badge visual "Generado con IA" en el post lee de `origins`. La página `/es/ai-generated/`
filtra por este campo — es una vista transversal, no una categoría.

---

## 6. Metodología SEO

Cada post nace ya optimizado si sigues este protocolo en orden.

### 6.1 Elige la keyword principal

Antes de escribir, define **una keyword primaria** (el término que el lector buscaría en Google
para encontrar este post). Todo lo demás deriva de ella.

Criterios para elegir bien:

- Es una búsqueda real que haría un profesional técnico.
- Encaja con la categoría del post.
- Tiene intención informacional (tutorial, referencia, guía) — no transaccional.

### 6.2 Title

- **50–60 caracteres.** Google trunca a ~60 en SERP.
- La keyword principal **al inicio** o en las primeras palabras.
- Descriptivo: que el lector sepa exactamente qué aprenderá.
- Sin clickbait ni sufijos de marca (el layout añade ` — Edu González` automáticamente).

```yaml
# ✓ Keyword al inicio, claro
title: 'Apache Spark en producción: configuración que nadie documenta'

# ✓ Keyword explícita, promesa concreta
title: 'RAG con LangChain y OpenAI: guía práctica paso a paso'

# ✗ Demasiado genérico
title: 'Cómo usar Python'

# ✗ Demasiado largo
title: 'Una guía completa y exhaustiva para configurar Apache Spark en entornos de producción con Python'
```

### 6.3 Description

- **50–160 caracteres** (Zod valida esto — el build falla si se viola).
- Incluye la keyword principal de forma natural.
- Responde a: ¿por qué leer este post? ¿qué aprenderá el lector?
- No es un resumen del artículo — es un argumento de venta en el SERP.

```yaml
# ✓ Keyword natural, promesa específica
description: 'Configuración práctica de Apache Spark para reducir tiempo de ejecución en pipelines de producción.'

# ✓ Acción + keyword + beneficio
description: 'Implementa RAG con LangChain y OpenAI en 30 minutos: recuperación semántica, prompts y evaluación.'

# ✗ Demasiado corto (< 50 chars)
description: 'Tutorial de Spark para producción.'

# ✗ No incluye keyword principal
description: 'Artículo sobre optimización de recursos computacionales en sistemas distribuidos.'
```

### 6.4 Slug

- **kebab-case**, 3–5 palabras, sin artículos ni preposiciones innecesarias.
- Contiene la keyword principal o sus palabras clave.
- En español para posts ES, en inglés para posts EN (pueden diferir — ver §7).
- **No cambiar tras publicar** — rompe URLs indexadas y pierde el equity SEO acumulado.

```yaml
# ✓ Conciso, keyword clara
slug: 'spark-produccion-configuracion'       # ES
slug: 'spark-production-configuration'      # EN

# ✓ Herramienta + acción
slug: 'dbt-guia-completa'
slug: 'dbt-complete-guide'

# ✗ Demasiado largo
slug: 'como-configurar-apache-spark-para-jobs-de-produccion-con-python'

# ✗ Sin keywords
slug: 'nuevo-post-junio-2026'
```

### 6.5 Estructura del contenido

- **H1 = title.** El sistema usa `title` del frontmatter como `<h1>`. No repitas el H1 en el
  cuerpo.
- **H2 para secciones principales.** Los rastreadores leen H2 para entender el scope del post.
  Incluye variantes de la keyword cuando sea natural.
- **Primer párrafo:** define el problema o el valor del post en 2–3 frases. Sin introducción
  genérica ("En este artículo vamos a ver…").
- **Código:** siempre con code fences y el lenguaje especificado (` ```python `). El blog añade
  automáticamente numeración de líneas y botón de copia.
- **Longitud mínima orientativa:** posts tutoriales ≥ 800 palabras, referencias ≥ 400 palabras.

### 6.6 Enlazado interno

- Enlaza a otros posts del blog cuando cites un concepto que ya has desarrollado en otro artículo.
- Enlaza desde posts nuevos hacia posts más antiguos (link juice hacia el contenido consolidado).
- Usa texto de enlace descriptivo: `[cómo configurar Airflow en Docker](../airflow-docker/)`,
  no `[aquí](../airflow-docker/)` ni `[click aquí](../airflow-docker/)`.
- Mínimo 1–2 enlaces internos por post de ≥800 palabras.

### 6.7 Imágenes

```yaml
cover:
  image: './cover.png'
  alt: 'Diagrama de arquitectura de pipeline con Spark, Kafka y Delta Lake.'
```

- **`alt` obligatorio** en imágenes de portada y en todas las imágenes inline.
- El `alt` describe el contenido visual, no el post en general.
- Si la imagen es puramente decorativa: `alt: ''`.
- El sistema genera automáticamente la imagen OG (1200×630) a partir de la cover.
- Para imágenes inline en el cuerpo: `![Descripción clara](./diagrama.png)`.

---

## 7. Flujo bilingüe

### Publicar solo en español

El comportamiento por defecto. Solo necesitas `index.es.md`. No hace falta `translationKey`.

### Publicar en ambos idiomas

1. Crea `index.es.md` e `index.en.md` en la misma carpeta.
2. Usa **el mismo `translationKey`** en ambos archivos — el sistema genera hreflang automáticamente.
3. El `slug` **puede diferir** entre idiomas para SEO local.

```yaml
# index.es.md
title: 'dbt en producción: lo que nadie documenta'
slug: 'dbt-produccion-guia'
lang: 'es'
translationKey: 'dbt-production-guide'   # ← mismo valor en ambos

# index.en.md
title: 'dbt in production: what nobody documents'
slug: 'dbt-production-guide'
lang: 'en'
translationKey: 'dbt-production-guide'   # ← mismo valor en ambos
```

Las URLs generadas serán:

- `/es/posts/dbt-produccion-guia/`
- `/en/posts/dbt-production-guide/`

Con hreflang bidireccional correcto entre ellas + `x-default` apuntando a ES.

### Slugs de categoría localizados

Las páginas de listado por categoría usan **slug localizado** cuando el término difiere:

| Categoría        | ES                      | EN                      |
| ---------------- | ----------------------- | ----------------------- |
| carrera          | `/es/carrera/`          | `/en/career/`           |
| data-engineering | `/es/data-engineering/` | `/en/data-engineering/` |
| cloud            | `/es/cloud/`            | `/en/cloud/`            |
| linux            | `/es/linux/`            | `/en/linux/`            |
| llms             | `/es/llms/`             | `/en/llms/`             |

Esto es transparente para el autor — el campo `category` del frontmatter usa siempre el slug ES
(`carrera`). El sistema gestiona la URL EN automáticamente.

---

## 8. Preview y build local

```bash
pnpm run dev     # servidor local en http://localhost:4321
pnpm run build   # build de producción (valida Zod, genera sitemap, pagefind)
pnpm run lint    # ESLint + type check
```

**URLs de preview en local:**

| Tipo         | URL                                      |
| ------------ | ---------------------------------------- |
| Post ES      | `http://localhost:4321/es/posts/{slug}/` |
| Post EN      | `http://localhost:4321/en/posts/{slug}/` |
| Categoría ES | `http://localhost:4321/es/{category}/`   |
| Categoría EN | `http://localhost:4321/en/{category}/`   |
| Tags ES      | `http://localhost:4321/es/tags/{tag}/`   |
| Blog ES      | `http://localhost:4321/es/blog/`         |
| AI Generated | `http://localhost:4321/es/ai-generated/` |

**Posts en draft** (`draft: true`) son visibles en `dev` pero **no** en el build de producción
ni en el sitemap ni en el RSS.

### Validaciones automáticas en cada commit

El pre-commit hook ejecuta:

1. ESLint con auto-fix sobre `.astro`, `.ts`, `.js`.
2. Prettier sobre `.json`, `.css`, `.yml`.

Los archivos en `src/content/**/*.md` están excluidos de Prettier para preservar el formato
intencional del Markdown.

---

## 9. Checklist antes de publicar

### Frontmatter

- [ ] `title` claro, keyword principal en las primeras palabras, 50–60 chars.
- [ ] `description` entre 50 y 160 caracteres con keyword natural.
- [ ] `slug` en kebab-case, único, descriptivo, sin artículos superfluos.
- [ ] `date` correcta (`YYYY-MM-DD`).
- [ ] `lang` coincide con el sufijo del archivo.
- [ ] `category` es exactamente un valor del catálogo (no un array).
- [ ] `tags` tiene entre 3 y 5 valores, todos del catálogo.
- [ ] Ningún tag repite la categoría.
- [ ] `translationKey` presente si publicas en ambos idiomas (y es el mismo valor en ambos).
- [ ] `cover.alt` presente y descriptivo si hay imagen de portada.
- [ ] `draft: false` (o `true` si es intencional).

### Contenido

- [ ] Primer párrafo define el problema/valor sin introducción genérica.
- [ ] H2 en secciones principales con keywords relevantes.
- [ ] Al menos 1 enlace interno a otro post del blog.
- [ ] Todas las imágenes inline tienen `alt`.
- [ ] Bloques de código tienen el lenguaje especificado.
- [ ] `pnpm run build` pasa sin errores Zod ni TypeScript.

### SEO

- [ ] El title no supera 60 chars (revisado en preview).
- [ ] La description no supera 160 chars (validado por Zod en build).
- [ ] El slug no cambia tras una primera publicación.
- [ ] Si tiene `origins: [ai-generated]`, tiene también `aiModel`.

---

## Referencia rápida de archivos

| Archivo                        | Propósito                                                            |
| ------------------------------ | -------------------------------------------------------------------- |
| `src/content.config.ts`        | Schema Zod — fuente de verdad de los campos y validaciones.          |
| `src/config/taxonomy.ts`       | Catálogo cerrado de CATEGORIES, TAGS y ORIGINS. Añadir valores aquí. |
| `src/config/site.ts`           | Branding, dominio, autor, redes sociales.                            |
| `astro.config.mjs`             | i18n, redirects, hreflang de posts, sitemap.                         |
| `src/layouts/BaseLayout.astro` | Canonical, hreflang, meta tags, JSON-LD.                             |
| `src/i18n/ui.ts`               | Strings de UI traducidos por idioma.                                 |
