# Testing

Suite de tests unitarios para detectar regresiones en la lógica crítica del blog. Los tests corren en ~115ms, sin levantar el runtime de Astro.

---

## Comandos

```bash
pnpm test          # one-shot (modo CI)
pnpm test:watch    # modo interactivo con re-ejecución en cambios
```

El CI ejecuta `pnpm test` automáticamente en cada PR y push a `main`, antes del build.

---

## Qué se testea

### `tests/i18n.test.ts` — Utilidades i18n

Cubre las 6 funciones puras de `src/i18n/utils.ts`:

| Función           | Casos clave                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `getLangFromUrl`  | Rutas `/es/`, `/en/`, lang desconocido → fallback `es`, ruta raíz            |
| `useTranslations` | Strings en ambos idiomas, `blog.minuteRead` devuelve `string` no función     |
| `switchLangPath`  | Reemplaza prefijo de idioma, preserva trailing slash, maneja ruta raíz       |
| `getPostUrl`      | Construye `/{lang}/posts/{slug}/` correctamente                              |
| `getReadingTime`  | Vacío → 1, strips markdown, **boundary 344→1min / 345→2min**                 |
| `formatDate`      | Locale `es-ES` / `en-US`, coerción de string, fallback para lang desconocido |

El test de boundary (344/345 palabras) es el más valioso: verifica que la constante `230 wpm` no ha cambiado accidentalmente.

### `tests/ui-completeness.test.ts` — Paridad de traducciones

Cubre `src/i18n/ui.ts`:

- `es` y `en` tienen exactamente las mismas claves
- `blog.minuteRead` es una función en ambos idiomas
- Ningún valor string es vacío
- `defaultLang === 'es'`
- `languages` contiene solo `es` y `en`

Si añades una clave en un idioma y te olvidas del otro, este test falla.

### `tests/og.test.ts` — Helpers de imágenes OG

Cubre `src/utils/og.ts`:

| Función     | Casos clave                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| `wrapTitle` | Título corto (1 línea), wrap en boundaries de palabra, cap a 3 líneas, string vacío, palabra larga sin partir |
| `escXml`    | `&`, `<`, `>`, `"`, combinación de los 4, string limpio, vacío, **orden de escape**                           |

El test de orden de escape (`&<` → `&amp;&lt;`) es el más crítico: verifica que `&` se escapa antes que `<` para prevenir double-escaping en el SVG generado.

### `tests/schema.test.ts` — Schema de contenido

Reproduce las reglas Zod de `src/content.config.ts` usando `zod` directamente (sin runtime de Astro):

| Regla                             | Test                                         |
| --------------------------------- | -------------------------------------------- |
| `description` min 50              | 49 chars → falla, 50 → pasa                  |
| `description` max 160             | 160 → pasa, 161 → falla                      |
| `title` requerido                 | Ausente → falla                              |
| `slug` requerido                  | Ausente → falla                              |
| `date` coercionado                | String ISO → `Date`, string inválido → falla |
| `draft` default `false`           | Ausente → `false`                            |
| `lang` enum `es`/`en`             | `fr` → falla, ausente → `es`                 |
| `tags`, `categories` default `[]` | Ausentes → `[]`                              |
| `author` default `'Edu González'` | Ausente → valor por defecto                  |
| `updatedDate` opcional            | Ausente → `undefined`, válido → `Date`       |

---

## Cuándo añadir tests

Añade un test cuando:

- **Introduces una nueva función pura** en `src/utils/` o `src/i18n/` — cada función nueva merece al menos 3 casos (happy path, edge case, error case).
- **Cambias una regla de validación** en `src/content.config.ts` — actualiza `tests/schema.test.ts` para reflejar el nuevo contrato.
- **Añades una clave al objeto `ui`** — el test de paridad lo detecta automáticamente; no necesitas modificar nada.
- **Un bug se cuela en producción** — escribe primero el test que lo reproduce, luego corrige el código.

No testees:

- Componentes `.astro` (requieren runtime de Astro)
- Endpoints que importan `astro:content` (RSS, sitemap)
- Lógica de presentación (SVG markup de `buildSvg`)

---

## Estructura de archivos

```
tests/
├── i18n.test.ts            # src/i18n/utils.ts
├── ui-completeness.test.ts # src/i18n/ui.ts
├── og.test.ts              # src/utils/og.ts
└── schema.test.ts          # reglas Zod de src/content.config.ts

src/utils/
└── og.ts                   # wrapTitle + escXml (extraídos para testabilidad)

vitest.config.ts            # config del runner
```

---

## Diagnóstico de fallos

**Test de paridad de claves falla:**
Añadiste una clave en `src/i18n/ui.ts` en un idioma pero no en el otro. Añade la clave que falta.

**Test de boundary `getReadingTime` falla:**
La constante de palabras por minuto en `src/i18n/utils.ts` cambió. Actualiza el test para reflejar el nuevo valor.

**Test de schema falla:**
Una regla Zod en `src/content.config.ts` cambió. Actualiza `tests/schema.test.ts` para que el test refleje la nueva restricción.

**Test de `escXml` falla:**
El orden de los `.replace()` en `src/utils/og.ts` cambió. El `&` debe escaparse siempre el primero.
