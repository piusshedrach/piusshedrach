import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const steps = [
  {
    title: 'Discovery',
    description:
      'We discuss your business, goals, audience, and what your website should accomplish.',
  },
  {
    title: 'Strategy',
    description:
      'I organize the content, structure, and user experience before any development begins.',
  },
  {
    title: 'Design & Development',
    description:
      'Your website is designed and built with performance, responsiveness, and usability in mind.',
  },
  {
    title: 'Launch',
    description:
      'Once everything is tested and approved, your website goes live with continued support available.',
  },
];

const StyledProcess = styled.section`
  max-width: 1000px;

  .process-list {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 520px) {
      grid-template-columns: 1fr;
    }
  }

  li {
    position: relative;
    padding-top: 25px;
    border-top: 2px solid var(--lightest-navy);

    &:before {
      content: attr(data-step);
      display: block;
      margin-bottom: 22px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
    }
  }

  h3 {
    font-size: var(--fz-xxl);
  }

  p {
    color: var(--light-slate);
    font-size: 17px;
  }
`;

const Process = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  return (
    <StyledProcess id="process" ref={revealContainer}>
      <h2 className="numbered-heading">How We Work Together</h2>
      <ol className="process-list">
        {steps.map(({ title, description }, i) => (
          <li key={title} data-step={`Step 0${i + 1}`}>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </StyledProcess>
  );
};

export default Process;
