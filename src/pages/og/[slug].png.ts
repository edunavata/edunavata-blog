import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { wrapTitle, escXml } from '@/utils/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: `${post.data.lang}-${post.data.slug}` },
    props: { title: post.data.title, author: post.data.author },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, author } = props as { title: string; author: string };

  const W = 1200;
  const H = 630;
  const lines = wrapTitle(title, 42);
  const lineHeight = 72;
  const titleY = H / 2 - ((lines.length - 1) * lineHeight) / 2;

  const svg = buildSvg(W, H, lines, lineHeight, titleY, author);
  const buf = await sharp(Buffer.from(svg)).png({ compressionLevel: 8 }).toBuffer();
  const body = new Uint8Array(buf);
  return new Response(body, { headers: { 'Content-Type': 'image/png' } });
};

function buildSvg(
  W: number,
  H: number,
  lines: string[],
  lh: number,
  y0: number,
  author: string
): string {
  const textLines = lines
    .map(
      (l, i) =>
        `<text x="80" y="${y0 + i * lh}" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="58" fill="#efefef" letter-spacing="-0.02em">${escXml(l)}</text>`
    )
    .join('\n  ');

  const underlineY = y0 + lines.length * lh - lh + 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0d0d"/>
      <stop offset="100%" stop-color="#111418"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <line x1="0" y1="1" x2="${W}" y2="1" stroke="#1a1a1a" stroke-width="1"/>
  <line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}" stroke="#1a1a1a" stroke-width="1"/>
  <rect x="60" y="60" width="3" height="${H - 120}" fill="#1e2a3a" rx="1"/>
  <rect x="60" y="60" width="8" height="16" fill="#4a90d9" rx="1"/>
  <text x="82" y="75" font-family="Courier New,monospace" font-size="13" fill="#4a90d9" letter-spacing="0.05em">~edunavata</text>
  ${textLines}
  <rect x="80" y="${underlineY}" width="420" height="2" fill="#4a90d9" opacity="0.6" rx="1"/>
  <text x="80" y="${H - 48}" font-family="Courier New,monospace" font-size="15" fill="#6b7280" letter-spacing="0.04em">${escXml(author)}</text>
  <text x="${W - 60}" y="${H - 48}" font-family="Courier New,monospace" font-size="13" fill="#2d3748" text-anchor="end" letter-spacing="0.04em">edunavata.com</text>
  <circle cx="${W - 60}" cy="${H - 30}" r="3" fill="#4a90d9" opacity="0.4"/>
</svg>`;
}
