import { enterWalletName, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const EnterWalletName: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={enterWalletName}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.walletActions.common.device.enterWalletName.heading}
      title={lang.strings.walletActions.common.device.enterWalletName.title}
      bulletList={lang.strings.walletActions.common.device.enterWalletName.list}
      infoText={lang.strings.walletActions.common.device.enterWalletName.note}
      infoIconVariant="white"
      infoTextVariant="white"
    />
  );
};
