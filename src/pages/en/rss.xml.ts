import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('posts', ({ data }) => data.lang === 'en' && !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Edu González — Technical Blog RSS Feed',
    description: 'Cloud, Data Engineering, LLMs, Linux, and Cybersecurity.',
    site: new URL('/en/', site!),
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: new URL(`/en/posts/${post.data.slug}/`, site!).toString(),
      categories: [...post.data.tags, post.data.category],
    })),
    customData: `<language>${SITE.hreflang.en}</language>`,
  });
};
