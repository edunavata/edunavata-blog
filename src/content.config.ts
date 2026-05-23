import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, TAGS, ORIGINS } from '@/config/taxonomy';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
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
