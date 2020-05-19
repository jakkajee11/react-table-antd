import React from 'react';
import { Spin } from 'antd';
import styled, { CSSProperties } from 'styled-components';
import { SpinProps } from 'antd/lib/spin';

interface WithSpinnerProps {
  loading: boolean;
}

interface SpinnerContainerProps {
  containerStyles?: CSSProperties;
}

const SpinnerContainer = styled.div`
  /* text-align: center; */
`;

export const Spinner: React.FC<SpinProps & SpinnerContainerProps> = ({
  containerStyles,
  ...props
}) => (
  <SpinnerContainer style={{ ...containerStyles }}>
    <Spin {...props} />
  </SpinnerContainer>
);

export const withLoading = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithSpinnerProps> => ({
  loading,
  ...props
}: WithSpinnerProps) =>
  loading ? <Spinner /> : <Component {...(props as P)} />;
