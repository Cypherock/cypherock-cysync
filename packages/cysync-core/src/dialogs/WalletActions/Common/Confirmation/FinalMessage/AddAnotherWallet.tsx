import { GuidedFlowDialogBox, informationIcon } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const AddAnotherWallet: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={informationIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.walletActions.common.confirmation.finalMessage
          .addAnotherWallet.heading
      }
      title={
        lang.strings.walletActions.common.confirmation.finalMessage
          .addAnotherWallet.title
      }
      bulletList={
        lang.strings.walletActions.common.confirmation.finalMessage
          .addAnotherWallet.list
      }
    />
  );
};
