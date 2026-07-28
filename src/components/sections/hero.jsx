import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 24px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;
  }

  h3 {
    max-width: 920px;
    margin-top: 8px;
    color: var(--slate);
    line-height: 0.95;
  }

  p {
    max-width: 650px;
    margin: 28px 0 0;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 42px;

    a {
      ${({ theme }) => theme.mixins.bigButton};
    }

    .secondary {
      border-color: var(--lightest-navy);
      color: var(--lightest-slate);

      &:hover,
      &:focus-visible {
        border-color: var(--green);
        color: var(--green);
      }
    }
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const items = [
    <h1 key="intro">{`Hi, I'm`}</h1>,
    <h2 key="name" className="big-heading">
      Pius Shedrach.
    </h2>,
    <h3 key="value-proposition" className="big-heading">
      I design and build websites that help businesses earn trust and win more clients.
    </h3>,
    <p key="description">
      I create fast, modern websites for businesses that want more than just an online presence.
      Every project is designed to communicate credibility, showcase what makes the business
      different, and make it easy for potential clients to take the next step.
    </p>,
    <div key="actions" className="hero-actions">
      <a href="#work">View My Work</a>
      <a className="secondary" href="#contact">
        {`Let's Talk`}
      </a>
    </div>,
  ];

  if (prefersReducedMotion) {
    return (
      <StyledHeroSection>
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </StyledHeroSection>
    );
  }

  return (
    <StyledHeroSection>
      <TransitionGroup component={null}>
        {isMounted &&
          items.map((item, i) => (
            <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
              <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
            </CSSTransition>
          ))}
      </TransitionGroup>
    </StyledHeroSection>
  );
};

export default Hero;
