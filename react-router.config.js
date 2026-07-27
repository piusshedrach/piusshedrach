import { getPreRenderedRoutes } from './tools/content.server.js';

export default {
  appDirectory: 'src',
  buildDirectory: 'build',
  ssr: false,
  async prerender() {
    return getPreRenderedRoutes();
  },
};
