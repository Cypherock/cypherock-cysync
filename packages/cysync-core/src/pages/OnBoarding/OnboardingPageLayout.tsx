import {
  HelpHeader,
  EmailHeader,
  OnboardingLayout,
  OnboardingLayoutProps,
} from '@cypherock/cysync-ui';
import React, { ReactNode } from 'react';

import { useAppSelector, selectLanguage } from '~/store';

export interface OnboardingPageLayoutProps
  extends Omit<OnboardingLayoutProps, 'headerProps' | 'footerProps'> {
  children: ReactNode | undefined;
  withHelp?: boolean;
  withEmail?: boolean;
  withBack?: boolean;
}

export const OnboardingPageLayout: React.FC<OnboardingPageLayoutProps> = ({
  children,
  img,
  text,
  currentState,
  totalState,
  withHelp,
  withBack,
  withEmail,
}) => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingLayout
      img={img}
      text={text}
      currentState={currentState}
      totalState={totalState}
      headerProps={{
        topRightComponent: withHelp ? (
          <HelpHeader text={lang.strings.help} />
        ) : undefined,
        topLeftComponent: withEmail ? (
          <EmailHeader email="user@example.com" />
        ) : undefined,
      }}
      footerProps={
        withBack
          ? {
              backText: lang.strings.back,
            }
          : undefined
      }
    >
      {children}
    </OnboardingLayout>
  );
};

OnboardingPageLayout.defaultProps = {
  withEmail: false,
  withHelp: false,
  withBack: false,
};
