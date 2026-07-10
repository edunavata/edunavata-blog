import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, TAGS, ORIGINS } from '@/config/taxonomy';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
    // Files follow "<folder>/index.<lang>.md". The default id collapses both
    // languages to the folder name and silently drops one entry, so derive an
    // id that keeps the language suffix (e.g. "llm-tool-en").
    generateId: ({ entry }) => {
      const segments = entry.replace(/\.md$/, '').split('/');
      const fileName = segments.pop() ?? entry;
      const folder = segments.join('/');
      const langSuffix = fileName.includes('.') ? fileName.split('.').pop() : '';
      const base = folder || fileName;
      return langSuffix ? `${base}-${langSuffix}` : base;
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
      slug: z.string(),
      description: z.string().min(50).max(160),
      summary: z.string().optional(),
      category: z.enum(CATEGORIES),
      tags: z.array(z.enum(TAGS)).min(3).max(5),
      origins: z.array(z.enum(ORIGINS)).optional(),
      aiModel: z.string().optional(),
      cover: z.object({ image: image(), alt: z.string() }).optional(),
      lang: z.enum(['es', 'en']).default('es'),
      translationKey: z.string().optional(),
      author: z.string().default('Edu González'),
      updatedDate: z.coerce.date().optional(),
    }),
});

export const collections = { posts };
export { CATEGORIES, TAGS, ORIGINS };
