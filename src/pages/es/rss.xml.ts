import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('posts', ({ data }) => data.lang === 'es' && !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: `${SITE.title} — Feed RSS`,
    description: 'Cloud, Data Engineering, LLMs, Linux y Ciberseguridad.',
    site: new URL('/es/', site!),
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: new URL(`/es/posts/${post.data.slug}/`, site!).toString(),
      categories: [...post.data.tags, ...post.data.categories],
    })),
    customData: `<language>${SITE.hreflang.es}</language>`,
  });
};
