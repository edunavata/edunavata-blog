# Blog Técnico — Reglas del Proyecto

Blog de ingeniería personal: Cloud, Data Engineering, LLMs, Linux, Ciberseguridad.
Objetivo: marca personal y documentación técnica de profundidad.

---

## Stack

| Capa       | Tecnología                                      |
|------------|-------------------------------------------------|
| Framework  | Astro 6.0+ — modo SSG/estático por defecto      |
| Estilos    | Tailwind CSS v4 (motor Oxide, config CSS-first) |
| Lenguaje   | TypeScript strict                               |
| Arquitectura | Islands — zero JS por defecto               |

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
- Mantén `/llms.txt` actualizado con el contenido limpio de los posts.

---

## Herramientas y Flujo de Trabajo

### Antes de cambios en el codebase

1. Ejecuta `search_code` (MCP `codebase-memory-mcp`) para localizar el código relevante antes de editar.
2. Si hay cambios recientes significativos, ejecuta `index_codebase` primero.

### Validación de APIs

- Usa `search_astro_docs` (MCP `astro-docs`) para confirmar cualquier cambio de API de Astro 6 antes de implementarlo.

### Skills disponibles

Actívalas según la fase del trabajo:

| Skill                      | Cuándo usarla                              |
|----------------------------|--------------------------------------------|
| `/astro-framework`         | Nuevos componentes, rutas, layouts         |
| `/tailwind-best-practices` | Estilos, tokens, responsividad             |
| `/web-design-guidelines`   | Accesibilidad, UX, estructura visual       |

---

## Comportamiento del Agente

- **Patrones recurrentes:** si detectas un error repetido o una preferencia no documentada, pide permiso antes de añadirlo aquí o a `CLAUDE.local.md`.
- **Contexto semántico:** en tareas complejas, confirma el estado del índice antes de empezar.
- **Veracidad técnica:** no asumas compatibilidad entre versiones de Astro o Tailwind — verifica con los MCPs correspondientes.