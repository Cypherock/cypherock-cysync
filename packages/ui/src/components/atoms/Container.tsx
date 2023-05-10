import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { utils, UtilsProps } from '../utils';

export interface ContainerProps extends UtilsProps {
  variant?: 'default' | 'container' | 'aside' | 'main' | 'modal';
  children?: ReactNode;
  borderRadiusOne?: boolean;
  border?: boolean;
  scroll?: boolean;
  roundedListTop?: boolean;
  roundedListBottom?: boolean;
  shadow?: boolean;
  size?: 'lg';
}

export const ContainerStyle = styled.div`
  ${utils}
  height: 100vh;
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DefaultContainerStyle = styled.div<ContainerProps>`
  ${props =>
    props.shadow &&
    css`
      box-shadow: 4px 4px 32px 4px #0f0d0b;
    `}
  ${props =>
    props.border &&
    css`
      border-width: 1px;
      border-style: solid;
      border-color: ${({ theme }) =>
        theme.palette.background.sepratorBackground};
    `}
  padding: 16px 24px;

  border-top-left-radius: ${props => (props.roundedListTop ? '24px' : '')};
  border-top-right-radius: ${props => (props.roundedListTop ? '24px' : '')};

  border-bottom-left-radius: ${props =>
    props.roundedListBottom ? '24px' : ''};
  border-bottom-right-radius: ${props =>
    props.roundedListBottom ? '24px' : ''};

  ${utils}
`;

export const AsideContainerStyle = styled.div<ContainerProps>`
  width: 300px;
  min-height: 100vh;

  ${props =>
    props.border &&
    css`
      border-width: 1px;
      border-style: solid;
      border-color: ${({ theme }) =>
        theme.palette.background.sepratorBackground};
    `}
  ${props =>
    props.size === 'lg'
      ? css`
          width: 500px;
        `
      : ''}
  padding:48px 42px;

  ${utils}
`;

export const MainContainerStyle = styled(DefaultContainerStyle)`
  height: 89vh;
  overflow-y: scroll;
`;

export const ModalContainerStyle = styled.div<ContainerProps>`
  ${utils}

  ${props =>
    props.position &&
    css`
      position: ${props.position};
    `}
  height: 100vh;
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3); /* Semi-transparent black */
  backdrop-filter: blur(3px);
`;

export const Container: FC<ContainerProps> = ({
  children,
  variant,
  ...props
}) => {
  switch (variant) {
    case 'container':
      return <ContainerStyle {...props}>{children}</ContainerStyle>;
    case 'aside':
      return <AsideContainerStyle {...props}>{children}</AsideContainerStyle>;
    case 'main':
      return <MainContainerStyle {...props}>{children}</MainContainerStyle>;
    case 'modal':
      return <ModalContainerStyle {...props}>{children}</ModalContainerStyle>;
    default:
      return (
        <DefaultContainerStyle {...props}>{children}</DefaultContainerStyle>
      );
  }
};

Container.defaultProps = {
  variant: undefined,
  children: null,
  borderRadiusOne: false,
  border: false,
  scroll: false,
  roundedListTop: false,
  roundedListBottom: false,
  shadow: false,
  size: undefined,
};
