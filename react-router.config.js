import { getPreRenderedRoutes } from './src/data/content.server.js';

export default {
  appDirectory: 'src',
  buildDirectory: 'build',
  ssr: false,
  async prerender() {
    return getPreRenderedRoutes();
  },
};
