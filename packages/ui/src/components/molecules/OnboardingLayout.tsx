import React, { ReactElement, ReactNode } from 'react';
import { Container } from '../atoms';
import { Aside, AsideProps } from './Aside';

interface OnboardingLayoutProps extends AsideProps {
  children: ReactNode | undefined;
}

export const OnboardingLayout = (
  props: OnboardingLayoutProps,
): ReactElement => {
  const { children, text, img, currentState, totalState } = props;
  return (
    <Container height="screen" $bgColor="sideBar" display="flex">
      <Aside
        img={img}
        text={text}
        currentState={currentState}
        totalState={totalState}
      />
      {children}
    </Container>
  );
};
