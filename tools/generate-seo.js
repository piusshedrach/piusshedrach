import fs from 'node:fs/promises';
import path from 'node:path';
import { getPublicRoutes } from '../src/data/content.server.js';
import { getSiteUrl } from './site-url.js';

const siteUrl = getSiteUrl({ allowLocal: false });

const outputDirectory = path.resolve('build/client');
const routes = await getPublicRoutes();
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

const preRenderedNotFoundPath = path.join(outputDirectory, '404', 'index.html');
const notFoundPath = path.join(outputDirectory, '404.html');

try {
  await fs.copyFile(preRenderedNotFoundPath, notFoundPath);
} catch {
  // The build output is validated separately by React Router.
}
