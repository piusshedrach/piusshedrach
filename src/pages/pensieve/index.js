import React from 'react';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

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

const InsightsPage = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location}>
      <Helmet title="Insights">
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

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
            {posts.map(({ node }) => {
              const { title, description, slug, date, tags = [] } = node.frontmatter;

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
                        <Link key={tag} to={`/pensieve/tags/${kebabCase(tag)}/`}>
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
    </Layout>
  );
};

InsightsPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default InsightsPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/content/posts/" }
        frontmatter: { draft: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            description
            slug
            date
            tags
          }
        }
      }
    }
  }
`;
