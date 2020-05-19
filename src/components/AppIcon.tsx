import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';

const StyledFontAwesomeIcon = styled(({ bordered, ...props }) => (
  <FontAwesomeIcon {...props} />
))`
  ${(props) =>
    props.bordered &&
    css`
      border-style: solid;
      border-radius: 50px;
      border-width: 1px;
      border-color: darkgray;
      background-color: white;
      padding: 5px;
      :hover {
        border-color: var(--antd-wave-shadow-color);
      }
    `}
`;

const AppIcon = ({ pointer = undefined, ...props }) => (
  <StyledFontAwesomeIcon
    {...props}
    className={pointer ? 'pointer' : ''}
    icon={props.icon}
    size={props.size}
    style={props.style}
    title={props.title}
    onClick={props.onClick}
  >
    {props.text || ''}
  </StyledFontAwesomeIcon>
);

AppIcon.defaultProps = {
  size: 'sm',
};

export default AppIcon;
