import React, { FC, ReactNode } from 'react';

import { BlurOverlay, Container } from '../../atoms';
import { BgColorProps } from '../../utils';
import { Aside, AsideProps, InfoAside, InfoAsideProps } from '../Asides';
import {
  DialogBoxBackground,
  DialogBoxBackgroundBar,
  DialogBoxBackgroundBarProps,
} from '../Dialog';

export interface OnboardingLayoutProps
  extends Partial<AsideProps>,
    Partial<InfoAsideProps>,
    BgColorProps {
  children: ReactNode | undefined;
  showBlurBackground?: boolean;
  showAside?: boolean;
  headerProps?: DialogBoxBackgroundBarProps;
  footerProps?: DialogBoxBackgroundBarProps;
}

const GetAside: FC<Partial<AsideProps> & Partial<InfoAsideProps>> = ({
  text,
  title,
  subTitle,
  version,
  img,
  currentState,
  totalState,
}) => {
  if (title && subTitle && version) {
    return <InfoAside title={title} subTitle={subTitle} version={version} />;
  }
  if (img && text && currentState && totalState) {
    return (
      <Aside
        img={img}
        text={text}
        currentState={currentState}
        totalState={totalState}
      />
    );
  }
  return null;
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  text,
  title,
  subTitle,
  version,
  img,
  currentState,
  totalState,
  headerProps,
  footerProps,
  showBlurBackground,
  showAside,
  $bgColor = 'sideBar',
}) => (
  <Container height="screen" $bgColor={$bgColor} display="flex">
    {showBlurBackground && <BlurOverlay>{children}</BlurOverlay>}
    {showAside && (
      <GetAside
        currentState={currentState}
        img={img}
        subTitle={subTitle}
        text={text}
        title={title}
        totalState={totalState}
        version={version}
      />
    )}
    <DialogBoxBackground>
      {headerProps && (
        <DialogBoxBackgroundBar {...headerProps} position="top" />
      )}
      {children}
      {footerProps && (
        <DialogBoxBackgroundBar {...footerProps} position="bottom" />
      )}
    </DialogBoxBackground>
  </Container>
);

OnboardingLayout.defaultProps = {
  headerProps: undefined,
  footerProps: undefined,
  showBlurBackground: false,
  showAside: true,
};
