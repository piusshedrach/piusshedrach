import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { createMeta } from '@utils/seo';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  h1 {
    margin-bottom: 50px;
  }

  ul {
    color: var(--light-slate);

    li {
      font-size: var(--fz-xxl);

      a {
        color: var(--light-slate);

        .count {
          color: var(--slate);
          font-family: var(--font-mono);
          font-size: var(--fz-md);
        }
      }
    }
  }
`;

export async function loader() {
  const { getPosts, groupPostsByTag } = await import('../../data/content.server.js');
  const posts = await getPosts();
  const tags = Array.from(groupPostsByTag(posts).values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return {
    tags: tags.map(tag => ({
      name: tag.name,
      slug: tag.slug,
      totalCount: tag.posts.length,
    })),
  };
}

export const meta = createMeta({ title: 'Insight Tags', noindex: true });

const TagsPage = ({ loaderData }) => (
  <StyledTagsContainer>
    <span className="breadcrumb">
      <span className="arrow">&larr;</span>
      <Link to="/pensieve">All insights</Link>
    </span>

    <h1>Tags</h1>
    <ul className="fancy-list">
      {loaderData.tags.map(tag => (
        <li key={tag.slug}>
          <Link to={`/pensieve/tags/${tag.slug}`} className="inline-link">
            {tag.name} <span className="count">({tag.totalCount})</span>
          </Link>
        </li>
      ))}
    </ul>
  </StyledTagsContainer>
);

export default TagsPage;
