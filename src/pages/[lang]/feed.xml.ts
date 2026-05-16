import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '@/config/site';

export const getStaticPaths: GetStaticPaths = () => [
  { params: { lang: 'es' } },
  { params: { lang: 'en' } },
];

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as 'es' | 'en';
  const posts = await getCollection('posts', ({ data }) => data.lang === lang && !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const titleByLang = {
    es: `${SITE.title} — Feed`,
    en: `${SITE.title} — Feed`,
  };
  const descriptionByLang = {
    es: SITE.description,
    en: SITE.description,
  };

  return rss({
    title: titleByLang[lang],
    description: descriptionByLang[lang],
    site: site!,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${lang}/posts/${post.data.slug}/`,
      categories: [...post.data.tags, ...post.data.categories],
    })),
    customData: `<language>${SITE.hreflang[lang]}</language>`,
  });
};
