import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    slug: z.string(),
    description: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    cover: z.object({
      image: z.string(),
      alt: z.string().optional(),
    }).optional(),
    lang: z.enum(['es', 'en']).default('es'),
  }),
});

export const collections = { posts };
