import { GuidedFlowDialogBox, successIcon } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const CardNote: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      heading={
        lang.strings.walletActions.common.confirmation.walletCreationSuccess
          .heading
      }
      title={
        lang.strings.walletActions.common.confirmation.walletCreationSuccess
          .titles.third
      }
      image={successIcon}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
};
