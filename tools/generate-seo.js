import fs from 'node:fs/promises';
import path from 'node:path';
import { getPreRenderedRoutes } from './content.server.js';

const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '');

if (!siteUrl) {
  throw new Error('SITE_URL is required to generate sitemap.xml and robots.txt.');
}

const outputDirectory = path.resolve('build/client');
const routes = await getPreRenderedRoutes();
const urls = routes.map(route => new URL(route, siteUrl).href);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;
const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

await fs.mkdir(outputDirectory, { recursive: true });
await Promise.all([
  fs.writeFile(path.join(outputDirectory, 'sitemap.xml'), sitemap),
  fs.writeFile(path.join(outputDirectory, 'robots.txt'), robots),
]);

const indexPath = path.join(outputDirectory, 'index.html');
const notFoundPath = path.join(outputDirectory, '404.html');

try {
  await fs.copyFile(indexPath, notFoundPath);
} catch {
  // React Router can emit a nested index depending on the adapter configuration.
}
