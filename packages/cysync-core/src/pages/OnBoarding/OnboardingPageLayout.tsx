import {
  BackButton,
  DialogBoxBackgroundBarProps,
  EmailDisplay,
  HelpButton,
  OnboardingLayout,
  OnboardingLayoutProps,
} from '@cypherock/cysync-ui';
import React, { ReactNode, useEffect, useState } from 'react';

import { openContactSupportDialog } from '~/actions';
import { useNavigateTo, useOnboardingCheckpoint } from '~/hooks';
import { useAppSelector, selectLanguage, useAppDispatch } from '~/store';
import { keyValueStore } from '~/utils';

export interface OnboardingPageLayoutProps
  extends Omit<OnboardingLayoutProps, 'headerProps' | 'footerProps'> {
  children: ReactNode | undefined;
  withHelp?: boolean;
  withEmail?: boolean;
  backTo?: string;
}

export const OnboardingPageLayout: React.FC<OnboardingPageLayoutProps> = ({
  children,
  img,
  text,
  currentState,
  totalState,
  withHelp,
  backTo,
  withEmail,
  showBlurBackground,
  title,
  showAside,
  subTitle,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [email, setEmail] = useState('');
  const navigateTo = useNavigateTo();
  const dispatch = useAppDispatch();
  useOnboardingCheckpoint();

  const fetchEmail = async () =>
    setEmail((await keyValueStore.email.get()) ?? '');

  useEffect(() => {
    fetchEmail();
  }, []);

  const parseHeaderProps = () => {
    let headerProps: DialogBoxBackgroundBarProps | undefined;

    if (withHelp || withEmail) {
      headerProps = {};

      if (withHelp) {
        headerProps.rightComponent = (
          <HelpButton
            text={lang.strings.help}
            onClick={() => dispatch(openContactSupportDialog())}
          />
        );
      }
      if (withEmail && email) {
        headerProps.leftComponent = <EmailDisplay email={email} />;
      }
    }

    return headerProps;
  };

  const parseFooterProps = () => {
    let footerProps: DialogBoxBackgroundBarProps | undefined;
    if (backTo) {
      footerProps = {
        leftComponent: (
          <BackButton
            text={lang.strings.back}
            onClick={() => navigateTo(backTo)}
          />
        ),
      };
    }
    return footerProps;
  };

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
      headerProps={parseHeaderProps()}
      footerProps={parseFooterProps()}
    >
      {children}
    </OnboardingLayout>
  );
};

OnboardingPageLayout.defaultProps = {
  withEmail: false,
  withHelp: false,
  backTo: undefined,
};
