import fs from 'node:fs/promises';

await Promise.all([
  fs.rm('build', { recursive: true, force: true }),
  fs.rm('.react-router', { recursive: true, force: true }),
  fs.rm('node_modules/.vite', { recursive: true, force: true }),
]);
