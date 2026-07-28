// @vitest-environment node

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  getPosts,
  getPreRenderedRoutes,
  getPublicRoutes,
  groupPostsByTag,
  parseMarkdownDocument,
  renderMarkdown,
} from '../src/data/content.server.js';
import { normalizePath, slugify } from '../src/utils/content.js';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(directory =>
      fs.rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe('content helpers', () => {
  it('normalizes paths and tag slugs', () => {
    expect(normalizePath('pensieve/my-post///')).toBe('/pensieve/my-post');
    expect(slugify('Design & Strategy')).toBe('design-strategy');
  });

  it('renders Markdown, highlighted code, titles, and secure external links', async () => {
    const html = await renderMarkdown(
      '[Example](https://example.com)\n\n```js title="example.js"\nconst answer = 42;\n```',
    );

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="nofollow noopener noreferrer"');
    expect(html).toContain('class="code-title"');
    expect(html).toContain('example.js');
    expect(html).toContain('language-js');
  });

  it('normalizes frontmatter and relative cover paths', async () => {
    const filePath = path.join(process.cwd(), 'content', 'projects', 'sample.md');
    const document = await parseMarkdownDocument(
      '---\ntitle: Sample\nslug: sample/\ncover: ./sample.webp\n---\nBody',
      filePath,
    );

    expect(document.frontmatter.slug).toBe('/sample');
    expect(document.frontmatter.cover).toBe('/content/projects/sample.webp');
    expect(document.frontmatter.services).toEqual([]);
  });

  it('filters drafts, sorts posts by date, and groups tags', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-content-'));
    temporaryDirectories.push(directory);

    await Promise.all([
      fs.writeFile(
        path.join(directory, 'older.md'),
        '---\ntitle: Older\ndate: 2025-01-01\nslug: /older\ntags: [Design]\n---\nOlder',
      ),
      fs.writeFile(
        path.join(directory, 'newer.md'),
        '---\ntitle: Newer\ndate: 2026-01-01\nslug: /newer\ntags: [Design, Strategy]\n---\nNewer',
      ),
      fs.writeFile(
        path.join(directory, 'draft.md'),
        '---\ntitle: Draft\ndate: 2027-01-01\nslug: /draft\ndraft: true\n---\nDraft',
      ),
    ]);

    const posts = await getPosts(directory);
    const groups = groupPostsByTag(posts);

    expect(posts.map(post => post.frontmatter.title)).toEqual(['Newer', 'Older']);
    expect(groups.get('design').posts).toHaveLength(2);
    expect(groups.get('strategy').posts).toHaveLength(1);
  });

  it('keeps internal dynamic-route fallbacks out of public URLs', async () => {
    const publicRoutes = await getPublicRoutes();
    const preRenderedRoutes = await getPreRenderedRoutes();

    expect(publicRoutes).not.toContain('/404');
    expect(preRenderedRoutes).toContain('/404');
  });
});
