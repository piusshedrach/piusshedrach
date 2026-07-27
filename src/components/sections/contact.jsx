import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 650px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before,
    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 45px;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">Start a Project</h2>
      <h2 className="title">Let's build something your customers will trust.</h2>
      <p>
        Whether you are launching a new business or improving an existing website, I would be happy
        to hear about your project.
      </p>
      <a className="email-link" href={`mailto:${email}`}>
        Let's Start a Conversation
      </a>
    </StyledContactSection>
  );
};

export default Contact;
