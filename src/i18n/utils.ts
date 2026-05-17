import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    const val = ui[lang][key] || ui[defaultLang][key];
    return typeof val === 'function' ? val(1) : val;
  };
}

export function switchLangPath(currentPath: string, targetLang: string): string {
  const segments = currentPath.split('/').filter(Boolean);
  if (segments.length > 0 && ['es', 'en'].includes(segments[0])) {
    segments[0] = targetLang;
  } else {
    segments.unshift(targetLang);
  }
  return '/' + segments.join('/') + (currentPath.endsWith('/') ? '/' : '');
}

export function getPostUrl(lang: string, slug: string): string {
  return `/${lang}/posts/${slug}/`;
}

export function getReadingTime(content: string): number {
  const words = content
    .replace(/[#*`\[\]()>|-]/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function formatDate(date: Date | string, lang: string): string {
  const d = new Date(date);
  const locale = lang === 'en' ? 'en-US' : 'es-ES';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}
