import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { getContentIndex } from './src/data/content.server.js';
import { getSiteUrl } from './tools/site-url.js';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));
const contentDirectory = path.join(rootDirectory, 'content');
const contentAssetPattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const virtualPortfolioDataId = 'virtual:portfolio-data';
const resolvedVirtualPortfolioDataId = `\0${virtualPortfolioDataId}`;

function portfolioData(siteUrl) {
  let dataPromise;

  return {
    name: 'portfolio-data',
    resolveId(id) {
      return id === virtualPortfolioDataId ? resolvedVirtualPortfolioDataId : null;
    },
    async load(id) {
      if (id !== resolvedVirtualPortfolioDataId) {
        return null;
      }

      dataPromise ||= getContentIndex();
      const content = await dataPromise;
      const data = {
        siteMetadata: {
          title: 'Pius Shedrach | Business Websites',
          description:
            'Pius Shedrach designs and builds fast, modern websites that help businesses earn trust and win more clients.',
          siteUrl,
          image: '/og.png',
          twitterUsername: '@PShedrach75368',
        },
        projects: content.projects.map(toPublicEntry),
        posts: content.posts.map(toPublicEntry),
        tags: content.tags.map((tag) => ({
          name: tag.name,
          slug: tag.slug,
          posts: tag.posts.map(toPublicEntry),
        })),
      };

      return `export default ${JSON.stringify(data)};`;
    },
  };
}

function toPublicEntry({ frontmatter, html }) {
  return { frontmatter, html };
}

function contentAssets() {
  return {
    name: 'content-assets',
    configureServer(server) {
      server.middlewares.use('/content', (request, response, next) => {
        const relativePath = decodeURIComponent(request.url || '').replace(/^\/+/, '');
        const assetPath = path.resolve(contentDirectory, relativePath);

        if (!assetPath.startsWith(`${contentDirectory}${path.sep}`) || !fs.existsSync(assetPath)) {
          next();
          return;
        }

        response.setHeader('Cache-Control', 'no-cache');
        fs.createReadStream(assetPath).pipe(response);
      });
    },
    generateBundle() {
      for (const assetPath of findContentAssets(contentDirectory)) {
        const relativePath = path.relative(contentDirectory, assetPath).replaceAll('\\', '/');
        this.emitFile({
          type: 'asset',
          fileName: `content/${relativePath}`,
          source: fs.readFileSync(assetPath),
        });
      }
    },
  };
}

function findContentAssets(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return findContentAssets(entryPath);
    }
    return contentAssetPattern.test(entry.name) ? [entryPath] : [];
  });
}

export default defineConfig(({ command, mode }) => {
  const siteUrl = getSiteUrl({ allowLocal: command !== 'build' });
  const plugins =
    mode === 'test'
      ? [react(), portfolioData(siteUrl)]
      : [reactRouter(), portfolioData(siteUrl), contentAssets()];

  return {
    plugins,
    publicDir: 'static',
    resolve: {
      alias: {
        '@components': path.resolve(rootDirectory, 'src/components'),
        '@config': path.resolve(rootDirectory, 'src/config.js'),
        '@fonts': path.resolve(rootDirectory, 'src/fonts'),
        '@hooks': path.resolve(rootDirectory, 'src/hooks'),
        '@images': path.resolve(rootDirectory, 'src/images'),
        '@pages': path.resolve(rootDirectory, 'src/pages'),
        '@styles': path.resolve(rootDirectory, 'src/styles'),
        '@utils': path.resolve(rootDirectory, 'src/utils'),
      },
    },
    ssr: {
      noExternal: ['styled-components'],
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
    },
  };
});
