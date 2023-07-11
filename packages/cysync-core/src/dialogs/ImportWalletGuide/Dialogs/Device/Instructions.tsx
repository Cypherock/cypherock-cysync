import {
  LangDisplay,
  followInfo,
  GuidedFlowDialogBox,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { useTheme } from 'styled-components';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

export const Instructions: FC = () => {
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();

  const goldenArrowList = [
    <>
      <LangDisplay
        text={lang.strings.importWallet.device.followInfo.list.first.first}
      />
      <span
        style={{
          background: theme?.palette.golden,
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
        }}
      >
        <LangDisplay
          text={lang.strings.importWallet.device.followInfo.list.first.second}
        />
      </span>
    </>,
    <>
      <LangDisplay
        text={lang.strings.importWallet.device.followInfo.list.second.first}
      />
      <span
        style={{
          background: theme?.palette.golden,
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
        }}
      >
        <LangDisplay
          text={lang.strings.importWallet.device.followInfo.list.second.second}
        />
      </span>
      <LangDisplay
        text={lang.strings.importWallet.device.followInfo.list.second.third}
      />
      <span
        style={{
          background: theme?.palette.golden,
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
        }}
      >
        <LangDisplay
          text={lang.strings.importWallet.device.followInfo.list.second.fourth}
        />
      </span>
      <LangDisplay
        text={lang.strings.importWallet.device.followInfo.list.second.fifth}
      />
    </>,
  ];

  return (
    <GuidedFlowDialogBox
      image={followInfo}
      onNext={onNext}
      onPrevious={onPrevious}
      goldenArrowList={goldenArrowList}
      heading={lang.strings.importWallet.device.followInfo.heading}
      title={lang.strings.importWallet.device.followInfo.title}
      subTitle={lang.strings.importWallet.device.followInfo.subTitle}
    />
  );
};
