import {
  LangDisplay,
  followInfo,
  GuidedFlowDialogBox,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { useTheme } from 'styled-components';

import { useCreateWalletGuide } from '~/dialogs/CreateWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

const GoldFont: React.FC<{
  text: string;
}> = ({ text }) => {
  const theme = useTheme();
  return (
    <span
      style={{
        background: theme?.palette.golden,
        WebkitTextFillColor: 'transparent',
        WebkitBackgroundClip: 'text',
      }}
    >
      <LangDisplay text={text} />
    </span>
  );
};

export const Instructions: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateWalletGuide();

  const goldenArrowList = [
    <>
      <LangDisplay
        text={lang.strings.onboarding.createWallet.followInfo.list.first.first}
      />
      <GoldFont
        text={lang.strings.onboarding.createWallet.followInfo.list.first.second}
      />
    </>,
    <>
      <LangDisplay
        text={lang.strings.onboarding.createWallet.followInfo.list.second.first}
      />
      <GoldFont
        text={
          lang.strings.onboarding.createWallet.followInfo.list.second.second
        }
      />
      <LangDisplay
        text={lang.strings.onboarding.createWallet.followInfo.list.second.third}
      />
      <GoldFont
        text={
          lang.strings.onboarding.createWallet.followInfo.list.second.fourth
        }
      />
      <LangDisplay
        text={lang.strings.onboarding.createWallet.followInfo.list.second.fifth}
      />
    </>,
  ];

  return (
    <GuidedFlowDialogBox
      image={followInfo}
      onNext={onNext}
      onPrevious={onPrevious}
      goldenArrowList={goldenArrowList}
      heading={lang.strings.onboarding.createWallet.followInfo.heading}
      title={lang.strings.onboarding.createWallet.followInfo.title}
      subTitle={lang.strings.onboarding.createWallet.followInfo.subTitle}
    />
  );
};
