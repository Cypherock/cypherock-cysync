import React, { FC, ReactNode } from 'react';
import { Container } from '../atoms';
import { Aside, AsideProps } from './Aside';
import {
  DialogBoxBackgroundHeaderProps,
  DialogBoxBackgroundFooterProps,
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  DialogBoxBackgroundFooter,
} from './Dialog';
import { InfoAside, InfoAsideProps } from './Aside/InfoAside';

export interface OnboardingLayoutProps
  extends Partial<AsideProps>,
    Partial<InfoAsideProps> {
  children: ReactNode | undefined;
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
}) => (
  <Container height="screen" $bgColor="sideBar" display="flex">
    <GetAside
      currentState={currentState}
      img={img}
      subTitle={subTitle}
      text={text}
      title={title}
      totalState={totalState}
      version={version}
    />{' '}
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
