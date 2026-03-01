import type { APIRoute } from 'astro';

// Generate sitemap for all pages
const pages = [
  { url: '', changefreq: 'weekly', priority: 1.0 },
  { url: '/projects', changefreq: 'weekly', priority: 0.9 },
  { url: '/projects/pos-system', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects/livestock-management', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects/hospital-management', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects/dating-mobile-app', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects/rent-management', changefreq: 'monthly', priority: 0.8 },
  { url: '/projects/ai-virtual-assistant', changefreq: 'monthly', priority: 0.8 },
];

const siteUrl = 'https://yourportfolio.vercel.app'; // Update with your domain
const lastmod = new Date().toISOString().split('T')[0];

export const GET: APIRoute = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
