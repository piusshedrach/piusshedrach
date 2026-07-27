import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { normalizePath, slugify } from '../utils/content.js';

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const contentDirectory = path.join(rootDirectory, 'content');
const projectsDirectory = path.join(contentDirectory, 'projects');
const postsDirectory = path.join(contentDirectory, 'posts');

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkCodeTitles)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHighlight)
  .use(rehypeCodeTitles)
  .use(rehypeExternalLinks, {
    target: '_blank',
    rel: ['nofollow', 'noopener', 'noreferrer'],
  })
  .use(rehypeStringify);

function remarkCodeTitles() {
  return tree => {
    walkTree(tree, node => {
      if (node.type !== 'code' || !node.meta) {
        return;
      }

      const match = node.meta.match(/title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/);
      const title = match?.[1] || match?.[2] || match?.[3];

      if (title) {
        node.data = {
          ...node.data,
          hProperties: {
            ...node.data?.hProperties,
            dataCodeTitle: title,
          },
        };
      }
    });
  };
}

function rehypeCodeTitles() {
  return tree => {
    walkTree(tree, (node, parent, index) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) {
        return;
      }

      const code = node.children?.find(child => child.tagName === 'code');
      const title = code?.properties?.dataCodeTitle;
      node.properties = { ...node.properties, className: ['code-block'] };

      if (title) {
        delete code.properties.dataCodeTitle;
        parent.children.splice(index, 0, {
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-title'] },
          children: [{ type: 'text', value: String(title) }],
        });
      }
    });
  };
}

function walkTree(node, callback, parent, index) {
  callback(node, parent, index);
  node.children?.slice().forEach((child, childIndex) => walkTree(child, callback, node, childIndex));
}

async function readMarkdownDirectory(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const filenames = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => entry.name);

  return Promise.all(
    filenames.map(async filename => {
      const filePath = path.join(directory, filename);
      const source = await fs.readFile(filePath, 'utf8');
      return parseMarkdownDocument(source, filePath);
    }),
  );
}

export async function renderMarkdown(content) {
  return String(await markdownProcessor.process(content));
}

export async function parseMarkdownDocument(source, filePath) {
  const { data, content } = matter(source);

  return {
    frontmatter: normalizeFrontmatter(data, filePath),
    html: await renderMarkdown(content),
    sourcePath: filePath,
  };
}

function normalizeFrontmatter(frontmatter, filePath) {
  const normalized = {
    ...frontmatter,
    services: frontmatter.services || [],
    tags: frontmatter.tags || [],
  };

  if (frontmatter.slug) {
    normalized.slug = normalizePath(frontmatter.slug);
  }

  if (frontmatter.cover) {
    normalized.cover = resolveCoverUrl(frontmatter.cover, filePath);
  }

  if (frontmatter.date instanceof Date) {
    normalized.date = frontmatter.date.toISOString();
  }

  return normalized;
}

function resolveCoverUrl(cover, filePath) {
  if (/^(?:https?:)?\/\//.test(cover) || cover.startsWith('/')) {
    return cover;
  }

  const absoluteCoverPath = path.resolve(path.dirname(filePath), cover);
  const relativeCoverPath = path.relative(contentDirectory, absoluteCoverPath).replaceAll('\\', '/');

  return `/content/${relativeCoverPath}`;
}

export async function getProjects() {
  const projects = await readMarkdownDirectory(projectsDirectory);

  return projects.sort(
    (a, b) => (a.frontmatter.featuredOrder ?? Number.MAX_SAFE_INTEGER) -
      (b.frontmatter.featuredOrder ?? Number.MAX_SAFE_INTEGER),
  );
}

export async function getPosts(directory = postsDirectory) {
  const posts = await readMarkdownDirectory(directory);

  return posts
    .filter(post => post.frontmatter.draft !== true && post.frontmatter.slug)
    .sort((a, b) => {
      const aDate = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const bDate = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      return bDate - aDate;
    });
}

export function groupPostsByTag(posts) {
  return posts.reduce((groups, post) => {
    post.frontmatter.tags.forEach(tag => {
      const key = slugify(tag);
      const existing = groups.get(key) || { name: tag, slug: key, posts: [] };
      existing.posts.push(post);
      groups.set(key, existing);
    });

    return groups;
  }, new Map());
}

export async function getContentIndex() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const tags = Array.from(groupPostsByTag(posts).values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return { projects, posts, tags };
}

export async function getPublicRoutes() {
  const { posts, tags } = await getContentIndex();
  const routes = ['/', '/archive', '/pensieve', '/pensieve/tags'];

  posts.forEach(post => routes.push(post.frontmatter.slug));
  tags.forEach(tag => routes.push(`/pensieve/tags/${tag.slug}`));

  return Array.from(new Set(routes.map(normalizePath)));
}

export async function getPreRenderedRoutes() {
  const publicRoutes = await getPublicRoutes();

  // Keep dynamic route loaders valid even before the first post or tag exists.
  return [...publicRoutes, '/404', '/pensieve/tags/__not-found'];
}
