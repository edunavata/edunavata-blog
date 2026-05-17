import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '@/config/site';

export const getStaticPaths: GetStaticPaths = () => [
  { params: { lang: 'es' } },
  { params: { lang: 'en' } },
];

const feedMeta = {
  es: {
    title: `${SITE.title} — Feed RSS`,
    description: 'Cloud, Data Engineering, LLMs, Linux y Ciberseguridad.',
  },
  en: {
    title: 'Edu González — Technical Blog RSS Feed',
    description: 'Cloud, Data Engineering, LLMs, Linux, and Cybersecurity.',
  },
} as const;

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as 'es' | 'en';
  const posts = await getCollection('posts', ({ data }) => data.lang === lang && !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const { title, description } = feedMeta[lang];
  const channelSite = new URL(`/${lang}/`, site!);

  return rss({
    title,
    description,
    site: channelSite,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: new URL(`/${lang}/posts/${post.data.slug}/`, site!).toString(),
      categories: [...post.data.tags, ...post.data.categories],
    })),
    customData: `<language>${SITE.hreflang[lang]}</language>`,
  });
};
