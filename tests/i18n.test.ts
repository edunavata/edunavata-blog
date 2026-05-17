import { describe, it, expect } from 'vitest';
import {
  getLangFromUrl,
  useTranslations,
  switchLangPath,
  getPostUrl,
  getReadingTime,
  formatDate,
} from '../src/i18n/utils';

describe('getLangFromUrl', () => {
  it('returns es for /es/ path', () => {
    expect(getLangFromUrl(new URL('http://x.com/es/'))).toBe('es');
  });

  it('returns en for /en/ prefix', () => {
    expect(getLangFromUrl(new URL('http://x.com/en/posts/slug/'))).toBe('en');
  });

  it('falls back to es for unknown lang segment', () => {
    expect(getLangFromUrl(new URL('http://x.com/fr/page'))).toBe('es');
  });

  it('falls back to es for root path', () => {
    expect(getLangFromUrl(new URL('http://x.com/'))).toBe('es');
  });
});

describe('useTranslations', () => {
  it('returns Spanish string for es locale', () => {
    const t = useTranslations('es');
    expect(t('nav.home')).toBe('Inicio');
  });

  it('returns English string for en locale', () => {
    const t = useTranslations('en');
    expect(t('nav.home')).toBe('Home');
  });

  it('blog.minuteRead returns a string not a raw function', () => {
    expect(typeof useTranslations('es')('blog.minuteRead')).toBe('string');
    expect(typeof useTranslations('en')('blog.minuteRead')).toBe('string');
  });

  it('blog.minuteRead formats with count=1', () => {
    expect(useTranslations('es')('blog.minuteRead')).toBe('1 min de lectura');
    expect(useTranslations('en')('blog.minuteRead')).toBe('1 min read');
  });
});

describe('switchLangPath', () => {
  it('replaces es prefix with en', () => {
    expect(switchLangPath('/es/posts/hola/', 'en')).toBe('/en/posts/hola/');
  });

  it('replaces en prefix with es', () => {
    expect(switchLangPath('/en/about/', 'es')).toBe('/es/about/');
  });

  it('prepends lang when no prefix exists', () => {
    expect(switchLangPath('/posts/no-lang', 'en')).toBe('/en/posts/no-lang');
  });

  it('handles root lang segment /es/', () => {
    expect(switchLangPath('/es/', 'en')).toBe('/en/');
  });

  it('handles bare root path /', () => {
    expect(switchLangPath('/', 'en')).toBe('/en/');
  });

  it('preserves absence of trailing slash', () => {
    expect(switchLangPath('/en/blog', 'es')).toBe('/es/blog');
  });
});

describe('getPostUrl', () => {
  it('builds correct es post URL', () => {
    expect(getPostUrl('es', 'mi-post')).toBe('/es/posts/mi-post/');
  });

  it('builds correct en post URL', () => {
    expect(getPostUrl('en', 'my-post')).toBe('/en/posts/my-post/');
  });
});

describe('getReadingTime', () => {
  it('returns 1 for empty string', () => {
    expect(getReadingTime('')).toBe(1);
  });

  it('returns 1 for under 230 words', () => {
    expect(getReadingTime(Array(100).fill('word').join(' '))).toBe(1);
  });

  it('returns 1 for exactly 230 words', () => {
    expect(getReadingTime(Array(230).fill('word').join(' '))).toBe(1);
  });

  it('returns 2 for 460 words', () => {
    expect(getReadingTime(Array(460).fill('word').join(' '))).toBe(2);
  });

  it('strips markdown syntax characters before counting', () => {
    const content = '# Header **bold** `code` [link](url) > quote | cell - item';
    expect(getReadingTime(content)).toBe(1);
  });

  it('boundary: 344 words → 1 min, 345 words → 2 min (verifies 230 wpm constant)', () => {
    expect(getReadingTime(Array(344).fill('word').join(' '))).toBe(1);
    expect(getReadingTime(Array(345).fill('word').join(' '))).toBe(2);
  });
});

describe('formatDate', () => {
  it('formats date in Spanish locale', () => {
    const result = formatDate(new Date(2025, 0, 15), 'es');
    expect(result).toContain('enero');
    expect(result).toContain('2025');
  });

  it('formats date in English locale', () => {
    const result = formatDate(new Date(2025, 0, 15), 'en');
    expect(result).toContain('January');
    expect(result).toContain('2025');
  });

  it('coerces string input to date', () => {
    expect(formatDate('2025-06-01T12:00:00', 'es')).toContain('junio');
  });

  it('unknown lang falls back to es-ES', () => {
    expect(formatDate(new Date(2025, 0, 15), 'fr')).toContain('enero');
  });
});
