import React from 'react';
import styled from 'styled-components';
import { Icon } from '@components/icons';
import { socialMedia } from '@config';

const StyledFooter = styled.footer`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  min-height: 100px;
  padding: 20px;
  color: var(--light-slate);
  text-align: center;

  .social-links {
    display: none;
    width: 100%;
    max-width: 270px;
    margin: 0 auto 12px;

    @media (max-width: 768px) {
      display: block;
    }

    ul {
      ${({ theme }) => theme.mixins.flexBetween};
      padding: 0;
      margin: 0;
      list-style: none;
    }

    a {
      padding: 10px;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .credit {
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.7;
  }

  .attribution {
    color: var(--slate);
  }
`;

const Footer = () => (
  <StyledFooter>
    <div className="social-links">
      <ul>
        {socialMedia.map(({ name, url }) => (
          <li key={name}>
            <a href={url} aria-label={name}>
              <Icon name={name} />
            </a>
          </li>
        ))}
      </ul>
    </div>

    <div className="credit">
      <div>Built and adapted by Pius Shedrach.</div>
      <div className="attribution">
        Original open-source design by{' '}
        <a href="https://brittanychiang.com">Brittany Chiang</a>.
      </div>
    </div>
  </StyledFooter>
);

export default Footer;
