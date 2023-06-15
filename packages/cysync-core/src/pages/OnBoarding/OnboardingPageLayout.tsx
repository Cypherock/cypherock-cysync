import React, { FC, ReactNode } from 'react';
import {
  HelpHeader,
  EmailHeader,
  OnboardingLayout,
  OnboardingLayoutProps,
  DialogBoxBackgroundFooterProps,
  DialogBoxBackgroundHeaderProps,
} from '@cypherock/cysync-ui';
import { useAppSelector, selectLanguage, ILangState } from '~/store';

export interface OnboardingPageLayoutProps
  extends Omit<OnboardingLayoutProps, 'headerProps' | 'footerProps'> {
  children: ReactNode | undefined;
  withHelp?: boolean;
  withEmail?: boolean;
  withBack?: boolean;
}

const parseHeaderProps = ({
  withHelp,
  withEmail,
  lang,
}: {
  withHelp?: boolean;
  withEmail?: boolean;
  lang: ILangState;
}) => {
  let headerProps: DialogBoxBackgroundHeaderProps | undefined;
  if (withHelp || withEmail) {
    headerProps = {};

    if (withHelp) {
      headerProps.topRightComponent = <HelpHeader text={lang.strings.help} />;
    }
    if (withEmail) {
      headerProps.topLeftComponent = <EmailHeader email="user@example.com" />;
    }
  }
  return headerProps;
};

const parseFooterProps = ({
  withBack,
  lang,
}: {
  withBack?: boolean;
  lang: ILangState;
}) => {
  let footerProps: DialogBoxBackgroundFooterProps | undefined;
  if (withBack) {
    footerProps = {
      backText: lang.strings.back,
    };
  }
  return footerProps;
};

export const OnboardingPageLayout: FC<OnboardingPageLayoutProps> = ({
  children,
  img,
  text,
  currentState,
  totalState,
  withHelp,
  withBack,
  withEmail,
  showBlurBackground,
  title,
  showAside,
  subTitle,
}) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <OnboardingLayout
      img={img}
      text={text}
      currentState={currentState}
      totalState={totalState}
      showBlurBackground={showBlurBackground}
      title={title}
      subTitle={subTitle}
      showAside={showAside}
      version={`ver ${window.cysyncEnv.VERSION}`}
      headerProps={parseHeaderProps({ withHelp, withEmail, lang })}
      footerProps={parseFooterProps({ withBack, lang })}
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
