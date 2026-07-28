import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 1000px;

  .inner {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(240px, 2fr);
    gap: 60px;
    align-items: start;

    @media (max-width: 768px) {
      display: block;
    }
  }

  .approach {
    margin-top: 35px;
    padding: 28px;
    border-left: 2px solid var(--green);
    background: var(--light-navy);
    border-radius: var(--border-radius);

    h3 {
      margin-bottom: 15px;
      font-size: var(--fz-xxl);
    }

    ul {
      ${({ theme }) => theme.mixins.fancyList};
    }
  }

  .trust-statement {
    margin-top: 30px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    line-height: 1.35;
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    width: 70%;
    margin: 50px auto 0;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus-within {
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      z-index: 1;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      object-position: center 62%;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
      z-index: 2;
      pointer-events: none;
    }

    &:after {
      top: 14px;
      left: 14px;
      z-index: -1;
      border: 2px solid var(--green);
    }

    @media (max-width: 768px) {
      background-color: transparent;

      .img {
        mix-blend-mode: normal;
        filter: none;
      }

      &:before {
        display: none;
      }
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">More Than a Website</h2>

      <div className="inner">
        <div>
          <p>Most businesses already have a logo, social media, and a phone number.</p>
          <p>
            What many do not have is a place that answers the questions potential customers ask
            before they ever make contact. That is what I build.
          </p>
          <p>
            I work with businesses to create websites that look professional and clearly communicate
            why someone should choose them.
          </p>
          <p>
            Whether it is a real estate company, consultancy, travel agency, or another service
            business, my focus is always the same: create a digital experience that builds
            confidence before the first conversation.
          </p>

          <div className="approach">
            <h3>My approach starts with the business.</h3>
            <ul>
              <li>What questions do customers ask?</li>
              <li>What makes the business different?</li>
              <li>What information builds confidence?</li>
              <li>What prevents people from reaching out?</li>
            </ul>
          </div>

          <p className="trust-statement">
            Every decision is made with one question in mind: will this make the business more
            trustworthy to a potential customer?
          </p>
        </div>

        <StyledPic>
          <div className="wrapper">
            <img className="img" src="/portrait_compressed.webp" alt="Pius Shedrach" />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
