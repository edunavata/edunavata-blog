// Central site configuration — edit this file to update domain, author, and social links.
// SITE_URL is read from the environment variable (set in .env or your hosting dashboard).

export const SITE = {
  url: import.meta.env.SITE_URL || 'https://edunavata-blog.pages.dev',
  title: 'Edu González — Blog Técnico',
  description: 'Cloud, Data Engineering, LLMs, Linux y Ciberseguridad.',
  author: 'Edu González',
  brand: '~edunavata',
  twitterHandle: '@edunavata',
  defaultLocale: 'es',
  locale: {
    es: 'es_ES',
    en: 'en_US',
  },
  hreflang: {
    es: 'es-ES',
    en: 'en-US',
  },
  ogImage: {
    default: '/og-default.jpg',
    width: 1200,
    height: 630,
  },
  sameAs: [
    'https://github.com/edunavata',
    'https://x.com/edunavata',
    'https://mastodon.social/@edunavata',
  ],
} as const;
