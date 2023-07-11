import {
  LangDisplay,
  followInfo,
  GuidedFlowDialogBox,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { useTheme } from 'styled-components';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
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
  const { onNext, onPrevious } = useImportWalletGuide();

  const goldenArrowList = [
    <>
      <LangDisplay
        text={lang.strings.importWallet.device.followInfo.list.first.first}
      />

      <GoldFont
        text={lang.strings.importWallet.device.followInfo.list.first.second}
      />
    </>,
    <>
      <LangDisplay
        text={lang.strings.importWallet.device.followInfo.list.second.first}
      />

      <GoldFont
        text={lang.strings.importWallet.device.followInfo.list.second.second}
      />
      <LangDisplay
        text={lang.strings.importWallet.device.followInfo.list.second.third}
      />

      <GoldFont
        text={lang.strings.importWallet.device.followInfo.list.second.fourth}
      />
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
