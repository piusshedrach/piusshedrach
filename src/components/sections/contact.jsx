import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email, whatsapp } from '@config';
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

  .contact-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 18px;
    margin-top: 45px;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .contact-link {
    ${({ theme }) => theme.mixins.bigButton};

    @media (max-width: 480px) {
      width: 100%;
    }
  }

  .email-link {
    border-color: var(--lightest-navy);
    color: var(--lightest-slate);

    &:hover,
    &:focus-visible {
      border-color: var(--green);
      color: var(--green);
    }
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, [prefersReducedMotion]);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">Start a Project</h2>
      <h2 className="title">{`Let's build something your customers will trust.`}</h2>
      <p>
        Whether you are launching a new business or improving an existing website, I would be happy
        to hear about your project.
      </p>
      <div className="contact-actions">
        <a
          className="contact-link"
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Pius on WhatsApp at +234 915 230 0793"
        >
          Chat on WhatsApp
        </a>
        <a
          className="contact-link email-link"
          href={`mailto:${email}`}
          aria-label={`Send an email to ${email}`}
        >
          Send an Email
        </a>
      </div>
    </StyledContactSection>
  );
};

export default Contact;
