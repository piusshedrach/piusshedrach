import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';
import { navDelay } from '@utils';
import { normalizePath, slugify } from '@utils/content';
import { createMeta } from '@utils/seo';
import portfolioData from 'virtual:portfolio-data';

const StyledPostContainer = styled.main`
  max-width: 1000px;
`;

const StyledPostHeader = styled.header`
  margin-bottom: 50px;

  .tag {
    margin-right: 10px;
  }
`;

const StyledPostContent = styled.div`
  margin-bottom: 100px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p {
    margin: 1em 0;
    line-height: 1.5;
    color: var(--light-slate);
  }

  a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  code {
    padding: 0.2em 0.4em;
    border-radius: var(--border-radius);
    background-color: var(--lightest-navy);
    color: var(--lightest-slate);
    font-size: var(--fz-sm);
  }

  pre code {
    padding: 0;
    background-color: transparent;
  }
`;

const StyledNotFound = styled.main`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
`;

const StyledTitle = styled.h1`
  color: var(--green);
  font-family: var(--font-mono);
  font-size: clamp(100px, 25vw, 200px);
  line-height: 1;
`;

const StyledSubtitle = styled.h2`
  font-size: clamp(30px, 5vw, 50px);
  font-weight: 400;
`;

const StyledHomeButton = styled(Link)`
  ${({ theme }) => theme.mixins.bigButton};
  margin-top: 40px;
`;

export function meta(args) {
  const pathname = normalizePath(args.location.pathname);
  const post = portfolioData.posts.find(candidate => candidate.frontmatter.slug === pathname);
  const title = post?.frontmatter.title || 'Page Not Found';
  const description = post?.frontmatter.description;
  return createMeta({ title, description, noindex: !post })(args);
}

function NotFoundPage() {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  if (!prefersReducedMotion && !isMounted) {
    return null;
  }

  return (
    <StyledNotFound className="fillHeight">
      <StyledTitle>404</StyledTitle>
      <StyledSubtitle>Page Not Found</StyledSubtitle>
      <StyledHomeButton to="/">Go Home</StyledHomeButton>
    </StyledNotFound>
  );
}

const PostTemplate = () => {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
  const post = portfolioData.posts.find(candidate => candidate.frontmatter.slug === pathname);

  if (!post) {
    return <NotFoundPage />;
  }

  const { frontmatter, html } = post;
  const { title, date, tags = [] } = frontmatter;

  return (
    <StyledPostContainer>
      <span className="breadcrumb">
        <span className="arrow">&larr;</span>
        <Link to="/pensieve">All insights</Link>
      </span>

      <StyledPostHeader>
        <h1 className="medium-heading">{title}</h1>
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
      </StyledPostHeader>

      <StyledPostContent
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </StyledPostContainer>
  );
};

export default PostTemplate;
