import { GuidedFlowDialogBox, countNumberOfWords } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const CountWords: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={countNumberOfWords}
      title={
        lang.strings.walletActions.importWallet.device.countNumberOfWords.title
      }
      heading={
        lang.strings.walletActions.importWallet.device.countNumberOfWords
          .heading
      }
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
};
