import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const technologies = [
  'React',
  'Next.js',
  'TypeScript',
  'WordPress',
  'Headless CMS',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'JavaScript',
  'Firebase',
  'Supabase',
  'Git',
];

const StyledTechnologies = styled.section`
  max-width: 900px;
  text-align: center;

  .eyebrow {
    margin-bottom: 14px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }

  h2 {
    margin-bottom: 35px;
    font-size: clamp(34px, 6vw, 54px);
  }

  ul {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  li {
    padding: 10px 15px;
    border: 1px solid var(--lightest-navy);
    border-radius: 999px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Technologies = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  return (
    <StyledTechnologies id="technologies" ref={revealContainer}>
      <p className="eyebrow">Built with modern tools</p>
      <h2>Technology chosen to fit the project.</h2>
      <ul>
        {technologies.map(technology => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
    </StyledTechnologies>
  );
};

export default Technologies;
