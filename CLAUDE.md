# Blog Técnico — Reglas del Proyecto

Blog de ingeniería personal: Cloud, Data Engineering, LLMs, Linux, Ciberseguridad.
Objetivo: marca personal y documentación técnica de profundidad.

---

## Stack

| Capa         | Tecnología                                      |
|--------------|-------------------------------------------------|
| Framework    | Astro 6.0+ — modo SSG/estático por defecto      |
| Estilos      | Tailwind CSS v4 (motor Oxide, config CSS-first) |
| Lenguaje     | TypeScript strict                               |
| Arquitectura | Islands — zero JS por defecto                   |

---

## Comandos

```bash
npm run dev      # servidor local
npm run build    # build de producción
npm run preview  # preview local
npm run lint     # linting
```

---

## Reglas de Código

### Astro

- **Static-first.** Todos los componentes son estáticos salvo necesidad explícita de interactividad.
- **Hidratación:** usa `client:visible` bajo el fold (comentarios, demos); `client:idle` para elementos secundarios. Nunca `client:load` sin justificación.
- **Content Collections obligatorias** para posts; valida esquemas con Zod.

### Tailwind CSS v4 — Reglas Críticas

- **No existe `tailwind.config.js`.** Toda configuración va en el bloque `@theme` de `src/styles/global.css`.
- **Import correcto:** `@import "tailwindcss";` — nunca las directivas `@tailwind` de v3.
- **Color:** usa espacio OKLCH para todos los tokens de marca.
- **Prohibido:** `bg-opacity-50` y similares — usa modificadores modernos (`bg-red-500/50`).
- **Evita `@apply`** para estilos simples; prefiere clases de utilidad en el markup.

### TypeScript

- Define interfaces para todos los props de componentes `.astro`.
- Sin `any` implícito; si es necesario, coméntalo.

### SEO

- Cada página incluye: `<title>`, `description`, `canonical`, OpenGraph y JSON-LD.
- Schema mínimo por post: `Article` + `Person` (autor). Valida contra tipos soportados por Google.
- **Prohibido:** `HowTo` (deprecated sept. 2023), `FAQ` restringido a gov/salud, `SpecialAnnouncement` (deprecated jul. 2025).
- Mantén `/llms.txt` actualizado con el contenido limpio de los posts.
- Imágenes: siempre componente `<Image>` de Astro con `alt` descriptivo.

---

## Herramientas y Flujo de Trabajo

### Git y trabajo en paralelo

- **Empieza siempre en una rama propia** antes de editar (`feature/...`, `fix/...`, `chore/...`). Si ya estás en una rama de tarea, confirma que es la correcta.
- **Asume agentes en paralelo:** revisa `git status` antes de tocar archivos, no sobrescribas cambios ajenos y coordina si el mismo archivo ya tiene trabajo no relacionado.
- **Cambios pequeños y atómicos:** separa documentación, refactors y cambios de comportamiento. Haz commits descriptivos cuando el usuario lo pida o la tarea lo requiera.
- **Antes de cerrar:** muestra el estado de Git y resume archivos tocados, validaciones ejecutadas y riesgos pendientes.

### Antes de cambios en el codebase

1. Si hay cambios recientes significativos, ejecuta `index_codebase` (MCP `codebase-memory-mcp`).
2. Ejecuta `search_code` para localizar el código relevante antes de editar.

### Validación de APIs

- Usa `search_astro_docs` (MCP `astro-docs`) para confirmar cambios de API de Astro 6 antes de implementarlos.

### Datos reales de búsqueda

- Usa el MCP **Google Search Console** para obtener datos de rendimiento reales (queries, CTR, impresiones, posición media) antes de hacer cambios de SEO on-page. Los datos de GSC prevalecen sobre suposiciones.

### Skills disponibles

Actívalas según la fase del trabajo. No cargues todas por defecto: usa la mínima skill que desbloquee la tarea y resume sus reglas en memoria de trabajo.

| Skill                      | Cuándo usarla                                          |
|----------------------------|--------------------------------------------------------|
| `/astro-framework`         | Nuevos componentes, rutas, layouts                     |
| `/tailwind-best-practices` | Estilos, tokens, responsividad                         |
| `/tailwind-design-system`  | Sistema de diseño, tokens globales, coherencia visual  |
| `/web-design-guidelines`   | Accesibilidad, UX, estructura visual                   |
| `/frontend-design`         | Componentes UI, primera impresión, marca personal      |
| `/seo`                     | Auditoría SEO completa, orchestración de subagentes    |
| `/seo-technical`           | Core Web Vitals, crawlabilidad, rendimiento            |
| `/seo-content`             | Calidad de contenido, E-E-A-T, estructura de posts     |
| `/seo-schema`              | Generación y validación de Schema.org / JSON-LD        |
| `/seo-geo`                 | Optimización para AI Overviews, Perplexity, ChatGPT    |

Skills globales instaladas desde `addyosmani/agent-skills`; úsalas de forma pragmática:

| Skill                                  | Cuándo usarla                                      |
|----------------------------------------|----------------------------------------------------|
| `/using-agent-skills`                  | Dudas sobre qué skill aplicar                      |
| `/context-engineering`                 | Preparar o ajustar contexto del agente             |
| `/spec-driven-development`             | Features ambiguas o nuevas sin especificación      |
| `/interview-me`                        | Requisitos vagos que necesitan aclaración          |
| `/source-driven-development`           | APIs/librerías donde conviene verificar docs       |
| `/debugging-and-error-recovery`        | Tests rotos, builds fallidos, errores inesperados  |
| `/browser-testing-with-devtools`       | Verificación real en navegador                     |
| `/frontend-ui-engineering`             | UI productiva, layouts, estado, componentes        |
| `/code-review-and-quality`             | Revisión antes de mergear o cerrar una tarea       |
| `/code-simplification`                 | Refactors de claridad sin cambiar comportamiento   |
| `/performance-optimization`            | Core Web Vitals, profiling, cuellos de botella     |
| `/security-and-hardening`              | Inputs, auth, sesiones, datos o integraciones      |
| `/documentation-and-adrs`              | Decisiones técnicas o cambios de API pública       |
| `/deprecation-and-migration`           | Migraciones, retirada de APIs o sistemas antiguos  |
| `/doubt-driven-development`            | Decisiones críticas que conviene verificar         |
| `/git-workflow-and-versioning`         | Cambios versionados, ramas, commits, PRs           |

---

## Comportamiento del Agente

- **Patrones recurrentes:** si detectas un error repetido o una preferencia no documentada, pide permiso antes de añadirlo aquí o a `CLAUDE.local.md`.
- **Contexto semántico:** en tareas complejas, confirma el estado del índice antes de empezar.
- **Veracidad técnica:** no asumas compatibilidad entre versiones de Astro o Tailwind — verifica con los MCPs correspondientes.
- **Decisiones de SEO basadas en datos:** consulta GSC antes de priorizar cambios on-page. No optimices a ciegas.
