import {
  LangDisplay,
  followInfo,
  GuidedFlowDialogBoxLayout,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { useTheme } from 'styled-components';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const Instructions: FC = () => {
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();

  const goldenArrowList = [
    <>
      <LangDisplay
        text={lang.strings.onboarding.createWallet.followInfo.list.first.first}
      />
      <span
        style={{
          background: theme?.palette.golden,
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
        }}
      >
        <LangDisplay
          text={
            lang.strings.onboarding.createWallet.followInfo.list.first.second
          }
        />
      </span>
    </>,
    <>
      <LangDisplay
        text={lang.strings.onboarding.createWallet.followInfo.list.second.first}
      />
      <span
        style={{
          background: theme?.palette.golden,
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
        }}
      >
        <LangDisplay
          text={
            lang.strings.onboarding.createWallet.followInfo.list.second.second
          }
        />
      </span>
      <LangDisplay
        text={lang.strings.onboarding.createWallet.followInfo.list.second.third}
      />
      <span
        style={{
          background: theme?.palette.golden,
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
        }}
      >
        <LangDisplay
          text={
            lang.strings.onboarding.createWallet.followInfo.list.second.fourth
          }
        />
      </span>
      <LangDisplay
        text={lang.strings.onboarding.createWallet.followInfo.list.second.fifth}
      />
    </>,
  ];

  return (
    <GuidedFlowDialogBoxLayout
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
