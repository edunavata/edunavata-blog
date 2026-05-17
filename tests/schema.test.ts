import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Reproduces src/content.config.ts validation rules without Astro's image() helper
const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().default(false),
  slug: z.string(),
  description: z.string().min(50).max(160),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  lang: z.enum(['es', 'en']).default('es'),
  author: z.string().default('Edu González'),
  updatedDate: z.coerce.date().optional(),
});

const VALID = {
  title: 'Test Post',
  date: '2025-01-15',
  slug: 'test-post',
  description: 'A'.repeat(50),
};

describe('content schema — description length', () => {
  it('accepts description with exactly 50 chars (min)', () => {
    expect(postSchema.safeParse(VALID).success).toBe(true);
  });

  it('rejects description shorter than 50 chars', () => {
    expect(postSchema.safeParse({ ...VALID, description: 'A'.repeat(49) }).success).toBe(false);
  });

  it('accepts description with exactly 160 chars (max)', () => {
    expect(postSchema.safeParse({ ...VALID, description: 'A'.repeat(160) }).success).toBe(true);
  });

  it('rejects description longer than 160 chars', () => {
    expect(postSchema.safeParse({ ...VALID, description: 'A'.repeat(161) }).success).toBe(false);
  });
});

describe('content schema — required fields', () => {
  it('rejects when title is missing', () => {
    expect(
      postSchema.safeParse({ date: VALID.date, slug: VALID.slug, description: VALID.description })
        .success
    ).toBe(false);
  });

  it('rejects when slug is missing', () => {
    expect(
      postSchema.safeParse({ title: VALID.title, date: VALID.date, description: VALID.description })
        .success
    ).toBe(false);
  });
});

describe('content schema — date coercion', () => {
  it('coerces string date to Date object', () => {
    const result = postSchema.safeParse(VALID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.date).toBeInstanceOf(Date);
  });

  it('rejects invalid date string', () => {
    expect(postSchema.safeParse({ ...VALID, date: 'not-a-date' }).success).toBe(false);
  });
});

describe('content schema — defaults', () => {
  it('draft defaults to false', () => {
    const result = postSchema.safeParse(VALID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.draft).toBe(false);
  });

  it('explicit draft: true is accepted', () => {
    const result = postSchema.safeParse({ ...VALID, draft: true });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.draft).toBe(true);
  });

  it('lang defaults to es', () => {
    const result = postSchema.safeParse(VALID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.lang).toBe('es');
  });

  it('tags defaults to empty array', () => {
    const result = postSchema.safeParse(VALID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.tags).toEqual([]);
  });

  it('categories defaults to empty array', () => {
    const result = postSchema.safeParse(VALID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.categories).toEqual([]);
  });

  it('author defaults to Edu González', () => {
    const result = postSchema.safeParse(VALID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.author).toBe('Edu González');
  });
});

describe('content schema — lang enum', () => {
  it('accepts es', () => {
    expect(postSchema.safeParse({ ...VALID, lang: 'es' }).success).toBe(true);
  });

  it('accepts en', () => {
    expect(postSchema.safeParse({ ...VALID, lang: 'en' }).success).toBe(true);
  });

  it('rejects unknown lang', () => {
    expect(postSchema.safeParse({ ...VALID, lang: 'fr' }).success).toBe(false);
  });
});

describe('content schema — optional fields', () => {
  it('summary is optional', () => {
    expect(postSchema.safeParse(VALID).success).toBe(true);
  });

  it('updatedDate is optional', () => {
    const result = postSchema.safeParse(VALID);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.updatedDate).toBeUndefined();
  });

  it('updatedDate coerces valid string to Date', () => {
    const result = postSchema.safeParse({ ...VALID, updatedDate: '2025-06-01' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.updatedDate).toBeInstanceOf(Date);
  });
});
