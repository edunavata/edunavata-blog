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
pnpm run dev      # servidor local
pnpm run build    # build de producción
pnpm run preview  # preview local
pnpm run lint     # linting
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

### Gestor de paquetes

- **Usa siempre `pnpm`** para instalar dependencias, ejecutar scripts y gestionar el lockfile. Usa `npm` solo si es estrictamente necesario y deja explícita la razón.

### Git — Flujo de trabajo

- **Rama por tarea:** crea una rama nueva desde `main` antes de tocar código (`feature/...`, `fix/...`, `chore/...`, `refactor/...`), salvo que se indique otra base. Confirma que corresponde a la tarea actual.
- **Agentes en paralelo:** asume que otros agentes trabajan en simultáneo. No sobrescribas ni reviertas cambios ajenos.
- **Commits atómicos:** mensajes en imperativo, ≤50 chars en el título. No mezcles contextos de tareas distintas.
- **Al terminar:** haz commit de todos los cambios y crea un PR con `gh pr create`:
  - Título: ≤70 chars, imperativo, descriptivo.
  - Body: 2–3 bullets de qué y por qué + checklist de test plan. Sin texto de relleno.
- **Antes de cerrar:** muestra `git status` y menciona cualquier trabajo ajeno detectado.

### Antes de cambios en el codebase

1. Si hay cambios recientes significativos, ejecuta `index_codebase` (MCP `codebase-memory-mcp`).
2. Ejecuta `search_code` para localizar el código relevante antes de editar.

### Validación de APIs

- Usa `search_astro_docs` (MCP `astro-docs`) para confirmar cambios de API de Astro 6 antes de implementarlos.

### Skills disponibles

Carga la mínima skill que desbloquee la tarea:

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

---

## Comportamiento del Agente

- No asumas compatibilidad entre versiones de Astro/Tailwind — verifica con los MCPs.
- Si detectas un patrón de error repetido o preferencia no documentada, pide permiso antes de actualizar este archivo o `CLAUDE.local.md`.
- **SEO basado en datos:** consulta GSC (MCP `gsc`) antes de priorizar cambios on-page. Los datos prevalecen sobre suposiciones.
