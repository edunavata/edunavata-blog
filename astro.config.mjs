import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: Cambia esto por tu dominio real en producción
  site: 'https://tublog.com',
  
  // Configuración de i18n nativa
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      // Recomiendo true: urls simétricas (/es/post y /en/post)
      prefixDefaultLocale: true 
    }
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