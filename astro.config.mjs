import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

function rehypeAccessibleTaskList() {
  return function (tree) {
    function walk(node) {
      if (
        node.type === 'element' &&
        node.tagName === 'input' &&
        node.properties?.type === 'checkbox'
      ) {
        node.properties['aria-label'] = node.properties.checked
          ? 'Tarea completada'
          : 'Tarea pendiente';
      }
      (node.children || []).forEach(walk);
    }
    walk(tree);
  };
}
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = './src/content/posts';
const DEFAULT_LOCALE = 'es';
const LOCALES = { es: 'es-ES', en: 'en-US' };

// Build translation map for posts with asymmetric slugs (es ↔ en).
// Posts in the same folder are considered translations of each other.
function buildPostTranslationMap() {
  const map = {};
  let folders;
  try {
    folders = readdirSync(POSTS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return map;
  }

  for (const folder of folders) {
    const folderPath = join(POSTS_DIR, folder);
    const slugByLang = {};
    const lastmodByLang = {};
    let files;
    try {
      files = readdirSync(folderPath);
    } catch {
      continue;
    }

    for (const file of files) {
      const m = file.match(/^index\.(es|en)\.md$/);
      if (!m) continue;
      const lang = m[1];
      const content = readFileSync(join(folderPath, file), 'utf-8');
      if (/^draft:\s*true\s*$/m.test(content)) continue;
      const slugMatch = content.match(/^slug:\s*["']?([^"'\n]+?)["']?\s*$/m);
      if (slugMatch) {
        slugByLang[lang] = slugMatch[1].trim();
      }
      const updatedMatch = content.match(/^updatedDate:\s*(.+?)\s*$/m);
      const dateMatch = content.match(/^date:\s*(.+?)\s*$/m);
      const rawDate = updatedMatch?.[1] || dateMatch?.[1];
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) lastmodByLang[lang] = d;
      }
    }

    if (slugByLang.es && slugByLang.en) {
      map[`/es/posts/${slugByLang.es}/`] = {
        es: slugByLang.es,
        en: slugByLang.en,
        lastmod: lastmodByLang.es,
      };
      map[`/en/posts/${slugByLang.en}/`] = {
        es: slugByLang.es,
        en: slugByLang.en,
        lastmod: lastmodByLang.en,
      };
    }
  }

  return map;
}

const postTranslations = buildPostTranslationMap();

export default defineConfig({
  site: process.env.SITE_URL || 'https://edunavata-blog.pages.dev',

  trailingSlash: 'always',

  redirects: {
    '/': '/es/',
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  env: {
    schema: {
      SITE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },

  // Exclude unrelated directories from type checking
  exclude: ['mi-blog/**'],

  // Configuración de i18n nativa
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: ['es', 'en'],
    routing: {
      // urls simétricas (/es/post y /en/post)
      prefixDefaultLocale: true,
    },
  },

  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: {
            className: ['heading-anchor'],
            ariaLabel: 'Enlace permanente a esta sección',
            tabIndex: -1,
          },
          content: {
            type: 'element',
            tagName: 'span',
            properties: { ariaHidden: 'true', className: ['heading-anchor__symbol'] },
            children: [],
          },
        },
      ],
      [rehypeExternalLinks, { rel: ['noopener', 'noreferrer'] }],
      rehypeAccessibleTaskList,
    ],
  },

  // Tailwind v4 se inyecta a través de Vite
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    expressiveCode(), // Debe ir ANTES de mdx()
    mdx(),
    sitemap({
      namespaces: { news: false, image: false, video: false },
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: LOCALES,
      },
      // Excluye RSS feeds (no son HTML) y páginas de tags (noindex por política: < 8 posts/tag).
      filter: (page) => {
        const path = new URL(page).pathname;
        if (path.endsWith('/rss.xml')) return false;
        if (path.includes('/tags/')) return false;
        return true;
      },
      // Inyecta hreflang alternates manualmente para posts con slugs asimétricos,
      // y x-default global apuntando al defaultLocale. Añade lastmod real de cada post.
      serialize(item) {
        const url = new URL(item.url);
        const pathname = url.pathname;
        const origin = url.origin;

        // 1) Posts con slugs asimétricos: inyecta alternates y lastmod manualmente.
        if (postTranslations[pathname]) {
          const { es, en, lastmod } = postTranslations[pathname];
          const esUrl = `${origin}/es/posts/${es}/`;
          const enUrl = `${origin}/en/posts/${en}/`;
          item.links = [
            { lang: LOCALES.es, url: esUrl },
            { lang: LOCALES.en, url: enUrl },
            { lang: 'x-default', url: esUrl },
          ];
          if (lastmod) item.lastmod = lastmod.toISOString();
          return item;
        }

        // 2) Resto de páginas: si ya tienen links auto-generados, añade x-default.
        if (item.links && item.links.length > 0) {
          const defaultLink = item.links.find((l) => l.lang === LOCALES[DEFAULT_LOCALE]);
          if (defaultLink && !item.links.some((l) => l.lang === 'x-default')) {
            item.links.push({ lang: 'x-default', url: defaultLink.url });
          }
        }

        return item;
      },
    }),
  ],
});
