import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const W = 1200;
const H = 630;

// Domain hostname derived from SITE_URL env or default.
const SITE_URL = process.env.SITE_URL || 'https://edunavata-blog.pages.dev';
const HOSTNAME = new URL(SITE_URL).hostname;
const AUTHOR = process.env.AUTHOR_NAME || 'Edu González';
const TAGLINE = process.env.TAGLINE || 'Cloud · Data · LLMs · Linux · Ciberseguridad';
const HANDLE = process.env.SITE_BRAND || '~edunavata';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0d0d"/>
      <stop offset="100%" stop-color="#111418"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Subtle grid lines -->
  <line x1="0" y1="1" x2="${W}" y2="1" stroke="#1a1a1a" stroke-width="1"/>
  <line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}" stroke="#1a1a1a" stroke-width="1"/>

  <!-- Left accent bar -->
  <rect x="60" y="60" width="3" height="510" fill="#1e2a3a" rx="1"/>

  <!-- Top label -->
  <rect x="60" y="60" width="8" height="16" fill="#4a90d9" rx="1"/>
  <text x="82" y="75" font-family="Courier New, monospace" font-size="13" fill="#4a90d9" letter-spacing="0.05em">${HANDLE}</text>

  <!-- Main name -->
  <text x="80" y="290" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="72" fill="#efefef" letter-spacing="-0.02em">${AUTHOR}</text>

  <!-- Accent underline -->
  <rect x="80" y="308" width="420" height="2" fill="#4a90d9" opacity="0.6" rx="1"/>

  <!-- Tagline -->
  <text x="80" y="370" font-family="Courier New, monospace" font-size="20" fill="#6b7280" letter-spacing="0.08em">${TAGLINE}</text>

  <!-- Bottom URL -->
  <text x="${W - 60}" y="${H - 48}" font-family="Courier New, monospace" font-size="13" fill="#2d3748" text-anchor="end" letter-spacing="0.04em">${HOSTNAME}</text>

  <!-- Bottom right accent dot -->
  <circle cx="${W - 60}" cy="${H - 30}" r="3" fill="#4a90d9" opacity="0.4"/>
</svg>`;

const dest = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/og-default.jpg');

await sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);

console.log(`Generated: public/og-default.jpg (${W}x${H}px)`);
