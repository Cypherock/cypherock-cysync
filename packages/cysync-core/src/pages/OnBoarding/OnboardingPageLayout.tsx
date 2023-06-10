import {
  HelpHeader,
  EmailHeader,
  OnboardingLayout,
  OnboardingLayoutProps,
  DialogBoxBackgroundFooterProps,
  DialogBoxBackgroundHeaderProps,
} from '@cypherock/cysync-ui';
import React, { ReactNode, useEffect, useState } from 'react';

import { useAppSelector, selectLanguage, ILangState } from '~/store';
import { getDB } from '~/utils';

export interface OnboardingPageLayoutProps
  extends Omit<OnboardingLayoutProps, 'headerProps' | 'footerProps'> {
  children: ReactNode | undefined;
  withHelp?: boolean;
  withEmail?: boolean;
  withBack?: boolean;
}

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

export const OnboardingPageLayout: React.FC<OnboardingPageLayoutProps> = ({
  children,
  img,
  text,
  currentState,
  totalState,
  withHelp,
  withBack,
  withEmail,
  title,
  subTitle,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [email, setEmail] = useState('');
  const fetchEmail = async () =>
    setEmail((await getDB().storage.getItem('email')) ?? '');
  useEffect(() => {
    fetchEmail();
  }, []);

  const parseHeaderProps = () => {
    let headerProps: DialogBoxBackgroundHeaderProps | undefined;

    if (withHelp || withEmail) {
      headerProps = {};

      if (withHelp) {
        headerProps.topRightComponent = <HelpHeader text={lang.strings.help} />;
      }
      if (withEmail && email) {
        headerProps.topLeftComponent = <EmailHeader email={email} />;
      }
    }

    return headerProps;
  };

  return (
    <OnboardingLayout
      img={img}
      text={text}
      currentState={currentState}
      totalState={totalState}
      title={title}
      subTitle={subTitle}
      version={`ver ${window.cysyncEnv.VERSION}`}
      headerProps={parseHeaderProps()}
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
