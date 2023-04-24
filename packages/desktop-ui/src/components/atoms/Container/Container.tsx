import React from 'react';
import {
  ContainerStyle,
  DefaultContainerStyle,
  ContainerProps,
  AsideContainerStyle,
  MainContainerStyle,
  ModalContainerStyle,
} from './Container.styled';

export const Container = ({ children, variant, ...props }: ContainerProps) => {
  switch (variant) {
    case 'container':
      return <ContainerStyle>{children}</ContainerStyle>;
    case 'asideContainer':
      return (
        <AsideContainerStyle border={props.border} size={props.size}>
          {children}
        </AsideContainerStyle>
      );
    case 'mainContainer':
      return <MainContainerStyle>{children}</MainContainerStyle>;
    case 'modalContainer':
      return <ModalContainerStyle>{children}</ModalContainerStyle>;
    default:
      return (
        <DefaultContainerStyle
          shadow={props.shadow}
          border={props.border}
          roundedListTop={props.roundedListTop}
          roundedListBottom={props.roundedListBottom}
        >
          {children}
        </DefaultContainerStyle>
      );
  }
};
