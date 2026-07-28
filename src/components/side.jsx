import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { loaderDelay } from '@utils';

const StyledSideElement = styled.div`
  width: 40px;
  position: fixed;
  bottom: 0;
  left: ${(props) => (props.orientation === 'left' ? '40px' : 'auto')};
  right: ${(props) => (props.orientation === 'left' ? 'auto' : '40px')};
  z-index: 10;
  color: var(--light-slate);

  @media (max-width: 1080px) {
    left: ${(props) => (props.orientation === 'left' ? '20px' : 'auto')};
    right: ${(props) => (props.orientation === 'left' ? 'auto' : '20px')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Side = ({ children, isHome, orientation }) => {
  const child = React.Children.only(children);
  const animatedChild = isHome
    ? React.cloneElement(child, {
        className: [child.props.className, 'fade-in'].filter(Boolean).join(' '),
        style: {
          ...child.props.style,
          animationDelay: `${loaderDelay}ms`,
        },
      })
    : child;

  return <StyledSideElement orientation={orientation}>{animatedChild}</StyledSideElement>;
};

Side.propTypes = {
  children: PropTypes.node.isRequired,
  isHome: PropTypes.bool,
  orientation: PropTypes.string,
};

export default Side;
