import React, { ReactNode } from 'react';
import { Container } from '../atoms';
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
}) => (
  <Container height="screen" $bgColor="sideBar" display="flex">
    <Aside
      img={img}
      text={text}
      currentState={currentState}
      totalState={totalState}
    />
    <DialogBoxBackground>
      {headerProps && <DialogBoxBackgroundHeader {...headerProps} />}
      {children}
      {footerProps && <DialogBoxBackgroundFooter {...footerProps} />}
    </DialogBoxBackground>
  </Container>
);

OnboardingLayout.defaultProps = {
  headerProps: undefined,
  footerProps: undefined,
};
