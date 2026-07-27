import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { createMeta } from '@utils/seo';
import { getPosts, groupPostsByTag, slugify } from '../../tools/content.server.js';

const StyledTagsContainer = styled.main`
  max-width: 1000px;

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  h1 {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 50px;

    a {
      font-size: var(--fz-lg);
      font-weight: 400;
    }
  }

  ul {
    li {
      font-size: 24px;

      h2 {
        margin: 0;
        font-size: inherit;

        a {
          color: var(--light-slate);
        }
      }

      .subtitle {
        color: var(--slate);
        font-size: var(--fz-sm);

        .tag {
          margin-right: 10px;
        }
      }
    }
  }
`;

export async function loader({ params }) {
  const posts = await getPosts();
  const tag = groupPostsByTag(posts).get(params.tag);

  return {
    tag: tag ? { name: tag.name, slug: tag.slug, posts: tag.posts } : null,
  };
}

export function meta(args) {
  const title = args.data?.tag ? `Tagged: #${args.data.tag.name}` : 'Tag Not Found';
  return createMeta({ title, noindex: !args.data?.tag })(args);
}

const TagTemplate = ({ loaderData }) => {
  if (!loaderData.tag) {
    return (
      <StyledTagsContainer>
        <h1>Tag not found</h1>
        <Link to="/pensieve/tags">View all tags</Link>
      </StyledTagsContainer>
    );
  }

  const { name, posts } = loaderData.tag;

  return (
    <StyledTagsContainer>
      <span className="breadcrumb">
        <span className="arrow">&larr;</span>
        <Link to="/pensieve">All insights</Link>
      </span>

      <h1>
        <span>#{name}</span>
        <span>
          <Link to="/pensieve/tags">View all tags</Link>
        </span>
      </h1>

      <ul className="fancy-list">
        {posts.map(({ frontmatter }) => {
          const { title, slug, date, tags = [] } = frontmatter;

          return (
            <li key={slug}>
              <h2>
                <Link to={slug}>{title}</Link>
              </h2>
              <p className="subtitle">
                <time>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {tags.length > 0 && <span>&nbsp;&mdash;&nbsp;</span>}
                {tags.map(tag => (
                  <Link key={tag} to={`/pensieve/tags/${slugify(tag)}`} className="tag">
                    #{tag}
                  </Link>
                ))}
              </p>
            </li>
          );
        })}
      </ul>
    </StyledTagsContainer>
  );
};

export default TagTemplate;
