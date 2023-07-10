import { GuidedFlowDialogBox, enterSeedPhrase } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const VerifySeedPhrase: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={enterSeedPhrase}
      title={
        lang.strings.walletActions.importWallet.device.verifySeedPhrase.title
      }
      subTitle={
        lang.strings.walletActions.importWallet.device.verifySeedPhrase.subTitle
      }
      heading={
        lang.strings.walletActions.importWallet.device.verifySeedPhrase.heading
      }
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
};
