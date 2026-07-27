import React, { useEffect, useRef } from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';
import { Icon } from '@components/icons';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledWorkList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  margin-top: 70px;
  border-top: 1px solid var(--lightest-navy);
`;

const StyledWorkItem = styled.li`
  display: grid;
  grid-template-columns: minmax(180px, 1.2fr) minmax(130px, 0.7fr) 2fr auto;
  gap: 30px;
  align-items: center;
  padding: 28px 18px;
  border-bottom: 1px solid var(--lightest-navy);
  transition: var(--transition);

  &:hover {
    background: var(--light-navy);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 12px 20px;
  }

  h2 {
    margin: 0;
    font-size: var(--fz-xxl);
  }

  .category {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .services {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }

  .links {
    display: flex;
    gap: 14px;

    a {
      ${({ theme }) => theme.mixins.flexCenter};

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

const ArchivePage = ({ location, data }) => {
  const projects = data.allMarkdownRemark.edges;
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig(100, 0));
    }
  }, []);

  return (
    <Layout location={location}>
      <Helmet title="All Work" />
      <main ref={revealContainer}>
        <header>
          <h1 className="big-heading">All Work</h1>
          <p className="subtitle">Websites designed around clarity, credibility, and trust.</p>
        </header>

        <StyledWorkList>
          {projects.map(({ node }) => {
            const { title, category, services = [], external, github } = node.frontmatter;

            return (
              <StyledWorkItem key={title}>
                <h2>{title}</h2>
                <span className="category">{category}</span>
                <span className="services">{services.join(' / ')}</span>
                {(github || external) && (
                  <span className="links">
                    {github && (
                      <a href={github} aria-label={`${title} source code`}>
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {external && (
                      <a href={external} aria-label={`Visit ${title}`}>
                        <Icon name="External" />
                      </a>
                    )}
                  </span>
                )}
              </StyledWorkItem>
            );
          })}
        </StyledWorkList>
      </main>
    </Layout>
  );
};

ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/projects/" } }
      sort: { fields: [frontmatter___featuredOrder], order: ASC }
    ) {
      edges {
        node {
          frontmatter {
            title
            category
            services
            external
            github
          }
        }
      }
    }
  }
`;
