import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL || 'https://edunavata-blog.pages.dev',

  env: {
    schema: {
      SITE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },

  // Exclude unrelated directories from type checking
  exclude: ['mi-blog/**'],

  // Configuración de i18n nativa
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      // Recomiendo true: urls simétricas (/es/post y /en/post)
      prefixDefaultLocale: true 
    }
  },

  redirects: {
    '/es/sobre-mi/': '/es/about/',
  },

  // Tailwind v4 se inyecta a través de Vite
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    expressiveCode(), // Debe ir ANTES de mdx()
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          en: 'en',
        },
      },
    }),
  ],
});