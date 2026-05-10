export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Sobre mí',
    'blog.featured': 'Destacado',
    'blog.latestPosts': 'Últimos artículos',
    'blog.viewAll': 'Ver todos',
    'blog.readArticle': 'Leer artículo',
    'blog.exploreByCategory': 'Explorar por categoría',
    'blog.allCategories': 'Todas',
    'blog.updateAt': 'actualizado el',
    'blog.copyright': '© 2026 Mi Blog.',
    // Función para el tiempo de lectura
    'blog.minuteRead': (count: number) => `${count} min de lectura`,
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About me',
    'blog.featured': 'Featured',
    'blog.latestPosts': 'Latest articles',
    'blog.viewAll': 'View all',
    'blog.readArticle': 'Read article',
    'blog.exploreByCategory': 'Explore by category',
    'blog.allCategories': 'All',
    'blog.updateAt': 'updated at',
    'blog.copyright': '© 2026 Mi Blog.',
    'blog.minuteRead': (count: number) => `${count} min read`,
  },
} as const;