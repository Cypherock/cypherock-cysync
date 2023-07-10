import { GuidedFlowDialogBox, enterSeedPhrase } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const EnterSeedPhrase: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={enterSeedPhrase}
      title={
        lang.strings.walletActions.importWallet.device.enterSeedPhrase.title
      }
      heading={
        lang.strings.walletActions.importWallet.device.enterSeedPhrase.heading
      }
      infoIconVariant="yellow"
      infoText={
        lang.strings.walletActions.importWallet.device.enterSeedPhrase.note
      }
      showInfoIcon
      infoTextVariant="warn"
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
};
