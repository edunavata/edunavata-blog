---
title: "Complete Markdown Reference"
date: 2025-05-17
draft: false
slug: "markdown-reference"
description: "Test article exercising every Markdown feature: typography, lists, tables, code blocks, blockquotes, and more."
category: carrera
tags: [reference, tools, tutorial]
lang: "en"
author: "Edu González"
---

This article exists to verify that every Markdown element renders correctly. It has no editorial intent — it is an exhaustive feature checklist.

---

## Emphasis and inline

Text can be **bold**, *italic*, ***bold and italic*** or ~~strikethrough~~. `Inline code` renders in monospace within the paragraph.

Combinations work inside lists, tables and blockquotes, not just in standalone paragraphs.

<mark>Highlighted text</mark> requires direct HTML, as do superscripts[^1] and subscripts: H<sub>2</sub>O and E=mc<sup>2</sup>.

Keyboard shortcuts: <kbd>Ctrl</kbd>+<kbd>S</kbd> to save, <kbd>Ctrl</kbd>+<kbd>Z</kbd> to undo.

[^1]: This is footnote number 1. It appears automatically at the end of the document, linked from here.

---

## Lists

### Unordered

- First item, no formatting
- Second item with **bold** and *italic*
- Third item with `inline code`
  - Nested item A
  - Nested item B
    - Third nesting level
  - Nested item C
- Fourth item back at the first level

### Ordered

1. Clone the repository: `git clone https://github.com/user/repo.git`
2. Install dependencies with `pnpm install`
3. Start the development server
   1. With pnpm: `pnpm run dev`
   2. With npm: `npm run dev`
4. Open `http://localhost:4321` in the browser

### Task list

- [x] Set up Astro 6 project
- [x] Add Tailwind CSS v4
- [x] Implement dark mode with OKLCH tokens
- [x] Bilingual support (es / en)
- [ ] Migrate all posts from the old blog
- [ ] Set up CI/CD in GitHub Actions
- [ ] Add full-text search with Pagefind

---

## Code blocks

Handled by `astro-expressive-code`, which adds syntax highlighting, file titles and a copy button.

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
# Clone and install dependencies
git clone https://github.com/user/blog.git
cd blog && pnpm install

# Production build with type check
pnpm run build

# Preview the generated site
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

```yaml title="src/content/posts/example/index.en.md"
---
title: "Article title"
date: 2025-05-17
draft: false
slug: "article-title"
description: "Description between 50 and 160 characters for SEO."
tags: ["astro", "tutorial"]
lang: "en"
---
```

### No-language block

```
╔════════════════════════════════╗
║   ASCII architecture diagram    ║
║                                 ║
║   Browser → Astro → HTML        ║
║              ↓                  ║
║         Static Files            ║
╚════════════════════════════════╝
```

---

## Tables

### Basic

| Framework  | Build time | JS in prod | License |
|------------|-----------|-----------|---------|
| Astro      | ~4 s      | 0 KB      | MIT     |
| Next.js    | ~18 s     | 89 KB     | MIT     |
| SvelteKit  | ~8 s      | 15 KB     | MIT     |
| Nuxt       | ~12 s     | 45 KB     | MIT     |

### With column alignment

| Item               |    Value           |  Monthly cost   |
|:-------------------|:------------------:|----------------:|
| Cloudflare Pages   | 0–500 builds/mo    |          $0     |
| Cloudflare R2      | 10 GB storage      |          $0     |
| .dev domain        | 1 year             |         $14     |
| **Total**          |                    |     **$14**     |

### With code and inline in cells

| Command              | Description                              |
|----------------------|------------------------------------------|
| `pnpm run dev`       | Start dev server with HMR                |
| `pnpm run build`     | Build + `astro check` (TypeScript)       |
| `pnpm run preview`   | Serve the `dist/` directory locally      |
| `pnpm run lint`      | ESLint over `src/**/*.{ts,astro}`        |

---

## Blockquotes

### Simple

> Simplicity is the ultimate sophistication.

### With attribution

> Everything should be made as simple as possible, but not simpler.
>
> — Albert Einstein

### With internal formatting

> **Important:** blockquotes can contain any Markdown element:
>
> - Lists
> - `inline code`
> - [links to sections](#lists)
>
> And multiple paragraphs separated by blank lines.

### Nested

> This is a first-level blockquote with some text for context.
>
> > Second-level nested blockquote. Useful for quoting replies.
> >
> > > Third level of nesting. Rare in practice.
>
> Back to the first level after the nested levels.

---

## h4 and h5 headings

h4 headings appear in the article body but are not included in the sidebar TOC.

### h4 example

#### Basic Astro configuration

The minimal configuration for a static blog lives in `astro.config.mjs`.

#### Image optimization options

Astro automatically optimizes images with the `<Image />` component or the `image()` schema directive.

---

## Inline images

Astro processes local images referenced from frontmatter with the `<Image />` component. Inline images in the article body use standard `<img>`.

![Placeholder — 16:9 diagram](https://placehold.co/720x405/0a0a0a/a1a1a1?text=Test+image+%E2%80%94+16:9)

---

## Direct HTML

Markdown allows HTML when native syntax falls short.

### Collapsible details

<details>
<summary>When to use <code>client:visible</code> vs <code>client:idle</code>?</summary>

**`client:visible`** hydrates the component when it enters the viewport. Ideal for below-the-fold elements the user might never see.

**`client:idle`** hydrates when the main thread is free (`requestIdleCallback`). Use it for non-critical components the user may need soon but not immediately.

```typescript
// below the fold — user must scroll
<CommentSection client:visible />

// secondary, non-critical
<NewsletterWidget client:idle />
```

</details>

### Highlight and keyboard shortcuts

To search the repository use <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>. <mark>Relevant terms</mark> can be highlighted with `<mark>`.

---

## Separators

All three horizontal rule syntaxes produce the same visual result:

With `---`:

---

With `***`:

***

With `___`:

___

---

## Paragraphs and typography

A long paragraph to verify line-height (`1.72`), paragraph spacing and overall body readability. The typeface is *Source Serif 4 Variable*, designed for on-screen reading at medium sizes.

Second consecutive paragraph to confirm that `margin-top` between paragraphs is neither excessive nor insufficient. The `> * + *` CSS selector applies `margin-top: 1.4em` only between siblings, leaving the first child unaffected.

Smart quotes are applied automatically by `remark-smartypants`: "double quotes", 'single quotes', em-dashes — like this one — and ellipses...

---

## Footnotes

This article has a second footnote[^2] listed at the end alongside the first one.

Footnotes can have text identifiers instead of numbers[^text-note], though they render numbered in order of appearance.

[^2]: Second footnote. It can contain long text without any issue.
[^text-note]: Footnote with a text identifier. The renderer numbers it according to the order in which it appears in the document.
