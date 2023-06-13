import React, { FC, ReactNode } from 'react';
import { BlurOverlay, Container } from '../../atoms';
import { Aside, AsideProps } from '../Asides/Aside';
import {
  DialogBoxBackground,
  DialogBoxBackgroundFooter,
  DialogBoxBackgroundFooterProps,
  DialogBoxBackgroundHeader,
  DialogBoxBackgroundHeaderProps,
} from '../DialogBoxBackground';

export interface OnboardingLayoutProps extends AsideProps {
  children: ReactNode | undefined;
  showBlurBackground?: boolean;
  headerProps?: DialogBoxBackgroundHeaderProps;
  footerProps?: DialogBoxBackgroundFooterProps;
}

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  children,
  text,
  img,
  currentState,
  totalState,
  headerProps,
  footerProps,
  showBlurBackground,
}) => (
  <Container height="screen" $bgColor="sideBar" display="flex">
    {showBlurBackground && <BlurOverlay>{children}</BlurOverlay>}
    <Aside
      img={img}
      text={text}
      currentState={currentState}
      totalState={totalState}
    />
    <DialogBoxBackground>
      {headerProps && <DialogBoxBackgroundHeader {...headerProps} />}
      {!showBlurBackground && children}
      {footerProps && <DialogBoxBackgroundFooter {...footerProps} />}
    </DialogBoxBackground>
  </Container>
);

OnboardingLayout.defaultProps = {
  headerProps: undefined,
  footerProps: undefined,
  showBlurBackground: false,
};
