import { describe, it, expect } from 'vitest';
import { ui, defaultLang, languages } from '../src/i18n/ui';

describe('ui translations completeness', () => {
  const esKeys = Object.keys(ui.es).sort();
  const enKeys = Object.keys(ui.en).sort();

  it('es and en have the exact same set of keys', () => {
    expect(esKeys).toEqual(enKeys);
  });

  it('blog.minuteRead is a function in es', () => {
    expect(typeof ui.es['blog.minuteRead']).toBe('function');
  });

  it('blog.minuteRead is a function in en', () => {
    expect(typeof ui.en['blog.minuteRead']).toBe('function');
  });

  it('no empty string values in es', () => {
    Object.values(ui.es).forEach((v) => {
      if (typeof v === 'string') expect(v).not.toBe('');
    });
  });

  it('no empty string values in en', () => {
    Object.values(ui.en).forEach((v) => {
      if (typeof v === 'string') expect(v).not.toBe('');
    });
  });

  it('defaultLang is es', () => {
    expect(defaultLang).toBe('es');
  });

  it('languages object contains exactly es and en', () => {
    expect(Object.keys(languages).sort()).toEqual(['en', 'es']);
  });
});
