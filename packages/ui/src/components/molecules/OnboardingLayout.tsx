import React, { ReactNode } from 'react';
import { BlurOverlay, Container } from '../atoms';
import { Aside, AsideProps } from './Aside';
import {
  DialogBoxBackground,
  DialogBoxBackgroundFooter,
  DialogBoxBackgroundFooterProps,
  DialogBoxBackgroundHeader,
  DialogBoxBackgroundHeaderProps,
} from './DialogBoxBackground';

export interface OnboardingLayoutProps extends AsideProps {
  children: ReactNode | undefined;
  isDialogOpen?: boolean;
  headerProps?: DialogBoxBackgroundHeaderProps;
  footerProps?: DialogBoxBackgroundFooterProps;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  text,
  img,
  currentState,
  totalState,
  headerProps,
  footerProps,
  isDialogOpen,
}) => (
  <Container height="screen" $bgColor="sideBar" display="flex">
    {isDialogOpen && <BlurOverlay>{children}</BlurOverlay>}
    <Aside
      img={img}
      text={text}
      currentState={currentState}
      totalState={totalState}
    />
    <DialogBoxBackground>
      {headerProps && <DialogBoxBackgroundHeader {...headerProps} />}
      {!isDialogOpen && children}
      {footerProps && <DialogBoxBackgroundFooter {...footerProps} />}
    </DialogBoxBackground>
  </Container>
);

OnboardingLayout.defaultProps = {
  headerProps: undefined,
  footerProps: undefined,
  isDialogOpen: false,
};
