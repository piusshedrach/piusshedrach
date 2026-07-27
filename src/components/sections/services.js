import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const services = [
  {
    title: 'Business Websites',
    description:
      'Professional websites built from the ground up to represent your business with clarity and confidence.',
  },
  {
    title: 'Website Redesigns',
    description:
      'Transform outdated websites into modern experiences that better reflect the quality of your business.',
  },
  {
    title: 'Performance & Optimization',
    description:
      'Fast-loading, responsive websites that work reliably across desktop and mobile devices.',
  },
  {
    title: 'Ongoing Website Care',
    description:
      'Hosting guidance, updates, improvements, and technical support to keep your website performing well.',
  },
];

const StyledServices = styled.section`
  max-width: 1000px;

  .services-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  li {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    min-height: 220px;
    padding: 34px;
    overflow: hidden;
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    background: var(--light-navy);
    transition: var(--transition);

    &:hover {
      transform: translateY(-6px);
      border-color: var(--green);
    }

    &:before {
      content: attr(data-number);
      display: block;
      margin-bottom: 30px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
    }
  }

  h3 {
    margin-bottom: 15px;
    font-size: clamp(24px, 4vw, 30px);
  }

  p {
    color: var(--light-slate);
    font-size: var(--fz-lg);
  }
`;

const Services = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  return (
    <StyledServices id="services" ref={revealContainer}>
      <h2 className="numbered-heading">What I Do</h2>
      <ul className="services-grid">
        {services.map(({ title, description }, i) => (
          <li key={title} data-number={`0${i + 1}`}>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </StyledServices>
  );
};

export default Services;
