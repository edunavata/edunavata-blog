import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
      tags: z.array(z.string()).default([]),
      categories: z.array(z.string()).default([]),
      cover: z
        .object({
          image: image(),
          alt: z.string(),
        })
        .optional(),
      lang: z.enum(['es', 'en']).default('es'),
      author: z.string().default('Edu González'),
      updatedDate: z.coerce.date().optional(),
    }),
});

export const collections = { posts };
