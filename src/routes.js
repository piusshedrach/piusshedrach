import { index, route } from '@react-router/dev/routes';

export default [
  index('pages/index.jsx'),
  route('archive', 'pages/archive.jsx'),
  route('pensieve', 'pages/pensieve/index.jsx'),
  route('pensieve/tags', 'pages/pensieve/tags.jsx'),
  route('pensieve/tags/:tag', 'templates/tag.jsx'),
  route('*', 'templates/post.jsx'),
];
