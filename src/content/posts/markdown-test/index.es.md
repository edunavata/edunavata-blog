---
title: "Referencia completa de Markdown"
date: 2025-05-17
draft: false
slug: "referencia-markdown"
description: "Artículo de prueba que ejercita todas las funcionalidades de Markdown: tipografía, listas, tablas, bloques de código, citas y más."
tags: ["markdown", "test", "referencia"]
categories: ["tech"]
lang: "es"
author: "Edu González"
---

Este artículo existe para verificar que cada elemento Markdown se renderiza correctamente. No tiene intención editorial — es una lista exhaustiva de funcionalidades.

---

## Énfasis e inline

El texto puede ser **negrita**, *cursiva*, ***negrita y cursiva*** o ~~tachado~~. El `código inline` aparece en fuente monospace dentro del párrafo.

Las combinaciones funcionan en listas, tablas y citas, no sólo en párrafos sueltos.

La <mark>marca de resaltado</mark> requiere HTML directo, igual que los superíndices[^1] y subíndices: H<sub>2</sub>O y E=mc<sup>2</sup>.

Atajos de teclado: <kbd>Ctrl</kbd>+<kbd>S</kbd> para guardar, <kbd>Ctrl</kbd>+<kbd>Z</kbd> para deshacer.

[^1]: Esta es la nota al pie número 1. Aparece automáticamente al final del documento, enlazada desde aquí.

---

## Listas

### No ordenada

- Primer ítem sin formato
- Segundo ítem con **negrita** y *cursiva*
- Tercer ítem con `código inline`
  - Subítem anidado A
  - Subítem anidado B
    - Tercer nivel de anidación
  - Subítem anidado C
- Cuarto ítem de vuelta al primer nivel

### Ordenada

1. Clonar el repositorio: `git clone https://github.com/user/repo.git`
2. Instalar dependencias con `pnpm install`
3. Arrancar el servidor de desarrollo
   1. Con pnpm: `pnpm run dev`
   2. Con npm: `npm run dev`
4. Abrir `http://localhost:4321` en el navegador

### Lista de tareas

- [x] Configurar el proyecto Astro 6
- [x] Añadir Tailwind CSS v4
- [x] Implementar modo oscuro con tokens OKLCH
- [x] Soporte bilingüe (es / en)
- [ ] Migrar todos los posts del blog anterior
- [ ] Configurar CI/CD en GitHub Actions
- [ ] Añadir búsqueda full-text con Pagefind

---

## Bloques de código

Gestionados por `astro-expressive-code`, que añade resaltado, título de archivo y botón de copia.

### TypeScript

```typescript title="src/utils/reading-time.ts"
interface ReadingTimeOptions {
  wordsPerMinute?: number;
}

export function getReadingTime(
  text: string,
  { wordsPerMinute = 200 }: ReadingTimeOptions = {}
): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

### Bash / terminal

```bash
# Clonar e instalar dependencias
git clone https://github.com/user/blog.git
cd blog && pnpm install

# Build de producción con chequeo de tipos
pnpm run build

# Preview del sitio generado
pnpm run preview
```

### JSON

```json title="tsconfig.json"
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### YAML (frontmatter)

```yaml title="src/content/posts/ejemplo/index.es.md"
---
title: "Título del artículo"
date: 2025-05-17
draft: false
slug: "titulo-del-articulo"
description: "Descripción entre 50 y 160 caracteres para SEO."
tags: ["astro", "tutorial"]
lang: "es"
---
```

### Bloque sin lenguaje

```
╔════════════════════════════════╗
║  Diagrama ASCII de arquitectura ║
║                                 ║
║   Browser → Astro → HTML        ║
║              ↓                  ║
║         Static Files            ║
╚════════════════════════════════╝
```

---

## Tablas

### Básica

| Framework  | Build time | JS en prod | Licencia |
|------------|-----------|-----------|----------|
| Astro      | ~4 s      | 0 KB      | MIT      |
| Next.js    | ~18 s     | 89 KB     | MIT      |
| SvelteKit  | ~8 s      | 15 KB     | MIT      |
| Nuxt       | ~12 s     | 45 KB     | MIT      |

### Con alineación de columnas

| Concepto           | Valor              |   Coste mensual |
|:-------------------|:------------------:|----------------:|
| Cloudflare Pages   | 0–500 builds/mes   |           0 €   |
| Cloudflare R2      | 10 GB almacén      |           0 €   |
| Dominio .dev       | 1 año              |          12 €   |
| **Total**          |                    |      **12 €**   |

### Con código e inline en celdas

| Comando              | Descripción                              |
|----------------------|------------------------------------------|
| `pnpm run dev`       | Arranca el servidor con HMR              |
| `pnpm run build`     | Build + `astro check` (TypeScript)       |
| `pnpm run preview`   | Sirve el directorio `dist/` localmente   |
| `pnpm run lint`      | ESLint sobre `src/**/*.{ts,astro}`       |

---

## Citas (blockquote)

### Simple

> La simplicidad es la sofisticación máxima.

### Con atribución

> Todo debería hacerse tan simple como sea posible, pero no más simple.
>
> — Albert Einstein

### Con formato interno

> **Importante:** los blockquotes pueden contener cualquier elemento Markdown:
>
> - Listas
> - `código inline`
> - [enlaces a secciones](#listas)
>
> Y múltiples párrafos separados por líneas en blanco.

### Anidadas

> Esta es una cita de primer nivel con algo de texto para darle contexto.
>
> > Cita anidada de segundo nivel. Útil para citar respuestas a citas.
> >
> > > Tercer nivel de anidación. En la práctica, raro de ver.
>
> Vuelta al primer nivel después de los niveles anidados.

---

## Cabeceras h4 y h5

Las cabeceras h4 aparecen en el cuerpo del artículo pero no en el TOC de la barra lateral.

#### Configuración básica de Astro

La configuración mínima para un blog estático vive en `astro.config.mjs`.

#### Opciones de imagen y optimización

Astro optimiza imágenes automáticamente con el componente `<Image />` o la directiva `image()` del schema.

---

## Imágenes inline

Astro procesa imágenes locales referenciadas desde el frontmatter con el componente `<Image />`. Las imágenes inline en el cuerpo del artículo usan `<img>` estándar.

![Placeholder — diagrama 16:9](https://placehold.co/720x405/0a0a0a/a1a1a1?text=Imagen+de+prueba+%E2%80%94+16:9)

---

## HTML directo

Markdown permite HTML cuando la sintaxis nativa no llega.

### Detalles colapsables

<details>
<summary>¿Cuándo usar <code>client:visible</code> vs <code>client:idle</code>?</summary>

**`client:visible`** hidrata el componente cuando entra en el viewport. Es ideal para elementos bajo el fold que el usuario puede no ver nunca.

**`client:idle`** hidrata cuando el hilo principal está libre (`requestIdleCallback`). Úsalo para componentes no críticos que el usuario puede necesitar pronto pero no de forma inmediata.

```typescript
// bajo el fold — el usuario tiene que hacer scroll
<CommentSection client:visible />

// secundario, no crítico
<NewsletterWidget client:idle />
```

</details>

### Marca y atajos de teclado

Para buscar en el repositorio usa <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>. Los términos <mark>relevantes</mark> se pueden destacar con `<mark>`.

---

## Separadores

Los tres tipos de separador horizontal producen el mismo resultado visual:

Con `---`:

---

Con `***`:

***

Con `___`:

___

---

## Párrafos y tipografía

Un párrafo largo para verificar el interlineado (`line-height: 1.72`), el espaciado entre párrafos y la legibilidad general del cuerpo. La tipografía que se usa es *Source Serif 4 Variable*, diseñada para la lectura en pantalla a tamaños medianos.

Segundo párrafo consecutivo para confirmar que el `margin-top` entre párrafos no es ni excesivo ni insuficiente. El `> * + *` del CSS aplica `margin-top: 1.4em` sólo entre hermanos, sin afectar al primer hijo.

Los smarts quotes se aplican automáticamente con `remark-smartypants`: "comillas dobles", 'simples', em-dashes — como este — y puntos suspensivos...

---

## Notas al pie

Este artículo tiene una segunda nota al pie[^2] que aparece listada al final junto con la primera.

Las notas pueden tener identificadores de texto en lugar de números[^nota-texto], aunque se renderizan numeradas en orden de aparición.

[^2]: Segunda nota al pie. Puede contener texto largo sin problema.
[^nota-texto]: Nota con identificador textual. El renderizador la numera según el orden en que aparece en el documento.
