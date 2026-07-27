import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { createMeta } from '@utils/seo';
import { slugify } from '@utils/content';

const StyledMain = styled.main`
  max-width: 1000px;

  & > header {
    margin-bottom: 70px;
    text-align: center;
  }

  .empty-state {
    max-width: 560px;
    margin: 0 auto;
    padding: 45px;
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    background: var(--light-navy);
    text-align: center;
  }

  .posts {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }

  .post {
    ${({ theme }) => theme.mixins.boxShadow};
    height: 100%;
    padding: 30px;
    border-radius: var(--border-radius);
    background: var(--light-navy);
  }

  .post-title {
    font-size: var(--fz-xxl);
  }

  .post-meta,
  .tags {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }
`;

export async function loader() {
  const { getPosts } = await import('../../data/content.server.js');
  return { posts: await getPosts() };
}

export const meta = createMeta({ title: 'Insights', noindex: true });

const InsightsPage = ({ loaderData }) => {
  const { posts } = loaderData;

  return (
    <StyledMain>
      <header>
        <h1 className="big-heading">Insights</h1>
        <p className="subtitle">Notes on websites, trust, performance, and digital strategy.</p>
      </header>

      {posts.length === 0 ? (
        <div className="empty-state">
          <h2>Original articles are being prepared.</h2>
          <p>This section will return when the first Pius-authored insight is ready.</p>
          <Link className="inline-link" to="/">
            Return home
          </Link>
        </div>
      ) : (
        <ul className="posts">
          {posts.map(({ frontmatter }) => {
            const { title, description, slug, date, tags = [] } = frontmatter;

            return (
              <li key={slug}>
                <article className="post">
                  <p className="post-meta">{new Date(date).toLocaleDateString()}</p>
                  <h2 className="post-title">
                    <Link to={slug}>{title}</Link>
                  </h2>
                  <p>{description}</p>
                  <div className="tags">
                    {tags.map(tag => (
                      <Link key={tag} to={`/pensieve/tags/${slugify(tag)}`}>
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </StyledMain>
  );
};

export default InsightsPage;
