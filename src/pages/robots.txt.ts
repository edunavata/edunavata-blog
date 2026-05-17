import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('/sitemap-index.xml', site).toString();

  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`);
};
