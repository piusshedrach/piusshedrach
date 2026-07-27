import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));
const contentDirectory = path.join(rootDirectory, 'content');
const contentAssetPattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

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

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return findContentAssets(entryPath);
    }
    return contentAssetPattern.test(entry.name) ? [entryPath] : [];
  });
}

export default defineConfig({
  plugins: [reactRouter(), contentAssets()],
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
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
});
