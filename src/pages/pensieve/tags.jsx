import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { createMeta } from '@utils/seo';
import portfolioData from 'virtual:portfolio-data';

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

export const meta = createMeta({ title: 'Insight Tags', noindex: true });

const TagsPage = ({ tags = portfolioData.tags }) => (
  <StyledTagsContainer>
    <span className="breadcrumb">
      <span className="arrow">&larr;</span>
      <Link to="/pensieve">All insights</Link>
    </span>

    <h1>Tags</h1>
    <ul className="fancy-list">
      {tags.map(tag => (
        <li key={tag.slug}>
          <Link to={`/pensieve/tags/${tag.slug}`} className="inline-link">
            {tag.name}{' '}
            <span className="count">({tag.totalCount ?? tag.posts.length})</span>
          </Link>
        </li>
      ))}
    </ul>
  </StyledTagsContainer>
);

export default TagsPage;
