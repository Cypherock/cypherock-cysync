import { enterWalletName, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateWalletGuide } from '~/context/createWalletGuide';
import { selectLanguage, useAppSelector } from '~/store';

export const EnterWalletName: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={enterWalletName}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.enterWalletName.heading}
      title={lang.strings.onboarding.createWallet.enterWalletName.title}
      bulletList={lang.strings.onboarding.createWallet.enterWalletName.list}
      infoText={lang.strings.onboarding.createWallet.enterWalletName.note}
      infoIconVariant="white"
      infoTextVariant="white"
    />
  );
};
