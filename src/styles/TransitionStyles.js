import { css } from 'styled-components';

const TransitionStyles = css`
  @keyframes fadeUp {
    from {
      opacity: 0.01;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeDown {
    from {
      opacity: 0.01;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .fade-up,
    .fade-down,
    .fade-in {
      animation-duration: 300ms;
      animation-timing-function: var(--easing);
      animation-fill-mode: both;
    }

    .fade-up {
      animation-name: fadeUp;
    }

    .fade-down {
      animation-name: fadeDown;
    }

    .fade-in {
      animation-name: fadeIn;
    }
  }
`;

export default TransitionStyles;
