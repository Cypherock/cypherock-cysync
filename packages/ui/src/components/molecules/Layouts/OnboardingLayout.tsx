import React, { FC, ReactNode } from 'react';
import { BlurOverlay, Container } from '../../atoms';
import { Aside, AsideProps } from '../Asides/Aside';
import {
  DialogBoxBackgroundHeaderProps,
  DialogBoxBackgroundFooterProps,
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  DialogBoxBackgroundFooter,
} from '../Dialog';
import { InfoAside, InfoAsideProps } from '../Asides/InfoAside';
import { BgColorProps } from '../../utils';

export interface OnboardingLayoutProps
  extends Partial<AsideProps>,
    Partial<InfoAsideProps>,
    BgColorProps {
  children: ReactNode | undefined;
  showBlurBackground?: boolean;
  showAside?: boolean;
  headerProps?: DialogBoxBackgroundHeaderProps;
  footerProps?: DialogBoxBackgroundFooterProps;
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
  showAside: true,
};
