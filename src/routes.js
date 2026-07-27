import { index, route } from '@react-router/dev/routes';

export default [
  index('pages/index.js'),
  route('archive', 'pages/archive.js'),
  route('pensieve', 'pages/pensieve/index.js'),
  route('pensieve/tags', 'pages/pensieve/tags.js'),
  route('pensieve/tags/:tag', 'templates/tag.js'),
  route('*', 'templates/post.js'),
];
