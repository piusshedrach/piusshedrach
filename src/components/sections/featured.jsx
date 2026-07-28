import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledWorkSection = styled.section`
  max-width: 1100px;

  .section-intro {
    max-width: 620px;
    margin: -18px 0 55px;
  }

  .archive-link {
    margin-top: 35px;
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }
`;

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StyledProject = styled.li`
  ${({ theme }) => theme.mixins.boxShadow};
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow: hidden;
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  background: var(--light-navy);
  transition: var(--transition);

  &:hover {
    transform: translateY(-7px);
    border-color: var(--green);
  }

  .project-visual {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 220px;
    overflow: hidden;
    background:
      linear-gradient(rgba(10, 25, 47, 0.64), rgba(10, 25, 47, 0.92)),
      repeating-linear-gradient(
        -45deg,
        var(--lightest-navy),
        var(--lightest-navy) 1px,
        transparent 1px,
        transparent 18px
      );
    color: var(--green);
  }

  .project-placeholder {
    position: relative;
    z-index: 1;
    padding: 30px;
    text-align: center;

    span {
      display: block;
      margin-bottom: 18px;
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    strong {
      display: block;
      color: var(--lightest-slate);
      font-size: clamp(30px, 5vw, 42px);
      line-height: 0.95;
    }
  }

  .project-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.46;
    filter: grayscale(100%) contrast(1.1);

    @media (max-width: 900px) {
      opacity: 1;
      filter: none;
    }
  }

  .project-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 30px;
  }

  .project-overline {
    margin-bottom: 12px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  h3 {
    margin-bottom: 18px;
    font-size: clamp(25px, 4vw, 30px);
  }

  .project-description {
    flex: 1;
    color: var(--light-slate);
    font-size: 17px;
  }

  .project-services {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    margin-top: 25px;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .project-links {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 22px;

    a {
      ${({ theme }) => theme.mixins.flexCenter};
      color: var(--lightest-slate);

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .website-link {
      ${({ theme }) => theme.mixins.smallButton};
    }
  }
`;

const Featured = ({ projects }) => {
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion, projects.length]);

  return (
    <StyledWorkSection id="work">
      <h2 className="numbered-heading" ref={revealTitle}>
        Selected Work
      </h2>
      <p className="section-intro">
        Each project begins with understanding the business before designing the solution.
      </p>

      <StyledProjectsGrid>
        {projects.map(({ frontmatter, html }, i) => {
          const { category, cover, external, github, services = [], title } = frontmatter;

          return (
            <StyledProject key={title} ref={(el) => (revealProjects.current[i] = el)}>
              <div className="project-visual">
                {cover && (
                  <img
                    src={cover}
                    alt=""
                    className="project-image"
                    width="700"
                    height="394"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="project-placeholder">
                  <span>{category}</span>
                  <strong>{title}</strong>
                </div>
              </div>

              <div className="project-content">
                <p className="project-overline">Selected Project</p>
                <h3>{title}</h3>
                <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

                <ul className="project-services">
                  {services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>

                {(external || github) && (
                  <div className="project-links">
                    {github && (
                      <a href={github} aria-label={`${title} source code`}>
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {external && (
                      <a
                        className="website-link"
                        href={external}
                        aria-label={`View ${title} website`}
                      >
                        View Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </StyledProject>
          );
        })}
      </StyledProjectsGrid>

      <Link className="inline-link archive-link" to="/archive">
        View all work
      </Link>
    </StyledWorkSection>
  );
};

export default Featured;

Featured.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      frontmatter: PropTypes.object.isRequired,
      html: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
